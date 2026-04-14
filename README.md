<!doctype html>
<html lang="da">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Færk Webbureau – Projektformular</title>
  <meta name="description" content="Få en estimeret pris og send din forespørgsel til Færk Webbureau." />
  <style>
    :root{
      --bg:#0b0f14;
      --panel:#0f1620;
      --panel2:#0c121b;
      --text:#e7edf6;
      --muted:#a8b3c4;
      --line:rgba(255,255,255,.08);
      --brand:#7c5cff;
      --brand2:#42d7ff;
      --ok:#22c55e;
      --warn:#f59e0b;
      --bad:#ef4444;

      --radius:16px;
      --shadow: 0 18px 60px rgba(0,0,0,.55);
      --shadow2: 0 10px 30px rgba(0,0,0,.45);
      --max: 1120px;
      --ease: cubic-bezier(.2,.9,.2,1);
    }

    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif;
      background:
        radial-gradient(1000px 700px at 15% 10%, rgba(124,92,255,.24), transparent 60%),
        radial-gradient(900px 650px at 85% 20%, rgba(66,215,255,.16), transparent 55%),
        radial-gradient(900px 700px at 50% 110%, rgba(124,92,255,.14), transparent 60%),
        var(--bg);
      color:var(--text);
      line-height:1.45;
    }

    a{color:inherit}
    .wrap{max-width:var(--max); margin:0 auto; padding:28px 18px 70px}
    header{
      display:flex; align-items:flex-start; justify-content:space-between; gap:18px;
      margin-bottom:18px;
    }
    .brand{
      display:flex; flex-direction:column; gap:8px;
    }
    .brand h1{
      font-size: clamp(22px, 2.1vw, 30px);
      margin:0;
      letter-spacing:.2px;
    }
    .brand p{margin:0; color:var(--muted); max-width:65ch}
    .badge{
      display:inline-flex; align-items:center; gap:8px;
      padding:8px 10px; border:1px solid var(--line);
      border-radius:999px; background:rgba(255,255,255,.03);
      font-size:13px; color:var(--muted);
      white-space:nowrap;
    }
    .dot{width:8px; height:8px; border-radius:999px; background:linear-gradient(135deg,var(--brand),var(--brand2))}
    .grid{
      display:grid;
      grid-template-columns: 1fr 360px;
      gap:18px;
      align-items:start;
    }
    @media (max-width: 980px){
      .grid{grid-template-columns: 1fr}
    }

    .card{
      background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
      border:1px solid var(--line);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      overflow:hidden;
    }
    .card .topbar{
      padding:16px 18px 14px;
      background: rgba(0,0,0,.2);
      border-bottom:1px solid var(--line);
    }
    .toprow{
      display:flex; align-items:center; justify-content:space-between; gap:12px;
      flex-wrap:wrap;
    }
    .stepTitle{margin:0; font-size:16px; letter-spacing:.2px}
    .stepMeta{color:var(--muted); font-size:13px}
    .progressWrap{margin-top:10px}
    .progress{
      width:100%; height:10px;
      background: rgba(255,255,255,.06);
      border-radius:999px; overflow:hidden;
      border:1px solid rgba(255,255,255,.06);
    }
    .bar{
      height:100%;
      width:0%;
      background: linear-gradient(90deg, var(--brand), var(--brand2));
      border-radius:999px;
      transition: width 420ms var(--ease);
    }

    .content{padding:18px}
    .fieldset{
      display:grid;
      gap:14px;
      animation: fadeIn 260ms var(--ease);
    }
    @keyframes fadeIn{
      from{opacity:0; transform:translateY(8px)}
      to{opacity:1; transform:translateY(0)}
    }

    .row2{display:grid; grid-template-columns: 1fr 1fr; gap:12px}
    @media (max-width: 640px){ .row2{grid-template-columns:1fr} }

    label{display:block; font-size:13px; color:var(--muted); margin-bottom:6px}
    .help{font-size:12px; color:var(--muted); margin-top:6px}
    input[type="text"], input[type="email"], input[type="tel"], input[type="url"], input[type="number"], select, textarea{
      width:100%;
      padding:12px 12px;
      border-radius: 12px;
      border:1px solid rgba(255,255,255,.10);
      outline:none;
      background: rgba(0,0,0,.24);
      color:var(--text);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.06);
    }
    textarea{min-height: 110px; resize:vertical}
    input::placeholder, textarea::placeholder{color:rgba(231,237,246,.35)}
    input:focus, select:focus, textarea:focus{
      border-color: rgba(124,92,255,.55);
      box-shadow: 0 0 0 4px rgba(124,92,255,.18);
    }

    .choices{
      display:grid; gap:10px;
      grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 720px){ .choices{grid-template-columns:1fr} }

    .choice{
      display:flex; gap:12px;
      padding:12px 12px;
      border:1px solid rgba(255,255,255,.10);
      border-radius: 14px;
      background: rgba(0,0,0,.22);
      cursor:pointer;
      transition: transform 160ms var(--ease), border-color 160ms var(--ease), background 160ms var(--ease);
    }
    .choice:hover{transform:translateY(-1px); border-color: rgba(124,92,255,.35)}
    .choice input{margin-top:3px}
    .choice b{display:block; font-size:14px}
    .choice small{color:var(--muted)}
    .pill{
      margin-left:auto;
      align-self:flex-start;
      font-size:12px;
      padding:6px 8px;
      border-radius:999px;
      border:1px solid var(--line);
      color:rgba(231,237,246,.9);
      background:rgba(255,255,255,.03);
      white-space:nowrap;
    }

    .addons{
      display:grid; gap:14px;
    }
    .addons h3{margin:4px 0 0; font-size:14px; color:rgba(231,237,246,.92); letter-spacing:.2px}
    .addons .group{
      padding:12px; border-radius:14px;
      border:1px solid rgba(255,255,255,.10);
      background: rgba(0,0,0,.18);
    }
    .groupGrid{display:grid; gap:10px; margin-top:10px}
    .checkline{
      display:flex; align-items:flex-start; gap:10px;
      padding:8px 8px;
      border-radius:12px;
      transition: background 160ms var(--ease);
    }
    .checkline:hover{background:rgba(255,255,255,.03)}
    .checkline .meta{display:flex; flex-direction:column; gap:2px}
    .checkline .meta span{font-size:13px}
    .checkline .meta em{font-style:normal; color:var(--muted); font-size:12px}
    .checkline .right{margin-left:auto; color:rgba(231,237,246,.92); font-size:12px; white-space:nowrap}
    .inlineNumber{
      display:grid;
      grid-template-columns: 1fr 160px;
      gap:10px;
      align-items:center;
    }
    @media (max-width: 520px){
      .inlineNumber{grid-template-columns:1fr}
    }

    .actions{
      display:flex; gap:10px;
      justify-content:space-between;
      padding:16px 18px;
      border-top:1px solid var(--line);
      background: rgba(0,0,0,.18);
    }
    .btn{
      appearance:none;
      border:1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.06);
      color:var(--text);
      padding:11px 14px;
      border-radius: 12px;
      cursor:pointer;
      font-weight:600;
      transition: transform 160ms var(--ease), background 160ms var(--ease), border-color 160ms var(--ease), opacity 160ms var(--ease);
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:8px;
      min-width: 120px;
    }
    .btn:hover{transform:translateY(-1px); background: rgba(255,255,255,.08); border-color: rgba(124,92,255,.35)}
    .btn:disabled{opacity:.45; cursor:not-allowed; transform:none}
    .btn.primary{
      background: linear-gradient(135deg, rgba(124,92,255,.95), rgba(66,215,255,.55));
      border-color: rgba(124,92,255,.5);
      box-shadow: var(--shadow2);
    }
    .btn.primary:hover{background: linear-gradient(135deg, rgba(124,92,255,1), rgba(66,215,255,.62))}
    .btn.ghost{
      background: transparent;
    }

    .side{
      position: sticky;
      top:16px;
      display:grid;
      gap:14px;
    }
    @media (max-width: 980px){
      .side{position:relative; top:auto}
    }

    .priceCard{
      padding:14px 14px;
      border-radius: var(--radius);
      border:1px solid var(--line);
      background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.02));
      box-shadow: var(--shadow2);
    }
    .priceTop{
      display:flex; justify-content:space-between; align-items:flex-start; gap:10px;
      margin-bottom:8px;
    }
    .priceTop h2{
      margin:0; font-size:14px; color:rgba(231,237,246,.92);
      letter-spacing:.2px;
    }
    .price{
      font-size: clamp(22px, 2.3vw, 28px);
      font-weight:800;
      letter-spacing:.2px;
      margin:6px 0 4px;
    }
    .sub{color:var(--muted); font-size:12px; margin:0}
    .summaryList{
      margin:10px 0 0;
      padding:0; list-style:none;
      display:grid; gap:8px;
      color:rgba(231,237,246,.9);
      font-size:13px;
    }
    .summaryList li{
      display:flex; gap:10px; justify-content:space-between;
      padding:8px 10px;
      border:1px solid rgba(255,255,255,.08);
      border-radius: 12px;
      background: rgba(0,0,0,.18);
    }
    .summaryList li span{color:var(--muted)}
    .tiny{font-size:12px; color:var(--muted)}
    .note{
      padding:12px;
      border-radius:14px;
      border:1px solid rgba(255,255,255,.10);
      background: rgba(0,0,0,.18);
      color:var(--muted);
      font-size:13px;
    }

    .error{
      border-color: rgba(239,68,68,.65) !important;
      box-shadow: 0 0 0 4px rgba(239,68,68,.14) !important;
    }
    .errText{
      color: rgba(255,160,160,.95);
      font-size: 12px;
      margin-top:6px;
      display:none;
    }
    .errText.show{display:block}

    .drop{
      border:1px dashed rgba(255,255,255,.22);
      border-radius: 16px;
      padding:14px;
      background: rgba(0,0,0,.18);
      transition: border-color 160ms var(--ease), background 160ms var(--ease);
    }
    .drop.dragover{
      border-color: rgba(66,215,255,.7);
      background: rgba(66,215,255,.06);
    }
    .fileRow{
      display:flex; justify-content:space-between; align-items:center; gap:10px;
      padding:10px 10px;
      border-radius: 12px;
      border:1px solid rgba(255,255,255,.08);
      background: rgba(0,0,0,.16);
      margin-top:10px;
      font-size:13px;
      color:rgba(231,237,246,.92);
    }
    .fileRow span{color:var(--muted); font-size:12px}
    .xbtn{
      border:1px solid rgba(255,255,255,.14);
      background: rgba(255,255,255,.06);
      color: var(--text);
      border-radius: 10px;
      padding:7px 10px;
      cursor:pointer;
    }

    .success{
      padding:14px;
      border-radius: 16px;
      border: 1px solid rgba(34,197,94,.35);
      background: rgba(34,197,94,.08);
      color: rgba(210,255,225,.95);
      display:none;
    }
    .success.show{display:block}

    .kbd{
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
      font-size:12px;
      padding:2px 6px;
      border-radius: 8px;
      border:1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.05);
      color: rgba(231,237,246,.9);
    }
  </style>
