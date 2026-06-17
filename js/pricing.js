/**
 * ============================================================
 * TAURO TV — PRICING JS
 * ============================================================
 * Detección de país: usa JSONP (ipapi.co/json?callback=...)
 * JSONP funciona desde file:// porque carga un <script>,
 * sin restricciones CORS. No requiere servidor ni API key.
 *
 * Flujo:
 *  1. Carga la página → muestra USD por defecto inmediatamente
 *  2. En paralelo: inyecta <script> con JSONP para detectar país
 *  3. Si país = CR → actualiza a CRC en tiempo real
 *  4. Si la API falla o tarda > 5s → queda en USD (fallback seguro)
 *  5. El usuario puede cambiar manualmente con el selector de moneda
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

  // ── Constantes ──────────────────────────────────────────
  var PLANS = ['basic', 'standard', 'family'];
  var USD   = CONFIG.pricing.usd;   // { basic: 5.99, standard: 8.99, family: 11.99 }
  var CRC   = CONFIG.pricing.crc;   // { basic: 3000, standard: 4500, family: 6000 }

  // ── Estado ──────────────────────────────────────────────
  var currentMode = 'monthly';   // 'monthly' | 'semiannual' | 'annual'
  var isCRC       = true;        // DEFAULT: Costa Rica (colones)
                                 // La detección de IP lo cambia a false si es extranjero

  // ── Formato de números ──────────────────────────────────
  // Evita depender de toLocaleString (inconsistente entre navegadores)

  function formatThousands(n) {
    // Formatea entero con punto como separador de miles: 15000 → "15.000"
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function fmt(amount, inCRC) {
    if (inCRC) {
      return '₡' + formatThousands(amount);
    }
    return '$' + amount.toFixed(2);
  }

  function fmtTotal(amount, inCRC) {
    if (inCRC) {
      return '₡' + formatThousands(amount);
    }
    return '$' + amount.toFixed(2);
  }

  // ── Cálculo de precios por modo ─────────────────────────

  function getPriceData(plan, mode, inCRC) {
    var base = inCRC ? CRC[plan] : USD[plan];

    if (mode === 'monthly') {
      return {
        display: fmt(base, inCRC),
        period:  '/mes',
        altHTML: '',
      };
    }

    if (mode === 'semiannual') {
      // Pague 5 meses, lleve 6
      var total6    = base * 5;
      var perMonth6 = total6 / 6;
      return {
        display: fmt(perMonth6, inCRC),
        period:  '/mes',
        altHTML: '<span class="price-total">Total: ' + fmtTotal(total6, inCRC) + '</span>'
               + ' &nbsp;·&nbsp; <span class="alt-saving">Paga 5 meses y recibe 6</span>',
      };
    }

    if (mode === 'annual') {
      // Pague 10 meses, lleve 12
      var total12    = base * 10;
      var perMonth12 = total12 / 12;
      return {
        display: fmt(perMonth12, inCRC),
        period:  '/mes',
        altHTML: '<span class="price-total">Total: ' + fmtTotal(total12, inCRC) + '</span>'
               + ' &nbsp;·&nbsp; <span class="alt-saving">Paga 10 meses y recibe 12</span>',
      };
    }

    return { display: fmt(base, inCRC), period: '/mes', altHTML: '' };
  }

  // ── Render de precios en el DOM ─────────────────────────

  function renderPrices() {
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

    // Badge de moneda
    var badge = document.getElementById('currency-badge');
    if (badge) {
      badge.textContent = isCRC
        ? '📍 Precios en Colones (₡) — Costa Rica'
        : '🌎 Precios en USD ($) — Internacional';
      badge.setAttribute('data-crc', isCRC ? 'true' : 'false');
      badge.style.display = '';
    }

    // Actualizar el botón del hero si existe
    var heroBtn = document.querySelector('.btn-primary[href="#pricing"]');
    if (heroBtn) {
      if (isCRC) {
        heroBtn.textContent = 'Ver planes desde ₡3.000';
      } else {
        heroBtn.textContent = 'Ver planes desde $5.99';
      }
    }
  }

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

  // ── Selector manual de moneda ───────────────────────────
  // (eliminado — los clientes no deben ver diferencia de precios)

  // ── Detección de país via JSONP ─────────────────────────
  // JSONP inyecta un <script src="...?callback=fn"> que el servidor
  // responde como: fn({ "country_code": "CR", ... })
  // Esto funciona desde file:// porque no es un fetch, es un script tag.

  var _geoTimeout = null;

  // La función de callback debe ser global para que el script la llame
  window.__tauroGeoCallback = function (data) {
    clearTimeout(_geoTimeout);

    var s = document.getElementById('__geo-script');
    if (s && s.parentNode) s.parentNode.removeChild(s);

    var code = (data && data.country_code) ? data.country_code.toUpperCase() : '';

    // Solo cambia a USD si detecta que NO es Costa Rica
    // Si falla la detección → isCRC ya es true (default), no cambia nada
    if (code !== '' && code !== 'CR') {
      isCRC = false;
      renderPrices();
    }
    // Si es CR o string vacío: ya estamos en CRC por defecto, no re-renderizar
  };

  function loadGeoJSONP() {
    // Mostrar estado "detectando" en el badge
    var badge = document.getElementById('currency-badge');
    if (badge) {
      badge.textContent = 'Detectando tu ubicación…';
      badge.style.display = '';
    }

    // Timeout: si en 5s no responde → quedamos en CRC (default), no hacemos nada
    _geoTimeout = setTimeout(function () {
      var s = document.getElementById('__geo-script');
      if (s && s.parentNode) s.parentNode.removeChild(s);
      // isCRC ya es true por default — no hay que cambiar nada ni re-renderizar
    }, 5000);

    // Inyectar el script JSONP
    var script = document.createElement('script');
    script.id  = '__geo-script';
    script.src = 'https://ipapi.co/json/?callback=__tauroGeoCallback';
    // Error de red → quedamos en CRC (default)
    script.onerror = function () {
      clearTimeout(_geoTimeout);
      if (script.parentNode) script.parentNode.removeChild(script);
      // isCRC ya es true — no hacer nada
    };
    document.head.appendChild(script);
  }

  // ── Inicialización ──────────────────────────────────────
  setMode('monthly');  // render inicial con CRC por defecto
  loadGeoJSONP();      // detección en paralelo, actualiza si es extranjero

  // Exponer estado global para que main.js lo lea al armar el mensaje de WhatsApp
  // Se actualiza cada vez que cambia el modo o la moneda
  window.TAURO_STATE = window.TAURO_STATE || {};
  window.TAURO_STATE.getMode = function () { return currentMode; };
  window.TAURO_STATE.isCRC   = function () { return isCRC; };
});
