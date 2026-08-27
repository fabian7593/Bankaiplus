/**
 * ============================================================
 * BANKAI + — PRICING JS
 * ============================================================
 * El DÓLAR es la moneda base: los precios se definen en USD en
 * config.js y los colones se derivan con CONFIG.pricing.exchangeRate.
 *
 * El sitio abre en USD (LATAM). El visitante cambia a colones
 * manualmente con el toggle de región.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

  // ── Constantes ──────────────────────────────────────────
  var PLANS = ['basic', 'standard', 'family'];
  var PX    = CONFIG.pricing;
  var USD   = PX.usd;              // fuente de verdad: { basic: 6, standard: 10, family: 13.33 }

  var RATE_CACHE_KEY = 'bankaiplus_tdc';
  var RATE_TIMEOUT_MS = 6000;

  // ── Estado ──────────────────────────────────────────────
  var currentMode   = 'monthly';   // 'monthly' | 'semiannual' | 'annual'

  // Región inicial derivada de config: 'usd' → 'latam', 'crc' → 'cr'
  var currentRegion = PX.defaultCurrency === 'crc' ? 'cr' : 'latam';

  var RATE        = PX.exchangeRateFallback;  // colones por 1 USD
  var rateSource  = 'fallback';               // 'bcr' | 'cache' | 'fallback'
  var CRC         = {};                       // colones derivados del USD

  // ══════════════════════════════════════════════════════════
  // TIPO DE CAMBIO — se consulta al BCR y se convierte solo
  // ══════════════════════════════════════════════════════════

  // Un tipo de cambio fuera de este rango es basura (API caída,
  // HTML de error, null, etc.) → mejor caer al fallback.
  function isValidRate(r) {
    return typeof r === 'number' && isFinite(r) && r >= 300 && r <= 1000;
  }

  // Recalcula la tabla de colones. Redondeo a ₡50 para que los precios
  // queden presentables aunque el tipo de cambio traiga decimales.
  function applyRate(rate, source) {
    RATE = rate;
    rateSource = source;
    PLANS.forEach(function (plan) {
      CRC[plan] = Math.round((USD[plan] * RATE) / 50) * 50;
    });
  }

  function readCachedRate() {
    try {
      var raw = localStorage.getItem(RATE_CACHE_KEY);
      if (!raw) return null;
      var c = JSON.parse(raw);
      var maxAge = (PX.exchangeRateCacheHours || 6) * 3600 * 1000;
      if (!isValidRate(c.rate)) return null;
      if (!c.ts || (Date.now() - c.ts) > maxAge) return null;
      return c.rate;
    } catch (e) {
      return null;   // localStorage bloqueado o JSON corrupto
    }
  }

  function writeCachedRate(rate) {
    try {
      localStorage.setItem(RATE_CACHE_KEY, JSON.stringify({ rate: rate, ts: Date.now() }));
    } catch (e) { /* modo privado o storage lleno: no es crítico */ }
  }

  function fetchRate() {
    if (!window.fetch || !PX.exchangeRateApi) return;

    // Timeout manual: si la API se cuelga, no dejamos los precios colgados
    var done = false;
    var timer = setTimeout(function () {
      if (!done) {
        done = true;
        console.warn('[Bankai +] El tipo de cambio tardó demasiado. Usando ₡' + PX.exchangeRateFallback + '.');
      }
    }, RATE_TIMEOUT_MS);

    fetch(PX.exchangeRateApi, { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (done) return;   // ya expiró el timeout
        var rate = data ? data[PX.exchangeRateField || 'venta'] : null;
        if (typeof rate === 'string') rate = parseFloat(rate);
        if (!isValidRate(rate)) throw new Error('tipo de cambio inválido: ' + rate);

        done = true;
        clearTimeout(timer);
        writeCachedRate(rate);
        applyRate(rate, 'bcr');
        renderPrices();
      })
      .catch(function (err) {
        done = true;
        clearTimeout(timer);
        console.warn('[Bankai +] No se pudo obtener el tipo de cambio del BCR. Usando ₡'
          + PX.exchangeRateFallback + '.', err);
      });
  }

  // ── Formato de números ──────────────────────────────────
  function formatThousands(n) {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function fmt(amount, isCRC) {
    if (isCRC) {
      return '₡' + formatThousands(amount);
    }
    // $6 en vez de $6.00, pero $7.50 conserva los centavos
    var rounded = Math.round(amount * 100) / 100;
    return '$' + (rounded % 1 === 0 ? String(rounded) : rounded.toFixed(2));
  }

  // ── Cálculo de precios por modo ─────────────────────────
  function getPriceData(plan, mode, isCRC) {
    var base = isCRC ? CRC[plan] : USD[plan];

    if (mode === 'monthly') {
      return {
        display: fmt(base, isCRC),
        period:  '/mes',
        altHTML: '',
        total:   '',
      };
    }

    if (mode === 'semiannual') {
      // Pague 5 meses, lleve 6
      var total6    = base * 5;
      var perMonth6 = total6 / 6;
      return {
        display: fmt(perMonth6, isCRC),
        period:  '/mes',
        altHTML: '<span class="price-total">Total: ' + fmt(total6, isCRC) + '</span>'
               + ' &nbsp;·&nbsp; <span class="alt-saving">Paga 5 meses y recibe 6</span>',
        total:   fmt(total6, isCRC) + ' por 6 meses',
      };
    }

    if (mode === 'annual') {
      // Pague 9 meses, lleve 12
      var total12    = base * 9;
      var perMonth12 = total12 / 12;
      return {
        display: fmt(perMonth12, isCRC),
        period:  '/mes',
        altHTML: '<span class="price-total">Total: ' + fmt(total12, isCRC) + '</span>'
               + ' &nbsp;·&nbsp; <span class="alt-saving">Paga 9 meses y recibe 12</span>',
        total:   fmt(total12, isCRC) + ' por 12 meses',
      };
    }

    return { display: fmt(base, isCRC), period: '/mes', altHTML: '', total: '' };
  }

  // ── Aviso bajo el toggle: explica de dónde sale el precio ──
  function renderHint() {
    var el = document.getElementById('region-hint');
    if (!el) return;

    if (currentRegion !== 'cr') {
      el.innerHTML = 'Precios en dólares. ¿Estás en Costa Rica? Tocá '
        + '<strong>🇨🇷 Costa Rica</strong> para verlos en colones.';
      return;
    }

    var rateTxt = '₡' + RATE.toFixed(2).replace('.', ',');
    el.innerHTML = rateSource === 'fallback'
      ? 'Convertido desde dólares a un tipo de cambio referencial de <strong>'
        + rateTxt + '</strong> por $1. El precio final se confirma al momento del pago.'
      : 'Convertido desde dólares al tipo de cambio del <strong>BCR</strong>: '
        + rateTxt + ' por $1. Se actualiza solo cada día.';
  }

  // ── Render de precios en el DOM ─────────────────────────
  function renderPrices() {
    var isCRC = currentRegion === 'cr';
    renderHint();
    
    PLANS.forEach(function (plan) {
      var data     = getPriceData(plan, currentMode, isCRC);
      var priceEl  = document.getElementById('price-' + plan);
      var periodEl = document.getElementById('period-' + plan);
      var altEl    = document.getElementById('alt-' + plan);

      if (priceEl)  priceEl.textContent  = data.display;
      if (periodEl) periodEl.textContent = data.period;
      if (altEl) {
        altEl.innerHTML     = data.altHTML;
        altEl.style.display = data.altHTML ? '' : 'none';
      }
    });
  }

  // ── Toggle de región ────────────────────────────────────
  function setRegion(region) {
    currentRegion = region;

    document.querySelectorAll('.region-toggle').forEach(function (btn) {
      var active = btn.dataset.region === region;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    renderPrices();
  }

  document.querySelectorAll('.region-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () { 
      setRegion(btn.dataset.region); 
    });
  });

  // ── Tabs de facturación ─────────────────────────────────
  function setMode(mode) {
    currentMode = mode;

    document.querySelectorAll('.billing-tab').forEach(function (tab) {
      var active = tab.dataset.mode === mode;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.setAttribute('tabindex', active ? '0' : '-1');
    });

    renderPrices();
  }

  document.querySelectorAll('.billing-tab').forEach(function (tab) {
    tab.addEventListener('click', function () { setMode(tab.dataset.mode); });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setMode(tab.dataset.mode);
      }
    });
  });

  // ── Botones de planes → abren WhatsApp con el plan armado ──
  var MODE_LABELS = {
    monthly:    'Mensual',
    semiannual: 'Semestral (pago 5 meses, recibo 6)',
    annual:     'Anual (pago 9 meses, recibo 12)',
  };

  var PLAN_LABELS = {
    basic:    'Basic — 1 pantalla',
    standard: 'Standard — 2 pantallas',
    family:   'Family — 4 pantallas',
  };

  // Arma el mensaje con el plan, precio y facturación exactos que el
  // visitante está viendo en pantalla en ese momento.
  function buildPlanWhatsAppUrl(planName) {
    var isCRC     = currentRegion === 'cr';
    var priceData = getPriceData(planName, currentMode, isCRC);
    var planLabel = PLAN_LABELS[planName] || planName;
    var modeLabel = MODE_LABELS[currentMode] || currentMode;

    var lines = [
      '¡Hola! Quiero solicitar una cuenta ' + planLabel.split(' —')[0] + ' de Bankai +.',
      '',
      '📋 Plan: ' + planLabel,
      '💳 Facturación: ' + modeLabel,
      '💰 Precio: ' + priceData.display + '/mes ' + (isCRC ? '(colones)' : '(dólares)'),
    ];

    // En semestral/anual sumamos el total para que no haya sorpresas
    if (priceData.total) lines.push('🧾 Total: ' + priceData.total);

    lines.push('', '¿Me ayudás a activarla?');

    return 'https://wa.me/' + CONFIG.contact.whatsappNumber
         + '?text=' + encodeURIComponent(lines.join('\n'));
  }

  document.querySelectorAll('.plan-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var planName = btn.dataset.plan;   // 'basic' | 'standard' | 'family'
      if (!planName) return;
      e.preventDefault();
      window.open(buildPlanWhatsAppUrl(planName), '_blank', 'noopener');
    });
  });

  // ── Inicialización ──────────────────────────────────────
  // 1. Arrancamos ya con un tipo de cambio utilizable (cache o fallback)
  //    para que los precios se pinten al instante, sin esperar a la red.
  var cached = readCachedRate();
  applyRate(cached || PX.exchangeRateFallback, cached ? 'cache' : 'fallback');

  setRegion(currentRegion);   // Por defecto USD (ver CONFIG.pricing.defaultCurrency)
  setMode('monthly');

  // 2. En paralelo consultamos el BCR. Si responde, repinta con el dato real.
  if (!cached) fetchRate();

  // Exponer estado global para que main.js lo lea
  window.BANKAI_STATE = window.BANKAI_STATE || {};
  window.BANKAI_STATE.getMode = function () { return currentMode; };
  window.BANKAI_STATE.isCRC   = function () { return currentRegion === 'cr'; };
  window.BANKAI_STATE.getRegion = function () { return currentRegion; };
  window.BANKAI_STATE.getCurrency = function () { return currentRegion === 'cr' ? 'CRC' : 'USD'; };
  window.BANKAI_STATE.getRate = function () { return RATE; };
  window.BANKAI_STATE.getRateSource = function () { return rateSource; };
});
