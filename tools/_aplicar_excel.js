// ══════════════════════════════════════════════════════════════════
// _aplicar_excel.js — pone resuelto.json al dia con la pestana
// "Catalogo ordenado" de un Excel que Fabian edito A MANO (altas, bajas y
// correcciones de TMDB ID), y regenera catalog-data.js.
//
// Por que no `node tools/sync.js`: el sync reescribe "Catalogo ordenado"
// desde resuelto.json y RENUMERA todos los VTX. Cuando las altas/bajas se
// hicieron a mano en esa pestana (y no en la pestana "Catalogo"), correrlo
// pisaria el trabajo de Fabian y moveria los IDs que ya usa el proyecto de
// marketing. Este script va en la direccion contraria: Excel -> resuelto.
//
//   node tools/_aplicar_excel.js <ruta del xlsx>  [--aplicar]
//
// Sin --aplicar solo reporta lo que haria (no toca nada).
// ══════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');
const zip = require('./lib/zip.js');
const { leerHoja } = require('./lib/xlsx_leer.js');
const T = require('./lib/tmdb.js');
const { generar } = require('./_gen_catalog_data.js');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(__dirname, 'data');
const RESUELTO_PATH = path.join(DATA, 'resuelto.json');
const WORK = path.join(__dirname, '_work_excel');

const XLSX = process.argv[2];
const APLICAR = process.argv.includes('--aplicar');
if (!XLSX || !fs.existsSync(XLSX)) {
  console.error('Falta la ruta del .xlsx (o no existe): ' + XLSX);
  process.exit(1);
}

// ── 1. leer la pestana "Catalogo ordenado" del Excel real ────────────
console.log('1) Leyendo "Catalogo ordenado" de ' + XLSX);
zip.extraerA(XLSX, WORK);
const hoja = leerHoja(WORK, 'Catalogo ordenado');
const C = { id: 0, cat: 1, tipo: 2, es: 3, en: 4, anio: 5, temp: 6, eps: 7, dur: 8, gen: 9,
  calif: 10, clasif: 11, casa: 12, disco: 13, estado: 14, dual: 15, tercero: 16, tmdb: 17,
  url: 18, poster: 19, notas: 20, agregado: 21, redes: 22, coleccion: 23, epoca: 24 };
const txt = (r, i) => String(r[i] == null ? '' : r[i]).trim();

const filas = [];
hoja.slice(1).forEach(r => {
  const titulo = txt(r, C.es) || txt(r, C.en);
  const tmdbId = txt(r, C.tmdb).replace(/\.0$/, '');
  if (!titulo || !tmdbId) return;               // fila vacia / reservada
  const tipo = /serie/i.test(txt(r, C.tipo)) ? 'tv' : 'movie';
  filas.push({ clave: tipo + '/' + tmdbId, tipo, tmdbId: Number(tmdbId), r });
});
console.log('   filas con titulo y TMDB ID: ' + filas.length);

const enExcel = new Map();
filas.forEach(f => { if (!enExcel.has(f.clave)) enExcel.set(f.clave, f); });
if (enExcel.size !== filas.length) {
  console.log('   ojo: ' + (filas.length - enExcel.size) + ' fila(s) repiten un TMDB ID ya presente (se toma la primera)');
  const vistos = new Set();
  filas.forEach(f => { if (vistos.has(f.clave)) console.log('      repetida: ' + txt(f.r, C.id) + ' ' + txt(f.r, C.es) + ' (' + f.clave + ')'); vistos.add(f.clave); });
}

// ── 2. comparar contra resuelto.json ─────────────────────────────────
const resuelto = JSON.parse(fs.readFileSync(RESUELTO_PATH, 'utf8'));
const claveDe = r => (r.tmdb ? r.tipo + '/' + r.tmdb.id : null);

const bajas = resuelto.filter(r => { const k = claveDe(r); return !k || !enExcel.has(k); });
const enResuelto = new Set(resuelto.map(claveDe).filter(Boolean));
const altas = [...enExcel.values()].filter(f => !enResuelto.has(f.clave));

