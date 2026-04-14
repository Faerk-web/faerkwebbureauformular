<?php
/**
 * Færk Webbureau – Form Processor
 * Receives wizard form data, sends email to agency and confirmation to customer.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(respond(false, 'Metode ikke tilladt.'));
}

/* =====================================================
   HELPERS
===================================================== */
function respond(bool $ok, string $msg = ''): string
{
    return (string) json_encode(['success' => $ok, 'message' => $msg], JSON_UNESCAPED_UNICODE);
}

function sanitize(string $value): string
{
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function field(string $key, string $default = ''): string
{
    return sanitize((string)($_POST[$key] ?? $default));
}

function yesno(string $value): string
{
    $map = [
        'ja'               => 'Ja',
        'nej'              => 'Nej',
        'maaske'           => 'Måske',
        'ja_klar'          => 'Ja, klar til brug',
        'ja_gammelt'       => 'Ja, men skal opdateres',
        'hjaelp'           => 'Brug for hjælp',
        'mig_selv'         => 'Mig selv',
        'faerk'            => 'Færk Webbureau',
        'begge'            => 'Begge parter',
        'delvist'          => 'Delvist',
        'asap'             => 'Så hurtigt som muligt',
        '1_maaned'         => 'Inden for 1 måned',
        '2_3_maaneder'     => '2–3 måneder',
        '3_6_maaneder'     => '3–6 måneder',
        'fleksibel'        => 'Fleksibel',
        'under_10k'        => 'Under 10.000 kr.',
        '10k_25k'          => '10.000–25.000 kr.',
        '25k_50k'          => '25.000–50.000 kr.',
        '50k_plus'         => 'Over 50.000 kr.',
        'ved_ikke'         => 'Ved ikke endnu',
        'ingen_preference' => 'Ingen præference',
        '1-5'              => '1–5 sider',
        '6-10'             => '6–10 sider',
        '11-20'            => '11–20 sider',
        '20+'              => 'Mere end 20 sider',
    ];
    return $map[$value] ?? $value;
}

function intval_safe(string $key): int
{
    return max(0, (int)($_POST[$key] ?? 0));
}

function formatDKK(int $amount): string
{
    return number_format($amount, 0, ',', '.') . ' kr.';
}

function buildHeaders(string $fromName, string $fromAddress, string $replyTo): string
{
    $encoded  = '=?UTF-8?B?' . base64_encode($fromName) . '?=';
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: {$encoded} <{$fromAddress}>\r\n";
    $headers .= "Reply-To: {$replyTo}\r\n";
    $headers .= "X-Mailer: PHP/" . PHP_VERSION . "\r\n";
    return $headers;
}

/* =====================================================
   COLLECT & VALIDATE
===================================================== */
$name        = field('name');
$email       = field('email');
$phone       = field('phone');
$company     = field('company');
$existingUrl = field('existing_url');

if (empty($name) || empty($email) || empty($phone) || empty($company)) {
    http_response_code(400);
    exit(respond(false, 'Manglende påkrævede felter.'));
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit(respond(false, 'Ugyldig e-mailadresse.'));
}

// Step 2
$businessType   = yesno(field('business_type'));
$industry       = field('industry');
$services       = field('services');
$targetAudience = field('target_audience');
$goal           = field('goal');

// Step 3
$hasWebsite   = yesno(field('has_website'));
$websiteUrl   = field('website_url');
$whatWorks    = field('what_works');
$improvements = field('improvements');
$inspiration  = field('inspiration');

// Step 4
$numPages      = yesno(field('num_pages'));
$needsWebshop  = yesno(field('needs_webshop'));
$languages     = field('languages');
$featuresRaw   = $_POST['features'] ?? [];
$features      = '';
if (is_array($featuresRaw)) {
    $featuresClean = array_map(fn($f) => sanitize((string)$f), $featuresRaw);
    $features = implode(', ', $featuresClean);
}

// Step 5
$colors         = field('colors');
$designStyleRaw = $_POST['design_style'] ?? [];
$designStyle    = '';
if (is_array($designStyleRaw)) {
    $styleClean  = array_map(fn($s) => sanitize((string)$s), $designStyleRaw);
    $designStyle = implode(', ', $styleClean);
}
$hasLogo         = yesno(field('has_logo'));
$contentProvider = yesno(field('content_provider'));
$hasImages       = yesno(field('has_images'));

// Step 6
$hasDomain        = yesno(field('has_domain'));
$domainName       = field('domain_name');
$hasHosting       = yesno(field('has_hosting'));
$cmsPreference    = field('cms_preference');
$needsMaintenance = yesno(field('needs_maintenance'));
$budget           = yesno(field('budget'));

// Step 7 – Add-ons
$addonExtraPages   = intval_safe('addon_extra_pages');
$addonBlogSetup    = isset($_POST['addon_blog_setup']);
$addonBlogPosts    = isset($_POST['addon_blog_posts']);
$addonSeo          = isset($_POST['addon_seo']);
$addonTestimonials = isset($_POST['addon_testimonials']);
$addonImageEditing = intval_safe('addon_image_editing');
$addonVideoEditing = intval_safe('addon_video_editing');
$addonSocialFeed   = isset($_POST['addon_social_feed']);
$addonBooking      = isset($_POST['addon_booking']);
$addonNewsletter   = isset($_POST['addon_newsletter']);
$addonGoogleMaps   = isset($_POST['addon_google_maps']);
$addonFileDownload = isset($_POST['addon_file_download']);
$addonFaq          = isset($_POST['addon_faq']);
$deadline          = yesno(field('deadline'));
$comments          = field('comments');

// Server-side price calculation (authoritative)
$totalPrice = 4999;
$totalPrice += $addonExtraPages * 500;
$totalPrice += $addonBlogSetup    ? 1000 : 0;
$totalPrice += $addonBlogPosts    ? 1200 : 0;
$totalPrice += $addonSeo          ? 1000 : 0;
$totalPrice += $addonTestimonials ?  500 : 0;
$totalPrice += $addonImageEditing * 250;
$totalPrice += $addonVideoEditing * 500;
$totalPrice += $addonSocialFeed   ? 1200 : 0;
$totalPrice += $addonBooking      ? 2800 : 0;
$totalPrice += $addonNewsletter   ?  800 : 0;
$totalPrice += $addonGoogleMaps   ?  500 : 0;
$totalPrice += $addonFileDownload ?  400 : 0;
$totalPrice += $addonFaq          ?  500 : 0;

$totalPriceFmt = formatDKK($totalPrice);

/* =====================================================
   FILE UPLOADS
===================================================== */
$uploadedFileNames = [];

if (!empty($_FILES['files']) && is_array($_FILES['files']['name'])) {
    $uploadDir = __DIR__ . '/uploads/' . date('Y-m-d') . '/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $allowedExts  = ['jpg', 'jpeg', 'png'];
    $allowedMimes = ['image/jpeg', 'image/png'];
    $maxSize      = 10 * 1024 * 1024;

    $fileCount = count($_FILES['files']['name']);

    for ($i = 0; $i < $fileCount; $i++) {
        if ($_FILES['files']['error'][$i] !== UPLOAD_ERR_OK) {
            continue;
        }
        if ($_FILES['files']['size'][$i] > $maxSize) {
            continue;
        }

        $origName = basename((string)$_FILES['files']['name'][$i]);
        $ext      = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

        if (!in_array($ext, $allowedExts, true)) {
            continue;
        }

        // Validate actual MIME type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo !== false) {
            $mime = finfo_file($finfo, $_FILES['files']['tmp_name'][$i]);
            finfo_close($finfo);
            if (!in_array($mime, $allowedMimes, true)) {
                continue;
            }
        }

        $safeName = time() . '_' . $i . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $origName);
        $dest     = $uploadDir . $safeName;

        if (move_uploaded_file($_FILES['files']['tmp_name'][$i], $dest)) {
            $sizeKb = number_format($_FILES['files']['size'][$i] / 1024, 1);
            $uploadedFileNames[] = htmlspecialchars($origName, ENT_QUOTES, 'UTF-8') . " ({$sizeKb} KB)";
        }
    }
}

