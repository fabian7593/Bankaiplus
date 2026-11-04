// tools/historial — script de referencia. Las rutas ya se ajustaron para
// correr desde aca (node tools/historial/marcar_agregados.js) si hiciera falta re-aplicar esta
// logica, pero no forma parte del sync automatico (node tools/sync.js).

// Marca "Agregado a la App" = Sí para los titulos de la lista de Fabian.
// La lista viene con los nombres que el usa, asi que hay que cruzarla por
// parecido contra el titulo mostrado, los alias, el titulo en ingles y el
// nombre del archivo en el disco.
const fs = require('fs');
const S = require('../lib/similitud.js');
const resuelto = require('../data/resuelto.json');

// Casos que ninguna medida de parecido puede acertar: o el titulo de Fabian y
// el de TMDB no comparten ni una palabra (The Purge -> "La Noche de la
// Expiacion"), o varias entradas de la lista viven en una sola carpeta del
// disco (las tres de Narnia). La clave es el numero de linea de agregados.txt
// y el valor es "tipo/idTMDB", o null si esa peli/serie no esta en el catalogo.
const FIJOS = require('../data/agregados_fijos.json');

const porTmdb = new Map();
resuelto.forEach((r, i) => { if (r.tmdb) porTmdb.set(r.tipo + '/' + r.tmdb.id, i); });

const crudo = fs.readFileSync(__dirname + '/../data/agregados.txt', 'utf8').split(/\r?\n/);
const lista = [];     // van al emparejamiento por parecido
const aMano = [];     // { q, i } resueltos a mano
const noEstan = [];   // en tu lista pero no existen en el catalogo
crudo.forEach((linea, k) => {
  const q = linea.trim();
  if (!q) return;
  const fijo = FIJOS[String(k + 1)];
  if (fijo === undefined) { lista.push(q); return; }
  if (fijo === null) { noEstan.push(q); return; }
  const i = porTmdb.get(fijo);
  if (i === undefined) { console.log('  !! ficha fija no encontrada: ' + fijo + '  (' + q + ')'); lista.push(q); return; }
  aMano.push({ q, i });
});

const cand = resuelto.map((r, i) => ({
  i, r,
  nombres: [r.tmdb && r.tmdb.espanol, r.tmdb && r.tmdb.ingles, r.tmdb && r.tmdb.original,
    r.base, r.nombreArchivo].filter(Boolean),
}));
const tomadasAMano = new Set(aMano.map(x => cand[x.i]));

// indice por token para no comparar todo contra todo
const porToken = new Map();
for (const c of cand) {
  for (const n of c.nombres) {
    for (const t of new Set(S.tokens(n))) {
      if (!porToken.has(t)) porToken.set(t, new Set());
      porToken.get(t).add(c);
    }
  }
}

// adyacencia: para cada titulo de la lista, sus fichas posibles ordenadas
const ady = new Map();
for (const q of lista) {
  const vistos = new Set(); const cands = [];
  for (const t of new Set(S.tokens(q))) {
    for (const c of (porToken.get(t) || [])) { if (!vistos.has(c)) { vistos.add(c); cands.push(c); } }
  }
  const lst = [];
  for (const c of (cands.length ? cands : cand)) {
    if (tomadasAMano.has(c)) continue;
    let p = 0;
    for (const n of c.nombres) p = Math.max(p, S.parecido(q, n));
    if (p >= 0.62) lst.push({ c, p });
  }
  lst.sort((a, b) => b.p - a.p);
  ady.set(q, lst);
}