</head>

<body>
  <div class="wrap">
    <header>
      <div class="brand">
        <h1>Færk Webbureau – Projektformular</h1>
        <p>Udfyld trin-for-trin. Du får en <b>estimeret pris</b>, og vi vender tilbage inden for 24 timer på hverdage.</p>
      </div>
      <div class="badge" title="Auto-gemmer i din browser">
        <span class="dot"></span>
        Auto-gemmer undervejs
      </div>
    </header>

    <div class="grid">
      <!-- MAIN -->
      <section class="card" aria-labelledby="stepHeading">
        <div class="topbar">
          <div class="toprow">
            <h2 class="stepTitle" id="stepHeading">Trin 1 – Kontaktinfo</h2>
            <div class="stepMeta" id="stepMeta">Trin 1 af 8</div>
          </div>
          <div class="progressWrap">
            <div class="progress" aria-label="Fremdrift">
              <div class="bar" id="progressBar"></div>
            </div>
          </div>
        </div>

        <form id="wizard" novalidate>
          <div class="content">
            <div class="success" id="successBox">
              <b>Tak for din forespørgsel!</b><br/>
              Vi har modtaget dine oplysninger og vender tilbage inden for 24 timer.
            </div>

            <!-- STEP 1 -->
            <section class="fieldset" data-step="1">
              <div class="row2">
                <div>
                  <label for="navn">Navn *</label>
                  <input id="navn" name="navn" type="text" placeholder="Dit navn" autocomplete="name" required />
                  <div class="errText" data-error-for="navn">Udfyld venligst dit navn.</div>
                </div>
                <div>
                  <label for="email">E-mail *</label>
                  <input id="email" name="email" type="email" placeholder="fx navn@firma.dk" autocomplete="email" required />
                  <div class="errText" data-error-for="email">Indtast en gyldig e-mailadresse.</div>
                </div>
              </div>

              <div class="row2">
                <div>
                  <label for="telefon">Telefon *</label>
                  <input id="telefon" name="telefon" type="tel" placeholder="fx 12 34 56 78" autocomplete="tel" required />
                  <div class="errText" data-error-for="telefon">Udfyld venligst et telefonnummer.</div>
                </div>
                <div>
                  <label for="kontaktmetode">Foretrukken kontakt *</label>
                  <select id="kontaktmetode" name="kontaktmetode" required>
                    <option value="" selected disabled>Vælg…</option>
                    <option>E-mail</option>
                    <option>Telefon</option>
                    <option>Begge</option>
                  </select>
                  <div class="errText" data-error-for="kontaktmetode">Vælg venligst en kontaktmetode.</div>
                </div>
              </div>

              <div class="note">
                Microcopy: Vi bruger dine oplysninger til at kontakte dig om din forespørgsel – intet spam.
              </div>
            </section>

            <!-- STEP 2 -->
            <section class="fieldset" data-step="2" hidden>
              <div class="row2">
                <div>
                  <label for="virksomhed">Virksomhed *</label>
                  <input id="virksomhed" name="virksomhed" type="text" placeholder="Firmanavn" autocomplete="organization" required />
                  <div class="errText" data-error-for="virksomhed">Udfyld venligst virksomhedsnavn.</div>
                </div>
                <div>
                  <label for="cvr">CVR (valgfrit)</label>
                  <input id="cvr" name="cvr" type="text" placeholder="8 cifre" inputmode="numeric" />
                  <div class="help">Hvis du kender det – ellers spring over.</div>
                </div>
              </div>

              <div class="row2">
                <div>
                  <label for="branche">Branche *</label>
                  <input id="branche" name="branche" type="text" placeholder="fx håndværk, klinik, e-handel…" required />
                  <div class="errText" data-error-for="branche">Udfyld venligst branche.</div>
                </div>
                <div>
                  <label for="maalgruppe">Målgruppe *</label>
                  <input id="maalgruppe" name="maalgruppe" type="text" placeholder="Hvem vil du helst tiltrække?" required />
                  <div class="errText" data-error-for="maalgruppe">Udfyld venligst målgruppe.</div>
                </div>
              </div>

              <div>
                <label for="maal">Hvad er dit primære mål? *</label>
                <div class="choices">
                  <label class="choice">
                    <input type="radio" name="maal" value="Flere henvendelser (leads)" required />
                    <div>
                      <b>Flere henvendelser</b>
                      <small>Fokus på konvertering og tydelige call-to-actions.</small>
                    </div>
                    <span class="pill">Anbefalet</span>
                  </label>
                  <label class="choice">
                    <input type="radio" name="maal" value="Flere salg (e-handel)" required />
                    <div>
                      <b>Flere salg</b>
                      <small>Produktflow, tillidsskabende elementer og performance.</small>
                    </div>
                    <span class="pill">+</span>
                  </label>
                  <label class="choice">
                    <input type="radio" name="maal" value="Brand & troværdighed" required />
                    <div>
                      <b>Brand & troværdighed</b>
                      <small>Premium udtryk og stærk fortælling.</small>
                    </div>
                    <span class="pill">+</span>
                  </label>
                  <label class="choice">
                    <input type="radio" name="maal" value="Information/portal" required />
                    <div>
                      <b>Information/portal</b>
                      <small>Struktur, navigation og god læsbarhed.</small>
                    </div>
                    <span class="pill">+</span>
                  </label>
                </div>
                <div class="errText" data-error-for="maal">Vælg venligst et mål.</div>
              </div>
            </section>

            <!-- STEP 3 -->
            <section class="fieldset" data-step="3" hidden>
              <div class="row2">
                <div>
                  <label for="harSide">Har du en hjemmeside i dag? *</label>
                  <select id="harSide" name="harSide" required>
                    <option value="" selected disabled>Vælg…</option>
                    <option value="Ja">Ja</option>
                    <option value="Nej">Nej</option>
                  </select>
                  <div class="errText" data-error-for="harSide">Vælg venligst en mulighed.</div>
                </div>
                <div>
                  <label for="url">Nuværende URL (valgfrit)</label>
                  <input id="url" name="url" type="url" placeholder="https://…" />
                  <div class="help">Hvis du allerede har en side, så indsæt linket.</div>
                </div>
              </div>

              <div>
                <label for="udfordringer">Hvad fungerer ikke optimalt i dag? *</label>
                <textarea id="udfordringer" name="udfordringer" placeholder="fx få henvendelser, langsom side, svært at opdatere…" required></textarea>
                <div class="errText" data-error-for="udfordringer">Beskriv venligst dine udfordringer.</div>
              </div>
            </section>

            <!-- STEP 4 -->
            <section class="fieldset" data-step="4" hidden>
              <div>
                <label for="sidetal">Ca. hvor mange sider forventer du? *</label>
                <select id="sidetal" name="sidetal" required>
                  <option value="" selected disabled>Vælg…</option>
                  <option value="1-3">1–3 sider</option>
                  <option value="4-7">4–7 sider</option>
                  <option value="8-12">8–12 sider</option>
                  <option value="13+">13+ sider</option>
                </select>
                <div class="errText" data-error-for="sidetal">Vælg venligst et interval.</div>
                <div class="help">Tip: Vi kan altid justere omfang efter en kort afklaring.</div>
              </div>

              <div>
                <label for="funktioner">Funktioner (vælg mindst 1) *</label>
                <div class="choices">
                  <label class="choice">
                    <input type="checkbox" name="funktioner" value="Kontaktformular" required data-mincheck="1"/>
                    <div><b>Kontaktformular</b><small>Let for kunder at tage kontakt.</small></div>
                    <span class="pill">Standard</span>
                  </label>
                  <label class="choice">
                    <input type="checkbox" name="funktioner" value="Call-to-action sektioner" required data-mincheck="1"/>
                    <div><b>CTA-sektioner</b><small>Skub besøgende mod handling.</small></div>
                    <span class="pill">+</span>
                  </label>
                  <label class="choice">
                    <input type="checkbox" name="funktioner" value="Præsentation af ydelser" required data-mincheck="1"/>
                    <div><b>Ydelser</b><small>Klare pakker og fordele.</small></div>
                    <span class="pill">+</span>
                  </label>
                  <label class="choice">
                    <input type="checkbox" name="funktioner" value="Case/Referencer" required data-mincheck="1"/>
                    <div><b>Cases/Referencer</b><small>Troværdighed og social proof.</small></div>
                    <span class="pill">+</span>
                  </label>
                </div>
                <div class="errText" data-error-for="funktioner">Vælg mindst én funktion.</div>
              </div>
            </section>

            <!-- STEP 5 -->
            <section class="fieldset" data-step="5" hidden>
              <div class="row2">
                <div>
                  <label for="designretning">Designretning *</label>
                  <select id="designretning" name="designretning" required>
                    <option value="" selected disabled>Vælg…</option>
                    <option value="Premium/minimal">Premium / minimal</option>
                    <option value="Moderne & farverig">Moderne & farverig</option>
                    <option value="Klassisk & konservativ">Klassisk & konservativ</option>
                    <option value="Ved ikke / I foreslår">Ved ikke / I foreslår</option>
                  </select>
                  <div class="errText" data-error-for="designretning">Vælg venligst en designretning.</div>
                </div>
                <div>
                  <label for="brandguide">Har du logo/brandguide? *</label>
                  <select id="brandguide" name="brandguide" required>
                    <option value="" selected disabled>Vælg…</option>
                    <option>Ja</option>
                    <option>Delvist</option>
                    <option>Nej</option>
                  </select>
                  <div class="errText" data-error-for="brandguide">Vælg venligst en mulighed.</div>
                </div>
              </div>

              <div>
                <label for="indholdStatus">Indhold (tekst/billeder) *</label>
                <select id="indholdStatus" name="indholdStatus" required>
                  <option value="" selected disabled>Vælg…</option>
                  <option value="Jeg har det meste klar">Jeg har det meste klar</option>
                  <option value="Jeg har noget – men mangler hjælp">Jeg har noget – men mangler hjælp</option>
                  <option value="Jeg har brug for hjælp til det hele">Jeg har brug for hjælp til det hele</option>
                </select>
                <div class="errText" data-error-for="indholdStatus">Vælg venligst en mulighed.</div>
                <div class="help">Microcopy: Vi kan hjælpe med både struktur, tekst og billedudvalg.</div>
              </div>

              <div>
                <label for="tone">Tone of voice (valgfrit)</label>
                <input id="tone" name="tone" type="text" placeholder="fx professionel, venlig, direkte, humoristisk…" />
              </div>
            </section>

            <!-- STEP 6 -->
            <section class="fieldset" data-step="6" hidden>
              <div class="row2">
                <div>
                  <label for="cms">Foretrukken platform/CMS *</label>
                  <select id="cms" name="cms" required>
                    <option value="" selected disabled>Vælg…</option>
                    <option value="WordPress">WordPress</option>
                    <option value="Webflow">Webflow</option>
                    <option value="Shopify">Shopify</option>
                    <option value="Headless / custom">Headless / custom</option>
                    <option value="Ved ikke / I anbefaler">Ved ikke / I anbefaler</option>
                  </select>
                  <div class="errText" data-error-for="cms">Vælg venligst en platform.</div>
                </div>
                <div>
                  <label for="hosting">Hosting & drift *</label>
                  <select id="hosting" name="hosting" required>
                    <option value="" selected disabled>Vælg…</option>
                    <option value="Jeg har hosting">Jeg har hosting</option>
                    <option value="Jeg vil gerne have hjælp til hosting">Jeg vil gerne have hjælp til hosting</option>
                    <option value="Ved ikke">Ved ikke</option>
                  </select>
                  <div class="errText" data-error-for="hosting">Vælg venligst en mulighed.</div>
                </div>
              </div>

              <div class="row2">
                <div>
                  <label for="gdpr">GDPR / cookie-løsning *</label>
                  <select id="gdpr" name="gdpr" required>
                    <option value="" selected disabled>Vælg…</option>
                    <option value="Jeg har allerede en løsning">Jeg har allerede en løsning</option>
                    <option value="Jeg skal have hjælp til cookie-banner">Jeg skal have hjælp til cookie-banner</option>
                    <option value="Ved ikke">Ved ikke</option>
                  </select>
                  <div class="errText" data-error-for="gdpr">Vælg venligst en mulighed.</div>
                </div>
                <div>
                  <label for="analytics">Tracking/Analytics *</label>
                  <select id="analytics" name="analytics" required>
                    <option value="" selected disabled>Vælg…</option>
                    <option value="GA4 / Tag Manager">GA4 / Tag Manager</option>
                    <option value="Piwik/Matomo el. andet">Piwik/Matomo el. andet</option>
                    <option value="Ved ikke / ikke vigtigt">Ved ikke / ikke vigtigt</option>
                  </select>
                  <div class="errText" data-error-for="analytics">Vælg venligst en mulighed.</div>
                </div>
              </div>
            </section>

            <!-- STEP 7 -->
            <section class="fieldset addons" data-step="7" hidden>
              <div class="group">
                <h3>Indhold & tekst</h3>
                <div class="groupGrid">
                  <div class="inlineNumber">
                    <div>
                      <label for="ekstraSider">Ekstra sider (udover basis) – 500 kr./side</label>
                      <div class="help">Angiv antal ekstra sider (0 hvis ingen). Basis er altid inkluderet.</div>
                    </div>
                    <input id="ekstraSider" name="ekstraSider" type="number" min="0" step="1" value="0" inputmode="numeric" />
                  </div>

                  <label class="checkline">
                    <input type="checkbox" name="addons" value="Blogopsætning" data-price="1000" />
                    <div class="meta">
                      <span>Blogopsætning</span>
                      <em>Struktur + opsætning af blog-sektion.</em>
                    </div>
                    <div class="right">+ 1.000 kr.</div>
                  </label>

                  <label class="checkline">
                    <input type="checkbox" name="addons" value="3 blogindlæg" data-price="1200" />
                    <div class="meta">
                      <span>3 blogindlæg</span>
                      <em>Udkast/opsætning (indhold kan afklares).</em>
                    </div>
                    <div class="right">+ 1.200 kr.</div>
                  </label>

                  <label class="checkline">
                    <input type="checkbox" name="addons" value="SEO basis" data-price="1000" />
                    <div class="meta">
                      <span>SEO basis</span>
                      <em>Grundopsætning + tekniske best practices.</em>
                    </div>
                    <div class="right">+ 1.000 kr.</div>
                  </label>

                  <label class="checkline">
                    <input type="checkbox" name="addons" value="Kundeudtalelser" data-price="500" />
                    <div class="meta">
                      <span>Kundeudtalelser</span>
                      <em>Opsætning af sektion til testimonials.</em>
                    </div>
                    <div class="right">+ 500 kr.</div>
                  </label>
                </div>
              </div>

              <div class="group">
                <h3>Billeder & video</h3>
                <div class="groupGrid">
                  <div class="inlineNumber">
                    <div>
                      <label for="billedredigering">Billedredigering – 250 kr./billede</label>
                      <div class="help">Angiv antal billeder (0 hvis ingen).</div>
                    </div>
                    <input id="billedredigering" name="billedredigering" type="number" min="0" step="1" value="0" inputmode="numeric" />
                  </div>

                  <div class="inlineNumber">
                    <div>
                      <label for="videoredigering">Videoredigering – 500 kr./video</label>
                      <div class="help">Angiv antal videoer (0 hvis ingen).</div>
                    </div>
                    <input id="videoredigering" name="videoredigering" type="number" min="0" step="1" value="0" inputmode="numeric" />
                  </div>
                </div>
              </div>

              <div class="group">
                <h3>Integrationer</h3>
                <div class="groupGrid">
                  <label class="checkline">
                    <input type="checkbox" name="addons" value="Social media feed" data-price="1200" />
                    <div class="meta"><span>Social media feed</span><em>Vis fx Instagram/Facebook feed.</em></div>
                    <div class="right">+ 1.200 kr.</div>
                  </label>

                  <label class="checkline">
                    <input type="checkbox" name="addons" value="Booking system" data-price="2800" />
                    <div class="meta"><span>Booking system</span><em>Integreret bookingflow.</em></div>
                    <div class="right">+ 2.800 kr.</div>
                  </label>

                  <label class="checkline">
                    <input type="checkbox" name="addons" value="Nyhedsbrev" data-price="800" />
                    <div class="meta"><span>Nyhedsbrev</span><em>Signup + integration til platform.</em></div>
                    <div class="right">+ 800 kr.</div>
                  </label>

                  <label class="checkline">
                    <input type="checkbox" name="addons" value="Google Maps" data-price="500" />
                    <div class="meta"><span>Google Maps</span><em>Kort + klikbar rute.</em></div>
                    <div class="right">+ 500 kr.</div>
                  </label>

                  <label class="checkline">
                    <input type="checkbox" name="addons" value="Fil-download" data-price="400" />
                    <div class="meta"><span>Fil-download</span><em>PDF/ressourcer til download.</em></div>
                    <div class="right">+ 400 kr.</div>
                  </label>

                  <label class="checkline">
                    <input type="checkbox" name="addons" value="FAQ sektion" data-price="500" />
                    <div class="meta"><span>FAQ sektion</span><em>Spørgsmål/svar med god UX.</em></div>
                    <div class="right">+ 500 kr.</div>
                  </label>
                </div>
              </div>

              <div class="row2">
                <div>
                  <label for="deadline">Ønsket deadline *</label>
                  <select id="deadline" name="deadline" required>
                    <option value="" selected disabled>Vælg…</option>
                    <option value="Hurtigst muligt (1-2 uger)">Hurtigst muligt (1–2 uger)</option>
                    <option value="Inden for 1 måned">Inden for 1 måned</option>
                    <option value="Inden for 2-3 måneder">Inden for 2–3 måneder</option>
                    <option value="Ingen hast">Ingen hast</option>
                  </select>
                  <div class="errText" data-error-for="deadline">Vælg venligst en deadline.</div>
                </div>
                <div>
                  <label for="budget">Budget-ramme (valgfrit)</label>
                  <select id="budget" name="budget">
                    <option value="" selected>Vælg…</option>
                    <option>5.000–10.000 kr.</option>
                    <option>10.000–20.000 kr.</option>
                    <option>20.000–40.000 kr.</option>
                    <option>40.000+ kr.</option>
                    <option>Ved ikke</option>
                  </select>
                  <div class="help">Det hjælper os med at foreslå det rigtige scope.</div>
                </div>
              </div>
            </section>

            <!-- STEP 8 -->
            <section class="fieldset" data-step="8" hidden>
              <div>
                <label for="besked">Ekstra info (valgfrit)</label>
                <textarea id="besked" name="besked" placeholder="Alt der kan hjælpe os: mål, konkurrenter, links til inspiration, krav osv."></textarea>
              </div>

              <div class="drop" id="dropzone">
                <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; flex-wrap:wrap;">
                  <div>
                    <b>Upload (valgfrit)</b>
                    <div class="help">
                      JPG/PNG • max 10MB pr. fil • flere filer tilladt.<br/>
                      Træk & slip her, eller klik for at vælge.
                    </div>
                  </div>
                  <div class="tiny">
                    Tip: Upload gerne logo, billeder eller inspiration.
                  </div>
                </div>
                <input id="filer" name="filer" type="file" accept="image/png,image/jpeg" multiple style="margin-top:10px;" />
                <div class="errText" id="fileError">Kun JPG/PNG, max 10MB pr. fil.</div>
                <div id="fileList"></div>
              </div>

              <div class="note">
                <b>Bekræftelse:</b> Når du sender, modtager du en kvittering pr. e-mail med opsummering og estimeret pris.
                <div class="help">Tryk <span class="kbd">Enter</span> i felter, eller brug knapperne nederst.</div>
              </div>

              <div>
                <label>
                  <input type="checkbox" id="samtykke" name="samtykke" required />
                  Jeg accepterer, at Færk Webbureau må kontakte mig om denne forespørgsel. *
                </label>
                <div class="errText" data-error-for="samtykke">Du skal acceptere for at sende.</div>
              </div>
            </section>

          </div>

          <div class="actions">
            <button type="button" class="btn ghost" id="backBtn">Tilbage</button>
            <button type="button" class="btn primary" id="nextBtn">Næste</button>
          </div>
        </form>
      </section>

      <!-- SIDE -->
      <aside class="side">
        <div class="priceCard" aria-live="polite">
          <div class="priceTop">
            <h2>Prisoversigt</h2>
            <div class="tiny">Opdateres live</div>
          </div>

          <div class="price" id="priceText">Estimeret pris: 4.999 kr.</div>
          <p class="sub">Priser starter fra 4.999 kr.</p>

          <ul class="summaryList" id="priceBreakdown">
            <!-- filled by JS -->
          </ul>

          <div class="note" style="margin-top:12px;">
            Microcopy: Estimatet er vejledende. Vi bekræfter scope og fast pris efter en kort afklaring.
          </div>
        </div>
      </aside>
    </div>
  </div>

  <script>
    // ====== KONFIG ======
    const TOTAL_STEPS = 8;
    const BASE_PRICE = 4999;

    // API endpoint (tilpas til din host):
    // - Netlify: "/.netlify/functions/submit"
    // - Vercel: "/api/submit"
    // - Egen server: "/submit"
    const SUBMIT_ENDPOINT = "/api/submit";

    const fmtDKK = (n) => {
      try {
        return new Intl.NumberFormat("da-DK", { maximumFractionDigits: 0 }).format(n) + " kr.";
      } catch {
        // fallback
        return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " kr.";
      }
    };

    // ====== STATE ======
    const form = document.getElementById("wizard");
    const steps = [...document.querySelectorAll("[data-step]")];
    const stepHeading = document.getElementById("stepHeading");
    const stepMeta = document.getElementById("stepMeta");
    const progressBar = document.getElementById("progressBar");
    const backBtn = document.getElementById("backBtn");
    const nextBtn = document.getElementById("nextBtn");
    const successBox = document.getElementById("successBox");

    const priceText = document.getElementById("priceText");
    const breakdown = document.getElementById("priceBreakdown");

    const dropzone = document.getElementById("dropzone");
    const fileInput = document.getElementById("filer");
    const fileList = document.getElementById("fileList");
    const fileError = document.getElementById("fileError");

    let currentStep = 1;

    // For uploads: vi holder filerne i memory (til FormData)
    let files = [];

    // Autosave key
    const STORAGE_KEY = "faerk_webbureau_wizard_v1";

    // ====== HELPERS ======
    function setStep(n){
      currentStep = n;

      steps.forEach(s => {
        const show = Number(s.dataset.step) === n;
        s.hidden = !show;
      });

      const titles = [
        "Trin 1 – Kontaktinfo",
        "Trin 2 – Om virksomheden",
        "Trin 3 – Nuværende hjemmeside",
        "Trin 4 – Omfang & funktioner",
        "Trin 5 – Design & indhold",
        "Trin 6 – Teknik & drift",
        "Trin 7 – Tilkøb & deadline",
        "Trin 8 – Upload & bekræftelse"
      ];
      stepHeading.textContent = titles[n-1] || `Trin ${n}`;
      stepMeta.textContent = `Trin ${n} af ${TOTAL_STEPS}`;

      const pct = Math.round(((n-1)/(TOTAL_STEPS-1)) * 100);
      progressBar.style.width = pct + "%";

      backBtn.disabled = (n === 1);

      if (n === TOTAL_STEPS){
        nextBtn.textContent = "Send forespørgsel";
        nextBtn.type = "submit";
      } else {
        nextBtn.textContent = "Næste";
        nextBtn.type = "button";
      }

      // Scroll card into view on mobile for better UX
      if (window.matchMedia("(max-width: 980px)").matches){
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    function showErrorFor(name, show){
      const el = form.elements[name];
      const err = document.querySelector(`[data-error-for="${name}"]`);
      if (!el || !err) return;

      if (show){
        el.classList.add("error");
        err.classList.add("show");
      } else {
        el.classList.remove("error");
        err.classList.remove("show");
      }
    }

    function isValidEmail(v){
      // enkel, robust nok til UI-validering
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
    }

    function getCheckedValues(name){
      return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(i => i.value);
    }

    function clampNonNegInt(v){
      const n = Number(v);
      if (!Number.isFinite(n)) return 0;
      return Math.max(0, Math.floor(n));
    }

    // ====== PRISLOGIK ======
    function calcPrice(){
      let total = BASE_PRICE;
      const items = [];

      items.push({ label: "Basis (inkl.)", value: BASE_PRICE });

      // Numeric add-ons
      const ekstraSider = clampNonNegInt(form.elements.ekstraSider?.value ?? 0);
      if (ekstraSider > 0){
        const p = ekstraSider * 500;
        total += p;
        items.push({ label: `Ekstra sider (${ekstraSider} × 500)`, value: p });
      }

      const billedred = clampNonNegInt(form.elements.billedredigering?.value ?? 0);
      if (billedred > 0){
        const p = billedred * 250;
        total += p;
        items.push({ label: `Billedredigering (${billedred} × 250)`, value: p });
      }

      const videored = clampNonNegInt(form.elements.videoredigering?.value ?? 0);
      if (videored > 0){
        const p = videored * 500;
        total += p;
        items.push({ label: `Videoredigering (${videored} × 500)`, value: p });
      }

      // Checkbox add-ons
      const addonChecks = [...form.querySelectorAll(`input[name="addons"]:checked`)];
      addonChecks.forEach(ch => {
        const price = Number(ch.dataset.price || 0);
        total += price;
        items.push({ label: ch.value, value: price });
      });

      return { total, items };
    }

    function renderPrice(){
      const { total, items } = calcPrice();
      priceText.textContent = `Estimeret pris: ${fmtDKK(total)}`;

      breakdown.innerHTML = "";
      // Vis kun top-linjer, men stadig tydelig:
      items.forEach(it => {
        const li = document.createElement("li");
        const left = document.createElement("div");
        left.textContent = it.label;
        const right = document.createElement("span");
        right.textContent = fmtDKK(it.value);
        li.appendChild(left);
        li.appendChild(right);
        breakdown.appendChild(li);
      });
    }

    // ====== VALIDERING PER TRIN ======
    function validateStep(stepNumber){
      let ok = true;
      const stepEl = steps.find(s => Number(s.dataset.step) === stepNumber);
      if (!stepEl) return true;

      // Clear step errors first
      const fields = stepEl.querySelectorAll("input, select, textarea");
      fields.forEach(f => {
        // ignore file input here
        if (f.type === "file") return;
        f.classList.remove("error");
        const err = document.querySelector(`[data-error-for="${f.name || f.id}"]`);
        if (err) err.classList.remove("show");
      });

      // Required + custom checks
      fields.forEach(f => {
        if (f.disabled || f.hidden) return;

        const fieldName = f.name || f.id;

        // Custom: email validation
        if (f.type === "email" && f.required){
          if (!isValidEmail(f.value)){
            showErrorFor(fieldName, true);
            ok = false;
            return;
          }
        }

        // Custom: min 1 checkbox in "funktioner" (step 4)
        if (f.name === "funktioner" && f.dataset.mincheck){
          const min = Number(f.dataset.mincheck);
          const checked = stepEl.querySelectorAll('input[name="funktioner"]:checked').length;
          if (checked < min){
            const err = document.querySelector(`[data-error-for="funktioner"]`);
            if (err) err.classList.add("show");
            ok = false;
          }
          return;
        }

        // Required checkbox
        if (f.type === "checkbox" && f.required){
          if (!f.checked){
            showErrorFor(fieldName, true);
            ok = false;
          }
          return;
        }

        // Required radio group
        if (f.type === "radio" && f.required){
          const any = stepEl.querySelectorAll(`input[name="${f.name}"]:checked`).length > 0;
          if (!any){
            const err = document.querySelector(`[data-error-for="${f.name}"]`);
            if (err) err.classList.add("show");
            ok = false;
          }
          return;
        }

        // Required standard
        if (f.required){
          const v = (f.value ?? "").toString().trim();
          if (!v){
            showErrorFor(fieldName, true);
            ok = false;
          }
        }
      });

      // File validation on step 8 if files exist (optional) — but always validate their constraints
      if (stepNumber === 8){
        if (!validateFiles(files)) ok = false;
      }

      return ok;
    }

    // ====== UPLOAD VALIDERING ======
    function validateFiles(fileArr){
      fileError.classList.remove("show");
      const ok = (fileArr || []).every(file => {
        const typeOk = (file.type === "image/jpeg" || file.type === "image/png");
        const sizeOk = file.size <= 10 * 1024 * 1024; // 10MB
        return typeOk && sizeOk;
      });
      if (!ok) fileError.classList.add("show");
      return ok;
    }

    function renderFiles(){
      fileList.innerHTML = "";
      files.forEach((f, idx) => {
        const row = document.createElement("div");
        row.className = "fileRow";
        row.innerHTML = `
          <div>
            <div><b>${escapeHtml(f.name)}</b></div>
            <span>${Math.round(f.size/1024)} KB</span>
          </div>
          <button type="button" class="xbtn" aria-label="Fjern fil">Fjern</button>
        `;
        row.querySelector("button").addEventListener("click", () => {
          files.splice(idx, 1);
          renderFiles();
          validateFiles(files);
          autoSave();
        });
        fileList.appendChild(row);
      });
    }

    function escapeHtml(s){
      return String(s).replace(/[&<>"']/g, (m) => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
      }[m]));
    }

    // Drag & drop UX
    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });
    dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
      const dropped = [...(e.dataTransfer.files || [])];
      addFiles(dropped);
    });

    function addFiles(newFiles){
      if (!newFiles.length) return;
      // add to array (keep multiple)
      files = files.concat(newFiles);
      // validate
      validateFiles(files);
      // render
      renderFiles();
      autoSave();
    }

    fileInput.addEventListener("change", () => {
      addFiles([...(fileInput.files || [])]);
      // reset input so same file can be reselected later
      fileInput.value = "";
    });

    // ====== AUTOSAVE ======
    function autoSave(){
      const data = serializeFormForStorage();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function serializeFormForStorage(){
      const fd = new FormData(form);
      const obj = {};
      // collect standard fields
      for (const [k, v] of fd.entries()){
        // multiple values (checkboxes)
        if (obj[k] !== undefined){
          if (!Array.isArray(obj[k])) obj[k] = [obj[k]];
          obj[k].push(v);
        } else {
          obj[k] = v;
        }
      }
      // add files metadata only (not contents)
      obj.__files = files.map(f => ({ name: f.name, size: f.size, type: f.type }));
      obj.__step = currentStep;
      return obj;
    }

    function restoreFromStorage(){
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      try{
        const data = JSON.parse(raw);
        // restore inputs
        for (const [k, v] of Object.entries(data)){
          if (k.startsWith("__")) continue;
          const el = form.elements[k];
          if (!el) continue;

          if (Array.isArray(v)){
            // checkboxes/radios multi
            const nodes = form.querySelectorAll(`[name="${k}"]`);
            nodes.forEach(n => {
              if (n.type === "checkbox" || n.type === "radio"){
                n.checked = v.includes(n.value);
              }
            });
          } else {
            // single
            if (el.type === "checkbox"){
              el.checked = (v === "on" || v === true);
            } else if (el.type === "radio"){
              const node = form.querySelector(`[name="${k}"][value="${CSS.escape(v)}"]`);
              if (node) node.checked = true;
            } else {
              el.value = v;
            }
          }
        }

        // restore step
        if (data.__step && Number(data.__step) >= 1 && Number(data.__step) <= TOTAL_STEPS){
          currentStep = Number(data.__step);
        }
      } catch {}
    }

    // Save on input changes
    form.addEventListener("input", () => { renderPrice(); autoSave(); });
    form.addEventListener("change", () => { renderPrice(); autoSave(); });

    // ====== NAVIGATION ======
    backBtn.addEventListener("click", () => {
      if (currentStep > 1) setStep(currentStep - 1);
      autoSave();
    });

    nextBtn.addEventListener("click", async () => {
      // If last step, submit
      if (currentStep === TOTAL_STEPS){
        // let submit handler do it
        form.requestSubmit?.();
        return;
      }

      const ok = validateStep(currentStep);
      if (!ok) return;

      setStep(currentStep + 1);
      autoSave();
    });

    // Enter key: go next (nice wizard feel)
    form.addEventListener("keydown", (e) => {
      if (e.key === "Enter"){
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
        if (tag === "textarea") return;
        e.preventDefault();
        if (currentStep < TOTAL_STEPS) nextBtn.click();
        else form.requestSubmit?.();
      }
    });

    // ====== SUBMIT ======
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validate last step + also validate previous required in case user jumped via restore
      for (let s = 1; s <= TOTAL_STEPS; s++){
        const ok = validateStep(s);
        if (!ok){
          setStep(s);
          return;
        }
      }

      // prevent double submit
      nextBtn.disabled = true;
      backBtn.disabled = true;
      nextBtn.textContent = "Sender…";

      const { total, items } = calcPrice();

      // Build payload
      const payload = new FormData();
      // add all fields
      new FormData(form).forEach((v,k) => payload.append(k, v));

      // add computed stuff
      payload.append("estimeretPris", String(total));
      payload.append("prisBreakdown", JSON.stringify(items));
      payload.append("funktioner_valgt", JSON.stringify(getCheckedValues("funktioner")));
      payload.append("addons_valgt", JSON.stringify(getCheckedValues("addons")));

      // add files
      files.forEach(f => payload.append("files", f, f.name));

      try{
        const res = await fetch(SUBMIT_ENDPOINT, { method:"POST", body: payload });
        const json = await res.json().catch(() => ({}));

        if (!res.ok){
          throw new Error(json?.error || "Der skete en fejl ved afsendelse. Prøv igen.");
        }

        // Success UI
        successBox.classList.add("show");
        // hide form sections after success (simple conversion-friendly confirmation)
        steps.forEach(s => s.hidden = true);
        document.querySelector(".actions").style.display = "none";
        document.querySelector(".topbar").style.display = "none";

        // clear storage when submitted
        localStorage.removeItem(STORAGE_KEY);

      } catch(err){
        alert(err.message || "Noget gik galt. Prøv igen.");
        nextBtn.disabled = false;
        backBtn.disabled = false;
        nextBtn.textContent = "Send forespørgsel";
      }
    });

    // ====== INIT ======
    restoreFromStorage();
    renderPrice();
    setStep(currentStep);
  </script>
</body>
</html>
