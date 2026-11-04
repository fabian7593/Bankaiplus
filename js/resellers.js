/**
 * BANKAI + — CALCULADORA DE RESELLERS
 * ─────────────────────────────────────────────────────────
 * Solo corre en /resellers. Hace tres cosas:
 *
 *   1. Dibuja la grilla de la calculadora (3 planes × 3 ciclos).
 *   2. Calcula qué cobra el reseller, qué nos transfiere y con qué
 *      se queda, según la modalidad elegida.
 *   3. Le mete al botón "Arrancar con esto" el escenario calculado
 *      dentro del mensaje de WhatsApp, así el pedido llega con los
 *      números puestos.
 *
 * LOS PRECIOS NO SE ESCRIBEN ACÁ. Salen de CONFIG.pricing.usd
 * (js/config.js), que es la fuente de verdad de todo el sitio: si
 * Fabián sube el precio del Basic allá, esta página se actualiza
 * sola. Los valores de PLANES son solo el respaldo por si config.js
 * no cargó.
 *
 * LA COMISIÓN DEPENDE DE LA MODALIDAD, NO DEL CICLO:
 *   sin inversión → 40 %   ·   con inversión → 50 %
 * Es el mismo porcentaje en Basic, Standard y Family, y en mensual,
 * semestral y anual. Si eso cambia, se toca MODOS y nada más.
 *
 * Va después de config.js en resellers/index.html.
 */
