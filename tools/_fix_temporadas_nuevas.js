// Las celdas "Temporadas" del Excel vienen numericas (1.0) y se copiaban tal
// cual a resuelto.excel.temp, asi que catalog-data.js mostraba seasons: '1.0'.
// Esto normaliza SOLO las fichas que agrego _aplicar_excel.js (las viejas se
// dejan como estaban para no tocar datos que no vienen de esta corrida).
const fs = require('fs');
const path = require('path');
const { generar } = require('./_gen_catalog_data.js');

const P = path.join(__dirname, 'data', 'resuelto.json');
const resuelto = JSON.parse(fs.readFileSync(P, 'utf8'));
let n = 0;
for (const r of resuelto) {
  if (!/_aplicar_excel\.js/.test(r.override || '')) continue;
  const t = r.excel && r.excel.temp;
  if (typeof t === 'string' && /\.0$/.test(t)) { r.excel.temp = t.replace(/\.0$/, ''); n++; }
  const d = r.excel && r.excel.disco;
  if (typeof d === 'string' && /\.0$/.test(d)) r.excel.disco = r.excel.discoNorm = d.replace(/\.0$/, '');
}
fs.writeFileSync(P, JSON.stringify(resuelto), 'utf8');
const e = generar(resuelto, path.join(__dirname, '..', 'catalog-data.js'));
console.log('temporadas normalizadas: ' + n + ' | catalog-data.js: ' + e.length + ' titulos');
