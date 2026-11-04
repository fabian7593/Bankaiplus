/**
 * ============================================================
 * BANKAI + — VIDEOS DEL CANAL DE YOUTUBE
 * ============================================================
 * Un solo reproductor para todo el sitio. Funciona en cualquier
 * página que cargue este archivo y css/video-player.css.
 *
 * CÓMO SE PONE UN VIDEO EN UNA PÁGINA
 * -----------------------------------
 * Alcanza con el ID del video. El título y la etiqueta salen solos
 * de CONFIG.videos.list (js/config.js), así que no se repiten textos:
 *
 *     <div class="video-frame">
 *       <div class="yt-player" data-yt="iswfONx8r4I"></div>
 *       <div class="video-glow" aria-hidden="true"></div>
 *     </div>
 *
 * Si hiciera falta otro texto en esa página puntual, se puede pisar
 * con data-yt-title="..." y data-yt-label="...". Un ID que no esté en
 * la lista igual funciona (queda con un título genérico).
 *
 * EL LANDING
 * ----------
 * #video-player es el marco grande de la portada y siempre muestra el
 * PRIMERO de CONFIG.videos.list. Debajo, #video-playlist arma la fila
 * con el resto del canal: al tocar una tarjeta, ese video se reproduce
 * arriba, sin recargar nada ni sacar al visitante del sitio.
 *
 * POR QUÉ UNA CARÁTULA Y NO EL IFRAME DIRECTO
 * -------------------------------------------
 * Mientras nadie toque play solo se carga una imagen (~40KB). El
 * reproductor de YouTube (~1MB y sus cookies) entra recién al primer
 * clic, y por youtube-nocookie.com. Así la página no paga el peso ni
 * deja cookies de seguimiento por un video que la mayoría no mira.
 * ============================================================
 */
(function () {
  var marcos = document.querySelectorAll('.yt-player');
  if (!marcos.length) return;

  var cfg  = (typeof CONFIG !== 'undefined' && CONFIG.videos) || {};
  var cola = Array.isArray(cfg.list)
    ? cfg.list.filter(function (v) { return v && v.id; })
    : [];

  var fila   = document.getElementById('video-playlist');
  var enlace = document.getElementById('video-channel-link');

  // Enlace "ver el canal": si no hay canal configurado no se muestra,
  // para no dejar un botón que no lleva a ninguna parte.
  if (enlace) {
    if (cfg.channel) enlace.setAttribute('href', cfg.channel);
    else if (!enlace.getAttribute('href')) enlace.hidden = true;
  }

  // maxres existe en todo video subido en HD; mq es la miniatura
  // liviana que va en la fila de abajo.
  function caratula(id, grande) {
    return 'https://i.ytimg.com/vi/' + encodeURIComponent(id) +
           (grande ? '/maxresdefault.jpg' : '/mqdefault.jpg');
  }

  var ICONO_PLAY =
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M8 5.14v13.72L19 12 8 5.14z"/></svg>';

  function texto(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Ficha de un video: lo que diga CONFIG.videos.list, y si la página
  // puso data-yt-title / data-yt-label, eso manda para ese marco.
  function ficha(marco, id) {
    var base = cola.filter(function (v) { return v.id === id; })[0] || {};
    return {
      id:    id,
      title: marco.dataset.ytTitle || base.title || 'Video de Bankai +',
      label: marco.dataset.ytLabel || base.label || '',
    };
  }

  function actual(marco) {
    return ficha(marco, marco.dataset.videoId);
  }

  // ── Carátula: todavía sin reproductor ──
  function dibujarCaratula(marco, video) {
    marco.dataset.videoId = video.id;
    marco.classList.remove('is-playing');
    marco.innerHTML =
      '<button type="button" class="yt-facade" aria-label="Reproducir el video: ' + texto(video.title) + '">' +
        '<img class="yt-facade-thumb" src="' + texto(caratula(video.id, true)) + '" alt="" ' +
             'width="1280" height="720" loading="lazy" decoding="async">' +
        '<span class="yt-facade-play" aria-hidden="true">' + ICONO_PLAY + '</span>' +
        '<span class="yt-facade-meta">' +
          (video.label ? '<span class="yt-facade-label">' + texto(video.label) + '</span>' : '') +
          '<span class="yt-facade-title">' + texto(video.title) + '</span>' +
        '</span>' +
      '</button>';
  }

  // ── Reproductor real: solo cuando la persona pidió verlo ──
  function reproducir(marco, video) {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(video.id) +
                 '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    iframe.title = video.title || 'Video de Bankai +';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; ' +
                   'gyroscope; picture-in-picture; web-share; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.setAttribute('frameborder', '0');

    marco.dataset.videoId = video.id;
    marco.innerHTML = '';
    marco.appendChild(iframe);
    marco.classList.add('is-playing');
  }

  function marcarActivo(id) {
    if (!fila) return;
    fila.querySelectorAll('.vp-item').forEach(function (btn) {
      var activo = btn.dataset.id === id;
      btn.classList.toggle('is-active', activo);
      if (activo) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    });
  }

  // ── Fila del canal (solo el landing la tiene) ──
  function dibujarFila() {
    if (!fila || cola.length < 2) return;

    fila.innerHTML = cola.map(function (v) {
      return '<button type="button" class="vp-item" data-id="' + texto(v.id) + '">' +
               '<span class="vp-thumb">' +
                 '<img src="' + texto(caratula(v.id, false)) + '" alt="" ' +
                      'width="320" height="180" loading="lazy" decoding="async">' +
                 '<span class="vp-thumb-play" aria-hidden="true">' + ICONO_PLAY + '</span>' +
               '</span>' +
               '<span class="vp-text">' +
                 (v.label ? '<span class="vp-label">' + texto(v.label) + '</span>' : '') +
                 '<span class="vp-title">' + texto(v.title) + '</span>' +
               '</span>' +
             '</button>';
    }).join('');

    fila.hidden = false;
    marcarActivo(cola[0].id);
  }

  // Un solo listener para todo el sitio: las carátulas de cualquier
  // página y las tarjetas de la fila del landing.
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;

    var tarjeta = e.target.closest('.vp-item');
    if (tarjeta && fila && fila.contains(tarjeta)) {
      var principal = document.getElementById('video-player');
      if (!principal) return;
      reproducir(principal, ficha(principal, tarjeta.dataset.id));
      marcarActivo(tarjeta.dataset.id);
      principal.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    var portada = e.target.closest('.yt-facade');
    if (!portada) return;

    var marco = portada.closest('.yt-player');
    if (marco && marco.dataset.videoId) reproducir(marco, actual(marco));
  });

  function iniciar() {
    marcos.forEach(function (marco) {
      // El marco grande del landing sigue a config.js: siempre muestra
      // el primero de la lista, se reordene como se reordene.
      var id = (marco.id === 'video-player' && cola.length)
        ? cola[0].id
        : (marco.dataset.yt || marco.dataset.videoId);

      if (id) dibujarCaratula(marco, ficha(marco, id));
    });

    dibujarFila();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
