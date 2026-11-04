// ══════════════════════════════════════════════════════════════════
// _gen_catalog_data.js — genera catalog-data.js desde resuelto.json.
//
// Es el PASO 6 de tools/sync.js extraido tal cual, para poder regenerar
// SOLO el archivo de la web cuando el Excel se edito a mano y no se puede
// correr el sync completo (el sync reescribe "Catalogo ordenado" y renumera
// todos los VTX, lo que pisaria las ediciones manuales de Fabian).
//
// Verificado: corriendo esto sobre el resuelto.json actual reproduce el
// catalog-data.js actual byte a byte.
// ══════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');
const { titleCase, elegirTitulo, alias } = require('./lib/titulos.js');

const CAT_ORDEN = ['Series', 'Doramas', 'Anime', 'Animados', 'Infantiles Series', 'Documentales',
  'Peliculas', 'Peliculas Colecciones', 'Anime Peliculas', 'Infantiles Peliculas', 'Otros'];

function categoria(r) {
  if (r.excel && r.excel.cat) { const c = r.excel.cat.trim(); return /^dorama$/i.test(c) ? 'Doramas' : c; }
  const s = ((r.categorias[0] || '') + ' ' + (r.rutas[0] || '')).toLowerCase();
  if (/dorama/.test(s)) return 'Doramas';
  if (/anime/.test(s)) return r.tipo === 'tv' ? 'Anime' : 'Anime Peliculas';
  if (/infantil|cartoon|animados/.test(s)) return r.tipo === 'tv' ? 'Infantiles Series' : 'Infantiles Peliculas';
  if (/documental/.test(s)) return 'Documentales';
  if (r.tipo === 'tv') return 'Series';
  return r.coleccion ? 'Peliculas Colecciones' : 'Peliculas';
}
function temporadas(r) {
  if (r.excel && r.excel.temp) return r.excel.temp;
  if (r.tipo !== 'tv') return '';
  const n = r.nTemporadas || (r.tmdb && r.tmdb.temporadas) || 0;
  if (!n) return '1';
  return n === 1 ? '1' : '1 a ' + n;
}

const GENERO = {
  'Action': 'accion', 'Action & Adventure': 'accion', 'Adventure': 'accion', 'War': 'accion',
  'War & Politics': 'accion', 'Western': 'accion', 'Crime': 'accion', 'Comedy': 'comedia',
  'Drama': 'drama', 'History': 'drama', 'Soap': 'drama', 'Music': 'drama',
  'Science Fiction': 'cienciaficcion', 'Sci-Fi & Fantasy': 'cienciaficcion', 'Fantasy': 'cienciaficcion',
  'Horror': 'terror', 'Thriller': 'terror', 'Mystery': 'terror', 'Romance': 'romance',
  'Documentary': 'documental', 'Reality': 'documental',
};
function principal(cat, tipo) {
  const k = (cat || '').toLowerCase();
  if (/anime/.test(k)) return 'anime';
  if (/infantil|animados/.test(k)) return 'infantil';
  return tipo === 'tv' ? 'series' : 'peliculas';
}
function generosDe(txt) {
  const out = [];
  for (const g of String(txt || '').split(',').map(x => x.trim())) { const k = GENERO[g]; if (k && !out.includes(k)) out.push(k); }
  return out.slice(0, 3);
}

function generar(resuelto, destino) {
  let entradas = resuelto.filter(r => r.tmdb).map(r => {
    const t = r.tmdb; const cat = categoria(r);
    const el = elegirTitulo({ espanol: t.espanol, ingles: t.ingles, original: t.original, archivo: r.nombreArchivo || r.base, idioma: t.idioma });
    return {
      title: el.titulo, tmdb: t.id, category: [principal(cat, r.tipo)].concat(generosDe(t.generos)).join(', '),
      type: r.tipo === 'tv' ? 'tv' : 'movie', seasons: r.tipo === 'tv' ? temporadas(r) : null,
      alt: alias(el.titulo, { espanol: t.espanol, ingles: t.ingles, original: t.original }),
      _anio: t.anio, _cat: cat,
    };
  });
  const cuenta = new Map();
  for (const e of entradas) cuenta.set(e.title, (cuenta.get(e.title) || 0) + 1);
  for (const e of entradas) if (cuenta.get(e.title) > 1 && e._anio) e.title = e.title + ' (' + e._anio + ')';
  entradas.sort((a, b) => {
    const ia = CAT_ORDEN.indexOf(a._cat), ib = CAT_ORDEN.indexOf(b._cat);
    const ca = ia < 0 ? 99 : ia, cb = ib < 0 ? 99 : ib;
    if (ca !== cb) return ca - cb;
    if (a._cat !== b._cat) return a._cat.localeCompare(b._cat, 'es');
    return a.title.localeCompare(b.title, 'es');
  });
  const escJs = s => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const L = [];
  L.push('// ' + '='.repeat(70));
  L.push('// CATALOG_DATA - Bankai+');
  L.push('// ' + '='.repeat(70));
  L.push('// GENERADO por tools/sync.js desde VORTEX_Catalogo_Master.xlsx, pestana "Catalogo ordenado".');
  L.push('// No editar a mano: los cambios se hacen en el Excel (pestana Catalogo) y se corre tools/sync.js.');
  L.push('//');
  L.push('// ' + entradas.length + ' titulos - ' + entradas.filter(e => e.type === 'tv').length + ' series - ' + entradas.filter(e => e.type === 'movie').length + ' peliculas');
  L.push('// ' + '='.repeat(70));
  L.push('');
  L.push('const CATALOG_DATA = [');
  for (const e of entradas) {
    let s = "  { title: '" + escJs(e.title) + "', tmdb: " + e.tmdb + ", category: '" + escJs(e.category) + "', type: '" + e.type + "'";
    if (e.seasons) s += ", seasons: '" + escJs(e.seasons) + "'";
    if (e.alt.length) s += ", alt: [" + e.alt.map(a => "'" + escJs(a) + "'").join(', ') + "]";
    s += ' },';
    L.push(s);
  }
  L.push('];');
  L.push('');
  fs.writeFileSync(destino, L.join('\n'), 'utf8');
  return entradas;
}

module.exports = { generar, categoria, temporadas, CAT_ORDEN };

if (require.main === module) {
  const resuelto = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'resuelto.json'), 'utf8'));
  const destino = process.argv[2] || path.join(__dirname, '..', 'catalog-data.js');
  const e = generar(resuelto, destino);
  console.log(destino + ': ' + e.length + ' titulos');
}
