// Resolucion contra TMDB: busqueda + ficha completa en una sola pasada.
const fs = require('fs');
const ROOT = 'p:/000_PROYECTOS_COMPLETOS/VORTEXTV/TAUROTV';
const TOKEN = fs.readFileSync(ROOT + '/js/catalog-app.js', 'utf8')
  .match(/eyJhbGciOiJIUzI1NiJ9[A-Za-z0-9._-]+/)[0];

const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/&/g, ' and ').replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim();
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

async function api(url) {
  for (let i = 0; i < 6; i++) {
    try {
      const r = await fetch(url, {
        headers: { Authorization: 'Bearer ' + TOKEN, Accept: 'application/json' },
        signal: AbortSignal.timeout(25000),
      });
      if (r.status === 429) { await new Promise(s => setTimeout(s, 1200 * (i + 1))); continue; }
      if (r.status === 404) return null;
      if (!r.ok) { if (r.status >= 500) { await new Promise(s => setTimeout(s, 700 * (i + 1))); continue; } return null; }
      return await r.json();
    } catch { await new Promise(s => setTimeout(s, 800 * (i + 1))); }
  }
  return null;
}

const tit = c => c.title || c.name || '';
const ori = c => c.original_title || c.original_name || '';
const anioDe = c => (c.release_date || c.first_air_date || '').slice(0, 4);

function puntuar(c, ctx) {
  const y = anioDe(c);
  const sim = Math.max(dice(ctx.q, tit(c)), dice(ctx.q, ori(c)));
  let s = sim * 100;
  const exacto = norm(tit(c)) === norm(ctx.q) || norm(ori(c)) === norm(ctx.q);
  if (exacto) s += 60;
  if (ctx.anio && y) {
    const d = Math.abs(+y - +ctx.anio);
    if (d === 0) s += 75; else if (d === 1) s += 25; else s -= 55;
  }
  if (!y) s -= 30;
  if (c.original_language === ctx.lang) s += 10;
  if (ctx.lang === 'en' && (c.original_language === 'en' || (c.origin_country || []).includes('US'))) s += 4;
  s += Math.min(Math.log10((c.vote_count || 0) + 1) * 12, 48);
  s += Math.min(Math.log10((c.popularity || 0) + 1) * 2, 5);
  return { s, sim, exacto };
}

// idioma esperado segun la categoria
function idiomaDe(categoria, ruta) {
  const c = (categoria + ' ' + (ruta || '')).toLowerCase();
  if (/anime/.test(c)) return 'ja';
  if (/dorama/.test(c)) return 'ko';
  return 'en';
}

async function buscar(q, tipo, anio, lang) {
  const kind = tipo === 'tv' ? 'tv' : 'movie';
  const consultas = [q];
  if (q.includes(':')) consultas.push(q.split(':')[0].trim());
  const qsin = q.replace(/\s+\d{1,2}$/, '').trim();          // "Rocky IV" -> "Rocky"
  if (qsin && qsin !== q) consultas.push(qsin);

  // Los nombres de carpeta escriben la "ñ" como "nn" o directamente "n"
  // ("Aranna", "arminno", "ninnos", "nino"). Se prueba la version con ñ.
  const conEnhe = q
    .replace(/nn/g, 'ñ')
    .replace(/\bnino(s?)\b/gi, 'niño$1')
    .replace(/\bnina(s?)\b/gi, 'niña$1')
    .replace(/\banos\b/gi, 'años')
    .replace(/\bsenor(a|es|as)?\b/gi, (m, s) => 'señor' + (s || ''))
    .replace(/\bmanana\b/gi, 'mañana')
    .replace(/\bcompania\b/gi, 'compañía');
  if (conEnhe !== q) consultas.push(conEnhe);

  // si no aparece nada, reintentar recortando la ultima palabra (basura pegada
  // o typo del nombre de la carpeta)
  const pal = q.split(/\s+/);
  if (pal.length >= 3) consultas.push(pal.slice(0, -1).join(' '));
  if (pal.length >= 4) consultas.push(pal.slice(0, -2).join(' '));

  let best = null, bs = -1e9, exactos = [];
  for (let i = 0; i < consultas.length; i++) {
    const cq = consultas[i];
    if (!cq) continue;
    if (i > 0 && best && bs > 60) break;   // ya hay algo decente
    // es-MX: TMDB busca en todos los idiomas igual, pero devuelve el titulo
    // traducido. Asi comparamos contra el titulo en espanol Y contra
    // original_title (que para cine gringo ES el titulo en ingles).
    const r = await api('https://api.themoviedb.org/3/search/' + kind + '?query=' +
      encodeURIComponent(cq) + '&language=es-MX&include_adult=false');
    const lista = (r && r.results) ? r.results.slice(0, 20) : [];
    if (i === 0) exactos = lista.filter(c => norm(tit(c)) === norm(q) || norm(ori(c)) === norm(q));
    for (const c of lista) {
      const p = puntuar(c, { q, anio, lang });
      const s = i === 0 ? p.s : p.s - 30;
      if (s > bs) { bs = s; best = { c, sim: p.sim, exacto: p.exacto }; }
    }
    if (best && bs > 140) break;
  }
  return { best, exactos };
}

