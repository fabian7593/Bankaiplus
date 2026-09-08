/**
 * BANKAI + — SCROLL REVEAL
 * ─────────────────────────────────────────────────────────
 * Los elementos con class="reveal" arrancan transparentes (base.css)
 * y aparecen cuando entran en pantalla.
 *
 * Va aparte de main.js porque lo usan varias páginas y main.js
 * tiene cosas que solo existen en la landing.
 */

document.addEventListener('DOMContentLoaded', () => {

  const elementos = document.querySelectorAll('.reveal');
  if (!elementos.length) return;

  // Sin IntersectionObserver (navegador viejo): se muestran todos
  if (!('IntersectionObserver' in window)) {
    elementos.forEach(el => el.classList.add('visible'));
    return;
  }

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observador.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  elementos.forEach(el => observador.observe(el));

});
