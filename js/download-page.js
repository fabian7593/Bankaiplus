/**
 * BANKAI + — PÁGINA DE DESCARGA (/descargar)
 * ─────────────────────────────────────────────────────────
 * Le pone el link real a los dos botones de descarga leyendo
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

});