// Emparejamiento 1-a-1 con caminos aumentantes (Kuhn). El codicioso puro
// dejaba huerfanos titulos con match exacto: "Grappler Baki" (1.00) perdia su
// ficha contra "Baki", que si tenia otra ficha libre a la que moverse.
const duenio = new Map();   // ficha -> titulo de la lista
function ubicar(q, visto) {
  for (const { c } of ady.get(q)) {
    if (visto.has(c)) continue;
    visto.add(c);
    if (!duenio.has(c) || ubicar(duenio.get(c), visto)) { duenio.set(c, q); return true; }
  }
  return false;
}
const orden = [...lista].sort((a, b) => (ady.get(b)[0] ? ady.get(b)[0].p : 0) - (ady.get(a)[0] ? ady.get(a)[0].p : 0));
for (const q of orden) ubicar(q, new Set());

// Kuhn solo maximiza CUANTOS quedan emparejados, no que tan bien. Dejaba
// "Spider-Man: No Way Home" pegado a "El hombre arana 3" mientras su ficha
// exacta la tenia otro. Esta pasada intercambia parejas mientras suba el peso.
const peso = (q, c) => { const e = ady.get(q).find(x => x.c === c); return e ? e.p : -1; };
const deQuien = new Map();
for (const [c, q] of duenio) deQuien.set(q, c);
for (let vuelta = 0; vuelta < 12; vuelta++) {
  let mejoro = false;
  for (const q of lista) {
    const cq = deQuien.get(q);
    const actual = cq ? peso(q, cq) : 0;
    for (const { c, p } of ady.get(q)) {
      if (c === cq) continue;
      const q2 = duenio.get(c);
      if (!q2) {
        if (p > actual) {
          if (cq) duenio.delete(cq);
          duenio.set(c, q); deQuien.set(q, c); mejoro = true; break;
        }
        continue;
      }
      const antes = actual + peso(q2, c);
      const despues = p + (cq ? peso(q2, cq) : -1);
      if (despues > antes + 1e-9) {
        duenio.set(c, q); deQuien.set(q, c);
        if (cq) { duenio.set(cq, q2); deQuien.set(q2, cq); } else { deQuien.delete(q2); }
        mejoro = true; break;
      }
    }
  }
  if (!mejoro) break;
}

const asignado = new Map();
for (const [c, q] of duenio) asignado.set(q, { c, p: peso(q, c) });

for (const c of cand) c.r.agregadoApp = (duenio.has(c) || tomadasAMano.has(c)) ? 'Sí' : 'No';
fs.writeFileSync(__dirname + '/../data/resuelto.json', JSON.stringify(resuelto), 'utf8');

const sinPareja = lista.filter(q => !asignado.has(q));
const marcados = cand.filter(c => c.r.agregadoApp === 'Sí').length;
console.log('titulos en tu lista: ' + (lista.length + aMano.length + noEstan.length));
console.log('  cruzados por parecido: ' + duenio.size);
console.log('  resueltos a mano:      ' + tomadasAMano.size);
console.log('marcados Sí ... ' + marcados);
console.log('marcados No ... ' + (cand.length - marcados));
console.log('');
console.log('=== de tu lista, NO estan en el catalogo (' + (noEstan.length + sinPareja.length) + ') ===');
for (const q of noEstan.concat(sinPareja)) console.log('   ' + q);
console.log('');
console.log('=== emparejamientos mas flojos (revisar) ===');
[...asignado.entries()].sort((a, b) => a[1].p - b[1].p).slice(0, 20)
  .forEach(([q, v]) => console.log('   ' + v.p.toFixed(2) + '  "' + q + '"  ->  ' +
    (v.c.r.tmdb.espanol || v.c.r.tmdb.ingles) + ' (' + v.c.r.tmdb.anio + ')'));

// deja el detalle completo por si hay que auditar
const det = [];
for (const { q, i } of aMano) det.push([q, 'a mano', resuelto[i].tmdb.espanol || resuelto[i].tmdb.ingles].join(' | '));
for (const [q, v] of asignado) det.push([q, v.p.toFixed(2), v.c.r.tmdb.espanol || v.c.r.tmdb.ingles].join(' | '));
fs.writeFileSync(__dirname + '/agregados_detalle.txt', det.sort().join('\n'), 'utf8');