(function () {
  'use strict';

  var panel = document.getElementById('rs-planes');
  if (!panel) return; // no estamos en /resellers

  /* ── Planes: mensual = precio de lista en USD ── */
  var PLANES = [
    { k: 'basic',    n: 'Basic',    d: '1 pantalla',  mensual: 6     },
    { k: 'standard', n: 'Standard', d: '2 pantallas', mensual: 10    },
    { k: 'family',   n: 'Family',   d: '4 pantallas', mensual: 13.33 }
  ];

  /* ── Ciclos de facturación ──
     pagos = cuántas mensualidades paga el cliente
             (semestral: paga 5 y lleva 6 · anual: paga 9 y lleva 12)
     meses = cuánto le dura el plan */
  var CICLOS = [
    { k: 'mensual',   n: 'Mensual',   meses: 1,  pagos: 1 },
    { k: 'semestral', n: 'Semestral', meses: 6,  pagos: 5 },
    { k: 'anual',     n: 'Anual',     meses: 12, pagos: 9 }
  ];

  /* ── Las dos modalidades ── */
  var MODOS = {
    sin: {
      com: 0.40,
      etiqueta: 'sin inversión (40 %)',
      nota: 'Vos cobrás y nos transferís nuestra parte.'
    },
    con: {
      com: 0.50,
      etiqueta: 'con inversión (50 %)',
      nota: 'El paquete ya lo pagaste: "nos pasás" es tu costo.'
    }
  };

  /* ── Escenarios de ejemplo de los botones ── */
  var PRESETS = {
    cero: {},
    arranque: {
      basic:    { mensual: 5 },
      standard: { mensual: 2 }
    },
    creciendo: {
      basic:    { mensual: 15, semestral: 4 },
      standard: { mensual: 8,  anual: 2 },
      family:   { mensual: 3 }
    },
    volumen: {
      basic:    { mensual: 40, semestral: 10 },
      standard: { mensual: 25, semestral: 6 },
      family:   { mensual: 10, anual: 4 }
    }
  };

  var TOPE = 999;
  var modo = 'con';     // la recomendada, igual que la card destacada
  var estado = {};

  /* ── Precios reales desde config.js ── */
  (function tomarPreciosDeConfig() {
    if (typeof CONFIG === 'undefined' || !CONFIG.pricing || !CONFIG.pricing.usd) return;
    var usd = CONFIG.pricing.usd;
    PLANES.forEach(function (p) {
      var v = Number(usd[p.k]);
      if (isFinite(v) && v > 0) p.mensual = v;
    });
  })();

  /* ── Las dos únicas cuentas de toda la página ── */
  function precioCliente(plan, ciclo) { return plan.mensual * ciclo.pagos; }
  function gananciaVenta(plan, ciclo) { return precioCliente(plan, ciclo) * MODOS[modo].com; }

  function usd(v) {
    return '$' + v.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function cargarEstado(preset) {
    estado = {};
    PLANES.forEach(function (p) {
      estado[p.k] = {};
      CICLOS.forEach(function (c) {
        estado[p.k][c.k] = (preset && preset[p.k] && preset[p.k][c.k]) || 0;
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     Grilla de contadores
  ════════════════════════════════════════════════════════ */
  function pintarPlanes() {
    panel.innerHTML = '';

    PLANES.forEach(function (p) {
      var bloque = document.createElement('div');
      bloque.className = 'rs-plan';

      var html =
        '<div class="rs-plan-h">' +
          '<span class="rs-plan-n">' + p.n +
            '<i>' + p.d + ' · ' + usd(p.mensual) + '/mes</i></span>' +
          '<span class="rs-plan-sub rs-off" data-rs-sub="' + p.k + '">' + usd(0) + '</span>' +
        '</div><div class="rs-celdas">';

      CICLOS.forEach(function (c) {
        var id = 'rs-q-' + p.k + '-' + c.k;
        html +=
          '<div class="rs-celda">' +
            '<div class="rs-celda-l">' + c.n + '</div>' +
            '<div class="rs-celda-p" data-rs-por="' + p.k + '-' + c.k + '">' +
              usd(gananciaVenta(p, c)) + ' por venta</div>' +
            '<div class="rs-step">' +
              '<button type="button" data-rs-paso="-1" data-rs-plan="' + p.k + '" data-rs-ciclo="' + c.k + '"' +
                     ' aria-label="Quitar un cliente ' + p.n + ' ' + c.n + '">−</button>' +
              '<input type="number" inputmode="numeric" min="0" max="' + TOPE + '" step="1" value="0"' +
                     ' id="' + id + '" data-rs-plan="' + p.k + '" data-rs-ciclo="' + c.k + '"' +
                     ' aria-label="Clientes ' + p.n + ' ' + c.n + '">' +
              '<button type="button" data-rs-paso="1" data-rs-plan="' + p.k + '" data-rs-ciclo="' + c.k + '"' +
                     ' aria-label="Sumar un cliente ' + p.n + ' ' + c.n + '">+</button>' +
            '</div>' +
          '</div>';
      });

      bloque.innerHTML = html + '</div>';
      panel.appendChild(bloque);
    });
  }

  /* ── Botones + / − ── */
  panel.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button[data-rs-paso]') : null;
    if (!b) return;
    var plan  = b.getAttribute('data-rs-plan');
    var ciclo = b.getAttribute('data-rs-ciclo');
    var paso  = parseInt(b.getAttribute('data-rs-paso'), 10);
    estado[plan][ciclo] = Math.max(0, Math.min(TOPE, estado[plan][ciclo] + paso));
    marcarPreset(null);
    recalcular(false);
  });

  /* ── Escritura a mano ── */
  panel.addEventListener('input', function (e) {
    var i = e.target;
    if (!i || i.tagName !== 'INPUT') return;
    var v = parseInt(i.value, 10);
    if (isNaN(v) || v < 0) v = 0;
    if (v > TOPE) { v = TOPE; i.value = String(TOPE); }
    estado[i.getAttribute('data-rs-plan')][i.getAttribute('data-rs-ciclo')] = v;
    marcarPreset(null);
    // true = no le pisamos el campo mientras escribe
    recalcular(true);
  });

  /* ── Campo vacío al salir: vuelve a 0 ── */
  panel.addEventListener('blur', function (e) {
    if (e.target && e.target.tagName === 'INPUT' && e.target.value === '') e.target.value = '0';
  }, true);

  /* ════════════════════════════════════════════════════════
     Link de WhatsApp con el escenario adentro
     ────────────────────────────────────────────────────────
     Respetamos el número que haya en el href: config-bind.js lo
     reescribe desde CONFIG.contact.whatsappNumber, así que lo
     leemos en vez de hardcodearlo de nuevo.
  ════════════════════════════════════════════════════════ */
  function actualizarWhatsApp(clientes, ganancia) {
    var a = document.getElementById('rs-wa-calc');
    if (!a) return;

    var base = (a.getAttribute('href') || '').split('?')[0];
    var msg  = 'Hola, quiero ser reseller de Bankai +';

    if (clientes > 0) {
      msg += '. Modalidad ' + MODOS[modo].etiqueta + ': con ' + clientes +
             (clientes === 1 ? ' cliente' : ' clientes') +
             ' me quedarían ' + usd(ganancia) + ' por ciclo.';
    }

    a.setAttribute('href', base + '?text=' + encodeURIComponent(msg));
  }

  /* ════════════════════════════════════════════════════════
     Resultado
  ════════════════════════════════════════════════════════ */
  function texto(id, valor) {
    var el = document.getElementById(id);
    if (el) el.textContent = valor;
  }

  function recalcular(escribiendo) {
    var cobrado = 0, ganancia = 0, porMes = 0, aDoceMeses = 0, clientes = 0;

    PLANES.forEach(function (p) {
      var subtotal = 0;

      CICLOS.forEach(function (c) {
        var q = estado[p.k][c.k];

        // el "por venta" de cada celda cambia con la modalidad
        var por = panel.querySelector('[data-rs-por="' + p.k + '-' + c.k + '"]');
        if (por) por.textContent = usd(gananciaVenta(p, c)) + ' por venta';

        if (!escribiendo) {
          var inp = document.getElementById('rs-q-' + p.k + '-' + c.k);
          if (inp && inp.value !== String(q)) inp.value = q;
        }

        if (!q) return;

        var g = gananciaVenta(p, c) * q;
        cobrado    += precioCliente(p, c) * q;
        ganancia   += g;
        porMes     += g / c.meses;          // repartida entre los meses que dura
        aDoceMeses += g * (12 / c.meses);   // si renueva todo el año
        clientes   += q;
        subtotal   += g;
      });

      var sub = panel.querySelector('[data-rs-sub="' + p.k + '"]');
      if (sub) {
        sub.textContent = usd(subtotal);
        sub.classList.toggle('rs-off', subtotal === 0);
      }
    });

    texto('rs-o-gan',  usd(ganancia));
    texto('rs-o-cli',  clientes === 1 ? '1 cliente' : clientes + ' clientes');
    texto('rs-o-cob',  usd(cobrado));
    texto('rs-o-ban',  usd(cobrado - ganancia));
    texto('rs-o-mes',  usd(porMes));
    texto('rs-o-anio', usd(aDoceMeses));
    texto('rs-o-fine', 'Precios de lista en USD. ' + MODOS[modo].nota);

    actualizarWhatsApp(clientes, ganancia);
  }

  /* ── Botones de escenario ── */
  function marcarPreset(nombre) {
    var botones = document.querySelectorAll('.rs-preset');
    for (var i = 0; i < botones.length; i++) {
      botones[i].setAttribute(
        'aria-pressed',
        botones[i].getAttribute('data-rs-preset') === nombre ? 'true' : 'false'
      );
    }
  }

  (function conectarPresets() {
    var botones = document.querySelectorAll('.rs-preset');
    for (var i = 0; i < botones.length; i++) {
      botones[i].addEventListener('click', function () {
        var nombre = this.getAttribute('data-rs-preset');
        cargarEstado(PRESETS[nombre]);
        marcarPreset(nombre);
        recalcular(false);
      });
    }
  })();

  /* ── Selector de modalidad ── */
  (function conectarModalidad() {
    var tabs = document.querySelectorAll('[data-rs-modo]');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].addEventListener('click', function () {
        modo = this.getAttribute('data-rs-modo');
        for (var j = 0; j < tabs.length; j++) {
          tabs[j].setAttribute('aria-pressed', tabs[j] === this ? 'true' : 'false');
        }
        recalcular(false);
      });
    }
  })();

  /* ── Arranque: la página abre con un escenario cargado para
        que se entienda de una qué hace la calculadora ── */
  cargarEstado(PRESETS.creciendo);
  pintarPlanes();
  recalcular(false);
})();