/* =====================================================
   BUILD ADD-ON HTML SNIPPETS
===================================================== */
$addonLines = [];
if ($addonExtraPages > 0)   $addonLines[] = "Ekstra sider: {$addonExtraPages} × 500 kr. = " . formatDKK($addonExtraPages * 500);
if ($addonBlogSetup)        $addonLines[] = 'Blogopsætning: ' . formatDKK(1000);
if ($addonBlogPosts)        $addonLines[] = '3 blogindlæg: ' . formatDKK(1200);
if ($addonSeo)              $addonLines[] = 'SEO basis: ' . formatDKK(1000);
if ($addonTestimonials)     $addonLines[] = 'Kundeudtalelser: ' . formatDKK(500);
if ($addonImageEditing > 0) $addonLines[] = "Billedredigering: {$addonImageEditing} × 250 kr. = " . formatDKK($addonImageEditing * 250);
if ($addonVideoEditing > 0) $addonLines[] = "Videoredigering: {$addonVideoEditing} × 500 kr. = " . formatDKK($addonVideoEditing * 500);
if ($addonSocialFeed)       $addonLines[] = 'Social media feed: ' . formatDKK(1200);
if ($addonBooking)          $addonLines[] = 'Booking system: ' . formatDKK(2800);
if ($addonNewsletter)       $addonLines[] = 'Nyhedsbrev: ' . formatDKK(800);
if ($addonGoogleMaps)       $addonLines[] = 'Google Maps: ' . formatDKK(500);
if ($addonFileDownload)     $addonLines[] = 'Fil-download: ' . formatDKK(400);
if ($addonFaq)              $addonLines[] = 'FAQ sektion: ' . formatDKK(500);

