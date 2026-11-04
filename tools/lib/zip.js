// Lector + escritor ZIP minimo (sin dependencias) para trabajar con el
// .xlsx directo, siempre en frio: se desempaqueta el archivo real que haya
// en ese momento (nunca una copia vieja en cache), se modifica, se vuelve a
// empaquetar. Asi el pipeline nunca queda desincronizado si Fabian edito el
// Excel a mano en Excel/LibreOffice entre una corrida y la siguiente.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const TABLA = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();
function crc32(buf) {
  let c = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ TABLA[(c ^ buf[i]) & 0xFF];
  return (c ^ (-1)) >>> 0;
}

// ---------- escribir ----------
// entradas: [{ nombre, datos:Buffer }]
function crearZip(entradas) {
  const locales = [];
  const centrales = [];
  let offset = 0;

  for (const e of entradas) {
    const nombre = Buffer.from(e.nombre, 'utf8');
    const crudo = e.datos;
    const comp = zlib.deflateRawSync(crudo, { level: 9 });
    const usarDeflate = comp.length < crudo.length;
    const datos = usarDeflate ? comp : crudo;
    const metodo = usarDeflate ? 8 : 0;
    const crc = crc32(crudo);

    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0);
    lh.writeUInt16LE(20, 4);
    lh.writeUInt16LE(0x0800, 6);
    lh.writeUInt16LE(metodo, 8);
    lh.writeUInt16LE(0, 10);
    lh.writeUInt16LE(0x21, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(datos.length, 18);
    lh.writeUInt32LE(crudo.length, 22);
    lh.writeUInt16LE(nombre.length, 26);
    lh.writeUInt16LE(0, 28);
    locales.push(lh, nombre, datos);

    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0);
    ch.writeUInt16LE(20, 4);
    ch.writeUInt16LE(20, 6);
    ch.writeUInt16LE(0x0800, 8);
    ch.writeUInt16LE(metodo, 10);
    ch.writeUInt16LE(0, 12);
    ch.writeUInt16LE(0x21, 14);
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(datos.length, 20);
    ch.writeUInt32LE(crudo.length, 24);
    ch.writeUInt16LE(nombre.length, 28);
    ch.writeUInt16LE(0, 30);
    ch.writeUInt16LE(0, 32);
    ch.writeUInt16LE(0, 34);
    ch.writeUInt16LE(0, 36);
    ch.writeUInt32LE(0, 38);
    ch.writeUInt32LE(offset, 42);
    centrales.push(ch, nombre);

    offset += lh.length + nombre.length + datos.length;
  }

  const cd = Buffer.concat(centrales);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entradas.length, 8);
  eocd.writeUInt16LE(entradas.length, 10);
  eocd.writeUInt32LE(cd.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...locales, cd, eocd]);
}

// ---------- leer ----------
function leerZip(buf) {
  // el End Of Central Directory esta al final; se busca desde atras porque
  // puede haber un comentario de largo variable despues
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('no parece un .xlsx (zip) valido');

  const nEntradas = buf.readUInt16LE(eocd + 10);
  let off = buf.readUInt32LE(eocd + 16);

  const entradas = [];
  for (let i = 0; i < nEntradas; i++) {
    if (buf.readUInt32LE(off) !== 0x02014b50) throw new Error('directorio central corrupto');
    const metodo = buf.readUInt16LE(off + 10);
    const compSize = buf.readUInt32LE(off + 20);
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const commentLen = buf.readUInt16LE(off + 32);
    const localOffset = buf.readUInt32LE(off + 42);
    const nombre = buf.toString('utf8', off + 46, off + 46 + nameLen);
    entradas.push({ nombre, metodo, compSize, localOffset });
    off += 46 + nameLen + extraLen + commentLen;
  }

  return entradas.map(e => {
    const lNameLen = buf.readUInt16LE(e.localOffset + 26);
    const lExtraLen = buf.readUInt16LE(e.localOffset + 28);
    const dataStart = e.localOffset + 30 + lNameLen + lExtraLen;
    const raw = buf.subarray(dataStart, dataStart + e.compSize);
    const datos = e.metodo === 8 ? zlib.inflateRawSync(raw) : Buffer.from(raw);
    return { nombre: e.nombre, datos };
  });
}

// Desempaqueta el .xlsx en `destino` (se recrea desde cero cada vez: si una
// corrida anterior dejo archivos de mas, no quedan contaminando esta).
function extraerA(rutaXlsx, destino) {
  fs.rmSync(destino, { recursive: true, force: true });
  fs.mkdirSync(destino, { recursive: true });
  const buf = fs.readFileSync(rutaXlsx);
  for (const { nombre, datos } of leerZip(buf)) {
    const p = path.join(destino, nombre);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, datos);
  }
}

// Reempaqueta `origen` (una carpeta con la misma estructura que un .xlsx
// desempaquetado) hacia `rutaXlsx`. Antes de pisar el archivo, deja una
// copia de respaldo con fecha y hora — asi una corrida que salio mal
// siempre se puede deshacer.
function empaquetarDesde(origen, rutaXlsx) {
  function listar(dir, pre) {
    let out = [];
    for (const n of fs.readdirSync(dir)) {
      const p = path.join(dir, n);
      const rel = pre ? pre + '/' + n : n;
      if (fs.statSync(p).isDirectory()) out = out.concat(listar(p, rel));
      else out.push({ nombre: rel, datos: fs.readFileSync(p) });
    }
    return out;
  }
  let entradas = listar(origen, '');
  entradas.sort((a, b) => (a.nombre === '[Content_Types].xml' ? -1 : b.nombre === '[Content_Types].xml' ? 1 : 0));

  if (fs.existsSync(rutaXlsx)) {
    const marca = new Date().toISOString().replace(/[:.]/g, '-');
    const respaldos = path.join(path.dirname(rutaXlsx), 'tools', 'backups');
    fs.mkdirSync(respaldos, { recursive: true });
    const base = path.basename(rutaXlsx, '.xlsx');
    fs.copyFileSync(rutaXlsx, path.join(respaldos, base + '.' + marca + '.xlsx'));
    // se guardan los ultimos 10 nada mas; no hace falta un historial infinito
    const previos = fs.readdirSync(respaldos)
      .filter(n => n.startsWith(base + '.') && n.endsWith('.xlsx'))
      .sort();
    for (const viejo of previos.slice(0, -10)) fs.unlinkSync(path.join(respaldos, viejo));
  }

  fs.writeFileSync(rutaXlsx, crearZip(entradas));
}

module.exports = { crearZip, leerZip, extraerA, empaquetarDesde, crc32 };
