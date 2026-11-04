// Medidas de parecido entre titulos.
const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/&/g, ' and ').replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();

const VACIAS = new Set(['el','la','los','las','un','una','de','del','y','a','en','the','of','and',
  'to','in','on','at','for','a','an','le','les','il','der','die','das','part','parte',
  // Palabras de relleno que aparecen en medio catalogo. Si cuentan como
  // significativas, "Frozen Película 2" empareja con "F1 la película".
  'pelicula','peliculas','movie','movies','film','serie','series','temporada','season',
  'especial','special','edition','edicion','completa','saga','coleccion','collection']);

const big = s => { const o = []; for (let i = 0; i < s.length - 1; i++) o.push(s.slice(i, i + 2)); return o; };
function dice(a, b) {
  a = norm(a); b = norm(b);
  if (!a || !b) return 0;
  if (a === b) return 1;
  const A = big(a), B = big(b);
  if (!A.length || !B.length) return 0;
  const m = new Map();
  for (const g of A) m.set(g, (m.get(g) || 0) + 1);
  let h = 0;
  for (const g of B) { const c = m.get(g); if (c > 0) { h++; m.set(g, c - 1); } }
  return 2 * h / (A.length + B.length);
}

const tokens = s => norm(s).split(' ').filter(t => t.length >= 3 && !VACIAS.has(t));

// Cuanto de "a" (el nombre del archivo, que es la verdad) explica "b".
//
// OJO: dividir entre el MENOR de los dos conjuntos era un error grave. Hacia
// que cualquier ficha de UNA sola palabra contenida en el archivo diera 1.00:
//   "Porque matan a las mujeres" vs "Mujeres"  -> 1/1 = 1.00  (falso perfecto)
// Dividiendo entre las palabras del ARCHIVO el caso queda en 1/3 = 0.33, y
// "Dahmer" vs "DAHMER - Monster: ..." sigue en 1/1 = 1.00, que si es correcto.
function tokenSim(a, b) {
  const A = [...new Set(tokens(a))], B = new Set(tokens(b));
  if (!A.length || !B.size) return 0;
  let h = 0;
  for (const t of A) if (B.has(t)) h++;
  return h / A.length;
}

// distancia de edicion acotada: sirve para typos de 1-2 letras
function editDist(a, b, tope) {
  a = norm(a); b = norm(b);
  if (Math.abs(a.length - b.length) > tope) return tope + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let mejor = i;
    for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c);
      if (cur[j] < mejor) mejor = cur[j];
    }
    if (mejor > tope) return tope + 1;
    prev = cur;
  }
  return prev[b.length];
}

// parecido combinado: el mejor de las tres medidas
function parecido(a, b) {
  const d = dice(a, b);
  const t = tokenSim(a, b);
  const na = norm(a), nb = norm(b);
  let e = 0;
  if (na && nb) {
    const tope = Math.max(1, Math.round(Math.max(na.length, nb.length) * 0.18));
    const dist = editDist(na, nb, tope);
    if (dist <= tope) e = 1 - dist / Math.max(na.length, nb.length);
  }
  // La contencion sola engana: "fable" esta dentro de "five fables" y no es lo
  // mismo. Solo vale si la corta ocupa buena parte de la larga; para los casos
  // tipo "Dahmer" dentro de "DAHMER - Monster..." ya responde tokenSim.
  let contiene = 0;
  if (na.length >= 5 && nb.length >= 5 && (na.includes(nb) || nb.includes(na))) {
    const prop = Math.min(na.length, nb.length) / Math.max(na.length, nb.length);
    if (prop >= 0.5) contiene = 0.85;
  }
  return Math.max(d, t, e, contiene);
}

module.exports = { norm, dice, tokenSim, editDist, parecido, tokens };
