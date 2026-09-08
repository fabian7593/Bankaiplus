/**
 * BANKAI + — NAVEGACIÓN COMPARTIDA
 * ─────────────────────────────────────────────────────────
 * La misma barra de arriba en las tres pantallas: inicio,
 * catálogo y descargar app. Acá vive lo único que necesita JS:
 *   · marcar la nav como "scrolled" al bajar
 *   · abrir y cerrar el menú hamburguesa en móvil
 *
 * Va aparte de main.js a propósito: main.js tiene cosas que solo
 * existen en la landing (slider del TV, cards del catálogo), y el
 * catálogo no puede cargarlo sin pisar su propio grid.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Fondo sólido de la nav al hacer scroll ───────────────
  const nav = document.querySelector('nav');
  if (nav) {
    const marcarScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    marcarScroll(); // por si la página abre ya scrolleada (ej: con #ancla)
    window.addEventListener('scroll', marcarScroll, { passive: true });
  }

  // ── Hamburguesa / menú móvil ─────────────────────────────
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');

  if (!hamburger || !mobileMenu) return;

  function cerrar() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const abierto = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', abierto);
    document.body.style.overflow = abierto ? 'hidden' : '';
    hamburger.setAttribute('aria-expanded', abierto);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', cerrar);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) cerrar();
  });

});