function buildListHtml(array $items, string $emptyMsg): string
{
    if (empty($items)) {
        return '<p style="color:#64748b;font-size:14px;margin:0">' . $emptyMsg . '</p>';
    }
    $li = implode('', array_map(fn($l) => '<li style="margin-bottom:4px;font-size:14px;color:#334155">' . $l . '</li>', $items));
    return '<ul style="margin:0;padding-left:18px;">' . $li . '</ul>';
}

$addonHtml         = buildListHtml($addonLines,         'Ingen tilkøb valgt');
$filesHtml         = buildListHtml($uploadedFileNames,  'Ingen filer uploadet');

/* =====================================================
   SHARED EMAIL CSS
===================================================== */
$css = 'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f8fafc;margin:0;padding:0}
.wrap{max-width:620px;margin:0 auto;padding:32px 16px}
.card{background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.hd{background:#0f172a;padding:32px 32px 24px;text-align:center}
.hd h1{color:#ffffff;font-size:22px;font-weight:800;margin:0 0 4px}
.hd p{color:#94a3b8;font-size:14px;margin:0}
.bd{padding:32px}
.st{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#94a3b8;margin:0 0 12px;display:block}
.rw{display:flex;gap:16px;margin-bottom:8px}
.lb{font-size:13px;font-weight:600;color:#64748b;min-width:140px;flex-shrink:0}
.vl{font-size:13px;color:#1e293b}
.pb{background:#0f172a;border-radius:8px;padding:20px 24px;display:flex;justify-content:space-between;align-items:center;margin:20px 0}
.pl{font-size:13px;color:#94a3b8}
.pa{font-size:24px;font-weight:800;color:#ffffff}
hr{border:none;border-top:1px solid #e2e8f0;margin:20px 0}
.ft{background:#f1f5f9;padding:20px 32px;text-align:center}
.ft p{font-size:12px;color:#94a3b8;margin:0;line-height:1.6}
a{color:#2563eb}';

/* =====================================================
   AGENCY EMAIL BODY
===================================================== */
$agencyBody = '<!DOCTYPE html><html lang="da"><head><meta charset="UTF-8"><style>' . $css . '</style></head><body>
<div class="wrap"><div class="card">
<div class="hd"><h1>Ny forespørgsel modtaget</h1><p>Indsendt via formular på faerkwebbureau.dk</p></div>
<div class="bd">

<span class="st">📋 Kontaktinfo</span>
<div class="rw"><span class="lb">Navn:</span><span class="vl">' . $name . '</span></div>
<div class="rw"><span class="lb">E-mail:</span><span class="vl"><a href="mailto:' . $email . '">' . $email . '</a></span></div>
<div class="rw"><span class="lb">Telefon:</span><span class="vl">' . $phone . '</span></div>
<div class="rw"><span class="lb">Virksomhed:</span><span class="vl">' . $company . '</span></div>
<div class="rw"><span class="lb">Nuv. hjemmeside:</span><span class="vl">' . $existingUrl . '</span></div>
<hr>
<span class="st">🏢 Om virksomheden</span>
<div class="rw"><span class="lb">Type:</span><span class="vl">' . $businessType . '</span></div>
<div class="rw"><span class="lb">Branche:</span><span class="vl">' . $industry . '</span></div>
<div class="rw"><span class="lb">Ydelser:</span><span class="vl">' . $services . '</span></div>
<div class="rw"><span class="lb">Målgruppe:</span><span class="vl">' . $targetAudience . '</span></div>
<div class="rw"><span class="lb">Mål:</span><span class="vl">' . $goal . '</span></div>
<hr>
<span class="st">🌐 Nuværende hjemmeside</span>
<div class="rw"><span class="lb">Har hjemmeside:</span><span class="vl">' . $hasWebsite . '</span></div>
<div class="rw"><span class="lb">URL:</span><span class="vl">' . $websiteUrl . '</span></div>
<div class="rw"><span class="lb">Fungerer godt:</span><span class="vl">' . $whatWorks . '</span></div>
<div class="rw"><span class="lb">Forbedringer:</span><span class="vl">' . $improvements . '</span></div>
<div class="rw"><span class="lb">Inspiration:</span><span class="vl">' . $inspiration . '</span></div>
<hr>
<span class="st">⚙️ Omfang &amp; funktioner</span>
<div class="rw"><span class="lb">Antal sider:</span><span class="vl">' . $numPages . '</span></div>
<div class="rw"><span class="lb">Webshop:</span><span class="vl">' . $needsWebshop . '</span></div>
<div class="rw"><span class="lb">Sprog:</span><span class="vl">' . $languages . '</span></div>
<div class="rw"><span class="lb">Funktioner:</span><span class="vl">' . $features . '</span></div>
<hr>
<span class="st">🎨 Design &amp; indhold</span>
<div class="rw"><span class="lb">Farver:</span><span class="vl">' . $colors . '</span></div>
<div class="rw"><span class="lb">Designstil:</span><span class="vl">' . $designStyle . '</span></div>
<div class="rw"><span class="lb">Logo:</span><span class="vl">' . $hasLogo . '</span></div>
<div class="rw"><span class="lb">Indholdsleverandør:</span><span class="vl">' . $contentProvider . '</span></div>
<div class="rw"><span class="lb">Har billeder:</span><span class="vl">' . $hasImages . '</span></div>
<hr>
<span class="st">🔧 Teknik &amp; drift</span>
<div class="rw"><span class="lb">Domæne:</span><span class="vl">' . $hasDomain . '</span></div>
<div class="rw"><span class="lb">Domænenavn:</span><span class="vl">' . $domainName . '</span></div>
<div class="rw"><span class="lb">Hosting:</span><span class="vl">' . $hasHosting . '</span></div>
<div class="rw"><span class="lb">CMS:</span><span class="vl">' . $cmsPreference . '</span></div>
<div class="rw"><span class="lb">Vedligeholdelse:</span><span class="vl">' . $needsMaintenance . '</span></div>
<div class="rw"><span class="lb">Budget:</span><span class="vl">' . $budget . '</span></div>
<hr>
<span class="st">🛒 Tilkøb</span>
' . $addonHtml . '
<div class="pb"><div><div class="pl">Estimeret pris ekskl. moms</div><div style="font-size:11px;color:#64748b;margin-top:2px">Basispakke: 4.999 kr.</div></div><div class="pa">' . $totalPriceFmt . '</div></div>
<hr>
<span class="st">📅 Deadline &amp; kommentarer</span>
<div class="rw"><span class="lb">Deadline:</span><span class="vl">' . $deadline . '</span></div>
<div class="rw"><span class="lb">Kommentarer:</span><span class="vl">' . $comments . '</span></div>
<hr>
<span class="st">📎 Uploadede filer</span>
' . $filesHtml . '
</div>
<div class="ft"><p>Sendt automatisk fra forespørgselsformularen på faerkwebbureau.dk<br>
Besvar kunden ved at svare til <a href="mailto:' . $email . '">' . $email . '</a></p></div>
</div></div></body></html>';

/* =====================================================
   CUSTOMER CONFIRMATION EMAIL BODY
===================================================== */
$customerBody = '<!DOCTYPE html><html lang="da"><head><meta charset="UTF-8"><style>' . $css . '</style></head><body>
<div class="wrap"><div class="card">
<div class="hd"><h1>Tak for din forespørgsel! 🎉</h1><p>Vi vender tilbage inden for 24 timer</p></div>
<div class="bd">
<p style="font-size:15px;color:#334155;line-height:1.7;margin:0 0 20px">
  Hej ' . $name . ',<br><br>
  Tak fordi du kontaktede <strong>Færk Webbureau</strong>. Vi har modtaget din forespørgsel og glæder os til at høre mere om dit projekt.<br><br>
  En af vores konsulenter gennemgår dine oplysninger og kontakter dig hurtigst muligt – og senest inden for <strong>24 timer</strong>.
</p>
<hr>
<span class="st">📋 Din opsummering</span>
<div class="rw"><span class="lb">Virksomhed:</span><span class="vl">' . $company . '</span></div>
<div class="rw"><span class="lb">Branche:</span><span class="vl">' . $industry . '</span></div>
<div class="rw"><span class="lb">Antal sider:</span><span class="vl">' . $numPages . '</span></div>
<div class="rw"><span class="lb">CMS:</span><span class="vl">' . $cmsPreference . '</span></div>
<div class="rw"><span class="lb">Deadline:</span><span class="vl">' . $deadline . '</span></div>
<hr>
<span class="st">🛒 Valgte tilkøb</span>
' . $addonHtml . '
<div class="pb">
  <div><div class="pl">Estimeret pris ekskl. moms</div><div style="font-size:11px;color:#64748b;margin-top:2px">Vejledende – endeligt tilbud aftales</div></div>
  <div class="pa">' . $totalPriceFmt . '</div>
</div>
<div style="background:#f0fdf4;border:1px solid #a7f3d0;border-radius:8px;padding:16px 20px;margin:20px 0">
<p style="font-size:14px;color:#065f46;margin:0;line-height:1.6">
  <strong>Hvad sker der nu?</strong><br>
  1. Vi gennemgår din forespørgsel og tilpasser et tilbud til dig.<br>
  2. Vi kontakter dig på <strong>' . $email . '</strong> eller <strong>' . $phone . '</strong>.<br>
  3. Du modtager et detaljeret og uforpligtende tilbud.
</p>
</div>
<p style="font-size:13px;color:#64748b;margin:20px 0 0;line-height:1.6">
  Har du spørgsmål i mellemtiden? Kontakt os gerne direkte:<br>
  📧 <a href="mailto:kontakt@faerkwebbureau.dk">kontakt@faerkwebbureau.dk</a>
</p>
</div>
<div class="ft"><p>Færk Webbureau · kontakt@faerkwebbureau.dk<br>
Denne e-mail er automatisk genereret på baggrund af din forespørgsel.</p></div>
</div></div></body></html>';

/* =====================================================
   SEND EMAILS
===================================================== */
$fromName    = 'Færk Webbureau';
$fromAddress = 'noreply@faerkwebbureau.dk';
$agencyEmail = 'kontakt@faerkwebbureau.dk';

$agencySubject   = "Ny webforespørgsel fra {$name} – {$company}";
$customerSubject = 'Tak for din forespørgsel – Færk Webbureau';

$agencyHeaders   = buildHeaders($fromName, $fromAddress, $email);
$customerHeaders = buildHeaders($fromName, $fromAddress, $agencyEmail);

$agencyOk = mail($agencyEmail, $agencySubject, $agencyBody, $agencyHeaders);
mail($email, $customerSubject, $customerBody, $customerHeaders);

if ($agencyOk) {
    echo respond(true, 'Forespørgsel sendt.');
} else {
    http_response_code(500);
    echo respond(false, 'Der opstod en fejl ved afsendelse. Kontakt os venligst direkte på kontakt@faerkwebbureau.dk.');
}