console.log('\n2) Diferencias Excel vs resuelto.json');
console.log('   bajas (estan en resuelto y ya no en el Excel): ' + bajas.length);
bajas.forEach(r => console.log('      - ' + (r.tmdb ? r.tmdb.espanol || r.tmdb.ingles : r.base) + '  [' + claveDe(r) + ']'));
console.log('   altas (estan en el Excel y no en resuelto): ' + altas.length);
altas.forEach(f => console.log('      + ' + txt(f.r, C.id) + ' ' + txt(f.r, C.es) + '  [' + f.clave + ']'));

if (!APLICAR) {
  console.log('\n(simulacion: no se escribio nada. Volve a correr con --aplicar)');
  process.exit(0);
}

// ── 3. aplicar: sacar bajas, resolver altas contra TMDB por ID exacto ─
(async () => {
  const stampDir = path.join(__dirname, 'backups');
  fs.mkdirSync(stampDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  fs.copyFileSync(RESUELTO_PATH, path.join(stampDir, 'resuelto-' + stamp + '.json'));
  fs.copyFileSync(path.join(ROOT, 'catalog-data.js'), path.join(stampDir, 'catalog-data-' + stamp + '.js'));
  console.log('\n3) Respaldo en tools/backups/ (resuelto + catalog-data, ' + stamp + ')');

  const fuera = new Set(bajas.map(r => r));
  const nuevo = resuelto.filter(r => !fuera.has(r));

  console.log('4) Resolviendo las altas contra TMDB (por ID exacto del Excel)...');
  let ok = 0, fallo = [];
  for (const f of altas) {
    const ficha = await T.ficha(f.tmdbId, f.tipo);
    if (!ficha) { fallo.push(f); console.log('   ! TMDB no devolvio ficha para ' + f.clave + ' (' + txt(f.r, C.es) + ')'); continue; }
    const r = f.r;
    nuevo.push({
      base: ficha.espanol || ficha.ingles, nombreArchivo: txt(r, C.es) || txt(r, C.en),
      tipo: f.tipo, anio: ficha.anio, discos: txt(r, C.disco) ? [txt(r, C.disco)] : [],
      casaRuta: '', categorias: [txt(r, C.cat) || (f.tipo === 'tv' ? 'Series' : 'Peliculas')],
      coleccion: '', nArchivos: Number(txt(r, C.eps).replace(/\.0$/, '')) || 0,
      nTemporadas: f.tipo === 'tv' ? (ficha.temporadas || 0) : 0, rutas: [], muestra: [],
      tmdb: ficha, casaFinal: txt(r, C.casa) || 'General', coleccionTmdb: undefined,
      excel: {
        id: txt(r, C.id), cat: txt(r, C.cat), tit: txt(r, C.es), temp: txt(r, C.temp),
        casa: txt(r, C.casa), disco: txt(r, C.disco), estado: txt(r, C.estado),
        dual: txt(r, C.dual), tercero: txt(r, C.tercero), notas: txt(r, C.notas),
        discoNorm: txt(r, C.disco),
      },
      motivo: '', detalle: '',
      override: 'agregado por tools/_aplicar_excel.js desde "Catalogo ordenado" editado a mano',
      agregadoApp: txt(r, C.agregado) || 'No',
      epoca_app: txt(r, C.epoca) || 'Cualquier Momento',
      coleccion_app: txt(r, C.coleccion) || undefined,
    });
    ok++;
  }
  console.log('   altas resueltas: ' + ok + (fallo.length ? ' | sin ficha: ' + fallo.length : ''));

  fs.writeFileSync(RESUELTO_PATH, JSON.stringify(nuevo), 'utf8');
  console.log('5) resuelto.json: ' + resuelto.length + ' -> ' + nuevo.length + ' fichas');

  const entradas = generar(nuevo, path.join(ROOT, 'catalog-data.js'));
  console.log('6) catalog-data.js regenerado: ' + entradas.length + ' titulos ('
    + entradas.filter(e => e.type === 'tv').length + ' series, '
    + entradas.filter(e => e.type === 'movie').length + ' peliculas)');
})();
