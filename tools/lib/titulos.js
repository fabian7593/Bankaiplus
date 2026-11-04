// Decide COMO se muestra cada titulo en la web, y genera los alias de busqueda.
const S = require('./similitud.js');

// Palabras que van en minuscula dentro de un titulo (salvo si son la primera).
// Se incluyen las de espanol y las de ingles, porque hay titulos en los dos.
const MINUSCULA = new Set([
  'a', 'al', 'ante', 'bajo', 'con', 'contra', 'de', 'del', 'desde', 'e', 'el', 'en', 'entre',
  'hacia', 'hasta', 'la', 'las', 'lo', 'los', 'mas', 'más', 'ni', 'o', 'para', 'por', 'que',
  'se', 'segun', 'según', 'si', 'sin', 'sobre', 'su', 'sus', 'tras', 'u', 'un', 'una', 'unas',
  'unos', 'y',
  'an', 'and', 'as', 'at', 'but', 'by', 'for', 'from', 'in', 'into', 'nor', 'of', 'on', 'onto',
  'or', 'over', 'the', 'to', 'up', 'via', 'with',
]);

// Palabras que SIEMPRE van tal cual (siglas, numeros romanos, marcas)
const TALCUAL = /^(?:[IVXLCDM]+|[A-Z0-9][A-Z0-9&.\-]*|\d+[a-zA-Z]*|[A-Z]\.[A-Z.]*)$/;

function mayusculaInicial(p) {
  if (!p) return p;
  // "spider-man" -> "Spider-Man";  "rock'n'roll" -> "Rock'n'Roll"
  return p.replace(/([^\s\-–—/]+)/g, seg => {
    if (!seg) return seg;
    if (TALCUAL.test(seg) && seg.length <= 5 && /[A-Z0-9]/.test(seg)) return seg;
    // La mayuscula va en la primera LETRA, no en el primer caracter: si no,
    // "¿le temes...?" quedaba como "¿le" con la ele en minuscula.
    const i = seg.search(/\p{L}/u);
    if (i < 0) return seg;
    return seg.slice(0, i) + seg.charAt(i).toLocaleUpperCase('es') + seg.slice(i + 1);
  });
}

// Title Case respetando articulos y preposiciones
function titleCase(s) {
  const txt = String(s || '').trim();
  if (!txt) return txt;
  // si ya viene TODO EN MAYUSCULAS, se baja primero para no dejarlo gritando
  const base = (txt === txt.toLocaleUpperCase('es') && /[A-ZÁÉÍÓÚÑ]{4}/.test(txt))
    ? txt.toLocaleLowerCase('es') : txt;

  const partes = base.split(/(\s+|:\s*|\s*[–—]\s*)/);
  let primeraPalabra = true;
  return partes.map(p => {
    if (/^\s+$/.test(p) || /^[:–—]/.test(p.trim()) || p === '') {
      if (/[:–—]/.test(p)) primeraPalabra = true;   // tras dos puntos vuelve a mayuscula
      return p;
    }
    const limpio = p.toLocaleLowerCase('es');
    // "¿le temes...": el signo de apertura no cuenta como palabra, la
    // siguiente sigue siendo la primera y va en mayuscula
    if (/^[¿¡"'(\[«]+$/.test(p.trim())) return p;
    if (!primeraPalabra && MINUSCULA.has(limpio)) return limpio;
    primeraPalabra = false;
    // conserva siglas y nombres estilizados que ya venian en mayuscula
    // (TV, DC, USS, 3D, WALL·E, R.I.P.D.)
    if (/^[A-Z0-9][A-Z0-9&.\-·']{0,7}$/.test(p)) return p;
    return mayusculaInicial(limpio);
  }).join('');
}

const NO_LATINO = /[぀-ヿ一-鿿가-힯Ѐ-ӿ؀-ۿ฀-๿]/;

// Elige el titulo que se muestra.
//   1. Nunca uno en alfabeto no latino.
//   2. Si el NOMBRE DEL ARCHIVO se parece mas al ingles que al espanol, gana el
//      ingles: es como Fabian nombra sus archivos, o sea como lo conoce
//      ("Jeepers Creepers", no "El demonio").
//   3. En cualquier otro caso manda el espanol latino.
function elegirTitulo({ espanol, ingles, original, archivo, idioma }) {
  let es = (espanol || '').trim();
  const en = (ingles || '').trim();
  const or = (original || '').trim();

  // Producciones en espanol sin traduccion es-MX cargada en TMDB: el titulo
  // ORIGINAL ya esta en espanol y es el bueno. Sin esto, "Chespirito: Sin
  // querer queriendo" se mostraba como "Chespirito: Not Really on Purpose".
  if (!es && idioma === 'es' && or && !NO_LATINO.test(or)) es = or;

  const opciones = [es, en, or].filter(x => x && !NO_LATINO.test(x));
  if (!opciones.length) return { titulo: titleCase(en || or || es), motivo: 'sin opcion latina' };

  const esOk = es && !NO_LATINO.test(es);
  const enOk = en && !NO_LATINO.test(en);

  if (esOk && enOk && archivo) {
    const pEs = S.parecido(archivo, es);
    const pEn = S.parecido(archivo, en);
    // Ademas del parecido general, el ingles tiene que compartir MAS palabras
    // con el archivo. Sin esto, "Chespirito" elegia el titulo en ingles solo
    // porque es mas corto, aunque el espanol tambien empieza por "Chespirito".
    const tEs = S.tokenSim(archivo, es);
    const tEn = S.tokenSim(archivo, en);
    if (pEn > pEs + 0.15 && tEn > tEs) {
      return { titulo: titleCase(en), motivo: 'el archivo usa el nombre en ingles' };
    }
  }
  if (esOk) return { titulo: titleCase(es), motivo: 'espanol latino' };
  return { titulo: titleCase(enOk ? en : opciones[0]), motivo: 'sin titulo en espanol' };
}

// Alias para que la busqueda encuentre por cualquiera de los nombres
function alias(titulo, { espanol, ingles, original }) {
  const norm = x => String(x || '').trim();
  const out = [];
  for (const x of [espanol, ingles, original]) {
    const v = norm(x);
    if (!v) continue;
    if (S.norm(v) === S.norm(titulo)) continue;
    if (out.some(y => S.norm(y) === S.norm(v))) continue;
    out.push(v);
  }
  return out;
}

module.exports = { titleCase, elegirTitulo, alias, NO_LATINO };
