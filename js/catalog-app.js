/**
 * BANKAI + — CATALOG APP
 * Busca posters en TMDB, renderiza el grid, filtros y búsqueda.
 * Fallback: logo de Bankai + si no encuentra el título.
 *
 * Tres pantallas en una sola página: el catálogo (grid), la ficha de un
 * título (?v=<título>) y el reproductor (?v=<título>&play=1). La ficha y el
 * reproductor tienen la misma forma que la web para ver de los clientes
 * (CONFIG.web.url): esta página nunca le habla a esa web, solo arma links
 * hacia ella. Lo único que se pide por la red es TMDB (datos e imágenes) y,
 * al abrir un tráiler, el reproductor de YouTube sin cookies.
 */

(function () {
  'use strict';

  // ── TMDB Config ──
  const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOGRhNDI0NWM3YTRhYzc3YWJhNWIxMjllNWM5YjkxMiIsInN1YiI6IjY1MTI0Njc2YTkxMTdmMDBlMTkzOWEwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.v0A7A94gXqXaIc3xQsOsAozFXYC3cIILkSgi3rLRfZQ';
  const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
  const TMDB_IMG_BACKDROP = 'https://image.tmdb.org/t/p/w780';
  const TMDB_IMG_STILL = 'https://image.tmdb.org/t/p/w300'; // la foto chica de cada episodio
  const CACHE_KEY = 'bankaiplus_tmdb_cache';
  const CACHE_VERSION = 5; // bumped: la clave del cache es el id de TMDB, ya no el titulo
  const EXTRAS_CACHE_KEY = 'bankaiplus_tmdb_extras_cache';
  // 3: la ficha trae también reparto, dirección, edad, duración, países y
  // géneros (los pide «Más info»), y los episodios su duración
  const EXTRAS_CACHE_VERSION = 3;
  // Si TMDB no contesta en este tiempo, la ficha se muestra con lo que haya
  const EXTRAS_TIMEOUT_MS = 10000;

  // Registro con el mes gratis — el mismo link que usa toda la web.
  // El que vale es el de CONFIG.registro.url (js/config.js); este es el respaldo.
  const REGISTRO_URL = 'https://app.vortexvip.org/register?code=hMXSHQE8P4';

  // Etiquetas legibles para los géneros que guardamos en catalog-data.js
  const GENRE_LABELS = {
    accion: 'Acción',
    comedia: 'Comedia',
    drama: 'Drama',
    cienciaficcion: 'Ciencia ficción',
    terror: 'Terror',
    romance: 'Romance',
    documental: 'Documental'
  };
  const MAIN_CATEGORIES = ['series', 'peliculas', 'anime', 'infantil'];

  // ── DOM Elements ──
  const grid = document.getElementById('catalog-grid');
  const loading = document.getElementById('catalog-loading');
  const empty = document.getElementById('catalog-empty');
  const emptyWeb = document.getElementById('catalog-empty-web');
  const emptyRequest = document.getElementById('catalog-empty-request');
  const searchWeb = document.getElementById('search-web');
  const countEl = document.getElementById('catalog-count');
  const searchInput = document.getElementById('catalog-search');
  const searchClear = document.getElementById('search-clear');
  // Dos grupos independientes: tipo (Todos/Series/Películas) y género (Acción,
  // Comedia, ..., Anime, Infantil). Cada uno se togglea dentro de su propia fila
  // y ambos se combinan con Y — así "Series" + "Comedia" da solo series de comedia.
  const filterTypeTags = document.querySelectorAll('.filter-row-type .filter-tag[data-filter]');
  const filterGenreTags = document.querySelectorAll('.filter-row-genre .filter-tag[data-filter]');
  const yearFilterEl = document.getElementById('year-filter');
  const ratingFilterEl = document.getElementById('rating-filter');
  const sortEl = document.getElementById('catalog-sort');

  // ── State ──
  let allItems = [];       // enriched items with TMDB data
  let filteredItems = [];   // after filter + search
  let activeTypeFilter = 'all';      // 'all' | 'series' | 'peliculas' — viene de item.type, no de category
  let activeCategoryFilter = 'all';  // 'all' | 'accion' | 'comedia' | ... | 'anime' | 'infantil'
  let searchTerm = '';
  let yearFilter = 'all';     // 'all' | '2020-2026' | '2010-2019' | '2000-2009' | 'pre2000'
  let ratingFilter = 'all';   // 'all' | '7' | '8' | '9'
  let sortOption = 'relevance'; // 'relevance' | 'name-asc' | 'name-desc' | 'year-desc' | 'year-asc' | 'rating-desc' | 'rating-asc'
  let tmdbCache = loadCache();
  let extrasCache = loadExtrasCache(); // ficha completa, temporadas y episodios: se piden al abrir un título

  // ══════════════════════════════════════════════════════════
  // LINKS A LA WEB PARA VER (CONFIG.web.url)
  // ══════════════════════════════════════════════════════════
  // 'https://ver.bankaiplus.com' sin la barra del final, o '' si no hay web
  function webBase() {
    const url = (typeof CONFIG !== 'undefined' && CONFIG.web && CONFIG.web.url) || '';
    return String(url).trim().replace(/\/+$/, '');
  }
  function hayWeb() { return webBase() !== ''; }

  // «Iniciar sesión y ver»: la web busca el título por su id de TMDB después
  // de iniciar sesión y elegir perfil (si no lo encuentra, cae a su búsqueda).
  function webOpenHref(item) {
    return `${webBase()}/abrir?tmdb=${encodeURIComponent(item.tmdbId)}`
      + `&tipo=${item.type === 'tv' ? 'serie' : 'pelicula'}`
      + `&q=${encodeURIComponent(item.title)}`;
  }
  function webSearchHref(term) { return `${webBase()}/buscar?q=${encodeURIComponent(term)}`; }

  function registerHref() {
    const url = (typeof CONFIG !== 'undefined' && CONFIG.registro && CONFIG.registro.url) || '';
    return String(url).trim() || REGISTRO_URL;
  }

  function whatsappRequestHref(term) {
    const numero = String((typeof CONFIG !== 'undefined' && CONFIG.contact && CONFIG.contact.whatsappNumber) || '50661719869').replace(/\D/g, '');
    const texto = term
      ? `Hola, quiero solicitar "${term}" para el catálogo de Bankai + ⚔️`
      : 'Hola, quiero solicitar un contenido para el catálogo de Bankai + ⚔️';
    return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  }

  // ══════════════════════════════════════════════════════════
  // TMDB CACHE (localStorage)
  // ══════════════════════════════════════════════════════════
  function loadCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (parsed._v !== CACHE_VERSION) return {};
      return parsed;
    } catch (e) { return {}; }
  }

  function saveCache() {
    try {
      tmdbCache._v = CACHE_VERSION;
      localStorage.setItem(CACHE_KEY, JSON.stringify(tmdbCache));
    } catch (e) { /* quota exceeded — ignore */ }
  }

  function loadExtrasCache() {
    try {
      const raw = localStorage.getItem(EXTRAS_CACHE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (parsed._v !== EXTRAS_CACHE_VERSION) return {};
      return parsed;
    } catch (e) { return {}; }
  }

  function saveExtrasCache() {
    try {
      extrasCache._v = EXTRAS_CACHE_VERSION;
      localStorage.setItem(EXTRAS_CACHE_KEY, JSON.stringify(extrasCache));
    } catch (e) { /* quota exceeded — ignore */ }
  }

  // ══════════════════════════════════════════════════════════
  // TMDB SEARCH
  // ══════════════════════════════════════════════════════════
  async function searchTMDB(title, type, tmdbId) {
    const searchType = type === 'movie' ? 'movie' : 'tv';
    // La clave del cache es el id, no el titulo: asi dos entradas con el mismo
    // nombre ("Batman 1989" y "Batman 2022") nunca comparten ficha.
    const cacheKey = `${searchType}__${tmdbId}`;
    if (tmdbCache[cacheKey]) return tmdbCache[cacheKey];

    // Sin id no se consulta nada. Antes se caia a /search por texto y eso
    // devolvia la obra equivocada en titulos cortos o repetidos ('X', 'War',
    // 'The Ring'). Todas las entradas de catalog-data.js traen su id exacto;
    // si alguna no lo trae es un error del dato y hay que verlo, no adivinarlo.
    if (!tmdbId) {
      console.warn('[catalogo] sin id de TMDB, no se consulta:', title);
      return null;
    }

    const url = `https://api.themoviedb.org/3/${searchType}/${tmdbId}?language=es-MX`;

    try {
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${TMDB_TOKEN}` }
      });
      if (!res.ok) {
        console.warn('[catalogo] TMDB respondio', res.status, 'para', searchType, tmdbId, '·', title);
        return null;
      }
      const data = await res.json();
      const result = (data && data.id) ? data : null;

      if (result) {
        const info = {
          id: result.id,
          poster: result.poster_path ? TMDB_IMG + result.poster_path : null,
          backdrop: result.backdrop_path ? TMDB_IMG_BACKDROP + result.backdrop_path : null,
          name: result.title || result.name || title,
          overview: result.overview || '',
          rating: result.vote_average ? result.vote_average.toFixed(1) : null,
          year: (result.release_date || result.first_air_date || '').substring(0, 4),
          tmdbType: searchType
        };
        tmdbCache[cacheKey] = info;
        return info;
      }
      // Cache "not found" too to avoid repeated calls
      tmdbCache[cacheKey] = { poster: null, name: title };
      return tmdbCache[cacheKey];
    } catch (e) {
      return null;
    }
  }

  // ══════════════════════════════════════════════════════════
  // TMDB — FICHA COMPLETA (se pide al abrir un título, una sola llamada)
  // tráiler, temporadas, similares, reparto, dirección, edad, duración…
  // ══════════════════════════════════════════════════════════
  function findTrailer(videos) {
    if (!videos || !videos.results || !videos.results.length) return null;
    const yt = videos.results.filter(v => v.site === 'YouTube');
    return yt.find(v => v.type === 'Trailer' && v.official)
        || yt.find(v => v.type === 'Trailer')
        || yt.find(v => v.type === 'Teaser')
        || yt[0]
        || null;
  }

  // Clasificación por edad: TMDB trae la de cada país. Se usa la del primer
  // país de esta lista que la tenga (el público es latinoamericano).
  const RATING_COUNTRIES = ['MX', 'US', 'AR', 'CO', 'CL', 'ES', 'BR', 'GB', 'DE', 'FR'];
  // Las que no traen un número: G y U = todo público, PG ≈ 7 años, R = 17…
  const AGE_BY_LABEL = {
    'G': 0, 'TV-G': 0, 'TV-Y': 0, 'U': 0, 'A': 0, 'AA': 0, 'L': 0, 'ATP': 0, 'APTA': 0, 'TP': 0, 'AL': 0,
    'PG': 7, 'TV-PG': 7, 'B': 12, 'R': 17, 'TV-MA': 17, 'C': 18, 'D': 18, 'X': 18
  };

  // «PG-13» → 13, «B15» → 15, «TV-MA» → 17, «G» → 0; lo que no se entiende → null
  function ageOf(certification) {
    const text = String(certification || '').trim().toUpperCase();
    if (!text) return null;
    if (Object.prototype.hasOwnProperty.call(AGE_BY_LABEL, text)) return AGE_BY_LABEL[text];
    const number = text.match(/(\d{1,2})/);
    if (!number) return null;
    const age = parseInt(number[1], 10);
    return age <= 21 ? age : null;
  }

  function certificationOf(data, tmdbType) {
    const byCountry = new Map();
    if (tmdbType === 'movie') {
      ((data.release_dates && data.release_dates.results) || []).forEach((r) => {
        const cert = (r.release_dates || []).map(d => String(d.certification || '').trim()).find(Boolean);
        if (cert) byCountry.set(r.iso_3166_1, cert);
      });
    } else {
      ((data.content_ratings && data.content_ratings.results) || []).forEach((r) => {
        const cert = String(r.rating || '').trim();
        if (cert) byCountry.set(r.iso_3166_1, cert);
      });
    }
    for (const country of RATING_COUNTRIES) {
      const cert = byCountry.get(country);
      if (cert && ageOf(cert) !== null) return cert;
    }
    return null;
  }

  // Dos pedidos iguales al mismo tiempo (la ficha y sus episodios, por ejemplo)
  // comparten la misma respuesta en vez de salir dos veces a TMDB.
  const inFlight = new Map();
  function once(key, run) {
    if (inFlight.has(key)) return inFlight.get(key);
    const promise = run().finally(() => inFlight.delete(key));
    inFlight.set(key, promise);
    return promise;
  }

  async function tmdbJson(url) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), EXTRAS_TIMEOUT_MS) : null;
    try {
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${TMDB_TOKEN}` },
        signal: controller ? controller.signal : undefined
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      return null;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  function extrasKey(tmdbId, tmdbType) { return `${tmdbType}_${tmdbId}`; }
  function cachedExtras(tmdbId, tmdbType) { return tmdbId ? (extrasCache[extrasKey(tmdbId, tmdbType)] || null) : null; }

  function fetchExtras(tmdbId, tmdbType) {
    const key = extrasKey(tmdbId, tmdbType);
    if (extrasCache[key]) return Promise.resolve(extrasCache[key]);
    return once(key, async () => {
      const isMovie = tmdbType === 'movie';
      // include_video_language es necesario: TMDB filtra /videos por idioma exacto,
      // y casi ningún tráiler está etiquetado "es-MX" — sin esto, videos.results
      // viene casi siempre vacío y el botón "Tráiler" nunca aparecería.
      // credits/aggregate_credits (reparto) y release_dates/content_ratings (edad)
      // viajan en la MISMA llamada: append_to_response no suma pedidos.
      const url = `https://api.themoviedb.org/3/${tmdbType}/${tmdbId}`
        + `?append_to_response=videos,recommendations,${isMovie ? 'credits,release_dates' : 'aggregate_credits,content_ratings'}`
        + '&language=es-MX&include_video_language=es,en,null';
      const data = await tmdbJson(url);
      if (!data || !data.id) return null;
      const trailer = findTrailer(data.videos);
      const credits = (isMovie ? data.credits : data.aggregate_credits) || {};
      const certification = certificationOf(data, tmdbType);

      const extras = {
        trailerKey: trailer ? trailer.key : null,
        seasons: !isMovie
          ? (data.seasons || [])
              .filter(s => s.episode_count > 0)
              .map(s => ({ seasonNumber: s.season_number, episodeCount: s.episode_count }))
              // Los "Especiales" (temporada 0) van al final, después de las temporadas reales
              .sort((a, b) => {
                const aSpecial = a.seasonNumber === 0;
                const bSpecial = b.seasonNumber === 0;
                if (aSpecial !== bSpecial) return aSpecial ? 1 : -1;
                return a.seasonNumber - b.seasonNumber;
              })
          : null,
        // Para la sección "Similares": guardamos id + nombre y después cruzamos
        // contra nuestro propio catálogo (solo mostramos lo que sí tenemos).
        recommendations: ((data.recommendations && data.recommendations.results) || [])
          .map(r => ({
            id: r.id,
            name: r.title || r.name || '',
            // Guardamos el póster de TMDB para que la tarjeta se vea completa aunque
            // ese título todavía no haya cargado en la tanda del grid.
            poster: r.poster_path ? TMDB_IMG + r.poster_path : null
          }))
          .slice(0, 40),
        genres: (data.genres || []).map(g => g.name).filter(Boolean),
        runtime: isMovie ? (data.runtime || null) : null,
        numberOfSeasons: !isMovie ? (data.number_of_seasons || null) : null,
        releaseDate: data.release_date || data.first_air_date || '',
        countries: isMovie
          ? (data.production_countries || []).map(c => c.iso_3166_1).filter(Boolean)
          : (data.origin_country || []),
        // Películas: quien dirige. Series: quien la creó (TMDB no tiene un director de toda la serie)
        directors: isMovie
          ? (credits.crew || []).filter(c => c.job === 'Director').map(c => c.name)
          : (data.created_by || []).map(c => c.name),
        cast: (credits.cast || []).slice(0, 8).map(c => c.name).filter(Boolean),
        certification: certification,
        minimumAge: ageOf(certification)
      };
      extrasCache[key] = extras;
      saveExtrasCache();
      return extras;
    });
  }

  function fetchSeasonEpisodes(tmdbId, seasonNumber) {
    const key = `season_${tmdbId}_${seasonNumber}`;
    if (extrasCache[key]) return Promise.resolve(extrasCache[key]);
    return once(key, async () => {
      const data = await tmdbJson(`https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNumber}?language=es-MX`);
      if (!data) return null;
      const episodes = (data.episodes || []).map(ep => ({
        number: ep.episode_number,
        name: ep.name || '',
        overview: ep.overview || '',
        still: ep.still_path ? TMDB_IMG_BACKDROP + ep.still_path : null,
        thumb: ep.still_path ? TMDB_IMG_STILL + ep.still_path : null,
        runtime: ep.runtime || null,
        airDate: ep.air_date || ''
      }));
      extrasCache[key] = episodes;
      saveExtrasCache();
      return episodes;
    });
  }

  // Texto comparable para buscar: sin acentos, sin signos y en minúscula.
  // Así "el señor de los anillos" también sale escribiendo "senor" o "Señor:".
  function plano(str) {
    return String(str == null ? '' : str)
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  const esc = escapeHtml;

  // ══════════════════════════════════════════════════════════
  // TEXTOS CHICOS DE UN TÍTULO (como la web: «+13», «★ 8,0», «1h 47min»…)
  // ══════════════════════════════════════════════════════════
  // 13 → «+13»; 0 → «ATP» (todo público); 17 se muestra como «+18».
  // Igual que la web y la app.
  function ageLabel(age) {
    if (age === null || age === undefined) return null;
    if (age <= 0) return 'ATP';
    return `+${age === 17 ? 18 : age}`;
  }

  // 107 → «1h 47min»; 45 → «45min»
  function durationLabel(minutes) {
    const total = parseInt(minutes, 10);
    if (!total || total <= 0) return null;
    const hours = Math.floor(total / 60);
    const rest = total % 60;
    return hours > 0 ? `${hours}h ${rest}min` : `${rest}min`;
  }

  // 107 → «1:47:00»; 45 → «45:00» (el reloj de la barra del reproductor)
  function clockLabel(minutes) {
    const total = parseInt(minutes, 10);
    if (!total || total <= 0) return null;
    const hours = Math.floor(total / 60);
    const rest = String(total % 60);
    return hours > 0 ? `${hours}:${rest.padStart(2, '0')}:00` : `${rest}:00`;
  }

  function seasonsLabel(count) { return count === 1 ? '1 temporada' : `${count} temporadas`; }
  function seasonName(number) { return Number(number) === 0 ? 'Especiales' : `Temporada ${number}`; }
  function episodeCountLabel(count) { return count === 1 ? '1 episodio' : `${count} episodios`; }

  // Cuántas temporadas tiene Bankai +, leído de la columna del Excel:
  // '1 a 6' → 6, '1 y 2' / '1, 2' → 2, '1' → 1. Lo que no se entiende → null
  function seasonsInCatalog(text) {
    const value = String(text == null ? '' : text).trim();
    if (!value) return null;
    const range = value.match(/(\d+)\s*a\s*(\d+)/i);
    if (range) {
      const from = Math.max(1, parseInt(range[1], 10));
      const to = parseInt(range[2], 10);
      return to >= from && to <= 60 ? to - from + 1 : null;
    }
    const numbers = value.match(/\d+(\.0)?/g) || [];
    if (numbers.length > 1) return numbers.length;
    const single = parseFloat(value);
    return single >= 1 && single <= 60 ? Math.round(single) : null;
  }

  function lengthLabel(item, ex) {
    if (item.type === 'tv') {
      const count = seasonsInCatalog(item.seasons) || ex.numberOfSeasons;
      return count ? seasonsLabel(count) : null;
    }
    return durationLabel(ex.runtime);
  }

  // Los chips de la ficha, en el orden de la web: edad, calificación, año, duración
  function chipsOf(item, extras) {
    const tmdb = item.tmdb || {};
    const ex = extras || {};
    const chips = [];
    const age = ageLabel(ex.minimumAge);
    if (age) chips.push(age);
    if (tmdb.rating && parseFloat(tmdb.rating) > 0) chips.push(`★ ${String(tmdb.rating).replace('.', ',')}`);
    if (tmdb.year) chips.push(tmdb.year);
    const length = lengthLabel(item, ex);
    if (length) chips.push(length);
    return chips;
  }

  // Los géneros de TMDB; si no llegaron, los del catálogo («Acción · Drama»)
  function genresOf(item, extras) {
    if (extras && extras.genres && extras.genres.length) return extras.genres;
    return String(item.category || '').split(',').map(c => c.trim())
      .filter(c => c && !MAIN_CATEGORIES.includes(c))
      .map(c => GENRE_LABELS[c] || c);
  }

  const LONG_MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
    'septiembre', 'octubre', 'noviembre', 'diciembre'];
  // '1990-09-10' → «10 de septiembre de 1990»
  function longDate(text) {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(text || ''));
    if (!match) return /^\d{4}$/.test(String(text || '')) ? String(text) : null;
    const month = LONG_MONTHS[parseInt(match[2], 10) - 1];
    return month ? `${parseInt(match[3], 10)} de ${month} de ${match[1]}` : match[1];
  }

  // 'US' → «Estados Unidos» (hasta dos países)
  function countriesOf(ex) {
    const codes = ((ex && ex.countries) || []).slice(0, 2);
    if (!codes.length) return null;
    let names = null;
    try { names = new Intl.DisplayNames(['es'], { type: 'region' }); } catch (e) { names = null; }
    return codes.map((code) => {
      try { return (names && names.of(String(code).toUpperCase())) || code; } catch (e) { return code; }
    }).join(', ');
  }

  // «PG-13 (+13)»
  function classificationOf(ex) {
    if (!ex || !ex.certification) return null;
    const age = ageLabel(ex.minimumAge);
    return age ? `${ex.certification} (${age})` : ex.certification;
  }

  // «6. Nombre»; si TMDB no tiene el nombre (o es «Episodio 6»), solo «Episodio 6»
  function episodeTitle(ep) {
    const name = String(ep.name || '').trim();
    const generic = !name || /^(episodio|episode|cap[ií]tulo)\s*\d+$/i.test(name);
    return generic ? `Episodio ${ep.number}` : `${ep.number}. ${name}`;
  }
  function episodeRealName(ep) {
    const name = String((ep && ep.name) || '').trim();
    return !name || /^(episodio|episode|cap[ií]tulo)\s*\d+$/i.test(name) ? '' : name;
  }
  // «T1 · E3» (los especiales: «Especiales · E3»)
  function episodeShortLabel(season, episode) {
    return `${Number(season) === 0 ? 'Especiales' : `T${season}`} · E${episode}`;
  }

  function reduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ══════════════════════════════════════════════════════════
  // ÍCONOS (los mismos dibujos que usa la web)
  // ══════════════════════════════════════════════════════════
  function icon(paths, extraClass, filled) {
    const paint = filled
      ? 'fill="currentColor" stroke="none"'
      : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    return `<svg class="ic${extraClass ? ' ' + extraClass : ''}" viewBox="0 0 24 24" ${paint} aria-hidden="true" focusable="false">${paths}</svg>`;
  }
  const ICON = {
    back: icon('<path d="m15 18-6-6 6-6"/>'),
    prev: icon('<path d="m15 18-6-6 6-6"/>'),
    next: icon('<path d="m9 18 6-6-6-6"/>'),
    play: icon('<path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/>', '', true),
    list: icon('<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>'),
    trailer: icon('<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>'),
    info: icon('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'),
    bookmark: icon('<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>'),
    like: icon('<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>'),
    dislike: icon('<path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"/>'),
    heart: icon('<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'),
    captions: icon('<rect width="18" height="14" x="3" y="5" rx="2" ry="2"/><path d="M7 15h4M15 15h2M7 11h2M13 11h4"/>'),
    close: icon('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
    external: icon('<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'),
    volume: icon('<path d="M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6A1.4 1.4 0 0 1 5.4 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.4 18.4a9 9 0 0 0 0-12.8"/>'),
    rewind: icon('<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'),
    forward: icon('<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>'),
    settings: icon('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>'),
    pip: icon('<path d="M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4"/><rect width="10" height="7" x="12" y="13" rx="2"/>'),
    fullscreen: icon('<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>')
  };

  // ══════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════
  // Card → item, para poder refrescar una sola tarjeta cuando llegan sus datos
  // sin reconstruir el grid entero (ver patchCards).
  const cardByItem = new Map();

  function cardInnerHtml(item) {
    const poster = item.tmdb && item.tmdb.poster;
    const typeLabel = item.type === 'tv' ? 'Serie' : 'Película';

    if (poster) {
      return `
        <img src="${poster}" alt="${escapeHtml(item.title)}" loading="lazy">
        <div class="catalog-item-info">
          <div class="catalog-item-title">${escapeHtml(item.title)}</div>
          <div class="catalog-item-meta">
            ${item.tmdb.rating ? `<span class="catalog-item-rating">★ ${escapeHtml(item.tmdb.rating)}</span>` : ''}
            ${item.tmdb.year ? `<span class="catalog-item-year">${escapeHtml(item.tmdb.year)}</span>` : ''}
            <span class="catalog-item-type">${typeLabel}</span>
          </div>
        </div>`;
    }
    return `
      <div class="catalog-item-fallback">
        <img src="../images/logo/logo.svg" alt="Bankai +">
        <span>${escapeHtml(item.title)}</span>
      </div>
      <div class="catalog-item-info">
        <div class="catalog-item-title">${escapeHtml(item.title)}</div>
        <div class="catalog-item-meta">
          <span class="catalog-item-type">${typeLabel}</span>
        </div>
      </div>`;
  }

  // Actualiza en el sitio solo las tarjetas cuyos datos acaban de llegar.
  function patchCards(items) {
    items.forEach((item) => {
      const card = cardByItem.get(item);
      if (card) card.innerHTML = cardInnerHtml(item);
    });
  }

  function wireCard(el, item) {
    const open = () => goDetail(item);
    el.addEventListener('click', open);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  }

  // «¿Ya tenés cuenta? Buscá "X" en la web →» debajo del buscador, y en el
  // aviso de «No se encontraron títulos» junto al pedido por WhatsApp.
  function webSearchLinkHtml(term) {
    return `¿Ya tenés cuenta? Buscá "${escapeHtml(term)}" en la web <span aria-hidden="true">→</span>`;
  }

  function updateSearchHelp(resultCount) {
    const term = searchTerm.trim();
    const showWeb = Boolean(term) && hayWeb();
    if (searchWeb) {
      searchWeb.hidden = !showWeb;
      if (showWeb) {
        const link = searchWeb.querySelector('a');
        link.href = webSearchHref(term);
        link.innerHTML = webSearchLinkHtml(term);
      }
    }
    if (resultCount === 0) {
      if (emptyWeb) {
        emptyWeb.hidden = !showWeb;
        if (showWeb) {
          const link = emptyWeb.querySelector('a');
          link.href = webSearchHref(term);
          link.innerHTML = webSearchLinkHtml(term);
        }
      }
      if (emptyRequest) emptyRequest.href = whatsappRequestHref(term);
    }
  }

  // Reconcilia el grid en vez de reconstruirlo entero. Con TMDB llegando en
  // tandas, applyFilters() puede correr muchas veces por segundo (p. ej. con
  // una búsqueda activa); si cada corrida hacía grid.innerHTML = ..., TODAS las
  // tarjetas se destruían y recreaban, y la que estaba bajo el cursor perdía y
  // recuperaba el :hover en cada tanda — de ahí la animación saltando sin fin.
  // Acá una tarjeta que ya existe y sigue en su posición no se toca para nada.
  function renderGrid(items) {
    updateSearchHelp(items.length);
    if (items.length === 0) {
      grid.innerHTML = '';
      cardByItem.clear();
      empty.style.display = 'block';
      countEl.textContent = 'No se encontraron títulos';
      return;
    }

    empty.style.display = 'none';
    countEl.textContent = `${items.length} título${items.length !== 1 ? 's' : ''}`;

    // Tarjetas que ya no deben mostrarse: se quitan del DOM y del mapa
    const keep = new Set(items);
    cardByItem.forEach((el, item) => {
      if (!keep.has(item)) { el.remove(); cardByItem.delete(item); }
    });

    // Inserta lo nuevo y reordena solo lo que cambió de posición
    let prevEl = null;
    items.forEach((item, idx) => {
      let el = cardByItem.get(item);
      if (!el) {
        el = document.createElement('div');
        el.className = 'catalog-item';
        el.tabIndex = 0;
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', item.title);
        el.innerHTML = cardInnerHtml(item);
        wireCard(el, item);
        cardByItem.set(item, el);
      }
      el.dataset.idx = idx;
      const wanted = prevEl ? prevEl.nextElementSibling : grid.firstElementChild;
      if (wanted !== el) grid.insertBefore(el, wanted || null);
      prevEl = el;
    });
  }

  // ══════════════════════════════════════════════════════════
  // NAVEGACIÓN ENTRE VISTAS
  // Tres pantallas reales (catálogo / detalle / reproductor) en vez de un popup.
  // El scroll siempre es el de la página: nunca hay scroll dentro de un overlay.
  // Cada paso que el visitante da dentro de la página se guarda con inApp: true;
  // así «Volver» sabe si puede ir atrás en el historial o si la ficha se abrió
  // directo desde un link (un correo, WhatsApp) y tiene que ir al catálogo.
  // ══════════════════════════════════════════════════════════
  const views = {
    catalog: document.getElementById('view-catalog'),
    detail: document.getElementById('view-detail'),
    player: document.getElementById('view-player')
  };

  const PAGE_TITLE = document.title;
  let currentItem = null;      // título abierto en la vista de detalle o en el reproductor
  let gridScrollY = 0;         // dónde estaba el usuario en el grid, para devolverlo ahí
  let viewToken = 0;           // invalida renders viejos si el usuario navega rápido
  let viewCleanups = [];       // observadores de la pantalla anterior que hay que apagar

  function runCleanups() {
    viewCleanups.forEach((fn) => { try { fn(); } catch (e) { /* nada */ } });
    viewCleanups = [];
  }

  function toTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  // Alto de la barra de arriba: el reproductor lo descuenta para que el video
  // y su barra entren en la pantalla sin bajar.
  const topNav = document.querySelector('nav');
  function measureNav() {
    if (topNav) document.documentElement.style.setProperty('--nav-h', `${topNav.offsetHeight}px`);
  }
  measureNav();
  window.addEventListener('resize', measureNav, { passive: true });

  function setView(name) {
    closeDialog(true);
    runCleanups();
    Object.keys(views).forEach((key) => {
      const isActive = key === name;
      views[key].classList.toggle('is-active', isActive);
      views[key].setAttribute('aria-hidden', isActive ? 'false' : 'true');
      // La ficha o el reproductor que se dejan se vacían: así no quedan ids
      // repetidos en la página ni un tráiler sonando escondido.
      if (!isActive && key !== 'catalog') views[key].innerHTML = '';
    });
    document.body.classList.toggle('player-open', name === 'player');
    document.body.classList.toggle('detail-open', name === 'detail');
    if (name === 'catalog') document.title = PAGE_TITLE;
  }

  function findItemByTitle(title) {
    return allItems.find(i => i.title === title) || null;
  }

  function playerUrl(item, ep) {
    let url = `${location.pathname}?v=${encodeURIComponent(item.title)}&play=1`;
    if (ep && ep.season !== undefined && ep.season !== null && ep.episode) url += `&t=${ep.season}&e=${ep.episode}`;
    return url;
  }

  // Un click normal se queda en esta página; con Ctrl, Cmd, Shift o la rueda,
  // el navegador hace lo suyo (abre el link en otra pestaña).
  function isPlainClick(e) {
    return e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey;
  }

  // ── Router ──
  function goCatalog(push = true) {
    currentItem = null;
    viewToken++;
    setView('catalog');
    if (push) history.pushState({ view: 'catalog', inApp: true }, '', location.pathname + filterQuery());
    // Devolvemos al usuario justo donde estaba mirando el grid
    window.scrollTo({ top: gridScrollY, left: 0, behavior: 'instant' });
  }

  // «Volver»: atrás en el historial si el visitante llegó desde esta misma
  // página; si abrió el link directo, a donde corresponde sin salir del sitio.
  function goBack(fallback) {
    const state = history.state || {};
    if (state.inApp) history.back();
    else fallback();
  }

  function backToCatalog() {
    history.replaceState({ view: 'catalog' }, '', location.pathname + filterQuery());
    goCatalog(false);
  }

  // how: undefined → apila (o reemplaza si ya estamos en una ficha), 'none' → no toca el historial
  function goDetail(item, how) {
    if (!item) return;
    const fromDetail = views.detail.classList.contains('is-active');
    if (views.catalog.classList.contains('is-active')) gridScrollY = window.scrollY;
    currentItem = item;
    setView('detail');
    toTop();
    if (how !== 'none') {
      const url = `${location.pathname}?v=${encodeURIComponent(item.title)}`;
      const prev = history.state || {};
      // Saltar de una ficha a otra por "Similares" reemplaza la entrada actual en
      // vez de apilar: desde cualquier ficha, atrás siempre devuelve al catálogo.
      // Si no, encadenar similares generaría un historial infinito.
      if (fromDetail || how === 'replace') {
        history.replaceState({ view: 'detail', title: item.title, inApp: Boolean(prev.inApp) }, '', url);
      } else {
        history.pushState({ view: 'detail', title: item.title, inApp: true }, '', url);
      }
    }
    renderDetail(item);
  }

  // ep: { season, episode } o null (película, o la serie desde su primer episodio)
  function goPlayer(item, ep, how) {
    if (!item) return;
    if (views.catalog.classList.contains('is-active')) gridScrollY = window.scrollY;
    currentItem = item;
    setView('player');
    toTop();
    const state = { view: 'player', title: item.title, ep: ep || null, inApp: true };
    if (how === 'replace') {
      state.inApp = Boolean((history.state || {}).inApp);
      history.replaceState(state, '', playerUrl(item, ep));
    } else if (how !== 'none') {
      history.pushState(state, '', playerUrl(item, ep));
    }
    renderPlayer(item, ep || null);
  }

  window.addEventListener('popstate', (e) => {
    closeDialog(true);
    const state = e.state || {};
    if (state.view === 'player') {
      const item = findItemByTitle(state.title);
      if (item) { goPlayer(item, validEp(state.ep), 'none'); return; }
    }
    if (state.view === 'detail') {
      const item = findItemByTitle(state.title);
      if (item) { goDetail(item, 'none'); return; }
    }
    goCatalog(false);
  });

  function validEp(ep) {
    if (!ep || typeof ep !== 'object') return null;
    const season = parseInt(ep.season, 10);
    const episode = parseInt(ep.episode, 10);
    return season >= 0 && episode >= 1 ? { season, episode } : null;
  }

  // ══════════════════════════════════════════════════════════
  // VENTANAS (Más info, Tráiler, «Iniciá sesión…»)
  // Como las de la web: el foco queda adentro (Tab da la vuelta), Escape y el
  // fondo la cierran, y al cerrar el foco vuelve al botón que la abrió.
  // En el celular sube desde abajo; en la compu va centrada.
  // ══════════════════════════════════════════════════════════
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, iframe, [tabindex]:not([tabindex="-1"])';
  let dialogSeq = 0;
  let openDialogState = null;

  function closeDialog(fromNavigation) {
    if (openDialogState) openDialogState.close(fromNavigation);
  }

  function openDialog(opts) {
    closeDialog(true);
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const titleId = `bk-dialogo-${++dialogSeq}`;
    const overlay = document.createElement('div');
    overlay.className = 'bk-overlay';
    overlay.innerHTML = `
      <div class="bk-dialog bk-dialog--${opts.size || 'md'}" role="dialog" aria-modal="true" aria-labelledby="${titleId}" tabindex="-1">
        <div class="bk-dialog-head">
          <h2 class="bk-dialog-title" id="${titleId}">${esc(opts.title)}</h2>
          <button type="button" class="bk-dialog-close" data-dialog-close aria-label="Cerrar">${ICON.close}</button>
        </div>
        <div class="bk-dialog-body">${opts.bodyHtml}</div>
      </div>`;
    // El resto de la página queda inerte mientras la ventana está abierta
    const madeInert = Array.from(document.body.children).filter(el => !el.inert && el.tagName !== 'SCRIPT');
    document.body.appendChild(overlay);
    madeInert.forEach((el) => { el.inert = true; });
    const dialog = overlay.firstElementChild;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    let closed = false;
    function close(fromNavigation) {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKey, true);
      madeInert.forEach((el) => { el.inert = false; });
      overlay.remove();
      document.body.style.overflow = previousOverflow;
      openDialogState = null;
      if (!fromNavigation && opener && opener.isConnected) opener.focus();
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(dialog.querySelectorAll(FOCUSABLE)).filter(el => el.offsetParent !== null || el === document.activeElement);
      if (!items.length) { e.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
    document.addEventListener('keydown', onKey, true);

    // Click en el fondo oscuro (empezado y terminado afuera de la ventana) la cierra
    let downOutside = false;
    overlay.addEventListener('pointerdown', (e) => { downOutside = e.target === overlay; });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay && downOutside) close(false);
      downOutside = false;
    });
    dialog.querySelectorAll('[data-dialog-close]').forEach(btn => btn.addEventListener('click', () => close(false)));

    openDialogState = { close };
    const target = (opts.focus && opts.focus !== 'dialog' && dialog.querySelector(opts.focus)) || dialog;
    target.focus();
    if (opts.onOpen) opts.onOpen(dialog, close);
    return close;
  }

  // «Más info»: chips, todos los géneros, la sinopsis entera y, si TMDB los
  // tiene, dirección, reparto, país, estreno y clasificación. En el reproductor
  // suma la foto y el episodio que se está viendo (como la web).
  function infoBodyHtml(item, extras, opts) {
    const tmdb = item.tmdb || {};
    const ex = extras || {};
    const options = opts || {};
    const chips = chipsOf(item, ex);
    const genres = genresOf(item, ex);
    const isSeries = item.type === 'tv';
    const rows = [
      { label: isSeries ? 'Creada por' : 'Director', value: (ex.directors || []).join(', ') },
      { label: 'Reparto', value: (ex.cast || []).join(', ') }
    ];
    if (!options.player) {
      rows.push(
        { label: 'País', value: countriesOf(ex) },
        { label: 'Estreno', value: longDate(ex.releaseDate) },
        { label: 'Clasificación', value: classificationOf(ex) }
      );
    }
    const shownRows = rows.filter(row => row.value);
    const chipsHtml = chips.length ? `<ul class="info-chips">${chips.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : '';
    const genresHtml = genres.length ? `<p class="info-genres">${esc(genres.join(' · '))}</p>` : '';
    const plotHtml = tmdb.overview ? `<p class="info-plot">${esc(tmdb.overview)}</p>` : '';
    const episode = options.episode;
    const episodeHtml = episode ? `
      <div class="info-ep">
        <p class="info-ep-label">Estás viendo</p>
        <p class="info-ep-name">${esc(episodeShortLabel(episode.season, episode.episode))}${episode.name ? ` · ${esc(episode.name)}` : ''}</p>
        ${episode.plot ? `<p class="info-ep-plot">${esc(episode.plot)}</p>` : ''}
      </div>` : '';
    const rowsHtml = shownRows.length ? `
      <dl class="info-rows">${shownRows.map(row => `
        <div class="info-row"><dt>${esc(row.label)}</dt><dd>${esc(row.value)}</dd></div>`).join('')}
      </dl>` : '';

    if (options.player) {
      const wide = tmdb.backdrop || tmdb.poster;
      const tall = tmdb.poster || tmdb.backdrop;
      return `
        <div class="info">
          ${wide ? `<img class="info-wide" src="${esc(wide)}" alt="" loading="lazy">` : ''}
          <div class="info-side">
            ${tall ? `<img class="info-poster" src="${esc(tall)}" alt="" loading="lazy">` : ''}
            <div class="info-facts">${chipsHtml}${genresHtml}${episodeHtml}${plotHtml}</div>
          </div>
          ${rowsHtml}
        </div>`;
    }
    return `<div class="info">${chipsHtml}${genresHtml}${plotHtml}${rowsHtml}</div>`;
  }

  function openInfo(item, extras, opts) {
    openDialog({ title: item.title, size: 'lg', bodyHtml: infoBodyHtml(item, extras, opts), focus: 'dialog' });
  }

  // El tráiler adentro de la página con el reproductor de YouTube sin cookies
  // (youtube-nocookie.com). Algunos dueños no dejan ver su video en otras
  // páginas: para eso está «Ver en YouTube».
  function openTrailer(item, youtubeId) {
    const id = encodeURIComponent(youtubeId);
    const label = `Tráiler · ${item.title}`;
    openDialog({
      title: label,
      size: 'video',
      focus: 'dialog',
      bodyHtml: `
        <div class="trailer">
          <iframe class="trailer-frame" src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0"
                  title="${esc(label)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>
          <a class="trailer-yt" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer">
            ${ICON.external}Ver en YouTube<span class="sr-only"> (se abre en otra pestaña)</span>
          </a>
        </div>`
    });
  }

  // «Iniciá sesión para…»: lo que se guarda o se elige con la cuenta vive en
  // la web y en la app; acá solo se ofrece ir a iniciar sesión.
  function openSignInPrompt(item, title, text, buttonLabel) {
    openDialog({
      title: title,
      size: 'md',
      focus: '[data-primary]',
      bodyHtml: `
        <div class="signin">
          <p class="signin-text">${esc(text)}</p>
          <div class="signin-actions">
            <a class="bk-btn bk-btn-red" data-primary href="${esc(webOpenHref(item))}">${esc(buttonLabel || 'Iniciar sesión')}</a>
            <button type="button" class="bk-btn bk-btn-alt" data-dialog-close>Ahora no</button>
          </div>
          <p class="signin-small">Es el mismo usuario y contraseña de la app.
            ¿No tenés cuenta? <a href="${esc(registerHref())}" target="_blank" rel="noopener">Registrate · 1 mes gratis<span class="sr-only"> (se abre en otra pestaña)</span></a></p>
        </div>`
    });
  }

  // ══════════════════════════════════════════════════════════
  // ARRASTRAR CON EL MOUSE (filas de pósters y de temporadas)
  // Las mismas reglas que la web (usePointerDrag):
  // - si el botón se mueve menos de 6 px de costado sigue siendo un click;
  // - después de arrastrar, el click que dispara el navegador al soltar se
  //   ignora (soltar arriba de un póster no lo abre);
  // - si el botón se suelta afuera, el próximo movimiento sin botón olvida el
  //   arrastre (nunca queda «pegado» al mouse).
  // El dedo y el trackpad ya deslizan la fila solos: esto es solo para el mouse.
  // ══════════════════════════════════════════════════════════
  const DRAG_THRESHOLD_PX = 6;

  function attachPointerDrag(el, handlers) {
    let press = null;
    let ignoreNextClick = false;

    function forgetPress() {
      const wasDrag = Boolean(press && press.isDrag);
      press = null;
      if (wasDrag) {
        el.classList.remove('is-dragging');
        if (handlers.onDragEnd) handlers.onDragEnd();
      }
    }

    el.addEventListener('pointerdown', (e) => {
      // Solo el mouse y su botón principal (el derecho abre el menú del navegador)
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      press = { id: e.pointerId, x: e.clientX, y: e.clientY, isDrag: false };
    });

    el.addEventListener('pointermove', (e) => {
      if (!press || e.pointerId !== press.id) return;
      // El botón se soltó afuera (ese pointerup nunca llegó): el arrastre terminó
      if ((e.buttons & 1) === 0) { forgetPress(); return; }
      const deltaX = e.clientX - press.x;
      if (!press.isDrag) {
        const deltaY = e.clientY - press.y;
        const sideways = Math.abs(deltaX) >= DRAG_THRESHOLD_PX && Math.abs(deltaX) > Math.abs(deltaY);
        if (!sideways) return;
        press.isDrag = true;
        el.classList.add('is-dragging');
        try { el.setPointerCapture(e.pointerId); } catch (err) { /* nada */ }
        const selection = window.getSelection && window.getSelection();
        if (selection) selection.removeAllRanges();
        if (handlers.onDragStart) handlers.onDragStart();
      }
      if (handlers.onDragMove) handlers.onDragMove(deltaX);
    });

    el.addEventListener('pointerup', (e) => {
      if (!press || e.pointerId !== press.id) return;
      const wasDrag = press.isDrag;
      forgetPress();
      if (wasDrag) {
        ignoreNextClick = true;
        // El click llega justo después de soltar; si no llega, no se ignora nada más
        setTimeout(() => { ignoreNextClick = false; }, 0);
      }
    });

    el.addEventListener('pointercancel', (e) => {
      if (press && e.pointerId === press.id) forgetPress();
    });

    el.addEventListener('click', (e) => {
      if (ignoreNextClick) {
        ignoreNextClick = false;
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Los links y las fotos arrancarían el arrastre propio del navegador (una
    // imagen fantasma) en vez de mover la fila
    el.addEventListener('dragstart', (e) => e.preventDefault());
  }

  function dragToScroll(el) {
    let startScroll = 0;
    attachPointerDrag(el, {
      onDragStart: () => { startScroll = el.scrollLeft; },
      onDragMove: (deltaX) => { el.scrollLeft = startScroll - deltaX; }
    });
  }

  // ══════════════════════════════════════════════════════════
  // FILA DE PÓSTERS («Similares»), como RowScroller de la web: se desliza
  // adentro de sí misma (la página nunca), se arrastra con el mouse y tiene
  // dos flechas a la altura del medio de los pósters.
  // ══════════════════════════════════════════════════════════
  function similarMatches(item, recommendations) {
    const index = buildCatalogIndex();
    const seen = new Set();
    const matches = [];
    for (const rec of recommendations || []) {
      const found = index.byId.get(rec.id) || index.byName.get(normalizeTitle(rec.name));
      if (!found || found === item || seen.has(found.title)) continue;
      seen.add(found.title);
      // El póster de la recomendación sirve de respaldo si ese título del catálogo
      // todavía no cargó su propia ficha de TMDB.
      matches.push({ item: found, poster: (found.tmdb && found.tmdb.poster) || rec.poster });
      if (matches.length >= 12) break;
    }
    return matches;
  }

  function rowHtml(idPrefix, heading, matches) {
    const headingId = `${idPrefix}similares`;
    return `
      <section class="row-section" aria-labelledby="${headingId}">
        <h2 class="row-heading" id="${headingId}">${esc(heading)}</h2>
        <div class="row-scroller" data-row>
          <button type="button" class="row-arrow row-prev" aria-label="Ver anteriores" disabled>${ICON.prev}</button>
          <ul class="row-list" aria-labelledby="${headingId}">
            ${matches.map((m, i) => `
              <li>
                <a class="tcard" href="${esc(`${location.pathname}?v=${encodeURIComponent(m.item.title)}`)}" data-row-idx="${i}">
                  <span class="tcard-in">
                    <span class="card-frame">
                      ${m.poster
                        ? `<img class="tcard-img" src="${esc(m.poster)}" alt="" loading="lazy" decoding="async">`
                        : `<span class="tcard-img tcard-noimg">${esc(m.item.title)}</span>`}
                    </span>
                    <span class="tcard-title">${esc(m.item.title)}</span>
                  </span>
                </a>
              </li>`).join('')}
          </ul>
          <button type="button" class="row-arrow row-next" aria-label="Ver más">${ICON.next}</button>
        </div>
      </section>`;
  }

  function mountRow(wrapper, matches, onPick) {
    const list = wrapper.querySelector('.row-list');
    const prev = wrapper.querySelector('.row-prev');
    const next = wrapper.querySelector('.row-next');

    dragToScroll(list);

    function updateEdges() {
      prev.disabled = list.scrollLeft <= 4;
      next.disabled = list.scrollLeft + list.clientWidth >= list.scrollWidth - 4;
    }
    // Las flechas van a la mitad de los pósters, no de toda la fila con sus títulos
    function updateArrows() {
      const frame = list.querySelector('.card-frame');
      if (!frame) return;
      const frameBox = frame.getBoundingClientRect();
      const wrapperBox = wrapper.getBoundingClientRect();
      if (frameBox.height > 0) {
        const top = `${Math.round(frameBox.top - wrapperBox.top + frameBox.height / 2)}px`;
        prev.style.top = top;
        next.style.top = top;
      }
    }
    function slide(direction) {
      list.scrollBy({ left: direction * list.clientWidth * 0.85, behavior: reduceMotion() ? 'auto' : 'smooth' });
    }

    list.addEventListener('scroll', updateEdges, { passive: true });
    prev.addEventListener('click', () => slide(-1));
    next.addEventListener('click', () => slide(1));
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => { updateEdges(); updateArrows(); });
      observer.observe(list);
      viewCleanups.push(() => observer.disconnect());
    }
    list.querySelectorAll('.tcard').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (!isPlainClick(e)) return;
        e.preventDefault();
        onPick(matches[parseInt(card.dataset.rowIdx, 10)].item);
      });
    });
    updateEdges();
    updateArrows();
  }

  // ── Similares: cruzamos las recomendaciones de TMDB contra nuestro catálogo ──
  function normalizeTitle(str) {
    return String(str == null ? '' : str)
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '');
  }

  function buildCatalogIndex() {
    const byId = new Map();
    const byName = new Map();
    allItems.forEach((it) => {
      // El id de catalog-data.js sirve aunque ese título todavía no haya cargado de TMDB
      if (it.tmdbId) byId.set(Number(it.tmdbId), it);
      if (it.tmdb && it.tmdb.id) byId.set(it.tmdb.id, it);
      const own = normalizeTitle(it.title);
      if (own && !byName.has(own)) byName.set(own, it);
      if (it.tmdb && it.tmdb.name) {
        const alt = normalizeTitle(it.tmdb.name);
        if (alt && !byName.has(alt)) byName.set(alt, it);
      }
    });
    return { byId, byName };
  }

  // ══════════════════════════════════════════════════════════
  // EPISODIOS (ficha y reproductor), como EpisodesSection de la web:
  // las temporadas en pestañas («Especiales» al final; ← → Inicio y Fin del
  // teclado eligen otra; se arrastran con el mouse si no entran) y cada
  // episodio con su foto, «6. Nombre», tres líneas y su duración.
  // En el reproductor se abre en la temporada que suena y ese episodio dice
  // «Reproduciendo». La lista es parte de la página (sin una caja con scroll
  // propio: el dueño no quiere doble scroll) y nada mueve la página solo.
  // ══════════════════════════════════════════════════════════
  function skeletonCardsHtml(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <li><div class="ep-card ep-card-sk">
          <span class="sk sk-thumb"></span>
          <span class="ep-info sk-info">
            <span class="sk sk-line" style="width:75%"></span>
            <span class="sk sk-line sk-line-sm"></span>
            <span class="sk sk-line sk-line-sm" style="width:66%"></span>
            <span class="sk sk-line sk-line-sm sk-time"></span>
          </span>
        </div></li>`;
    }
    return html;
  }

  function episodesSkeletonHtml() {
    return `
      <section class="ep-section" aria-busy="true">
        <h2 class="ep-heading">Episodios</h2>
        <p class="sr-only" role="status">Cargando episodios…</p>
        <div class="ep-tabs ep-tabs-sk" aria-hidden="true">
          <span class="sk sk-tab"></span><span class="sk sk-tab"></span><span class="sk sk-tab"></span>
        </div>
        <div aria-hidden="true">
          <span class="sk sk-count"></span>
          <ul class="ep-grid">${skeletonCardsHtml(6)}</ul>
        </div>
      </section>`;
  }

  function episodeCardHtml(item, season, ep, isPlaying, fallbackImage) {
    const image = ep.thumb || fallbackImage;
    const inner = `
      <span class="ep-thumb">
        ${image ? `<img src="${esc(image)}" alt="" loading="lazy" decoding="async">` : '<span class="ep-noimg"></span>'}
        ${isPlaying ? `<span class="ep-badge">${ICON.play}Reproduciendo</span>` : ''}
      </span>
      <span class="ep-info">
        <span class="ep-name">${esc(episodeTitle(ep))}</span>
        ${ep.overview ? `<span class="ep-plot">${esc(ep.overview)}</span>` : ''}
        ${ep.runtime ? `<span class="ep-time">${esc(durationLabel(ep.runtime))}</span>` : ''}
      </span>`;
    if (isPlaying) {
      // Nunca solo el color: la etiqueta «Reproduciendo» también lo dice
      return `<li><div class="ep-card is-playing" aria-current="true">${inner}</div></li>`;
    }
    return `<li><a class="ep-card" href="${esc(playerUrl(item, { season, episode: ep.number }))}" data-episode="${ep.number}">${inner}</a></li>`;
  }

  // La página en rem para mover cajas con scroll (scrollTop va en px)
  function unitPx(el) {
    const size = parseFloat(getComputedStyle(el).fontSize);
    return Number.isFinite(size) && size > 0 ? size : 16;
  }

  function mountEpisodes(area, opts) {
    const item = opts.item;
    const token = opts.token;
    const playing = opts.playing || null;
    const idp = opts.idPrefix;
    const seasons = (opts.extras && opts.extras.seasons) || [];
    const fallbackImage = (item.tmdb && item.tmdb.backdrop) || null;

    if (!seasons.length) {
      area.innerHTML = `<section class="ep-section"><h2 class="ep-heading">Episodios</h2><p class="ep-msg">${opts.extras
        ? 'No se encontraron episodios'
        : 'No pudimos cargar los episodios. Revisá tu conexión e intentá de nuevo.'}</p></section>`;
      return;
    }

    let current = playing && seasons.some(s => s.seasonNumber === playing.season)
      ? playing.season
      : seasons[0].seasonNumber;

    area.innerHTML = `
      <section class="ep-section" id="${idp}episodios" aria-labelledby="${idp}ep-titulo">
        <h2 class="ep-heading" id="${idp}ep-titulo">Episodios</h2>
        <div class="ep-tabs" role="tablist" aria-label="Temporadas" data-tabs>
          ${seasons.map(s => `
            <button type="button" role="tab" class="ep-tab" id="${idp}tab-${s.seasonNumber}"
                    aria-controls="${idp}ep-panel" aria-selected="${s.seasonNumber === current}"
                    tabindex="${s.seasonNumber === current ? 0 : -1}" data-season="${s.seasonNumber}">${esc(seasonName(s.seasonNumber))}</button>`).join('')}
        </div>
        <div class="ep-panel" role="tabpanel" id="${idp}ep-panel" aria-labelledby="${idp}tab-${current}" data-panel></div>
      </section>`;

    const tabsEl = area.querySelector('[data-tabs]');
    const panel = area.querySelector('[data-panel]');
    dragToScroll(tabsEl);

    function select(seasonNumber, moveFocus) {
      current = seasonNumber;
      tabsEl.querySelectorAll('.ep-tab').forEach((tab) => {
        const on = Number(tab.dataset.season) === seasonNumber;
        tab.setAttribute('aria-selected', on ? 'true' : 'false');
        tab.tabIndex = on ? 0 : -1;
        if (on && moveFocus) tab.focus();
      });
      panel.setAttribute('aria-labelledby', `${idp}tab-${seasonNumber}`);
      load(seasonNumber);
    }

    tabsEl.addEventListener('click', (e) => {
      const tab = e.target.closest('.ep-tab');
      if (tab) select(Number(tab.dataset.season), false);
    });
    tabsEl.addEventListener('keydown', (e) => {
      const index = seasons.findIndex(s => s.seasonNumber === current);
      const targets = {
        ArrowRight: (index + 1) % seasons.length,
        ArrowLeft: (index - 1 + seasons.length) % seasons.length,
        Home: 0,
        End: seasons.length - 1
      };
      if (!(e.key in targets)) return;
      e.preventDefault();
      select(seasons[targets[e.key]].seasonNumber, true);
    });

    async function load(seasonNumber) {
      const info = seasons.find(s => s.seasonNumber === seasonNumber);
      panel.innerHTML = `
        <p class="sr-only" role="status">Cargando episodios…</p>
        <p class="ep-count">${esc(seasonName(seasonNumber))}${info ? ` · ${esc(episodeCountLabel(info.episodeCount))}` : ''}</p>
        <ul class="ep-grid" aria-hidden="true">${skeletonCardsHtml(Math.min(6, (info && info.episodeCount) || 6))}</ul>`;
      const episodes = await fetchSeasonEpisodes(item.tmdbId, seasonNumber);
      if (token !== viewToken || seasonNumber !== current) return;
      if (!episodes) {
        panel.innerHTML = `
          <p class="ep-msg">No pudimos cargar los episodios. Revisá tu conexión e intentá de nuevo.</p>
          <button type="button" class="bk-btn bk-btn-alt ep-retry" data-retry>Intentar de nuevo</button>`;
        panel.querySelector('[data-retry]').addEventListener('click', () => load(seasonNumber));
        return;
      }
      if (!episodes.length) {
        panel.innerHTML = '<p class="ep-msg">No se encontraron episodios</p>';
        return;
      }
      const isPlayingSeason = Boolean(playing) && playing.season === seasonNumber;
      panel.innerHTML = `
        <p class="ep-count">${esc(seasonName(seasonNumber))} · ${esc(episodeCountLabel(episodes.length))}</p>
        <ul class="ep-grid" data-listbox>${episodes.map(ep => episodeCardHtml(item, seasonNumber, ep,
          isPlayingSeason && ep.number === playing.episode, fallbackImage)).join('')}</ul>`;
      panel.querySelectorAll('a.ep-card').forEach((card) => {
        card.addEventListener('click', (e) => {
          if (!isPlainClick(e)) return;
          e.preventDefault();
          const ep = { season: seasonNumber, episode: Number(card.dataset.episode) };
          // En el reproductor se cambia de episodio sin apilar historial:
          // «Volver» sigue llevando a la ficha.
          goPlayer(item, ep, playing ? 'replace' : undefined);
        });
      });
      if (playing) {
        // La pestaña de la temporada que suena queda a la vista DENTRO de su
        // fila (solo la fila se corre de costado; la página no se mueve)
        showTabInRow(tabsEl, tabsEl.querySelector('[aria-selected="true"]'));
      }
    }

    load(current);
  }

  // Corre la fila de pestañas (solo la fila) si la elegida quedó afuera
  function showTabInRow(row, tab) {
    if (!row || !tab) return;
    const rowBox = row.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    const peek = 1.5 * unitPx(row);
    if (tabBox.left < rowBox.left) row.scrollLeft -= rowBox.left - tabBox.left + peek;
    else if (tabBox.right > rowBox.right) row.scrollLeft += tabBox.right - rowBox.right + peek;
  }

  // ══════════════════════════════════════════════════════════
  // VISTA DETALLE — la ficha del título, como la página de un título de la web:
  // - desde 1024 px: la foto ancha atrás, «‹ Volver» arriba a la izquierda y
  //   el texto sobre su lado izquierdo oscurecido;
  // - más angosto: la foto 16:9 arriba y el texto debajo;
  // - abajo: los episodios de una serie y «Similares».
  // ══════════════════════════════════════════════════════════
  function heroImageHtml(url) {
    if (!url) return '<span class="dt-img dt-img-empty" aria-hidden="true"></span>';
    const big = url.replace('/w780/', '/w1280/');
    const srcset = big !== url ? ` srcset="${esc(url)} 780w, ${esc(big)} 1280w" sizes="100vw"` : '';
    return `<img class="dt-img" src="${esc(url)}"${srcset} alt="" fetchpriority="high" decoding="async">`;
  }

  function roundButtonHtml(action, iconHtml, label) {
    return `
      <li>
        <button type="button" class="dt-rbtn" data-action="${action}" aria-haspopup="dialog">
          <span class="dt-rcircle" aria-hidden="true">${iconHtml}</span>
          <span class="dt-rlabel">${esc(label)}</span>
        </button>
      </li>`;
  }

  function detailHtml(item, extras) {
    const tmdb = item.tmdb || {};
    const ex = extras || {};
    const name = item.title;   // manda el titulo curado de catalog-data.js, no el de TMDB
    const isSeries = item.type === 'tv';
    const chips = chipsOf(item, ex);
    const genres = genresOf(item, ex).slice(0, 3);
    const web = hayWeb();

    return `
      <main class="dt-page">
        <section class="dt-top" aria-labelledby="dt-titulo">
          <div class="dt-picture">
            ${heroImageHtml(tmdb.backdrop || tmdb.poster)}
            <span class="dt-fade-bottom" aria-hidden="true"></span>
            <span class="dt-fade-side" aria-hidden="true"></span>
            <button type="button" class="dt-back" data-back>${ICON.back}Volver</button>
          </div>
          <div class="dt-text">
            <h1 class="dt-title" id="dt-titulo" tabindex="-1">${esc(name)}</h1>
            ${chips.length ? `<ul class="dt-chips" aria-label="Datos del título">${chips.map(c => `<li>${esc(c)}</li>`).join('')}</ul>` : ''}
            ${genres.length ? `<p class="dt-genres">${esc(genres.join(' · '))}</p>` : ''}
            ${tmdb.overview ? `<p class="dt-plot">${esc(tmdb.overview)}</p>` : ''}
            <div class="dt-actions">
              <div class="dt-long-row">
                <button type="button" class="dt-btn dt-btn-play" data-play>${ICON.play}Reproducir</button>
                ${isSeries ? `<button type="button" class="dt-btn dt-btn-alt" data-goto-episodes>${ICON.list}Episodios</button>` : ''}
                ${ex.trailerKey ? `<button type="button" class="dt-btn dt-btn-alt" data-trailer aria-haspopup="dialog">${ICON.trailer}Tráiler</button>` : ''}
              </div>
              <ul class="dt-round" aria-label="Acciones del título">
                ${roundButtonHtml('info', ICON.info, 'Más info')}
                ${web ? roundButtonHtml('save', ICON.bookmark, 'Ver luego') : ''}
                ${web ? roundButtonHtml('save', ICON.like, 'Me gusta') : ''}
                ${web ? roundButtonHtml('save', ICON.dislike, 'No me gusta') : ''}
                ${web ? roundButtonHtml('save', ICON.heart, 'Favoritos') : ''}
              </ul>
              <p class="dt-where">${web ? 'Disponible en la web, en la app y en tu tele.' : 'Disponible en la app y en tu tele.'}</p>
            </div>
          </div>
        </section>
        ${isSeries ? '<div class="dt-episodes" id="episodios-zona" tabindex="-1" data-episodes-area></div>' : ''}
        <div data-similar></div>
      </main>`;
  }

  // Lo que se ve mientras carga: la misma forma de la ficha en gris
  // («‹ Volver» ya funciona), así nada salta cuando llegan los datos.
  function detailSkeletonHtml(item) {
    const posters = '<li><span class="tcard-in"><span class="sk sk-poster"></span><span class="sk sk-line sk-line-sm sk-ptitle"></span></span></li>'.repeat(8);
    const rounds = '<span class="sk-rbtn"><span class="sk sk-circle"></span><span class="sk sk-line sk-line-xs"></span></span>'.repeat(5);
    return `
      <main class="dt-page" aria-busy="true">
        <p class="sr-only" role="status">Cargando ${esc(item.title)}…</p>
        <div class="dt-top">
          <div class="dt-picture">
            <span class="sk sk-fill"></span>
            <span class="dt-fade-bottom" aria-hidden="true"></span>
            <span class="dt-fade-side" aria-hidden="true"></span>
            <button type="button" class="dt-back" data-back>${ICON.back}Volver</button>
          </div>
          <div class="dt-text" aria-hidden="true">
            <span class="sk sk-title"></span>
            <span class="sk-chips"><span class="sk sk-chip"></span><span class="sk sk-chip"></span><span class="sk sk-chip"></span></span>
            <span class="sk sk-line" style="width:50%;max-width:calc(var(--u) * 20)"></span>
            <span class="sk-lines"><span class="sk sk-line"></span><span class="sk sk-line"></span><span class="sk sk-line" style="width:66%"></span></span>
            <span class="dt-actions">
              <span class="dt-long-row">
                <span class="sk sk-btn sk-btn-play"></span><span class="sk sk-btn" style="width:calc(var(--u) * 9)"></span><span class="sk sk-btn" style="width:calc(var(--u) * 8)"></span>
              </span>
              <span class="dt-round sk-round">${rounds}</span>
              <span class="sk sk-line sk-line-sm" style="width:calc(var(--u) * 18)"></span>
            </span>
          </div>
        </div>
        <div class="row-section" aria-hidden="true">
          <span class="sk sk-row-title"></span>
          <ul class="row-list row-list-sk">${posters}</ul>
        </div>
      </main>`;
  }

  async function renderDetail(item) {
    const token = ++viewToken;
    const root = views.detail;
    const tmdbType = item.type === 'movie' ? 'movie' : 'tv';
    document.title = `${item.title} | Bankai +`;

    // Con todo en el cache la ficha sale de una; si no, la forma gris mientras
    // llegan la ficha corta (si el grid todavía no la trajo) y la completa.
    let extras = cachedExtras(item.tmdbId, tmdbType);
    if (!(item.tmdb && extras)) {
      root.innerHTML = detailSkeletonHtml(item);
      root.querySelector('[data-back]').addEventListener('click', () => goBack(backToCatalog));
      const results = await Promise.all([
        item.tmdb ? Promise.resolve(item.tmdb) : searchTMDB(item.title, item.type, item.tmdbId),
        item.tmdbId ? fetchExtras(item.tmdbId, tmdbType) : Promise.resolve(null)
      ]);
      if (token !== viewToken) return; // el usuario ya navegó a otra cosa
      if (results[0]) item.tmdb = results[0];
      extras = results[1];
    }

    const focusWasInside = root.contains(document.activeElement) || document.activeElement === document.body;
    root.innerHTML = detailHtml(item, extras);
    wireDetail(item, extras, token);
    // Para el lector de pantalla y el teclado: la página nueva empieza en su título
    if (focusWasInside) {
      const heading = root.querySelector('#dt-titulo');
      if (heading) heading.focus({ preventScroll: true });
    }
  }

  function wireDetail(item, extras, token) {
    const root = views.detail;
    const ex = extras || {};
    root.querySelector('[data-back]').addEventListener('click', () => goBack(backToCatalog));
    root.querySelector('[data-play]').addEventListener('click', () => goPlayer(item, null));

    const trailerBtn = root.querySelector('[data-trailer]');
    if (trailerBtn) trailerBtn.addEventListener('click', () => openTrailer(item, ex.trailerKey));

    root.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.action === 'info') {
          openInfo(item, extras, {});
        } else {
          openSignInPrompt(item, 'Iniciá sesión para guardarlo',
            'Con tu cuenta, lo que marcás queda guardado y lo encontrás en la web y en la app.');
        }
      });
    });

    // «Episodios» baja hasta la lista y lleva el teclado a la temporada elegida
    const episodesBtn = root.querySelector('[data-goto-episodes]');
    const area = root.querySelector('[data-episodes-area]');
    if (episodesBtn && area) {
      episodesBtn.addEventListener('click', () => {
        const navHeight = topNav ? topNav.offsetHeight : 0;
        const top = area.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion() ? 'auto' : 'smooth' });
        const tab = area.querySelector('[role="tab"][aria-selected="true"]');
        (tab || area).focus({ preventScroll: true });
      });
    }

    if (area) mountEpisodes(area, { item, extras, token, playing: null, idPrefix: 'dt-' });

    // Similares (solo los que están en nuestro catálogo); si no hay, no aparece
    const matches = similarMatches(item, ex.recommendations);
    const holder = root.querySelector('[data-similar]');
    if (holder && matches.length) {
      holder.innerHTML = rowHtml('dt-', 'Similares', matches);
      mountRow(holder.querySelector('[data-row]'), matches, (target) => goDetail(target));
    }
  }

  // ══════════════════════════════════════════════════════════
  // VISTA REPRODUCTOR — con la forma de la página del reproductor de la web:
  // la barra de arriba, «‹ Volver» y el título, el video 16:9 (nunca más alto
  // de lo que deja ver también su barra), «Audio y subtítulos» y «Más info», y
  // abajo los episodios de una serie o «Similares» de una película.
  // Acá no hay video: al darle play aparece adentro del cuadro cómo verlo de
  // verdad (iniciar sesión en la web, registrarse o bajar la app).
  // ══════════════════════════════════════════════════════════
  function ctrlHtml(iconHtml, label, extraClass) {
    // La barra es decorativa (aria-hidden): con el teclado se usa el play grande
    return `<button type="button" class="pl-ctrl${extraClass ? ' ' + extraClass : ''}" tabindex="-1" title="${esc(label)}" data-gate-open>${iconHtml}</button>`;
  }

  function frameImageHtml(url) {
    if (!url) return '<span class="pl-frame pl-frame-empty"></span>';
    const big = url.replace('/w780/', '/w1280/');
    const srcset = big !== url ? ` srcset="${esc(url)} 780w, ${esc(big)} 1280w" sizes="(min-width: 1200px) 1152px, 100vw"` : '';
    return `<img class="pl-frame" src="${esc(url)}"${srcset} alt="" decoding="async">`;
  }

  function gateHtml(item) {
    const name = esc(item.title);
    if (!hayWeb()) {
      // Sin web configurada: el muro de registro de siempre
      const price = (typeof CONFIG !== 'undefined' && CONFIG.pricing && CONFIG.pricing.usd && CONFIG.pricing.usd.basic) || 6;
      return `
        <div class="pl-gate-box">
          <button type="button" class="pl-gate-x" data-gate-close aria-label="Cerrar">${ICON.close}</button>
          <p class="pl-gate-eyebrow">Contenido para suscriptores</p>
          <h2 class="pl-gate-title" tabindex="-1" data-gate-title>Para ver ${name}, activá tu cuenta</h2>
          <p class="pl-gate-text">Activá tu cuenta y mirá esto — y todo el catálogo — en Full HD 1080p desde $${esc(price)} USD al mes.</p>
          <div class="pl-gate-actions">
            <a class="bk-btn bk-btn-red" href="${esc(registerHref())}" target="_blank" rel="noopener">Registrate · 1 mes gratis</a>
            <a class="bk-btn bk-btn-alt" href="../descargar">Descargar la app</a>
          </div>
        </div>`;
    }
    return `
      <div class="pl-gate-box">
        <button type="button" class="pl-gate-x" data-gate-close aria-label="Cerrar">${ICON.close}</button>
        <h2 class="pl-gate-title" tabindex="-1" data-gate-title>Para ver ${name}, iniciá sesión</h2>
        <p class="pl-gate-text">Miralo en la web desde la compu o el celular, en la app de Android y Android TV, o en tu tele con Chromecast.</p>
        <div class="pl-gate-actions">
          <a class="bk-btn bk-btn-red" href="${esc(webOpenHref(item))}">Iniciar sesión y ver</a>
          <a class="bk-btn bk-btn-alt" href="${esc(registerHref())}" target="_blank" rel="noopener">Registrate · 1 mes gratis<span class="sr-only"> (se abre en otra pestaña)</span></a>
          <a class="bk-btn bk-btn-alt" href="../descargar">Descargar la app</a>
        </div>
        <p class="pl-gate-note">Es el mismo usuario y contraseña de la app.</p>
      </div>`;
  }

  function playerHtml(item, frameUrl, durationText) {
    const isSeries = item.type === 'tv';
    return `
      <main class="pl-page" data-page>
        <div class="pl-column">
          <div class="pl-heading" data-heading>
            <button type="button" class="pl-back" data-back>${ICON.back}Volver</button>
            <h1 class="pl-title" id="pl-titulo" tabindex="-1">${esc(item.title)}<span class="pl-ep" data-ep-line hidden></span></h1>
          </div>
          <section class="pl-area" aria-label="Video" tabindex="-1" data-area>
            <div class="pl-video" data-video>
              <div class="pl-media">
                <span data-frame>${frameImageHtml(frameUrl)}</span>
                <span class="pl-shade" aria-hidden="true"></span>
                <button type="button" class="pl-bigplay" data-gate-open data-bigplay aria-label="Reproducir ${esc(item.title)}">${ICON.play}</button>
                <div class="pl-bar" aria-hidden="true">
                  <div class="pl-progress" data-gate-open><span class="pl-progress-knob"></span></div>
                  <div class="pl-bar-row">
                    <div class="pl-bar-side">
                      ${ctrlHtml(ICON.play, 'Reproducir')}
                      ${ctrlHtml(ICON.rewind, 'Retroceder 10 segundos', 'pl-ctrl-wide')}
                      ${ctrlHtml(ICON.forward, 'Adelantar 10 segundos', 'pl-ctrl-wide')}
                      ${ctrlHtml(ICON.volume, 'Volumen')}
                      <span class="pl-time" data-time>0:00${durationText ? ` / ${esc(durationText)}` : ''}</span>
                    </div>
                    <div class="pl-bar-side">
                      ${ctrlHtml(ICON.captions, 'Subtítulos')}
                      ${ctrlHtml(ICON.settings, 'Configuración', 'pl-ctrl-wide')}
                      ${ctrlHtml(ICON.pip, 'Imagen en imagen', 'pl-ctrl-wide')}
                      ${ctrlHtml(ICON.fullscreen, 'Pantalla completa')}
                    </div>
                  </div>
                </div>
              </div>
              <div class="pl-gate" data-gate hidden>${gateHtml(item)}</div>
            </div>
            <div class="pl-toolbar">
              ${hayWeb() ? `<button type="button" class="pl-tool" data-tracks aria-haspopup="dialog">${ICON.captions}Audio y subtítulos</button>` : ''}
              <button type="button" class="pl-tool" data-info aria-haspopup="dialog">${ICON.info}Más info</button>
            </div>
          </section>
        </div>
        ${isSeries
          ? `<div class="pl-below" data-episodes-area>${episodesSkeletonHtml()}</div>`
          : '<div class="pl-below pl-below-row" data-similar></div>'}
      </main>`;
  }

  // «Volver» va en el margen izquierdo cuando entra, así el título queda
  // alineado con el borde del video; si no hay lugar, va al lado del título.
  function placeBack(root) {
    const heading = root.querySelector('[data-heading]');
    const back = heading && heading.querySelector('.pl-back');
    if (!heading || !back) return;
    heading.classList.remove('is-gutter');
    const unit = unitPx(heading);
    const room = heading.getBoundingClientRect().left - unit;
    const need = back.getBoundingClientRect().width + 0.5 * unit;
    heading.classList.toggle('is-gutter', room >= need);
  }

  function setFrame(root, url) {
    const holder = root.querySelector('[data-frame]');
    if (holder && url) holder.innerHTML = frameImageHtml(url);
  }

  async function renderPlayer(item, askedEp) {
    const token = ++viewToken;
    const root = views.player;
    const isSeries = item.type === 'tv';
    const tmdbType = isSeries ? 'tv' : 'movie';
    const ctx = { extras: cachedExtras(item.tmdbId, tmdbType), episode: null };
    const firstTmdb = item.tmdb || {};
    const firstFrame = firstTmdb.backdrop || firstTmdb.poster || '';
    document.title = `${item.title} | Bankai +`;

    root.innerHTML = playerHtml(item, firstFrame, !isSeries && ctx.extras ? clockLabel(ctx.extras.runtime) : null);
    wirePlayer(item, ctx);
    placeBack(root);
    const onResize = () => placeBack(root);
    window.addEventListener('resize', onResize, { passive: true });
    viewCleanups.push(() => window.removeEventListener('resize', onResize));
    // Para el lector de pantalla y el teclado: la página nueva empieza en su título
    root.querySelector('#pl-titulo').focus({ preventScroll: true });

    const results = await Promise.all([
      item.tmdb ? Promise.resolve(item.tmdb) : searchTMDB(item.title, item.type, item.tmdbId),
      ctx.extras ? Promise.resolve(ctx.extras) : (item.tmdbId ? fetchExtras(item.tmdbId, tmdbType) : Promise.resolve(null))
    ]);
    if (token !== viewToken) return;
    if (results[0]) item.tmdb = results[0];
    ctx.extras = results[1];
    const tmdb = item.tmdb || {};
    if (!firstFrame) setFrame(root, tmdb.backdrop || tmdb.poster);

    if (!isSeries) {
      const clock = ctx.extras ? clockLabel(ctx.extras.runtime) : null;
      const timeEl = root.querySelector('[data-time]');
      if (timeEl && clock) timeEl.textContent = `0:00 / ${clock}`;
      const matches = similarMatches(item, ctx.extras && ctx.extras.recommendations);
      const holder = root.querySelector('[data-similar]');
      if (holder && matches.length) {
        holder.innerHTML = rowHtml('pl-', 'Similares', matches);
        mountRow(holder.querySelector('[data-row]'), matches, (target) => goDetail(target));
      }
      return;
    }

    // Serie: el episodio pedido o, si no se pidió ninguno, el primero
    const area = root.querySelector('[data-episodes-area]');
    const seasons = (ctx.extras && ctx.extras.seasons) || [];
    if (!seasons.length) {
      mountEpisodes(area, { item, extras: ctx.extras, token, playing: null, idPrefix: 'pl-' });
      return;
    }
    const season = askedEp && seasons.some(s => s.seasonNumber === askedEp.season)
      ? askedEp.season
      : seasons[0].seasonNumber;
    const episodes = await fetchSeasonEpisodes(item.tmdbId, season);
    if (token !== viewToken) return;
    const playingEp = episodes && episodes.length
      ? ((askedEp && askedEp.season === season && episodes.find(e => e.number === askedEp.episode)) || episodes[0])
      : null;
    if (playingEp) {
      ctx.episode = {
        season: season,
        episode: playingEp.number,
        name: episodeRealName(playingEp),
        plot: playingEp.overview
      };
      const line = root.querySelector('[data-ep-line]');
      line.textContent = `${episodeShortLabel(season, playingEp.number)}${ctx.episode.name ? ` · ${ctx.episode.name}` : ''}`;
      line.hidden = false;
      if (playingEp.still) setFrame(root, playingEp.still);
      const clock = clockLabel(playingEp.runtime);
      const timeEl = root.querySelector('[data-time]');
      if (timeEl && clock) timeEl.textContent = `0:00 / ${clock}`;
      const bigPlay = root.querySelector('[data-bigplay]');
      if (bigPlay) bigPlay.setAttribute('aria-label', `Reproducir ${item.title}, ${episodeShortLabel(season, playingEp.number)}`);
      placeBack(root);
    }
    mountEpisodes(area, {
      item, extras: ctx.extras, token, idPrefix: 'pl-',
      playing: playingEp ? { season, episode: playingEp.number } : { season, episode: -1 }
    });
  }

  function wirePlayer(item, ctx) {
    const root = views.player;
    const video = root.querySelector('[data-video]');
    const gate = root.querySelector('[data-gate]');
    const bigPlay = root.querySelector('[data-bigplay]');

    root.querySelector('[data-back]').addEventListener('click', () => goBack(() => goDetail(item, 'replace')));

    // Darle play (al botón grande o a cualquier control de la barra) muestra
    // adentro del cuadro cómo verlo. Sin cargas de mentira: aparece al instante.
    function openGate() {
      if (!gate.hidden) return;
      gate.hidden = false;
      video.classList.add('is-gated');
      const title = gate.querySelector('[data-gate-title]');
      if (title) title.focus({ preventScroll: true });
      // En el celular el aviso puede quedar más abajo: que se vea entero
      const box = video.getBoundingClientRect();
      if (box.bottom > window.innerHeight || box.top < 0) {
        video.scrollIntoView({ block: 'nearest', behavior: reduceMotion() ? 'auto' : 'smooth' });
      }
    }
    function closeGate() {
      if (gate.hidden) return;
      gate.hidden = true;
      video.classList.remove('is-gated');
      if (bigPlay) bigPlay.focus({ preventScroll: true });
    }
    root.querySelectorAll('[data-gate-open]').forEach((el) => el.addEventListener('click', openGate));
    gate.querySelectorAll('[data-gate-close]').forEach((el) => el.addEventListener('click', closeGate));
    video.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !gate.hidden) { e.preventDefault(); closeGate(); }
    });

    const tracks = root.querySelector('[data-tracks]');
    if (tracks) {
      tracks.addEventListener('click', () => openSignInPrompt(item,
        'Iniciá sesión para elegir audio y subtítulos',
        'El audio y los subtítulos se eligen en el reproductor de la web o de la app, con tu cuenta.',
        'Iniciar sesión y ver'));
    }
    root.querySelector('[data-info]').addEventListener('click', () => {
      openInfo(item, ctx.extras, { player: true, episode: ctx.episode });
    });
  }

  // ══════════════════════════════════════════════════════════
  // SORT
  // ══════════════════════════════════════════════════════════
  // Compares two possibly-missing numeric values so that missing values
  // (NaN — TMDB data not loaded yet, or no year/rating) always sort last,
  // regardless of ascending/descending direction.
  function compareWithMissingLast(a, b, ascending) {
    const aMissing = isNaN(a);
    const bMissing = isNaN(b);
    if (aMissing && bMissing) return 0;
    if (aMissing) return 1;
    if (bMissing) return -1;
    return ascending ? a - b : b - a;
  }

  function sortItems(items) {
    if (sortOption === 'relevance') return items; // keep original filter order

    items.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
        case 'name-desc': {
          const nameA = (a.tmdb && a.tmdb.name) || a.title;
          const nameB = (b.tmdb && b.tmdb.name) || b.title;
          const cmp = nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
          return sortOption === 'name-asc' ? cmp : -cmp;
        }
        case 'year-desc':
        case 'year-asc': {
          const yearA = (a.tmdb && a.tmdb.year) ? parseInt(a.tmdb.year, 10) : NaN;
          const yearB = (b.tmdb && b.tmdb.year) ? parseInt(b.tmdb.year, 10) : NaN;
          return compareWithMissingLast(yearA, yearB, sortOption === 'year-asc');
        }
        case 'rating-desc':
        case 'rating-asc': {
          const ratingA = (a.tmdb && a.tmdb.rating) ? parseFloat(a.tmdb.rating) : NaN;
          const ratingB = (b.tmdb && b.tmdb.rating) ? parseFloat(b.tmdb.rating) : NaN;
          return compareWithMissingLast(ratingA, ratingB, sortOption === 'rating-asc');
        }
        default:
          return 0;
      }
    });
    return items;
  }

  // ══════════════════════════════════════════════════════════
  // FILTER + SEARCH
  // ══════════════════════════════════════════════════════════
  function applyFilters() {
    filteredItems = allItems.filter(item => {
      // Tipo: viene de item.type, no de category — así "anime" o "infantil"
      // (que en category reemplazan a "series"/"peliculas") se pueden combinar
      // con Series o Películas sin perder de cuál de las dos se trata.
      if (activeTypeFilter !== 'all') {
        const wantTv = activeTypeFilter === 'series';
        if ((item.type === 'tv') !== wantTv) return false;
      }
      // Género (incluye Anime e Infantil)
      if (activeCategoryFilter !== 'all') {
        const cats = item.category.split(',').map(c => c.trim());
        if (!cats.includes(activeCategoryFilter)) return false;
      }
      // Búsqueda: por el título que se muestra, por los alias que trae
      // catalog-data.js (nombre en inglés y original) y por el que devolvió
      // TMDB. Así "Jeepers Creepers" también aparece buscando "El demonio",
      // y "El Padrino" buscando "The Godfather".
      if (searchTerm) {
        const donde = [item.title].concat(item.alt || []);
        if (item.tmdb && item.tmdb.name) donde.push(item.tmdb.name);
        const s = plano(searchTerm);
        if (s) {
          if (!donde.some(x => plano(x).includes(s))) return false;
        } else {
          // El término no deja nada al normalizar: es japonés, coreano, etc.
          // Se compara en crudo; si no, plano() lo dejaba vacío y el filtro
          // daba por buenos los 1349 títulos.
          const bruto = searchTerm.trim().toLowerCase();
          if (!donde.some(x => String(x).toLowerCase().includes(bruto))) return false;
        }
      }
      // Year filter (ranges, since exact years arrive progressively from TMDB)
      if (yearFilter !== 'all') {
        const year = (item.tmdb && item.tmdb.year) ? parseInt(item.tmdb.year, 10) : NaN;
        if (isNaN(year)) return false; // TMDB data not loaded yet — hide until known
        if (yearFilter === '2020-2026' && !(year >= 2020 && year <= 2026)) return false;
        if (yearFilter === '2010-2019' && !(year >= 2010 && year <= 2019)) return false;
        if (yearFilter === '2000-2009' && !(year >= 2000 && year <= 2009)) return false;
        if (yearFilter === 'pre2000' && !(year < 2000)) return false;
      }
      // Rating filter
      if (ratingFilter !== 'all') {
        const rating = (item.tmdb && item.tmdb.rating) ? parseFloat(item.tmdb.rating) : NaN;
        if (isNaN(rating)) return false; // TMDB data not loaded yet — hide until known
        if (rating < parseFloat(ratingFilter)) return false;
      }
      return true;
    });
    sortItems(filteredItems);
    renderGrid(filteredItems);
    syncFilterUrl();
  }

  // ── Filtros en la URL ──
  // /catalog/?tipo=series&genero=anime&q=naruto&anio=2020-2026&rating=8&orden=year-desc
  // Así un correo (o un mensaje) abre el catálogo ya filtrado, y al filtrar la
  // URL cambia para que se pueda compartir. Solo se aceptan valores que existen
  // en los botones y listas de la página; lo demás se ignora.
  function filterQuery() {
    const params = new URLSearchParams();
    if (activeTypeFilter !== 'all') params.set('tipo', activeTypeFilter);
    if (activeCategoryFilter !== 'all') params.set('genero', activeCategoryFilter);
    if (searchTerm) params.set('q', searchTerm);
    if (yearFilter !== 'all') params.set('anio', yearFilter);
    if (ratingFilter !== 'all') params.set('rating', ratingFilter);
    if (sortOption !== 'relevance') params.set('orden', sortOption);
    const qs = params.toString();
    return qs ? `?${qs}` : '';
  }

  function syncFilterUrl() {
    // En el detalle o el reproductor la URL es ?v=<título>: esa no se toca
    const state = history.state || {};
    if (state.view && state.view !== 'catalog') return;
    if (new URLSearchParams(location.search).has('v')) return;
    const next = location.pathname + filterQuery();
    if (next !== location.pathname + location.search) {
      history.replaceState({ view: 'catalog', inApp: Boolean(state.inApp) }, '', next);
    }
  }

  function readFiltersFromUrl(params) {
    const pick = (value, allowed) => (value && allowed.includes(value) ? value : null);
    const tipo = pick(params.get('tipo'), Array.from(filterTypeTags, t => t.dataset.filter));
    const genero = pick(params.get('genero'), Array.from(filterGenreTags, t => t.dataset.filter));
    const anio = pick(params.get('anio'), Array.from(yearFilterEl.options, o => o.value));
    const rating = pick(params.get('rating'), Array.from(ratingFilterEl.options, o => o.value));
    const orden = pick(params.get('orden'), Array.from(sortEl.options, o => o.value));
    const q = (params.get('q') || '').trim().slice(0, 80);
    if (tipo) { activeTypeFilter = tipo; filterTypeTags.forEach(t => t.classList.toggle('active', t.dataset.filter === tipo)); }
    if (genero) { activeCategoryFilter = genero; filterGenreTags.forEach(t => t.classList.toggle('active', t.dataset.filter === genero)); }
    if (anio) { yearFilter = anio; yearFilterEl.value = anio; }
    if (rating) { ratingFilter = rating; ratingFilterEl.value = rating; }
    if (orden) { sortOption = orden; sortEl.value = orden; }
    if (q) { searchTerm = q; searchInput.value = q; searchClear.style.display = 'block'; }
    return Boolean(tipo || genero || anio || rating || orden || q);
  }

  // ── Filter tag clicks — dos grupos independientes que se combinan con Y ──
  filterTypeTags.forEach(tag => {
    tag.addEventListener('click', () => {
      filterTypeTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      activeTypeFilter = tag.dataset.filter;
      applyFilters();
    });
  });

  filterGenreTags.forEach(tag => {
    tag.addEventListener('click', () => {
      filterGenreTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      activeCategoryFilter = tag.dataset.filter;
      applyFilters();
    });
  });

  // ── Search input ──
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTerm = searchInput.value.trim();
    searchClear.style.display = searchTerm ? 'block' : 'none';
    searchTimeout = setTimeout(applyFilters, 200);
  });

  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchTerm = '';
    searchClear.style.display = 'none';
    applyFilters();
    searchInput.focus();
  });

  // ── Year / rating filter dropdowns ──
  yearFilterEl.addEventListener('change', () => {
    yearFilter = yearFilterEl.value;
    applyFilters();
  });

  ratingFilterEl.addEventListener('change', () => {
    ratingFilter = ratingFilterEl.value;
    applyFilters();
  });

  // ── Sort dropdown ──
  sortEl.addEventListener('change', () => {
    sortOption = sortEl.value;
    applyFilters();
  });

  // ══════════════════════════════════════════════════════════
  // INIT — Load data + fetch TMDB in batches
  // ══════════════════════════════════════════════════════════
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  async function init() {
    // Al recargar, la página siempre arranca desde arriba — el navegador si no
    // restaura el scroll anterior y el usuario aterriza a mitad del catálogo.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    toTop();

    // Orden aleatorio en cada carga de página (afecta el orden "Relevancia")
    // OJO: 'tmdb' en catalog-data.js es el ID; aqui la propiedad 'tmdb' pasa a
    // guardar la ficha ya descargada. Si no se copia el id a 'tmdbId' primero,
    // el `tmdb: null` lo borra y la consulta se queda sin id (era justo lo que
    // hacia que la web terminara buscando por titulo).
    allItems = shuffle(CATALOG_DATA.map(item => ({ ...item, tmdbId: item.tmdb, tmdb: null })));

    // Render immediately with empty posters
    filteredItems = allItems;
    renderGrid(filteredItems);
    loading.style.display = 'none';

    // Filtros que vienen en la URL (?tipo=series&genero=anime…)
    const params = new URLSearchParams(location.search);
    if (readFiltersFromUrl(params)) applyFilters();

    // Enlace directo: /catalog/?v=<título>[&play=1[&t=1&e=3]] abre esa pantalla al cargar
    const deepLink = params.get('v');
    if (deepLink) {
      const item = findItemByTitle(deepLink);
      if (item) {
        // La ficha queda debajo en el historial: «Volver» del reproductor lleva a ella
        history.replaceState({ view: 'detail', title: item.title }, '',
          `${location.pathname}?v=${encodeURIComponent(item.title)}`);
        if (params.get('play') === '1') {
          const ep = item.type === 'tv' ? validEp({ season: params.get('t'), episode: params.get('e') }) : null;
          goPlayer(item, ep);
        } else {
          goDetail(item, 'none');
        }
      }
    }

    // Fetch TMDB data in batches (to not overwhelm the API)
    const BATCH_SIZE = 8;
    const DELAY = 100; // ms between batches

    for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
      const batch = allItems.slice(i, i + BATCH_SIZE);
      const promises = batch.map(item => searchTMDB(item.title, item.type, item.tmdbId));
      const results = await Promise.all(promises);

      results.forEach((tmdbData, idx) => {
        // La ficha abierta pudo haberla traído antes: no se pisa con un null
        if (tmdbData || !allItems[i + idx].tmdb) allItems[i + idx].tmdb = tmdbData;
      });

      // Si hay filtros/orden que dependen de los datos de TMDB, el conjunto visible
      // puede cambiar y toca recalcular. Si no, basta con rellenar las tarjetas de
      // esta tanda en el sitio — así el grid no se reconstruye y el hover no salta.
      const affectsVisibleSet = yearFilter !== 'all' || ratingFilter !== 'all'
        || sortOption !== 'relevance' || !!searchTerm;
      if (affectsVisibleSet) {
        applyFilters();
      } else {
        patchCards(batch);
      }

      // Save cache periodically
      if (i % (BATCH_SIZE * 5) === 0) saveCache();

      // Small delay to respect rate limits
      if (i + BATCH_SIZE < allItems.length) {
        await new Promise(r => setTimeout(r, DELAY));
      }
    }

    // Final save
    saveCache();
    applyFilters();
  }

  init();
})();
