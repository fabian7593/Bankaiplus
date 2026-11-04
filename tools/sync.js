// ══════════════════════════════════════════════════════════════════
// SYNC - un solo comando: `node tools/sync.js`
//
// Toma lo que Fabian haya escrito de nuevo en la pestana "Catalogo" del
// VORTEX_Catalogo_Master.xlsx real (titulos con ID_Anterior que todavia no
// existen en "Catalogo ordenado"), los resuelve contra TMDB, y actualiza:
//   - Catalogo ordenado (con Coleccion y Epoca, mismos estandares de siempre)
//   - Catalogo (le pone el ID nuevo en la columna A, columna ID_Anterior)
//   - catalog-data.js (el archivo que usa la pagina web)
//
// El archivo real SIEMPRE se desempaqueta de cero (nunca una copia vieja en
// cache), asi que si Fabian edito el Excel a mano en Excel/LibreOffice, este
// script parte de esa version. Antes de sobrescribirlo se deja un respaldo
// con fecha y hora en tools/backups/.
//
// Ver CLAUDE.md en la raiz del proyecto para el detalle de las reglas.
// ══════════════════════════════════════════════════════════════════
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const XLSX = path.join(ROOT, 'VORTEX_Catalogo_Master.xlsx');
const WORK = path.join(__dirname, '_work');
const DATA = path.join(__dirname, 'data');

const zip = require('./lib/zip.js');
const { leerHoja } = require('./lib/xlsx_leer.js');
const T = require('./lib/tmdb.js');
const S = require('./lib/similitud.js');
const { titleCase, elegirTitulo, alias } = require('./lib/titulos.js');

const RESUELTO_PATH = path.join(DATA, 'resuelto.json');
const FUZZY_PATH = path.join(DATA, 'mapa_ids_fuzzy.json');
const NOTAS = require(path.join(DATA, 'notas.js'));

const resuelto = JSON.parse(fs.readFileSync(RESUELTO_PATH, 'utf8'));
const fuzzy = fs.existsSync(FUZZY_PATH) ? JSON.parse(fs.readFileSync(FUZZY_PATH, 'utf8')) : {};

function guardarResuelto() { fs.writeFileSync(RESUELTO_PATH, JSON.stringify(resuelto), 'utf8'); }
function guardarFuzzy() { fs.writeFileSync(FUZZY_PATH, JSON.stringify(fuzzy, null, 1), 'utf8'); }

// ══════════════════════════════════════════════════════════════════
// PASO 1 - desempaquetar el xlsx real y leer "Catalogo"
// ══════════════════════════════════════════════════════════════════
console.log('1) Desempaquetando el Excel actual...');
zip.extraerA(XLSX, WORK);

const catalogoViejo = leerHoja(WORK, 'Catalogo');
const yaResueltos = new Set(resuelto.filter(r => r.excel && r.excel.id).map(r => r.excel.id));
Object.keys(fuzzy).forEach(id => yaResueltos.add(id));

const nuevas = [];
catalogoViejo.slice(1).forEach((r) => {
  const idAnterior = String(r[10] || '').trim();
  const titulo = String(r[2] || '').trim();
  if (!idAnterior || !titulo) return;            // fila vacia: nada que hacer
  if (yaResueltos.has(idAnterior)) return;        // ya esta en Catalogo ordenado
  nuevas.push({
    idAnterior, titulo,
    categoria: String(r[1] || '').trim(),
    temporadas: String(r[3] || '').trim(),
    casa: String(r[4] || '').trim(),
    disco: String(r[5] || '').trim().replace(/\.0$/, ''),
    estado: String(r[6] || '').trim(),
    dual: String(r[7] || '').trim(),
    tercero: String(r[8] || '').trim(),
    notas: String(r[9] || '').trim(),
  });
});

