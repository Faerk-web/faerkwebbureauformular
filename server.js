require('dotenv').config();

const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Kun JPG og PNG filer er tilladt'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Static files & body parsing
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(price) {
  return price.toLocaleString('da-DK') + ' kr.';
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ── Email templates ────────────────────────────────────────────────────────

function buildInternalEmail(formData, totalPrice, addons, files) {
  const arr = (v) => (Array.isArray(v) ? v.join(', ') : v || '–');

  const addonRows = addons
    .map(
      (a) =>
        `<tr><td style="padding:4px 8px">${a.label}</td><td style="padding:4px 8px;text-align:right">+${formatPrice(a.price)}</td></tr>`
    )
    .join('');

  const fileList =
    files && files.length
      ? `<ul>${files.map((f) => `<li>${f.originalname} (${(f.size / 1024).toFixed(0)} KB)</li>`).join('')}</ul>`
      : '–';

  return `<!DOCTYPE html>
<html lang="da">
<head><meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;color:#111;max-width:680px;margin:0 auto;padding:20px}
  h1{color:#1B4FD8}h2{color:#1B4FD8;border-bottom:2px solid #EEF3FF;padding-bottom:6px;margin-top:28px}
  .price-hero{background:#1B4FD8;color:#fff;padding:24px;border-radius:10px;text-align:center;margin:20px 0}
  .price-hero .amount{font-size:40px;font-weight:700}
  .section{background:#F5F7FA;border-radius:8px;padding:16px;margin:8px 0}
  .row{display:flex;gap:8px;margin:6px 0}.label{font-weight:600;min-width:160px;color:#555}.val{color:#111}
  table{width:100%;border-collapse:collapse}td{border-bottom:1px solid #E5E7EB}
  .total-row td{font-weight:700;font-size:18px;color:#1B4FD8;border-top:2px solid #1B4FD8}
  footer{color:#aaa;font-size:12px;margin-top:32px;border-top:1px solid #E5E7EB;padding-top:12px}
</style>
</head>
<body>
<h1>📬 Ny forespørgsel fra ${formData.navn || '–'}</h1>

<div class="price-hero">
  <p style="margin:0;opacity:.8">Estimeret pris</p>
  <div class="amount">${formatPrice(totalPrice)}</div>
  <p style="margin:6px 0 0;opacity:.7;font-size:13px">Priser starter fra 4.999 kr.</p>
</div>

<h2>Kontaktoplysninger</h2>
<div class="section">
  <div class="row"><span class="label">Navn:</span><span class="val">${formData.navn || '–'}</span></div>
  <div class="row"><span class="label">Email:</span><span class="val">${formData.email || '–'}</span></div>
  <div class="row"><span class="label">Telefon:</span><span class="val">${formData.telefon || '–'}</span></div>
  <div class="row"><span class="label">Virksomhed:</span><span class="val">${formData.virksomhed || '–'}</span></div>
</div>

<h2>Om virksomheden</h2>
<div class="section">
  <div class="row"><span class="label">Branche:</span><span class="val">${formData.branche || '–'}</span></div>
  <div class="row"><span class="label">Størrelse:</span><span class="val">${formData.storrelse || '–'}</span></div>
  <div class="row"><span class="label">Målgruppe:</span><span class="val">${formData.maalgruppe || '–'}</span></div>
  <div class="row"><span class="label">Mål med hjemmesiden:</span><span class="val">${formData.maal || '–'}</span></div>
</div>

<h2>Nuværende hjemmeside</h2>
<div class="section">
  <div class="row"><span class="label">Har hjemmeside:</span><span class="val">${formData.harHjemmeside === 'ja' ? 'Ja' : 'Nej'}</span></div>
  ${formData.hjemmesideUrl ? `<div class="row"><span class="label">URL:</span><span class="val"><a href="${formData.hjemmesideUrl}">${formData.hjemmesideUrl}</a></span></div>` : ''}
  ${formData.hvadFungerer ? `<div class="row"><span class="label">Fungerer godt:</span><span class="val">${formData.hvadFungerer}</span></div>` : ''}
  ${formData.hvadForbedres ? `<div class="row"><span class="label">Skal forbedres:</span><span class="val">${formData.hvadForbedres}</span></div>` : ''}
</div>

<h2>Omfang & funktioner</h2>
<div class="section">
  <div class="row"><span class="label">Type:</span><span class="val">${formData.hjemmesideType || '–'}</span></div>
  <div class="row"><span class="label">Antal sider:</span><span class="val">${formData.antalSider || '–'}</span></div>
  <div class="row"><span class="label">Funktioner:</span><span class="val">${arr(formData.funktioner)}</span></div>
</div>

<h2>Design & indhold</h2>
<div class="section">
  <div class="row"><span class="label">Designstil:</span><span class="val">${formData.designstil || '–'}</span></div>
  <div class="row"><span class="label">Farveønsker:</span><span class="val">${formData.farver || '–'}</span></div>
  <div class="row"><span class="label">Logo:</span><span class="val">${formData.harLogo || '–'}</span></div>
  <div class="row"><span class="label">Indhold klar:</span><span class="val">${formData.indholdKlar || '–'}</span></div>
  ${formData.inspirationsUrls ? `<div class="row"><span class="label">Inspiration:</span><span class="val">${formData.inspirationsUrls}</span></div>` : ''}
</div>

<h2>Teknik & drift</h2>
<div class="section">
  <div class="row"><span class="label">Domæne:</span><span class="val">${formData.domain || '–'}</span></div>
  ${formData.domainNavn ? `<div class="row"><span class="label">Domænenavn:</span><span class="val">${formData.domainNavn}</span></div>` : ''}
  <div class="row"><span class="label">Hosting:</span><span class="val">${formData.hosting || '–'}</span></div>
  <div class="row"><span class="label">CMS:</span><span class="val">${formData.cms || '–'}</span></div>
  <div class="row"><span class="label">Vedligeholdelse:</span><span class="val">${formData.vedligeholdelse || '–'}</span></div>
</div>

<h2>Tilkøb & pris</h2>
<div class="section">
  <table>
    <tr><td style="padding:4px 8px">Basispris</td><td style="padding:4px 8px;text-align:right">4.999 kr.</td></tr>
    ${addonRows}
    <tr class="total-row"><td style="padding:8px">Total estimeret pris</td><td style="padding:8px;text-align:right">${formatPrice(totalPrice)}</td></tr>
  </table>
  ${formData.deadline ? `<div class="row" style="margin-top:12px"><span class="label">Ønsket deadline:</span><span class="val">${formData.deadline}</span></div>` : ''}
</div>

${formData.kommentarer ? `<h2>Kommentarer</h2><div class="section"><p>${formData.kommentarer}</p></div>` : ''}

<h2>Uploadede filer</h2>
<div class="section">${fileList}</div>

<footer>Indsendt via Færk Webbureau Formular · ${new Date().toLocaleString('da-DK')}</footer>
</body>
</html>`;
}

function buildCustomerEmail(formData, totalPrice, addons) {
  const addonListItems = addons
    .map((a) => `<li>${a.label}: +${formatPrice(a.price)}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="da">
<head><meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:0}
  .header{background:linear-gradient(135deg,#1B4FD8,#3B6FFF);color:#fff;padding:48px 40px;text-align:center;border-radius:12px 12px 0 0}
  .header h1{margin:0;font-size:26px}.header p{margin:8px 0 0;opacity:.85}
  .content{background:#fff;padding:40px;border:1px solid #E5E7EB;border-top:0}
  .price-box{background:#EEF3FF;border:2px solid #1B4FD8;border-radius:10px;padding:24px;text-align:center;margin:24px 0}
  .price-box .amount{font-size:38px;font-weight:700;color:#1B4FD8}
  .price-box .note{font-size:13px;color:#888;margin:6px 0 0}
  .steps{list-style:none;padding:0;margin:0}
  .steps li{display:flex;align-items:flex-start;gap:14px;padding:12px 0;border-bottom:1px solid #F3F4F6}
  .steps li:last-child{border-bottom:0}
  .step-num{background:#1B4FD8;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0}
  .addon-list{margin:8px 0 0;padding-left:20px}
  .footer{background:#F9FAFB;padding:20px 40px;text-align:center;color:#9CA3AF;font-size:12px;border-radius:0 0 12px 12px;border:1px solid #E5E7EB;border-top:0}
  a{color:#1B4FD8}
</style>
</head>
<body>
<div class="header">
  <h1>🎉 Tak for din forespørgsel!</h1>
  <p>Færk Webbureau – vi vender tilbage inden for 24 timer</p>
</div>
<div class="content">
  <p>Hej ${formData.navn || ''},</p>
  <p>Mange tak for din henvendelse! Vi har modtaget alle dine oplysninger og glæder os til at hjælpe dig med din nye hjemmeside.</p>

  <div class="price-box">
    <p style="margin:0 0 6px;color:#555;font-size:14px">Din estimerede pris</p>
    <div class="amount">${formatPrice(totalPrice)}</div>
    <div class="note">Priser starter fra 4.999 kr. · Endelig pris aftales ved møde</div>
  </div>

  <h3 style="margin-top:0">Valgte tilkøb:</h3>
  <ul class="addon-list">
    <li>Basispris: 4.999 kr.</li>
    ${addonListItems || '<li>Ingen tilkøb valgt</li>'}
  </ul>

  <h3>Hvad sker der nu?</h3>
  <ul class="steps">
    <li>
      <div class="step-num">1</div>
      <div>Vi gennemgår din forespørgsel og forbereder et skræddersyet tilbud</div>
    </li>
    <li>
      <div class="step-num">2</div>
      <div>Vi kontakter dig inden for 24 timer på <strong>${formData.email || ''}</strong>${formData.telefon ? ` eller <strong>${formData.telefon}</strong>` : ''}</div>
    </li>
    <li>
      <div class="step-num">3</div>
      <div>Vi holder et indledende møde (online eller fysisk) for at drøfte dit projekt</div>
    </li>
    <li>
      <div class="step-num">4</div>
      <div>Du modtager et detaljeret tilbud og en tidsplan for projektet</div>
    </li>
  </ul>

  <p style="margin-top:24px">Har du spørgsmål i mellemtiden? Skriv til os på <a href="mailto:kontakt@faerkwebbureau.dk">kontakt@faerkwebbureau.dk</a></p>
  <p>Med venlig hilsen,<br><strong>Teamet hos Færk Webbureau</strong></p>
</div>
<div class="footer">
  <p>Færk Webbureau · <a href="mailto:kontakt@faerkwebbureau.dk">kontakt@faerkwebbureau.dk</a></p>
  <p>Du modtager denne email fordi du udfyldte vores kontaktformular.</p>
</div>
</body>
</html>`;
}

// ── Route: form submission ─────────────────────────────────────────────────

app.post('/api/submit', upload.array('filer', 10), async (req, res) => {
  try {
    const payload = JSON.parse(req.body.formData || '{}');
    const { formData = {}, totalPrice = 4999, addons = [] } = payload;
    const files = req.files || [];

    const transporter = createTransporter();

    const attachments = files.map((f) => ({
      filename: f.originalname,
      path: f.path,
    }));

    // Internal email
    await transporter.sendMail({
      from: `"Færk Webbureau Formular" <${process.env.SMTP_USER}>`,
      to: 'kontakt@faerkwebbureau.dk',
      subject: `Ny forespørgsel fra ${formData.navn || 'Ukendt'} – ${formatPrice(totalPrice)}`,
      html: buildInternalEmail(formData, totalPrice, addons, files),
      attachments,
    });

    // Customer confirmation
    if (formData.email) {
      await transporter.sendMail({
        from: `"Færk Webbureau" <${process.env.SMTP_USER}>`,
        replyTo: 'kontakt@faerkwebbureau.dk',
        to: formData.email,
        subject: 'Bekræftelse – Vi har modtaget din forespørgsel | Færk Webbureau',
        html: buildCustomerEmail(formData, totalPrice, addons),
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Submission error:', err.message);
    res.status(500).json({
      success: false,
      error: 'Der opstod en fejl ved afsendelse. Prøv venligst igen.',
    });
  }
});

// ── Start ──────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅ Server kører på http://localhost:${PORT}`);
});
