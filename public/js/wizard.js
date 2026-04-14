/* =========================================================
   Færk Webbureau – Multi-step Form Wizard
   ========================================================= */

'use strict';

class WizardForm {
  constructor() {
    this.currentStep = 1;
    this.totalSteps  = 8;
    this.BASE_PRICE  = 4999;
    this.TTL_MS      = 24 * 60 * 60 * 1000; // 24 hours
    this.totalPrice  = this.BASE_PRICE;
    this.addons      = [];
    this.files       = [];
    this.completedSteps = new Set();

    this.stepNames = [
      '',
      'Kontaktinfo',
      'Om virksomheden',
      'Nuværende hjemmeside',
      'Omfang & funktioner',
      'Design & indhold',
      'Teknik & drift',
      'Tilkøb & deadline',
      'Upload & bekræftelse',
    ];

    this.init();
  }

  /* ── Bootstrap ─────────────────────────────────────────── */

  init() {
    this.bindNavigation();
    this.bindConditionalFields();
    this.bindAddonPricing();
    this.bindFileUpload();
    this.bindAutoSave();
    this.loadSavedData();
    this.refreshUI();
  }

  /* ── Navigation ─────────────────────────────────────────── */

  bindNavigation() {
    document.getElementById('btn-next').addEventListener('click', () => this.nextStep());
    document.getElementById('btn-prev').addEventListener('click', () => this.prevStep());
    document.getElementById('btn-submit').addEventListener('click', () => this.submit());

    document.querySelectorAll('.step-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const target = parseInt(dot.dataset.step, 10);
        if (this.completedSteps.has(target) || target < this.currentStep) {
          this.goToStep(target);
        }
      });
    });
  }

  nextStep() {
    if (!this.validateStep(this.currentStep)) return;
    this.completedSteps.add(this.currentStep);
    this.goToStep(this.currentStep + 1);
  }

  prevStep() {
    if (this.currentStep > 1) this.goToStep(this.currentStep - 1);
  }

  goToStep(step) {
    this.pane(this.currentStep).classList.add('hidden');
    this.currentStep = step;
    this.pane(step).classList.remove('hidden');

    if (step === this.totalSteps) this.buildSummary();

    this.refreshUI();
    this.saveToStorage();

    // Scroll wizard card into view
    document.getElementById('wizard-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  pane(step) {
    return document.querySelector(`.step-pane[data-step="${step}"]`);
  }

  /* ── UI refresh ─────────────────────────────────────────── */

  refreshUI() {
    const s = this.currentStep;
    const t = this.totalSteps;

    document.getElementById('current-step-num').textContent = s;
    document.getElementById('step-name').textContent = this.stepNames[s];
    document.getElementById('step-pct').textContent = `${Math.round((s / t) * 100)}%`;
    document.getElementById('progress-fill').style.width = `${(s / t) * 100}%`;

    document.querySelectorAll('.step-dot').forEach(dot => {
      const n = parseInt(dot.dataset.step, 10);
      dot.classList.remove('active', 'completed');
      if (n === s) dot.classList.add('active');
      else if (this.completedSteps.has(n)) dot.classList.add('completed');
    });

    const btnPrev   = document.getElementById('btn-prev');
    const btnNext   = document.getElementById('btn-next');
    const btnSubmit = document.getElementById('btn-submit');

    btnPrev.classList.toggle('hidden', s === 1);
    btnNext.classList.toggle('hidden', s === t);
    btnSubmit.classList.toggle('hidden', s !== t);
  }

  /* ── Conditional fields ─────────────────────────────────── */

  bindConditionalFields() {
    // Step 3 – existing site
    document.querySelectorAll('input[name="harHjemmeside"]').forEach(r => {
      r.addEventListener('change', () => {
        const show = r.value === 'ja' && r.checked;
        document.getElementById('existing-site-fields')
          .classList.toggle('hidden', !show);
      });
    });

    // Step 6 – domain name
    document.querySelectorAll('input[name="domain"]').forEach(r => {
      r.addEventListener('change', () => {
        const show = r.value === 'Jeg har allerede et domæne' && r.checked;
        document.getElementById('domain-name-group')
          .classList.toggle('hidden', !show);
      });
    });
  }

  /* ── Price calculation ──────────────────────────────────── */

  bindAddonPricing() {
    // Numeric quantity inputs
    document.querySelectorAll('.addon-qty').forEach(input => {
      input.addEventListener('input', () => this.recalculate());
    });

    // Quantity +/- buttons
    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (!target) return;
        const delta = btn.dataset.action === 'plus' ? 1 : -1;
        target.value = Math.max(0, parseInt(target.value || 0, 10) + delta);
        this.recalculate();
      });
    });

    // Checkbox add-ons
    document.querySelectorAll('input[type="checkbox"][data-price]').forEach(cb => {
      cb.addEventListener('change', () => this.recalculate());
    });
  }

  recalculate() {
    let total = this.BASE_PRICE;
    const addons = [];

    // Numeric add-ons
    const numericDefs = [
      { id: 'ekstraSider',    ppu: 500, label: 'Ekstra sider' },
      { id: 'billedredigering', ppu: 250, label: 'Billedredigering' },
      { id: 'videoredigering',  ppu: 500, label: 'Videoredigering' },
    ];

    numericDefs.forEach(({ id, ppu, label }) => {
      const qty = parseInt(document.getElementById(id)?.value || 0, 10);
      if (qty > 0) {
        const price = qty * ppu;
        total += price;
        addons.push({ label: `${label} (×${qty})`, price });
      }
    });

    // Checkbox add-ons
    document.querySelectorAll('input[type="checkbox"][data-price]:checked').forEach(cb => {
      const price = parseInt(cb.dataset.price, 10);
      total += price;
      addons.push({ label: cb.dataset.label, price });
    });

    this.totalPrice = total;
    this.addons = addons;
    this.updatePriceDisplay();
  }

  updatePriceDisplay() {
    const formatted = this.fmt(this.totalPrice);
    const bare = formatted.replace(' kr.', '');

    document.getElementById('price-amount').textContent = bare;
    document.getElementById('mobile-price-amount').textContent = bare;

    // Breakdown
    let html = `<div class="bd-row bd-base"><span>Basispris</span><span>4.999 kr.</span></div>`;

    this.addons.forEach(a => {
      html += `<div class="bd-row"><span>${this.esc(a.label)}</span><span>+${this.fmt(a.price)}</span></div>`;
    });

    if (this.addons.length > 0) {
      html += `<div class="bd-row bd-total"><span>I alt (estimat)</span><span>${formatted}</span></div>`;
    }

    document.getElementById('price-breakdown').innerHTML = html;
  }

  fmt(price) {
    return price.toLocaleString('da-DK') + ' kr.';
  }

  /* ── File upload ─────────────────────────────────────────── */

  bindFileUpload() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('filer');
    const trigger   = document.getElementById('upload-trigger');

    trigger.addEventListener('click', e => { e.stopPropagation(); fileInput.click(); });
    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });

    fileInput.addEventListener('change', e => this.handleFiles(e.target.files));

    dropzone.addEventListener('dragover', e => { e.preventDefault(); dropzone.classList.add('drag-over'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
    dropzone.addEventListener('drop', e => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
      this.handleFiles(e.dataTransfer.files);
    });
  }

  handleFiles(list) {
    const allowed  = ['image/jpeg', 'image/png'];
    const maxBytes = 10 * 1024 * 1024;

    Array.from(list).forEach(file => {
      if (!allowed.includes(file.type)) {
        this.showToast(`"${file.name}" er ikke en JPG eller PNG fil.`);
        return;
      }
      if (file.size > maxBytes) {
        this.showToast(`"${file.name}" overstiger grænsen på 10 MB.`);
        return;
      }
      // Avoid duplicates by name + size
      const dup = this.files.some(f => f.name === file.name && f.size === file.size);
      if (!dup) this.files.push(file);
    });

    this.renderFileList();
  }

  renderFileList() {
    const list = document.getElementById('file-list');
    if (!this.files.length) { list.innerHTML = ''; return; }

    list.innerHTML = this.files.map((f, i) => `
      <div class="file-item">
        <span aria-hidden="true">🖼️</span>
        <span class="file-name">${this.esc(f.name)}</span>
        <span class="file-size">${(f.size / 1024).toFixed(0)} KB</span>
        <button type="button" class="file-remove" data-idx="${i}" aria-label="Fjern ${this.esc(f.name)}">×</button>
      </div>
    `).join('');

    list.querySelectorAll('.file-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        this.files.splice(parseInt(btn.dataset.idx, 10), 1);
        this.renderFileList();
      });
    });
  }

  /* ── Validation ─────────────────────────────────────────── */

  validateStep(step) {
    const validators = {
      1: () => this.v1(),
      2: () => this.v2(),
      3: () => this.v3(),
      4: () => this.v4(),
      5: () => this.v5(),
      6: () => this.v6(),
      7: () => true,
      8: () => this.v8(),
    };
    return (validators[step] ?? (() => true))();
  }

  // ── Step 1 ──
  v1() {
    let ok = true;
    ok = this.req('navn',    'navn',    'Indtast venligst dit navn')                              && ok;
    ok = this.reqEmail('email',   'email',   'Indtast venligst en gyldig email-adresse')             && ok;
    ok = this.req('telefon', 'telefon', 'Indtast venligst dit telefonnummer')                    && ok;
    return ok;
  }

  // ── Step 2 ──
  v2() {
    let ok = true;
    ok = this.reqSelect('branche',    'branche',    'Vælg venligst din branche')                && ok;
    ok = this.reqSelect('storrelse',  'storrelse',  'Vælg venligst virksomhedens størrelse')    && ok;
    ok = this.req('maalgruppe',       'maalgruppe', 'Beskriv venligst din målgruppe')           && ok;
    ok = this.req('maal',             'maal',       'Beskriv venligst dit mål med hjemmesiden') && ok;
    return ok;
  }

  // ── Step 3 ──
  v3() {
    return this.reqRadio('harHjemmeside', 'harHjemmeside', 'Vælg venligst en mulighed');
  }

  // ── Step 4 ──
  v4() {
    let ok = true;
    ok = this.reqSelect('hjemmesideType', 'hjemmesideType', 'Vælg venligst en hjemmesidetype') && ok;
    ok = this.reqNum('antalSider',        'antalSider',     'Angiv venligst et antal sider')    && ok;
    return ok;
  }

  // ── Step 5 ──
  v5() {
    let ok = true;
    ok = this.reqRadio('designstil',  'designstil',  'Vælg venligst en designstil')  && ok;
    ok = this.reqRadio('harLogo',     'harLogo',     'Vælg venligst en mulighed')    && ok;
    ok = this.reqRadio('indholdKlar', 'indholdKlar', 'Vælg venligst en mulighed')    && ok;
    return ok;
  }

  // ── Step 6 ──
  v6() {
    let ok = true;
    ok = this.reqRadio('domain',         'domain',         'Vælg venligst en mulighed') && ok;
    ok = this.reqRadio('hosting',        'hosting',        'Vælg venligst en mulighed') && ok;
    ok = this.reqRadio('cms',            'cms',            'Vælg venligst en mulighed') && ok;
    ok = this.reqRadio('vedligeholdelse','vedligeholdelse','Vælg venligst en mulighed') && ok;
    return ok;
  }

  // ── Step 8 ──
  v8() {
    const cb = document.getElementById('accepterBetingelser');
    if (!cb.checked) {
      this.setErr('accepterBetingelser', 'Du skal acceptere betingelserne for at fortsætte');
      return false;
    }
    this.clearErr('accepterBetingelser');
    return true;
  }

  // ── Validators ──
  req(id, errKey, msg) {
    const el = document.getElementById(id);
    const val = el?.value.trim();
    if (!val) { this.setErr(errKey, msg); el?.classList.add('invalid'); return false; }
    this.clearErr(errKey); el?.classList.remove('invalid');
    return true;
  }

  reqEmail(id, errKey, msg) {
    const el  = document.getElementById(id);
    const val = el?.value.trim();
    const ok  = val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!ok) { this.setErr(errKey, msg); el?.classList.add('invalid'); return false; }
    this.clearErr(errKey); el?.classList.remove('invalid');
    return true;
  }

  reqSelect(id, errKey, msg) {
    const el = document.getElementById(id);
    if (!el?.value) { this.setErr(errKey, msg); el?.classList.add('invalid'); return false; }
    this.clearErr(errKey); el?.classList.remove('invalid');
    return true;
  }

  reqNum(id, errKey, msg) {
    const el  = document.getElementById(id);
    const val = parseInt(el?.value, 10);
    if (!val || val < 1) { this.setErr(errKey, msg); el?.classList.add('invalid'); return false; }
    this.clearErr(errKey); el?.classList.remove('invalid');
    return true;
  }

  reqRadio(name, errKey, msg) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    if (!checked) { this.setErr(errKey, msg); return false; }
    this.clearErr(errKey);
    return true;
  }

  setErr(key, msg) {
    const el = document.getElementById(`err-${key}`);
    if (el) el.textContent = msg;
  }

  clearErr(key) {
    const el = document.getElementById(`err-${key}`);
    if (el) el.textContent = '';
  }

  /* ── Summary ─────────────────────────────────────────────── */

  buildSummary() {
    const g  = id => document.getElementById(id)?.value || '–';
    const r  = name => document.querySelector(`input[name="${name}"]:checked`)?.value || '–';
    const cbs = name => {
      const els = document.querySelectorAll(`input[name="${name}"]:checked`);
      return els.length ? Array.from(els).map(e => e.value).join(', ') : 'Ingen valgt';
    };

    const rows = [
      ['Navn',              g('navn')],
      ['Email',             g('email')],
      ['Telefon',           g('telefon')],
      ['Virksomhed',        g('virksomhed') || '–'],
      ['Branche',           g('branche')],
      ['Hjemmesidetype',    g('hjemmesideType')],
      ['Antal sider',       g('antalSider')],
      ['Designstil',        r('designstil')],
      ['Indhold klar',      r('indholdKlar')],
      ['CMS',               r('cms')],
      ['Funktioner',        cbs('funktioner')],
      ['Estimeret pris',    this.fmt(this.totalPrice)],
    ];

    document.getElementById('summary-content').innerHTML = rows.map(([k, v]) => `
      <div class="sum-row">
        <strong>${this.esc(k)}:</strong>
        <span class="${k === 'Estimeret pris' ? 'sum-price' : ''}">${this.esc(v)}</span>
      </div>`).join('');
  }

  /* ── Auto-save ───────────────────────────────────────────── */

  bindAutoSave() {
    document.querySelectorAll('input:not([type="file"]), textarea, select').forEach(el => {
      el.addEventListener('change', () => this.saveToStorage());
      el.addEventListener('input',  () => this.saveToStorage());
    });
  }

  saveToStorage() {
    try {
      const data = {};
      document.querySelectorAll('input:not([type="file"]), textarea, select').forEach(el => {
        const key = el.name || el.id;
        if (!key) return;
        if (el.type === 'checkbox') {
          if (!data[key]) data[key] = [];
          if (el.checked) data[key].push(el.value);
        } else if (el.type === 'radio') {
          if (el.checked) data[key] = el.value;
        } else {
          data[key] = el.value;
        }
      });

      localStorage.setItem('faerk-wizard-v1', JSON.stringify({
        step: this.currentStep,
        completed: [...this.completedSteps],
        data,
        ts: Date.now(),
      }));
    } catch (_) { /* storage unavailable */ }
  }

  loadSavedData() {
    try {
      const raw = localStorage.getItem('faerk-wizard-v1');
      if (!raw) return;
      const { step, completed, data, ts } = JSON.parse(raw);

      // Discard if older than 24 h
      if (Date.now() - ts > this.TTL_MS) {
        localStorage.removeItem('faerk-wizard-v1');
        return;
      }

      // Restore form values
      Object.entries(data).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          // Checkboxes
          val.forEach(v => {
            const el = document.querySelector(`input[name="${key}"][value="${CSS.escape(v)}"]`);
            if (el) el.checked = true;
          });
        } else {
          const el = document.getElementById(key) ||
                     document.querySelector(`[name="${key}"]`);
          if (!el) return;
          if (el.type === 'radio') {
            const radio = document.querySelector(`input[name="${key}"][value="${CSS.escape(val)}"]`);
            if (radio) radio.checked = true;
          } else {
            el.value = val;
          }
        }
      });

      // Restore conditional fields visibility
      const harHjemmeside = document.querySelector('input[name="harHjemmeside"]:checked');
      if (harHjemmeside?.value === 'ja') {
        document.getElementById('existing-site-fields').classList.remove('hidden');
      }
      const domain = document.querySelector('input[name="domain"]:checked');
      if (domain?.value === 'Jeg har allerede et domæne') {
        document.getElementById('domain-name-group').classList.remove('hidden');
      }

      // Restore navigation state
      this.completedSteps = new Set(completed || []);
      if (step && step > 1) {
        this.pane(this.currentStep).classList.add('hidden');
        this.currentStep = step;
        this.pane(step).classList.remove('hidden');
      }

      this.recalculate();
    } catch (_) {
      localStorage.removeItem('faerk-wizard-v1');
    }
  }

  /* ── Form submission ─────────────────────────────────────── */

  async submit() {
    if (!this.validateStep(this.totalSteps)) return;

    const btnSubmit = document.getElementById('btn-submit');
    const label     = btnSubmit.querySelector('.btn-label');
    const spinner   = btnSubmit.querySelector('.btn-spinner');

    btnSubmit.disabled = true;
    label.textContent  = 'Sender…';
    spinner.classList.remove('hidden');

    try {
      const fd = new FormData();
      const formData = this.collectFormData();

      fd.append('formData', JSON.stringify({
        formData,
        totalPrice: this.totalPrice,
        addons:     this.addons,
      }));

      this.files.forEach(f => fd.append('filer', f));

      const res  = await fetch('/api/submit', { method: 'POST', body: fd });
      const json = await res.json();

      if (json.success) {
        localStorage.removeItem('faerk-wizard-v1');
        document.getElementById('success-overlay').classList.remove('hidden');
        document.getElementById('success-overlay').focus();
      } else {
        throw new Error(json.error || 'Ukendt fejl');
      }
    } catch (err) {
      this.showToast(err.message || 'Der opstod en fejl. Prøv venligst igen.');
    } finally {
      btnSubmit.disabled = false;
      label.textContent  = '✉️ Send forespørgsel';
      spinner.classList.add('hidden');
    }
  }

  collectFormData() {
    const data = {};

    document.querySelectorAll('input:not([type="file"]):not([type="checkbox"]):not([type="radio"]), textarea, select').forEach(el => {
      const key = el.name || el.id;
      if (key) data[key] = el.value;
    });

    document.querySelectorAll('input[type="radio"]:checked').forEach(el => {
      data[el.name] = el.value;
    });

    const funktioner = Array.from(
      document.querySelectorAll('input[name="funktioner"]:checked')
    ).map(el => el.value);
    if (funktioner.length) data.funktioner = funktioner;

    document.querySelectorAll('input[type="checkbox"][data-price]').forEach(el => {
      data[el.name] = el.checked;
    });

    return data;
  }

  /* ── Helpers ─────────────────────────────────────────────── */

  showToast(msg) {
    const toast = document.getElementById('toast-error');
    document.getElementById('toast-msg').textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => toast.classList.add('hidden'), 6000);
  }

  esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

/* ── Bootstrap ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => new WizardForm());