console.log('   filas nuevas en Catalogo (con titulo, sin resolver todavia): ' + nuevas.length);
if (nuevas.length === 0) {
  console.log('   No hay nada nuevo. Solo se regeneran Catalogo ordenado y catalog-data.js por si algo cambio a mano.');
}

// ══════════════════════════════════════════════════════════════════
// PASO 2 - resolver cada fila nueva contra TMDB
// ══════════════════════════════════════════════════════════════════
const PRIO = ['Netflix', 'Max', 'HBO Max', 'Disney Plus', 'Amazon Prime Video', 'Star Plus',
  'Paramount Plus', 'Apple TV+', 'Crunchyroll', 'ViX', 'Claro video', 'Pluto TV'];
const casas = (l, cr) => {
  const u = [...new Set((l || []).map(x => x.replace(/\s+(Standard )?with Ads$/i, '')
    .replace(/\s+Amazon Channel$/i, '').replace(/\s+Apple TV Channel$/i, '').trim()).filter(Boolean))];
  const o = u.sort((a, b) => {
    const ia = PRIO.findIndex(p => p.toLowerCase() === a.toLowerCase());
    const ib = PRIO.findIndex(p => p.toLowerCase() === b.toLowerCase());
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  return o.length ? o.slice(0, 3).join(', ') : (cr || 'General');
};

function tipoDe(fila) {
  if (/pelicula/i.test(fila.categoria)) return 'movie';
  return 'tv';
}
function anioDeTitulo(t) {
  const m = t.match(/\((\d{4})\)\s*$/);
  return m ? m[1] : '';
}

const dudas = [];
const agregadas = [];

async function resolverFilasNuevas() {
  for (const fila of nuevas) {
    const candTexto = resuelto
      .map(r => ({ r, nombres: [r.tmdb && r.tmdb.espanol, r.tmdb && r.tmdb.ingles, r.tmdb && r.tmdb.original, r.base].filter(Boolean) }))
      .map(c => ({ c, p: Math.max(0, ...c.nombres.map(n => S.parecido(fila.titulo, n))) }))
      .sort((a, b) => b.p - a.p)[0];
    if (candTexto && candTexto.p >= 0.93) {
      fuzzy[fila.idAnterior] = candTexto.c.r.tipo + '/' + candTexto.c.r.tmdb.id;
      console.log('   = "' + fila.titulo + '" ya estaba en el catalogo como "' +
        (candTexto.c.r.tmdb.espanol || candTexto.c.r.tmdb.ingles) + '" - solo se enlaza');
      continue;
    }

    const tipo = tipoDe(fila);
    const anio = anioDeTitulo(fila.titulo);
    const idioma = T.idiomaDe(fila.categoria, '');
    const { best } = await T.buscar(fila.titulo, tipo, anio, idioma);

    if (!best) { dudas.push({ ...fila, razon: 'TMDB no devolvio ningun resultado' }); continue; }
    const confiable = best.exacto || best.sim >= 0.9;
    if (!confiable) {
      dudas.push({ ...fila, razon: 'match debil (parecido ' + best.sim.toFixed(2) + '): ' + (best.c.title || best.c.name) + ' (' + ((best.c.release_date || best.c.first_air_date || '').slice(0, 4)) + ')' });
      continue;
    }

    const f = await T.ficha(best.c.id, tipo);
    if (!f) { dudas.push({ ...fila, razon: 'TMDB.ficha() fallo para id ' + best.c.id }); continue; }

    let coleccionTmdb;
    if (tipo === 'movie') {
      const d = await T.api('https://api.themoviedb.org/3/movie/' + best.c.id + '?language=es-MX');
      if (d && d.belongs_to_collection) coleccionTmdb = { id: d.belongs_to_collection.id, nombre: d.belongs_to_collection.name };
    }

    const el = elegirTitulo({ espanol: f.espanol, ingles: f.ingles, original: f.original, archivo: fila.titulo, idioma: f.idioma });

    resuelto.push({
      base: el.titulo, nombreArchivo: fila.titulo, tipo,
      anio: f.anio, discos: fila.disco ? [fila.disco] : [], casaRuta: fila.casa,
      categorias: [fila.categoria || (tipo === 'tv' ? 'Series' : 'Peliculas')],
      coleccion: '', nArchivos: 0, nTemporadas: tipo === 'tv' ? (f.temporadas || 0) : 0,
      rutas: [], muestra: [],
      tmdb: f, casaFinal: casas(f.casas, fila.casa), coleccionTmdb,
      excel: {
        id: fila.idAnterior, cat: fila.categoria, tit: fila.titulo, temp: fila.temporadas,
        casa: fila.casa, disco: fila.disco, estado: fila.estado, dual: fila.dual,
        tercero: fila.tercero, notas: fila.notas, discoNorm: fila.disco,
      },
      motivo: '', detalle: '',
      override: 'agregado por tools/sync.js desde una fila nueva de Catalogo',
      agregadoApp: 'No',
    });
    agregadas.push(fila.titulo + '  ->  ' + (f.espanol || f.ingles) + ' (' + f.anio + ')');
    console.log('   + "' + fila.titulo + '"  ->  ' + (f.espanol || f.ingles) + ' (' + f.anio + ')');
  }
}

// ══════════════════════════════════════════════════════════════════
// PASO 3 - colecciones y epoca SOLO para lo nuevo
// ══════════════════════════════════════════════════════════════════
const KEYWORD_A_EPOCA = new Map([
  ['christmas', 'Navidad'], ['christmas tree', 'Navidad'], ['christmas eve', 'Navidad'],
  ['christmas decorations', 'Navidad'], ['christmas spirit', 'Navidad'], ['first christmas', 'Navidad'],
  ['christmas bonus', 'Navidad'], ['santa claus', 'Navidad'], ['christmas special', 'Navidad'],
  ['christmas movie', 'Navidad'], ['krampus', 'Navidad'],
  ['halloween', 'Halloween'], ['halloween night', 'Halloween'], ['halloween special', 'Halloween'],
  ['halloween party', 'Halloween'], ['halloween costume', 'Halloween'],
  ['halloween atraction', 'Halloween'], ['halloween attraction', 'Halloween'],
  ['day of the dead', 'Día de Muertos'],
  ['thanksgiving', 'Acción de Gracias'], ['thanksgiving prayer', 'Acción de Gracias'],
  ['thanksgiving special', 'Acción de Gracias'], ['thanksgiving dinner', 'Acción de Gracias'],
  ["valentine's day", 'San Valentín'], ["happy valentine's day", 'San Valentín'],
  ["new year's day", 'Año Nuevo'], ['happy new year', 'Año Nuevo'], ['new year', 'Año Nuevo'],
  ["new year's eve", 'Año Nuevo'],
  ['easter', 'Pascua'], ['easter bunny', 'Pascua'], ['easter eggs', 'Pascua'],
  ['easter egg hunt', 'Pascua'], ['easter rabbit', 'Pascua'],
  ["mother's day", 'Día de la Madre'], ["father's day", 'Día del Padre'],
]);

async function epocaKeywordsNuevas() {
  for (const r of resuelto) {
    if (!r.tmdb || r.epoca_app !== undefined) continue;
    const kind = r.tipo === 'tv' ? 'tv' : 'movie';
    const d = await T.api('https://api.themoviedb.org/3/' + kind + '/' + r.tmdb.id + '/keywords');
    const lista = (d && (d.keywords || d.results)) || [];
    const epocas = new Set();
    for (const k of lista) { const e = KEYWORD_A_EPOCA.get((k.name || '').toLowerCase().trim()); if (e) epocas.add(e); }
    r.epoca_app = epocas.size ? [...epocas].join(', ') : 'Cualquier Momento';
  }
}

const FUSIONAR = [
  { ids: [386410, 425164, 620873], nombre: 'Dragon Ball' },
  { ids: [10, 133830, 1004630], nombre: 'Star Wars' },
  { ids: [10522], nombre: 'Starship Troopers' },
];
const MANUAL_COLECCIONES = [
  ['manual:mha', 'My Hero Academia', [['tv', 65930], ['tv', 280110], ['movie', 768744], ['movie', 592350], ['movie', 505262], ['movie', 1159311]]],
  ['tmdb:23616', 'Naruto', [['tv', 46260], ['tv', 31910]]],
  ['manual:baki', 'Baki', [['tv', 80623], ['tv', 129600], ['tv', 300054], ['tv', 56425], ['movie', 1263421]]],
  ['manual:digimon', 'Digimon', [['tv', 31654], ['tv', 98034], ['tv', 327719], ['tv', 286791], ['tv', 8991], ['tv', 134843], ['tv', 9302]]],
  ['manual:berserk', 'Berserk', [['tv', 35935], ['tv', 66053], ['tv', 211057], ['movie', 113082], ['movie', 118412], ['movie', 144288]]],
  ['manual:blueexorcist', 'Blue Exorcist', [['tv', 38464], ['movie', 201223]]],
  ['manual:spyxfamily', 'Spy x Family', [['tv', 120089], ['movie', 1062807]]],
  ['manual:twd', 'The Walking Dead', [['tv', 1402], ['tv', 62286], ['tv', 94305], ['tv', 194583], ['tv', 211684]]],
  ['manual:adventuretime', 'Hora de Aventura', [['tv', 15260], ['tv', 94810], ['tv', 131378]]],
  ['manual:rickmorty', 'Rick y Morty', [['tv', 60625], ['tv', 202282]]],
  ['manual:peakyblinders', 'Peaky Blinders', [['tv', 60574], ['movie', 875828]]],
  ['manual:devilmaycry', 'Devil May Cry', [['tv', 12577], ['tv', 235930]]],
  ['manual:junjiito', 'Junji Ito', [['tv', 75775], ['tv', 203704]]],
  ['manual:sao', 'Sword Art Online', [['tv', 45782], ['tv', 78204]]],
  ['manual:penguins', 'Los Pingüinos de Madagascar', [['tv', 7869], ['movie', 270946]]],
  ['tmdb:10194', 'Toy Story', [['movie', 213121], ['movie', 256835], ['movie', 82424], ['movie', 130925]]],
  ['tmdb:109079', 'Los Caballeros del Zodiaco', [['tv', 78122], ['tv', 61389], ['tv', 62428], ['tv', 67199]]],
  ['tmdb:328', 'Jurassic Park', [['tv', 93741], ['tv', 237512]]],
  ['tmdb:256322', 'La Purga', [['tv', 80213]]],
  ['tmdb:1529614', 'Jujutsu Kaisen', [['tv', 95479]]],
  ['tmdb:925155', 'Demon Slayer: Kimetsu no Yaiba', [['tv', 85937]]],
  ['tmdb:508783', 'Escalofríos', [['tv', 157004], ['tv', 5835]]],
];
const SUFIJO = /\s*[-–]?\s*(colecci[oó]n(\s+completa)?|collection|saga)\s*$/i;
function limpiarNombreColeccion(nombre) {
  let s = String(nombre || '').replace(SUFIJO, '').replace(/\s{2,}/g, ' ').trim();
  if (/[぀-ヿ一-鿿가-힯]/.test(s)) return '';
  return s;
}
const YA_CURADO = new Set(['Star Wars', 'Dragon Ball', 'Toy Story', 'Los Caballeros del Zodiaco',
  'Jurassic Park', 'La Purga', 'Jujutsu Kaisen', 'Demon Slayer: Kimetsu no Yaiba', 'Escalofríos',
  'My Hero Academia', 'Naruto', 'Baki', 'Digimon', 'Berserk', 'Blue Exorcist', 'Spy x Family',
  'The Walking Dead', 'Hora de Aventura', 'Rick y Morty', 'Peaky Blinders', 'Devil May Cry',
  'Junji Ito', 'Sword Art Online', 'Los Pingüinos de Madagascar', 'Starship Troopers']);

function recalcularColecciones() {
  const grupos = new Map();
  function grupo(key, nombre) { if (!grupos.has(key)) grupos.set(key, { nombre, miembros: new Set() }); return grupos.get(key); }
  resuelto.forEach(r => { if (r.coleccionTmdb) grupo('tmdb:' + r.coleccionTmdb.id, r.coleccionTmdb.nombre).miembros.add(r); });
  for (const { ids, nombre } of FUSIONAR) {
    const claves = ids.map(id => 'tmdb:' + id).filter(k => grupos.has(k));
    if (!claves.length) continue;
    const destino = grupo(claves[0], nombre); destino.nombre = nombre;
    for (const k of claves.slice(1)) { const otro = grupos.get(k); otro.miembros.forEach(m => destino.miembros.add(m)); grupos.delete(k); }
  }
  function porId(tipo, id) { return resuelto.find(r => r.tipo === tipo && r.tmdb && r.tmdb.id === id); }
  for (const [clave, nombre, pares] of MANUAL_COLECCIONES) {
    const g = grupo(clave, nombre); g.nombre = nombre;
    for (const [tipo, id] of pares) { const r = porId(tipo, id); if (r) g.miembros.add(r); }
  }
  resuelto.forEach(r => { delete r.coleccion_app; });
  for (const g of grupos.values()) {
    if (g.miembros.size < 2) continue;
    let nombre = limpiarNombreColeccion(g.nombre);
    if (!nombre) continue;
    if (!YA_CURADO.has(nombre)) nombre = titleCase(nombre);
    for (const r of g.miembros) r.coleccion_app = nombre;
  }
}

// ══════════════════════════════════════════════════════════════════
// PASO 4 - armar las filas de "Catalogo ordenado"
// ══════════════════════════════════════════════════════════════════
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

function armarFilas() {
  const filas = resuelto.map(r => {
    const t = r.tmdb;
    const idViejo = r.excel ? r.excel.id : '';
    return {
      categoria: categoria(r), tipo: r.tipo === 'tv' ? 'Serie' : 'Película',
      espanol: titleCase((t && (t.espanol || t.original || t.ingles)) || ''),
      ingles: titleCase((t && t.ingles) || ''),
      anio: (t && t.anio) || r.anio || '', temporadas: temporadas(r),
      episodios: r.tipo === 'tv' ? (r.nArchivos || '') : '',
      duracion: (t && t.duracion) || '', generos: (t && t.generos) || '',
      calificacion: (t && t.calificacion) || '', clasificacion: (t && t.clasificacion) || '',
      casa: r.casaFinal || r.casaRuta || 'General', disco: r.discos.join(', '),
      estado: (r.excel && r.excel.estado) || '', dual: (r.excel && r.excel.dual) || '',
      tercero: (r.excel && r.excel.tercero) || '', tmdbId: t ? t.id : '',
      tmdbUrl: t ? 'https://www.themoviedb.org/' + (r.tipo === 'tv' ? 'tv' : 'movie') + '/' + t.id : '',
      poster: (t && t.poster) || '',
      notas: (idViejo && NOTAS[idViejo]) || (t && NOTAS._porTmdb[t.id]) || (r.excel && r.excel.notas) || '',
      agregado: r.agregadoApp || 'No', redes: r.redesApp || 'No', coleccion: r.coleccion_app || '',
      epoca: r.epoca_app || 'Cualquier Momento',
      _idViejo: idViejo, _cat: categoria(r),
    };
  });
  filas.sort((a, b) => {
    const ia = CAT_ORDEN.indexOf(a._cat), ib = CAT_ORDEN.indexOf(b._cat);
    const ca = ia < 0 ? 99 : ia, cb = ib < 0 ? 99 : ib;
    if (ca !== cb) return ca - cb;
    if (a._cat !== b._cat) return a._cat.localeCompare(b._cat, 'es');
    return (a.espanol || a.ingles).localeCompare(b.espanol || b.ingles, 'es');
  });
  filas.forEach((f, i) => { f.id = 'VTX-' + String(i + 1).padStart(4, '0'); delete f._cat; });
  const mapa = {};
  for (const f of filas) if (f._idViejo) mapa[f._idViejo] = f.id;
  filas.forEach(f => delete f._idViejo);
  return { filas, mapa };
}

// ══════════════════════════════════════════════════════════════════
// PASO 5 - escribir sheet3 (Catalogo ordenado), sheet2 (Catalogo, IDs) y
// repaquetar el xlsx
// ══════════════════════════════════════════════════════════════════
// Los XML no aceptan ciertos caracteres de control (0x00-0x08, 0x0B, 0x0C,
// 0x0E-0x1F); se filtran por codigo numerico para no depender de escribir un
// escape \u que se pueda malinterpretar al guardar el archivo.
function limpiarControl(s) {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c <= 8 || c === 11 || c === 12 || (c >= 14 && c <= 31)) continue;
    out += s[i];
  }
  return out;
}
const esc = s => limpiarControl(String(s == null ? '' : s))
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const COLS = [
  ['ID', 11], ['Categoria', 21], ['Tipo', 10], ['Titulo Español (LATAM)', 36], ['Titulo Inglés', 34],
  ['Año', 8], ['Temporadas', 13], ['Episodios', 11], ['Duración (min)', 14], ['Géneros', 30],
  ['Calificación', 13], ['Clasificación', 13], ['Casa', 26], ['Disco Duro', 12], ['Estado', 13],
  ['Audio Dual', 11], ['Tercer Audio', 16], ['TMDB ID', 11], ['TMDB URL', 42], ['Póster', 42],
  ['Notas', 60], ['Agregado a la App', 18], ['Añadido a Redes Sociales', 24], ['Colección', 30], ['Época', 22],
];
const LETRA = n => { let s = ''; n++; while (n > 0) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = (n - r - 1) / 26; } return s; };
const ULT = LETRA(COLS.length - 1);
const NUM = new Set([5, 7, 8, 10, 17]);
const orden = ['id', 'categoria', 'tipo', 'espanol', 'ingles', 'anio', 'temporadas', 'episodios',
  'duracion', 'generos', 'calificacion', 'clasificacion', 'casa', 'disco', 'estado', 'dual', 'tercero',
  'tmdbId', 'tmdbUrl', 'poster', 'notas', 'agregado', 'redes', 'coleccion', 'epoca'];

