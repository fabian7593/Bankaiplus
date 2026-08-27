/**
 * BANKAI + — BOTÓN "VOLVER ARRIBA"
 * Se muestra después de bajar un poco en la página y hace scroll suave al top.
 * Compartido entre index.html y catalog/index.html.
 */
(function () {
  'use strict';

  const topBtn = document.querySelector('.float-btn-top');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    topBtn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  topBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
