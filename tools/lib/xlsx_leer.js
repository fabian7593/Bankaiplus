// Lector de .xlsx sin dependencias.
// Ojo: Excel/Sheets escriben las celdas vacias auto-cerradas (<c r="D2" s="9"/>).
// Un regex que exija </c> se come las celdas siguientes y corre todos los valores.
const fs = require('fs');
const path = require('path');

const unesc = s => String(s)
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&amp;/g, '&');

const colNum = ref => {
  const L = ref.match(/^[A-Z]+/)[0];
  let n = 0;
  for (const c of L) n = n * 26 + (c.charCodeAt(0) - 64);
  return n - 1;
};

function hojas(X) {
  const wb = fs.readFileSync(path.join(X, 'xl', 'workbook.xml'), 'utf8');
  const rels = fs.readFileSync(path.join(X, 'xl', '_rels', 'workbook.xml.rels'), 'utf8');
  const rel = {};
  for (const m of rels.matchAll(/<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g))
    rel[m[1]] = m[2].replace(/^\/?xl\//, '');
  const out = [];
  for (const m of wb.matchAll(/<sheet[^>]*name="([^"]*)"[^>]*r:id="([^"]*)"/g))
    out.push({ nombre: unesc(m[1]), file: rel[m[2]] });
  return out;
}

function shared(X) {
  const p = path.join(X, 'xl', 'sharedStrings.xml');
  if (!fs.existsSync(p)) return [];
  const ss = fs.readFileSync(p, 'utf8');
  const out = [];
  for (const si of ss.split('<si>').slice(1)) {
    const cuerpo = si.split('</si>')[0];
    let txt = '';
    for (const t of cuerpo.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)) txt += t[1];
    out.push(unesc(txt));
  }
  return out;
}

function leerHoja(X, nombreHoja) {
  const hs = hojas(X);
  const h = hs.find(x => x.nombre.toLowerCase().trim() === nombreHoja.toLowerCase().trim());
  if (!h) throw new Error('no existe la hoja "' + nombreHoja + '". Hay: ' + hs.map(x => x.nombre).join(', '));
  const SS = shared(X);
  const xml = fs.readFileSync(path.join(X, 'xl', h.file), 'utf8');

  const filas = new Map();
  for (const rm of xml.matchAll(/<row([^>]*)>([\s\S]*?)<\/row>/g)) {
    const nfila = Number((rm[1].match(/r="(\d+)"/) || [])[1]);
    if (!nfila) continue;
    const celdas = [];
    let max = -1;
    // acepta <c .../>  y  <c ...>...</c>
    for (const cm of rm[2].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const attrs = cm[1] || '', cuerpo = cm[2] || '';
      const ref = (attrs.match(/r="([A-Z]+\d+)"/) || [])[1];
      if (!ref) continue;
      const i = colNum(ref);
      const t = (attrs.match(/\bt="([^"]+)"/) || [])[1];
      let v = '';
      if (t === 'inlineStr') {
        for (const x of cuerpo.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)) v += x[1];
        v = unesc(v);
      } else {
        const vm = cuerpo.match(/<v>([\s\S]*?)<\/v>/);
        if (vm) v = (t === 's') ? (SS[Number(vm[1])] ?? '') : unesc(vm[1]);
      }
      celdas[i] = v;
      if (i > max) max = i;
    }
    for (let i = 0; i <= max; i++) if (celdas[i] === undefined) celdas[i] = '';
    filas.set(nfila, celdas);
  }
  const orden = [...filas.keys()].sort((a, b) => a - b);
  return orden.map(n => filas.get(n));
}

module.exports = { leerHoja, hojas, unesc };

if (require.main === module) {
  const X = process.argv[2], hoja = process.argv[3], out = process.argv[4];
  const filas = leerHoja(X, hoja);
  fs.writeFileSync(out, JSON.stringify(filas), 'utf8');
  console.log('filas: ' + filas.length);
  console.log('encabezado: ' + JSON.stringify(filas[0]));
  console.log('fila 2:     ' + JSON.stringify(filas[1]));
  console.log('fila 3:     ' + JSON.stringify(filas[2]));
}
