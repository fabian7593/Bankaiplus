/**
 * BANKAI + — CONTADOR DE CATÁLOGO
 * Calcula "+N" a partir de CATALOG_DATA.length (redondeado a la centena
 * más cercana hacia abajo) y actualiza todos los elementos .js-catalog-count.
 * Así el número crece solo a medida que se agregan títulos a catalog-data.js.
 */
(function () {
  'use strict';
  if (typeof CATALOG_DATA === 'undefined') return;

  const rounded = Math.floor(CATALOG_DATA.length / 100) * 100;
  const label = '+' + rounded;

  document.querySelectorAll('.js-catalog-count').forEach((el) => {
    el.textContent = label;
  });
})();
