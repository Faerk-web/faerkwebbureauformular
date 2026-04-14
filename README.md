# Færk Webbureau – Hjemmeside-formular

En moderne, responsiv og konverteringsoptimeret trinvis formular til [Færk Webbureau](https://faerkwebbureau.dk).

## Funktioner

- ✅ **8-trins guide** med fremdriftsindikator
- 💰 **Live prisberegning** (starter fra 4.999 kr.)
- 📧 **Email til kontakt@faerkwebbureau.dk** med alle detaljer
- 📬 **Bekræftelsesemail** til kunden
- 🎉 **Success-besked** på skærmen efter indsendelse
- 📁 **Filupload** (JPG/PNG, maks. 10 MB, drag & drop)
- 💾 **Auto-gem** af fremskridt i localStorage
- 📱 **Mobilvenlig** – mobile-first design

## Hurtigstart

### 1. Installer afhængigheder

```bash
npm install
```

### 2. Konfigurer email

Kopiér `.env.example` til `.env` og udfyld med dine SMTP-oplysninger:

```bash
cp .env.example .env
```

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=din@email.dk
SMTP_PASS=dit-app-password
PORT=3000
```

> **Gmail-tip:** Brug et [App Password](https://myaccount.google.com/apppasswords) i stedet for dit almindelige password.

### 3. Start serveren

```bash
npm start
```

Åbn derefter [http://localhost:3000](http://localhost:3000) i din browser.

### Udviklingstilstand (med auto-reload)

```bash
npm run dev
```

## Tilkøb & prisstruktur

| Tilkøb | Pris |
|---|---|
| Basispris | 4.999 kr. |
| Ekstra sider | +500 kr./side |
| Blogopsætning | +1.000 kr. |
| 3 blogindlæg | +1.200 kr. |
| SEO basis | +1.000 kr. |
| Kundeudtalelser | +500 kr. |
| Billedredigering | +250 kr./billede |
| Videoredigering | +500 kr./video |
| Social media feed | +1.200 kr. |
| Booking system | +2.800 kr. |
| Nyhedsbrev | +800 kr. |
| Google Maps | +500 kr. |
| Fil-download | +400 kr. |
| FAQ sektion | +500 kr. |

## Filstruktur

```
├── server.js           # Express-server med email-håndtering
├── package.json
├── .env.example        # Email-konfiguration (template)
└── public/
    ├── index.html      # Formular-side
    ├── css/
    │   └── style.css   # Design
    └── js/
        └── wizard.js   # Formular-logik
```
