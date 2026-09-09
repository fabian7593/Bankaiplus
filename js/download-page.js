/**
 * BANKAI + — PÁGINA DE DESCARGA (/descargar)
 * ─────────────────────────────────────────────────────────
 * Le pone el link real a los dos botones de descarga (y el código de
 * Downloader) leyendo
 * CONFIG.downloads (js/config.js). Es el único lugar donde hay
 * que pegar las URLs.
 *
 * Si una URL todavía está vacía, el botón NO queda muerto:
 * cae a WhatsApp con un mensaje armado pidiendo el link, y el
 * texto chico del botón lo aclara. Así la página nunca se ve rota.
 */

document.addEventListener('DOMContentLoaded', () => {

  const dl = (typeof CONFIG !== 'undefined' && CONFIG.downloads) ? CONFIG.downloads : {};

  // Link de WhatsApp de respaldo, con el mensaje según el caso
  function whatsappFallback(mensaje) {
    const numero = (typeof CONFIG !== 'undefined' && CONFIG.contact)
      ? CONFIG.contact.whatsappNumber
      : '50661719869';
    return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensaje);
  }

  // ── Botón de Play Store ──────────────────────────────────
  const btnPlay = document.getElementById('btn-play-store');
  if (btnPlay) {
    const url = (dl.playStore || '').trim();
    if (url) {
      btnPlay.href = url;
    } else {
      btnPlay.href = whatsappFallback('¡Hola! Quiero el link de la app de Bankai + en Play Store ⚔️');
    }
  }

  // ── Botón del APK ────────────────────────────────────────
  const btnApk = document.getElementById('btn-apk');
  if (btnApk) {
    const url = (dl.apk || '').trim();
    if (url) {
      btnApk.href = url;
    } else {
      btnApk.href = whatsappFallback('¡Hola! Quiero el APK de la app de Bankai + ⚔️');
    }
  }

  // ── Código de Downloader ──────────────────────────
  // El código sale de CONFIG (si está seteado) y se puede copiar de un
  // toque. Si el navegador no deja copiar, se selecciona el texto para
  // que el usuario lo copie a mano — nunca queda sin respuesta.
  const btnCode = document.getElementById('btn-downloader-code');
  if (btnCode) {
    const valEl = btnCode.querySelector('.dl-code-val');
    const codigo = (dl.downloaderCode || btnCode.dataset.code || '').trim();

    if (codigo) {
      btnCode.dataset.code = codigo;
      if (valEl) valEl.textContent = codigo;
    }

    btnCode.addEventListener('click', () => {
      const code = btnCode.dataset.code || '';
      if (!code || !valEl) return;

      const avisarCopiado = () => {
        if (btnCode.classList.contains('is-copied')) return;
        valEl.textContent = '¡Copiado!';
        btnCode.classList.add('is-copied');
        setTimeout(() => {
          valEl.textContent = code;
          btnCode.classList.remove('is-copied');
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(avisarCopiado).catch(seleccionar);
      } else {
        seleccionar();
      }

      // Respaldo: dejar el número seleccionado para copiarlo a mano
      function seleccionar() {
        try {
          const rango = document.createRange();
          rango.selectNodeContents(valEl);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(rango);
        } catch (e) { /* si tampoco se puede, el código igual está a la vista */ }
      }
    });
  }

});