async function ficha(id, tipo) {
  const kind = tipo === 'tv' ? 'tv' : 'movie';
  const extra = kind === 'movie' ? 'release_dates' : 'content_ratings';
  const d = await api('https://api.themoviedb.org/3/' + kind + '/' + id +
    '?language=en-US&append_to_response=translations,' + extra + ',watch/providers');
  if (!d) return null;

  // titulo en espanol latino
  let esMX = '', esES = '';
  for (const t of (d.translations && d.translations.translations) || []) {
    if (t.iso_639_1 !== 'es') continue;
    const nom = (t.data && (t.data.title || t.data.name)) || '';
    if (!nom) continue;
    if (t.iso_3166_1 === 'MX') esMX = nom;
    else if (!esES) esES = nom;
  }

  // clasificacion por edad (US)
  let clasif = '';
  if (kind === 'movie') {
    const us = ((d.release_dates && d.release_dates.results) || []).find(r => r.iso_3166_1 === 'US');
    if (us) { const c = (us.release_dates || []).find(x => x.certification); if (c) clasif = c.certification; }
  } else {
    const us = ((d.content_ratings && d.content_ratings.results) || []).find(r => r.iso_3166_1 === 'US');
    if (us) clasif = us.rating || '';
  }

  // donde se puede ver (MX, luego US)
  const wp = d['watch/providers'] && d['watch/providers'].results;
  let casas = [];
  for (const reg of ['MX', 'US']) {
    const r = wp && wp[reg];
    if (!r) continue;
    for (const k of ['flatrate', 'free', 'ads']) for (const p of (r[k] || [])) casas.push(p.provider_name);
    if (casas.length) break;
  }
  casas = [...new Set(casas)];

  return {
    id: d.id, tipo: kind,
    ingles: d.title || d.name || '',
    original: d.original_title || d.original_name || '',
    espanol: esMX || esES || '',
    anio: (d.release_date || d.first_air_date || '').slice(0, 4),
    generos: (d.genres || []).map(g => g.name).join(', '),
    calificacion: d.vote_average ? Math.round(d.vote_average * 10) / 10 : '',
    votos: d.vote_count || 0,
    clasificacion: clasif,
    temporadas: d.number_of_seasons || '',
    episodios: d.number_of_episodes || '',
    duracion: d.runtime || '',
    estadoTMDB: d.status || '',
    poster: d.poster_path ? 'https://image.tmdb.org/t/p/w500' + d.poster_path : '',
    casas,
    idioma: d.original_language || '',
  };
}

module.exports = { api, buscar, ficha, dice, norm, tit, ori, anioDe, idiomaDe };
