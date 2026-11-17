/**
 * BANKAI + — DATOS DEL SITIO EN UN SOLO LUGAR
 * ─────────────────────────────────────────────────────────
 * Le pone a todas las páginas los datos de js/config.js, así cambiar el
 * WhatsApp, el correo, un precio o un código es tocar SOLO config.js:
 *
 *  - Todos los links de WhatsApp (https://wa.me/...) usan
 *    CONFIG.contact.whatsappNumber. El mensaje (?text=) de cada link se respeta.
 *  - Todos los mailto: usan CONFIG.contact.email. El asunto se respeta.
 *  - data-cfg="ruta.en.config" → el texto del elemento sale de CONFIG.
 *    Ej.: data-cfg="downloads.downloaderCode", "downloads.serverCode",
 *    "downloads.appName", "contact.email".
 *  - data-cfg-price="basic|standard|family" → precio mensual en USD de
 *    CONFIG.pricing.usd ("6", "10", "13.33").
 *  - [data-social-links] → se llena con los iconos de CONFIG.social
 *    (YouTube, Instagram, Facebook, TikTok, Telegram) más el de WhatsApp,
 *    que sale de CONFIG.contact.whatsappNumber. La red que esté en ''
 *    no dibuja icono, así que nunca queda un enlace muerto.
 *  - [data-web-link="/ruta"] → link a la web para ver (CONFIG.web.url):
 *    si es un <a> le pone href = CONFIG.web.url + ruta; si es otra cosa
 *    (un <li>), se lo pone al <a> de adentro. Con CONFIG.web.url en ''
 *    el elemento se esconde entero, así nunca queda un botón a una web
 *    que no existe.
 *  - Los links de registro (https://app.vortexvip.org/register...) usan
 *    CONFIG.registro.url.
 *
 * El HTML conserva los valores escritos como respaldo (se ven si este
 * script no carga), pero los que valen son los de config.js.
 *
 * Lo único que NO cubre: las etiquetas <meta> y el JSON-LD del <head> de
 * index.html (precios y WhatsApp para Google). Esos se leen antes de que
 * corra cualquier script, así que si cambian precios hay que editarlos a mano.
 *
 * Va justo después de config.js en cada página.
 */
(function () {
  if (typeof CONFIG === 'undefined') return;

  function get(path) {
    return String(path).split('.').reduce(function (obj, key) {
      return obj == null ? undefined : obj[key];
    }, CONFIG);
  }

  // 6 → "6", 10.00 → "10", 13.33 → "13.33"
  function price(value) {
    var n = Number(value);
    if (!isFinite(n) || n <= 0) return null;
    return n % 1 === 0 ? String(n) : n.toFixed(2);
  }


  // ── Redes sociales ──
  // Los iconos viven acá (no repetidos en los 5 footers del sitio), así
  // sumar una red es una línea en config.js y nada más.
  // El orden de esta lista es el orden en que se ven en el footer.
  var REDES = [
    { clave: 'youtube', nombre: 'YouTube',
      icono: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
    { clave: 'instagram', nombre: 'Instagram',
      icono: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
    { clave: 'facebook', nombre: 'Facebook',
      icono: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
    { clave: 'tiktok', nombre: 'TikTok',
      icono: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z' },
    { clave: 'telegram', nombre: 'Telegram',
      icono: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-.634-.419-.246-.65.154-1.026.104-.098 1.908-1.74 1.943-1.888.004-.018.008-.084-.033-.119s-.096-.023-.137-.014q-.088.02-2.733 1.805-.388.266-.735.26c-.238-.005-.697-.135-1.038-.246-.42-.136-.753-.21-.726-.44q.02-.18.336-.366 2.69-1.173 3.587-1.547c1.708-.71 2.062-.833 2.293-.837z' },
  ];

  var ICONO_WHATSAPP = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';

  function icono(red, url) {
    return '<a class="social-link social-' + red.clave + '" href="' + url + '" ' +
           'target="_blank" rel="noopener noreferrer" ' +
           'aria-label="Bankai + en ' + red.nombre + '" title="' + red.nombre + '">' +
           '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' +
           '<path d="' + red.icono + '"/></svg></a>';
  }

  function dibujarRedes() {
    var cajas = document.querySelectorAll('[data-social-links]');
    if (!cajas.length) return;

    var social = CONFIG.social || {};
    var html = REDES.filter(function (red) {
      return String(social[red.clave] || '').trim() !== '';
    }).map(function (red) {
      return icono(red, String(social[red.clave]).trim());
    });

    // WhatsApp cierra la fila: es el canal de contacto principal y ya
    // tiene su número en CONFIG.contact, no hace falta repetirlo.
    var wa = String((CONFIG.contact || {}).whatsappNumber || '').replace(/\D/g, '');
    if (wa) {
      html.push(icono({ clave: 'whatsapp', nombre: 'WhatsApp', icono: ICONO_WHATSAPP },
                      'https://wa.me/' + wa));
    }

    cajas.forEach(function (caja) {
      caja.innerHTML = html.join('');
      caja.hidden = html.length === 0;
    });
  }

  // ── Web para ver ──
  // La dirección sin la barra del final: 'https://ver.bankaiplus.com'
  function baseWeb() {
    return String((CONFIG.web || {}).url || '').trim().replace(/\/+$/, '');
  }

  function enlazarWeb() {
    var base = baseWeb();
    document.querySelectorAll('[data-web-link]').forEach(function (el) {
      if (!base) {
        // Sin web configurada el botón no se muestra (style y no hidden:
        // las clases de los botones ponen su propio display y le ganarían)
        el.style.display = 'none';
        return;
      }
      var ruta = el.getAttribute('data-web-link') || '/';
      if (ruta.charAt(0) !== '/') ruta = '/' + ruta;
      var link = el.tagName === 'A' ? el : el.querySelector('a');
      if (link) link.setAttribute('href', base + ruta);
    });
  }

  function apply() {
    // Las redes van primero: así el link de WhatsApp que se dibuja acá
    // también pasa por el normalizador de números de más abajo.
    dibujarRedes();
    enlazarWeb();

    var registro = String((CONFIG.registro || {}).url || '').trim();
    if (registro) {
      document.querySelectorAll('a[href^="https://app.vortexvip.org/register"]').forEach(function (a) {
        a.setAttribute('href', registro);
      });
    }

    var contact = CONFIG.contact || {};

    var number = String(contact.whatsappNumber || '').replace(/\D/g, '');
    if (number) {
      document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) {
        a.setAttribute('href', a.getAttribute('href').replace(/^https:\/\/wa\.me\/\d*/, 'https://wa.me/' + number));
      });
    }

    var email = String(contact.email || '').trim();
    if (email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
        a.setAttribute('href', a.getAttribute('href').replace(/^mailto:[^?]*/, 'mailto:' + email));
      });
    }

    document.querySelectorAll('[data-cfg]').forEach(function (el) {
      var value = get(el.getAttribute('data-cfg'));
      if (value != null && String(value).trim() !== '') el.textContent = String(value);
    });

    var usd = (CONFIG.pricing && CONFIG.pricing.usd) || {};
    document.querySelectorAll('[data-cfg-price]').forEach(function (el) {
      var value = price(usd[el.getAttribute('data-cfg-price')]);
      if (value) el.textContent = value;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply);
  } else {
    apply();
  }
})();