function celda(ref, valor, estilo, numerico) {
  if (valor === '' || valor == null) return '<c r="' + ref + '" s="' + estilo + '"/>';
  if (numerico && !isNaN(Number(valor))) return '<c r="' + ref + '" s="' + estilo + '"><v>' + Number(valor) + '</v></c>';
  return '<c r="' + ref + '" s="' + estilo + '" t="inlineStr"><is><t xml:space="preserve">' + esc(valor) + '</t></is></c>';
}

function escribirCatalogoOrdenado(filas) {
  const L = [];
  L.push('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
  L.push('<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">');
  L.push('<sheetPr><pageSetUpPr/></sheetPr>');
  L.push('<sheetViews><sheetView showGridLines="0" tabSelected="0" workbookViewId="0"><pane xSplit="4" ySplit="1" topLeftCell="E2" activePane="bottomRight" state="frozen"/><selection pane="bottomRight" activeCell="E2" sqref="E2"/></sheetView></sheetViews>');
  L.push('<sheetFormatPr customHeight="1" defaultColWidth="14.43" defaultRowHeight="15.0"/>');
  L.push('<cols>' + COLS.map((c, i) => '<col customWidth="1" min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + c[1] + '"/>').join('') + '</cols>');
  L.push('<sheetData>');
  L.push('<row r="1" ht="30.0" customHeight="1">' + COLS.map((c, i) => celda(LETRA(i) + '1', c[0], 1, false)).join('') + '</row>');
  filas.forEach((f, n) => {
    const r = n + 2;
    L.push('<row r="' + r + '">' + orden.map((k, i) => celda(LETRA(i) + r, f[k], 6, NUM.has(i))).join('') + '</row>');
  });
  L.push('</sheetData>');
  const ultFila = filas.length + 1;
  L.push('<autoFilter ref="A1:' + ULT + ultFila + '"/>');
  L.push('<dataValidations>');
  L.push('<dataValidation type="list" allowBlank="1" sqref="B2:B' + ultFila + '"><formula1>&quot;Peliculas,Peliculas Colecciones,Series,Anime,Anime Peliculas,Infantiles Series,Infantiles Peliculas,Documentales,Doramas,Animados,SHOW&quot;</formula1></dataValidation>');
  L.push('<dataValidation type="list" allowBlank="1" sqref="C2:C' + ultFila + '"><formula1>&quot;Serie,Película&quot;</formula1></dataValidation>');
  L.push('<dataValidation type="list" allowBlank="1" sqref="O2:O' + ultFila + '"><formula1>&quot;Completo,Incompleto,Por Mejorar,N/A&quot;</formula1></dataValidation>');
  L.push('<dataValidation type="list" allowBlank="1" sqref="P2:P' + ultFila + '"><formula1>&quot;Si,No,N/A&quot;</formula1></dataValidation>');
  L.push('<dataValidation type="list" allowBlank="1" sqref="V2:V' + ultFila + '"><formula1>&quot;Sí,No&quot;</formula1></dataValidation>');
  L.push('<dataValidation type="list" allowBlank="1" sqref="W2:W' + ultFila + '"><formula1>&quot;Sí,No&quot;</formula1></dataValidation>');
  L.push('</dataValidations>');
  L.push('<printOptions/><pageMargins bottom="1.0" footer="0.0" header="0.0" left="0.75" right="0.75" top="1.0"/>');
  L.push('<pageSetup paperSize="9" orientation="landscape"/>');
  L.push('<drawing r:id="rId1"/>');
  L.push('</worksheet>');
  fs.writeFileSync(path.join(WORK, 'xl', 'worksheets', 'sheet3.xml'), L.join(''), 'utf8');
}

function enlazarCatalogoViejo(mapa, filasNuevas) {
  const P = path.join(WORK, 'xl', 'worksheets', 'sheet2.xml');
  let xml = fs.readFileSync(P, 'utf8');
  const filasHoja = leerHoja(WORK, 'Catalogo');
  const conK = String(filasHoja[0][10] || '').trim() === 'ID_Anterior';
  const idPorFila = new Map();
  filasHoja.forEach((r, i) => { if (i === 0) return; const original = conK ? r[10] : r[0]; if (original) idPorFila.set(i + 1, String(original).trim()); });

  const porTmdb = new Map();
  filasNuevas.forEach(f => {
    if (!f.tmdbId) return;
    porTmdb.set((f.tipo === 'Serie' ? 'tv' : 'movie') + '/' + f.tmdbId, f.id);
  });

  let cambiadas = 0, sinVinculo = 0;
  xml = xml.replace(/<row([^>]*)>([\s\S]*?)<\/row>/g, (todo, attrs, cuerpo) => {
    const nfila = Number((attrs.match(/r="(\d+)"/) || [])[1]);
    if (!nfila) return todo;
    if (nfila === 1) {
      if (/r="K1"/.test(cuerpo)) return todo;
      return '<row' + attrs + '>' + cuerpo + '<c r="K1" s="1" t="inlineStr"><is><t>ID_Anterior</t></is></c></row>';
    }
    const viejo = idPorFila.get(nfila);
    if (!viejo) return todo;
    let nuevoId = mapa[viejo];
    if (!nuevoId && fuzzy[viejo]) nuevoId = porTmdb.get(fuzzy[viejo]);
    const valorA = nuevoId || 'SIN VINCULO';
    if (nuevoId) cambiadas++; else sinVinculo++;
    let cuerpo2 = cuerpo;
    const celdaA = '<c r="A' + nfila + '" s="6" t="inlineStr"><is><t>' + esc(valorA) + '</t></is></c>';
    cuerpo2 = /<c\b[^>]*r="A\d+"[^>]*(\/>|>[\s\S]*?<\/c>)/.test(cuerpo2)
      ? cuerpo2.replace(/<c\b[^>]*r="A\d+"[^>]*(?:\/>|>[\s\S]*?<\/c>)/, celdaA) : celdaA + cuerpo2;
    if (!new RegExp('r="K' + nfila + '"').test(cuerpo2)) cuerpo2 += '<c r="K' + nfila + '" s="6" t="inlineStr"><is><t>' + esc(viejo) + '</t></is></c>';
    return '<row' + attrs + '>' + cuerpo2 + '</row>';
  });
  if (/<cols>/.test(xml) && !/min="11" max="11"/.test(xml)) xml = xml.replace('</cols>', '<col customWidth="1" min="11" max="11" width="14.0"/></cols>');
  fs.writeFileSync(P, xml, 'utf8');
  console.log('   Catalogo: ' + cambiadas + ' filas vinculadas, ' + sinVinculo + ' sin equivalente');
}

// ══════════════════════════════════════════════════════════════════
// PASO 6 - catalog-data.js (el que usa la pagina web)
// ══════════════════════════════════════════════════════════════════
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

function generarCatalogData() {
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
  fs.writeFileSync(path.join(ROOT, 'catalog-data.js'), L.join('\n'), 'utf8');
  return entradas;
}

// ══════════════════════════════════════════════════════════════════
// EJECUCION
// ══════════════════════════════════════════════════════════════════
(async () => {
  console.log('2) Resolviendo filas nuevas contra TMDB...');
  await resolverFilasNuevas();
  guardarResuelto();
  guardarFuzzy();

  console.log('3) Buscando keywords de epoca para lo nuevo...');
  await epocaKeywordsNuevas();
  console.log('   recalculando colecciones...');
  recalcularColecciones();
  guardarResuelto();

  console.log('4) Armando Catalogo ordenado...');
  const { filas, mapa } = armarFilas();

  console.log('5) Escribiendo sheet3 (Catalogo ordenado) y sheet2 (Catalogo)...');
  escribirCatalogoOrdenado(filas);
  enlazarCatalogoViejo(mapa, filas);

  console.log('6) Repaquetando el .xlsx (con respaldo automatico)...');
  zip.empaquetarDesde(WORK, XLSX);

  console.log('7) Regenerando catalog-data.js...');
  const entradas = generarCatalogData();

  fs.rmSync(WORK, { recursive: true, force: true });

  console.log('');
  console.log('===========================================');
  console.log('LISTO');
  console.log('  Catalogo ordenado: ' + filas.length + ' filas');
  console.log('  catalog-data.js:   ' + entradas.length + ' entradas');
  console.log('  agregadas automaticamente: ' + agregadas.length);
  agregadas.forEach(a => console.log('    + ' + a));
  console.log('  necesitan revision manual: ' + dudas.length);
  dudas.forEach(d => console.log('    ? "' + d.titulo + '" - ' + d.razon));
  console.log('===========================================');
  if (dudas.length) {
    fs.writeFileSync(path.join(__dirname, 'dudas_ultima_corrida.txt'),
      dudas.map(d => d.titulo + '  (' + d.idAnterior + ')  - ' + d.razon).join('\n'), 'utf8');
    console.log('Detalle guardado en tools/dudas_ultima_corrida.txt');
  }
})();
