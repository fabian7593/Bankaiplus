// tools/historial — script de referencia. Las rutas ya se ajustaron para
// correr desde aca (node tools/historial/epocas_subjetivas.js) si hiciera falta re-aplicar esta
// logica, pero no forma parte del sync automatico (node tools/sync.js).

// Fase 2 de la columna "Epoca": fechas que TMDB no cataloga con una keyword
// propia (Dia de la Madre/Padre/Nino, Semana Santa) y que Fabian pidio armar
// con criterio propio en vez de dato objetivo. Se apoya en lo que YA
// tenemos (genero de TMDB, categoria del catalogo, votos como proxy de
// "memorable") y se suma a lo que ya puso epocas_tmdb.js — no lo reemplaza.
const fs = require('fs');
const resuelto = require('../data/resuelto.json');

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
const generos = r => new Set(String((r.tmdb && r.tmdb.generos) || '').split(',').map(x => x.trim()));
const tiene = (r, ...gs) => { const G = generos(r); return gs.some(g => G.has(g)); };

function agregar(r, etiqueta) {
  const actuales = new Set((r.epoca_app || 'Cualquier Momento').split(',').map(x => x.trim()).filter(Boolean));
  actuales.delete('Cualquier Momento');
  actuales.add(etiqueta);
  r.epoca_app = [...actuales].join(', ');
}

const porId = new Map();
resuelto.forEach(r => { if (r.tmdb) porId.set(r.tipo + '/' + r.tmdb.id, r); });
function porIds(tipo, ids) { return ids.map(id => porId.get(tipo + '/' + id)).filter(Boolean); }

// ---------- Dia de la Madre: romanticas para publico adulto/femenino ----------
// Genero Romance, quitando lo infantil/animado/anime (eso tiene su propio
// destino) y el terror (aunque tenga Romance de genero, el tono no calza:
// "Together: Juntos hasta la muerte" es body-horror, no una peli de amor).
let madre = 0;
for (const r of resuelto) {
  if (!r.tmdb || r.tipo !== 'movie') continue;
  if (categoria(r).match(/infantil|anime/i)) continue;
  if (tiene(r, 'Family', 'Animation', 'Horror')) continue;
  if (!tiene(r, 'Romance')) continue;
  if (parseFloat(r.tmdb.calificacion) < 5.5) continue;
  agregar(r, 'Día de la Madre'); madre++;
}

// ---------- Dia del Padre: accion/crimen/guerra + comedias y dramas de
// hombres adultos que Fabian nombro de ejemplo ----------
// Se excluye Horror por completo (esas ya tienen su propio dia: Halloween) y
// Romance sin Action/War (365 dias, El abismo secreto son romance con Crime
// o Thriller de trasfondo, no pelis de accion). Tambien se sacan a mano dos
// dramas durisimos que por genero (Drama+Thriller / Drama+War) entraban por
// el filtro pero el tono no es "noche de peliculas con papa": La Habitacion
// (secuestro de una madre con su hijo) y El nino con el pijama de rayas
// (Holocausto desde la mirada de un nino).
const PAPA_EXCLUIR = new Set([264644, 14574, 641]);
let padre = 0;
for (const r of resuelto) {
  if (!r.tmdb || r.tipo !== 'movie') continue;
  if (categoria(r).match(/infantil|anime/i)) continue;
  if (tiene(r, 'Family', 'Animation', 'Fantasy', 'Horror')) continue;
  if (PAPA_EXCLUIR.has(r.tmdb.id)) continue;
  const conAccionOGuerra = tiene(r, 'Action', 'War');
  if (tiene(r, 'Romance') && !conAccionOGuerra) continue;
  const accion = conAccionOGuerra || tiene(r, 'Crime') || tiene(r, 'Thriller');
  if (!accion) continue;
  if (parseFloat(r.tmdb.calificacion) < 7.0) continue;
  agregar(r, 'Día del Padre'); padre++;
}
// Rocky no tiene genero Action en TMDB (solo Drama) y se hubiera quedado
// afuera del filtro de arriba. Estos son los que Fabian nombro directo.
const PAPA_A_MANO = [
  ...porIds('movie', [1366, 1246, 1367, 1371, 1374, 1375]),   // Rocky I-V + Balboa
  ...porIds('movie', [77338]),                                 // Amigos Intocables
  ...porIds('movie', [38365, 109418]),                         // Son Como Niños 1-2
  ...porIds('movie', [18785, 45243, 109439]),                  // ¿Qué Pasó Ayer? 1-3
  ...porIds('movie', [490132]),                                // Green Book (drama adulto)
];
for (const r of PAPA_A_MANO) { agregar(r, 'Día del Padre'); padre++; }

// ---------- Dia del Nino: infantiles verdaderamente memorables ----------
// "Infantiles Peliculas" tiene 104 titulos; no todos son "imperdibles". Se usa
// la cantidad de votos en TMDB como proxy objetivo de que tan conocida es.
// OJO: dos titulos vienen categorizados "Infantiles Peliculas" en el Excel
// original de Fabian que NO son para ninos (Nueve/9 es animacion post-
// apocaliptica para adultos, Five Nights at Freddy's es terror) — se excluyen
// a mano aunque tengan votos altos.
const NINO_EXCLUIR = new Set([12244, 507089]);
let nino = 0;
for (const r of resuelto) {
  if (!r.tmdb || r.tipo !== 'movie') continue;
  if (categoria(r) !== 'Infantiles Peliculas') continue;
  if (NINO_EXCLUIR.has(r.tmdb.id)) continue;
  if ((r.tmdb.votos || 0) < 3300) continue;
  agregar(r, 'Día del Niño'); nino++;
}

// ---------- Semana Santa ----------
// TMDB no tiene keyword propia; el catalogo solo tiene contenido religioso
// explicito para dos titulos (los mismos que ya cayeron en "Pascua" via
// keyword). Se suman a Semana Santa tambien.
let semanaSanta = 0;
for (const r of porIds('movie', [335778, 615])) { agregar(r, 'Semana Santa'); semanaSanta++; }

fs.writeFileSync(__dirname + '/../data/resuelto.json', JSON.stringify(resuelto), 'utf8');
console.log('Día de la Madre: ' + madre);
console.log('Día del Padre:   ' + padre);
console.log('Día del Niño:    ' + nino);
console.log('Semana Santa:    ' + semanaSanta);

const dist = new Map();
resuelto.forEach(r => {
  const v = r.epoca_app || 'Cualquier Momento';
  dist.set(v, (dist.get(v) || 0) + 1);
});
console.log('');
console.log('distribución final de Época:');
[...dist.entries()].sort((a, b) => b[1] - a[1]).forEach(([v, n]) => console.log('  ' + String(n).padStart(4) + '  ' + v));
