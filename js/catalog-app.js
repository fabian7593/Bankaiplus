/**
 * BANKAI + — CATALOG APP
 * Busca posters en TMDB, renderiza el grid, filtros y búsqueda.
 * Fallback: logo de Bankai + si no encuentra el título.
 */

(function () {
  'use strict';

  // ── TMDB Config ──
  const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOGRhNDI0NWM3YTRhYzc3YWJhNWIxMjllNWM5YjkxMiIsInN1YiI6IjY1MTI0Njc2YTkxMTdmMDBlMTkzOWEwYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.v0A7A94gXqXaIc3xQsOsAozFXYC3cIILkSgi3rLRfZQ';
  const TMDB_IMG = 'https://image.tmdb.org/t/p/w500';
  const TMDB_IMG_BACKDROP = 'https://image.tmdb.org/t/p/w780';
  const CACHE_KEY = 'bankaiplus_tmdb_cache';
  const CACHE_VERSION = 5; // bumped: la clave del cache es el id de TMDB, ya no el titulo
  const EXTRAS_CACHE_KEY = 'bankaiplus_tmdb_extras_cache';
  const EXTRAS_CACHE_VERSION = 2; // bumped: recommendations now carry poster_path

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
  let extrasCache = loadExtrasCache(); // seasons/trailer data, fetched on-demand when a modal opens

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
  // TMDB DETAILS — trailer + temporadas (fetched on-demand, solo al abrir un modal)
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

  async function fetchExtras(tmdbId, tmdbType) {
    const key = `${tmdbType}_${tmdbId}`;
    if (extrasCache[key]) return extrasCache[key];

    try {
      // include_video_language es necesario: TMDB filtra /videos por idioma exacto,
      // y casi ningún tráiler está etiquetado "es-MX" — sin esto, videos.results
      // viene casi siempre vacío y el botón "Ver tráiler" nunca aparecería.
      const url = `https://api.themoviedb.org/3/${tmdbType}/${tmdbId}`
        + `?append_to_response=videos,recommendations&language=es-MX&include_video_language=es,en,null`;
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${TMDB_TOKEN}` } });
      if (!res.ok) return null;
      const data = await res.json();
      const trailer = findTrailer(data.videos);

      const extras = {
        trailerKey: trailer ? trailer.key : null,
        seasons: tmdbType === 'tv'
          ? (data.seasons || [])
              .filter(s => s.episode_count > 0)
              .map(s => ({
                seasonNumber: s.season_number,
                // Etiqueta uniforme: muchas series nombran sus temporadas con el
                // título del show ("Stranger Things 2"), lo que en las tabs se ve
                // repetitivo. Usamos siempre "Temporada N" / "Especiales".
                name: s.season_number === 0 ? 'Especiales' : `Temporada ${s.season_number}`,
                episodeCount: s.episode_count
              }))
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
          .slice(0, 40)
      };
      extrasCache[key] = extras;
      saveExtrasCache();
      return extras;
    } catch (e) {
      return null;
    }
  }

  async function fetchSeasonEpisodes(tmdbId, seasonNumber) {
    const key = `season_${tmdbId}_${seasonNumber}`;
    if (extrasCache[key]) return extrasCache[key];

    try {
      const url = `https://api.themoviedb.org/3/tv/${tmdbId}/season/${seasonNumber}?language=es-MX`;
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${TMDB_TOKEN}` } });
      if (!res.ok) return null;
      const data = await res.json();
      const episodes = (data.episodes || []).map(ep => ({
        number: ep.episode_number,
        name: ep.name || '',
        overview: ep.overview || '',
        still: ep.still_path ? TMDB_IMG_BACKDROP + ep.still_path : null,
        airDate: ep.air_date || ''
      }));
      extrasCache[key] = episodes;
      saveExtrasCache();
      return episodes;
    } catch (e) {
      return null;
    }
  }

  // Texto comparable para buscar: sin acentos, sin signos y en minúscula.
  // Así "el señor de los anillos" también sale escribiendo "senor" o "Señor:".
  function plano(str) {
    return String(str == null ? '' : str)
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

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

  // Reconcilia el grid en vez de reconstruirlo entero. Con TMDB llegando en
  // tandas, applyFilters() puede correr muchas veces por segundo (p. ej. con
  // una búsqueda activa); si cada corrida hacía grid.innerHTML = ..., TODAS las
  // tarjetas se destruían y recreaban, y la que estaba bajo el cursor perdía y
  // recuperaba el :hover en cada tanda — de ahí la animación saltando sin fin.
  // Acá una tarjeta que ya existe y sigue en su posición no se toca para nada.
  function renderGrid(items) {
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
  // ══════════════════════════════════════════════════════════
  const views = {
    catalog: document.getElementById('view-catalog'),
    detail: document.getElementById('view-detail'),
    player: document.getElementById('view-player')
  };

  let currentItem = null;      // título abierto en la vista de detalle
  let gridScrollY = 0;         // dónde estaba el usuario en el grid, para devolverlo ahí
  let detailToken = 0;         // invalida renders viejos si el usuario navega rápido

  function toTop() {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  function setView(name) {
    // Salir del reproductor cancela la carga simulada: si el usuario se fue antes
    // de los 3s, el paywall no debe aparecer sobre una pantalla que ya no se ve.
    if (name !== 'player') clearPlayerLoad();
    Object.keys(views).forEach((key) => {
      const isActive = key === name;
      views[key].classList.toggle('is-active', isActive);
      views[key].setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });
    // El reproductor es un takeover: bloquea el scroll de la página detrás y
    // esconde los botones flotantes (taparían los controles y el CTA ya está adentro).
    document.body.style.overflow = name === 'player' ? 'hidden' : '';
    document.body.classList.toggle('player-open', name === 'player');
    // En la ficha ya hay un "Volver al catálogo": el "Volver al inicio" del nav
    // duplicaría la acción de retroceso y confunde.
    document.body.classList.toggle('detail-open', name === 'detail');
  }

  function findItemByTitle(title) {
    return allItems.find(i => i.title === title) || null;
  }

  // ── Router ──
  function goCatalog(push = true) {
    currentItem = null;
    detailToken++;
    setView('catalog');
    if (push) history.pushState({ view: 'catalog' }, '', location.pathname);
    // Devolvemos al usuario justo donde estaba mirando el grid
    window.scrollTo({ top: gridScrollY, left: 0, behavior: 'instant' });
  }

  function goDetail(item, push = true) {
    if (!item) return;
    const fromDetail = views.detail.classList.contains('is-active');
    if (views.catalog.classList.contains('is-active')) gridScrollY = window.scrollY;
    currentItem = item;
    setView('detail');
    toTop();
    if (push) {
      const state = { view: 'detail', title: item.title };
      const url = `${location.pathname}?v=${encodeURIComponent(item.title)}`;
      // Saltar de una ficha a otra por "Similares" reemplaza la entrada actual en
      // vez de apilar: desde cualquier ficha, atrás siempre devuelve al catálogo.
      // Si no, encadenar similares generaría un historial infinito.
      if (fromDetail) history.replaceState(state, '', url);
      else history.pushState(state, '', url);
    }
    renderDetail(item);
  }

  function goPlayer(item, contextLabel, bgImage, push = true) {
    if (!item) return;
    currentItem = item;
    renderPlayer(item, contextLabel, bgImage);
    setView('player');
    if (push) {
      // El still del episodio viaja en el state para que atrás/adelante vuelvan a
      // mostrar el mismo frame de fondo y no el backdrop genérico de la serie.
      history.pushState({ view: 'player', title: item.title, ctx: contextLabel || '', bg: bgImage || '' }, '',
        `${location.pathname}?v=${encodeURIComponent(item.title)}&play=1`);
    }
  }

  window.addEventListener('popstate', (e) => {
    const state = e.state || {};
    if (state.view === 'player') {
      const item = findItemByTitle(state.title);
      if (item) { renderPlayer(item, state.ctx, state.bg); currentItem = item; setView('player'); return; }
    }
    if (state.view === 'detail') {
      const item = findItemByTitle(state.title);
      if (item) { currentItem = item; setView('detail'); toTop(); renderDetail(item); return; }
    }
    goCatalog(false);
  });

  // Esc: reproductor → detalle → catálogo
  function handleEsc(e) {
    if (e.key !== 'Escape') return;
    if (views.player.classList.contains('is-active') || views.detail.classList.contains('is-active')) {
      history.back();
    }
  }
  document.addEventListener('keydown', handleEsc);

  // ══════════════════════════════════════════════════════════
  // VISTA DETALLE
  // ══════════════════════════════════════════════════════════
  const ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  const ICON_BACK = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>';
  const ICON_YT = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.8 8.2s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C16 5 12 5 12 5h0s-4 0-6.9.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2 10 2 11.7v1.6C2 15 2.2 16.7 2.2 16.7s.2 1.5.8 2.1c.8.8 1.8.8 2.3.9 1.7.2 7.7.2 7.7.2s4 0 6.9-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.4v-1.6c0-1.7-.2-3.4-.2-3.4zM9.9 15.3V8.4l6.1 3.5-6.1 3.4z"/></svg>';
  const ICON_WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  function waLink(title) {
    return `https://wa.me/50661719869?text=${encodeURIComponent('Hola! Me interesa ver ' + title + ' en Bankai + ⚔️')}`;
  }

  function detailHtml(item) {
    const tmdb = item.tmdb || {};
    const typeLabel = item.type === 'tv' ? 'Serie' : 'Película';
    const name = item.title;   // manda el titulo curado de catalog-data.js, no el de TMDB
    const backdrop = tmdb.backdrop || '';

    const meta = [];
    if (tmdb.rating) meta.push(`<span class="detail-rating">★ ${escapeHtml(tmdb.rating)}</span>`);
    if (tmdb.year) meta.push(`<span>${escapeHtml(tmdb.year)}</span>`);
    meta.push(`<span class="detail-badge">${typeLabel}</span>`);
    if (item.seasons) meta.push(`<span>${escapeHtml(item.seasons)} temporadas</span>`);
    if (item.category) {
      const genres = item.category.split(',').map(c => c.trim())
        .filter(c => c && !MAIN_CATEGORIES.includes(c))
        .map(c => GENRE_LABELS[c] || c);
      if (genres.length) meta.push(`<span>${escapeHtml(genres.join(' · '))}</span>`);
    }

    return `
      <section class="detail-hero${backdrop ? '' : ' detail-hero-empty'}">
        ${backdrop ? `<div class="detail-hero-bg" style="background-image:url('${backdrop}')"></div>` : ''}
        <button type="button" class="detail-back" data-back>${ICON_BACK} Volver al catálogo</button>
        <div class="detail-hero-inner">
          ${tmdb.poster ? `<div class="detail-poster"><img src="${tmdb.poster}" alt="${escapeHtml(name)}"></div>` : ''}
          <div class="detail-headline">
            <h1 class="detail-title">${escapeHtml(name)}</h1>
            <div class="detail-meta">${meta.join('<span class="detail-dot">·</span>')}</div>
            <div class="detail-actions">
              <button type="button" class="btn-play" data-play>${ICON_PLAY} Reproducir</button>
              <a class="btn-ghost" data-trailer href="#" target="_blank" rel="noopener" hidden>${ICON_YT} Ver tráiler</a>
            </div>
          </div>
        </div>
      </section>

      <div class="detail-body">
        ${tmdb.overview ? `<p class="detail-overview">${escapeHtml(tmdb.overview)}</p>` : ''}

        ${item.type === 'tv' ? `
          <section class="detail-section" data-seasons hidden>
            <div class="detail-section-head">
              <h2 class="detail-section-title">Episodios</h2>
              <div class="season-tabs" data-season-tabs></div>
            </div>
            <div data-episodes><p class="detail-state">Cargando episodios...</p></div>
          </section>` : ''}

        <section class="detail-section" data-similar hidden>
          <div class="detail-section-head">
            <h2 class="detail-section-title">Similares en Bankai +</h2>
          </div>
          <div class="similar-grid" data-similar-grid></div>
        </section>
      </div>`;
  }

  function detailSkeleton() {
    return `
      <section class="detail-hero detail-hero-empty">
        <button type="button" class="detail-back" data-back>${ICON_BACK} Volver al catálogo</button>
      </section>
      <div class="detail-body"><p class="detail-state">Cargando título...</p></div>`;
  }

  async function renderDetail(item) {
    const token = ++detailToken;

    // Los datos de TMDB llegan por tandas; si el usuario abre algo que todavía
    // no cargó, lo pedimos en el momento en vez de mostrar una ficha vacía.
    if (!item.tmdb) {
      views.detail.innerHTML = detailSkeleton();
      views.detail.querySelector('[data-back]').addEventListener('click', () => history.back());
      const fetched = await searchTMDB(item.title, item.type, item.tmdbId);
      if (token !== detailToken) return; // el usuario ya navegó a otra cosa
      item.tmdb = fetched;
    }

    views.detail.innerHTML = detailHtml(item);
    wireDetail(item);
    loadDetailExtras(item, token);
  }

  function wireDetail(item) {
    const root = views.detail;
    root.querySelector('[data-back]').addEventListener('click', () => history.back());
    root.querySelector('[data-play]').addEventListener('click', () => goPlayer(item, null, null));
  }

  async function loadDetailExtras(item, token) {
    const tmdb = item.tmdb || {};
    const root = views.detail;
    if (!tmdb.id) {
      const section = root.querySelector('[data-seasons]');
      if (section) {
        section.hidden = false;
        section.querySelector('[data-episodes]').innerHTML =
          '<p class="detail-state">No hay información de episodios disponible.</p>';
      }
      return;
    }

    const extras = await fetchExtras(tmdb.id, tmdb.tmdbType || item.type);
    if (token !== detailToken || !extras) return;

    // Tráiler
    if (extras.trailerKey) {
      const link = root.querySelector('[data-trailer]');
      if (link) {
        link.href = `https://www.youtube.com/watch?v=${extras.trailerKey}`;
        link.hidden = false;
      }
    }

    // Temporadas + episodios
    if (item.type === 'tv') {
      const section = root.querySelector('[data-seasons]');
      if (section) {
        section.hidden = false;
        if (extras.seasons && extras.seasons.length) {
          renderSeasonTabs(item, tmdb.id, extras.seasons, token);
        } else {
          section.querySelector('[data-episodes]').innerHTML =
            '<p class="detail-state">No hay información de episodios disponible.</p>';
        }
      }
    }

    // Similares (solo los que están en nuestro catálogo)
    renderSimilar(item, extras.recommendations || []);
  }

  function renderSeasonTabs(item, tmdbId, seasons, token) {
    const root = views.detail;
    const tabsEl = root.querySelector('[data-season-tabs]');
    const listEl = root.querySelector('[data-episodes]');
    if (!tabsEl || !listEl) return;

    tabsEl.innerHTML = seasons.map((s, i) => `
      <button type="button" class="season-tab${i === 0 ? ' active' : ''}${s.seasonNumber === 0 ? ' is-special' : ''}"
              data-season="${s.seasonNumber}">${escapeHtml(s.name)}</button>
    `).join('');

    async function loadSeason(seasonNumber) {
      listEl.innerHTML = '<p class="detail-state">Cargando episodios...</p>';
      const episodes = await fetchSeasonEpisodes(tmdbId, seasonNumber);
      if (token !== detailToken) return;
      if (!episodes || !episodes.length) {
        listEl.innerHTML = '<p class="detail-state">No hay episodios disponibles para esta temporada.</p>';
        return;
      }
      listEl.innerHTML = `<div class="episode-grid">${episodes.map(ep => `
        <article class="episode-card" data-episode="${ep.number}" tabindex="0" role="button"
                 aria-label="Reproducir episodio ${ep.number}">
          <div class="episode-thumb">
            ${ep.still
              ? `<img src="${ep.still}" alt="" loading="lazy">`
              : '<span class="episode-thumb-fallback">Sin imagen</span>'}
            <span class="episode-play">${ICON_PLAY}</span>
          </div>
          <div class="episode-info">
            <div class="episode-number">Episodio ${ep.number}</div>
            <h3 class="episode-name">${escapeHtml(ep.name || 'Sin título')}</h3>
            ${ep.overview ? `<p class="episode-overview">${escapeHtml(ep.overview)}</p>` : ''}
            ${ep.airDate ? `<div class="episode-date">${escapeHtml(ep.airDate)}</div>` : ''}
          </div>
        </article>`).join('')}</div>`;

      const seasonLabel = (seasons.find(s => String(s.seasonNumber) === String(seasonNumber)) || {}).name || '';
      const stillByNumber = new Map(episodes.map(ep => [String(ep.number), ep.still]));
      listEl.querySelectorAll('.episode-card').forEach((card) => {
        // El reproductor abre con el mismo frame que el usuario acaba de tocar.
        const open = () => goPlayer(item, `${seasonLabel} · Episodio ${card.dataset.episode}`,
                                    stillByNumber.get(String(card.dataset.episode)) || null);
        card.addEventListener('click', open);
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      });
    }

    tabsEl.querySelectorAll('.season-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        tabsEl.querySelectorAll('.season-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        loadSeason(tab.dataset.season);
      });
    });

    loadSeason(seasons[0].seasonNumber);
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

  function renderSimilar(item, recommendations) {
    const root = views.detail;
    const section = root.querySelector('[data-similar]');
    const gridEl = root.querySelector('[data-similar-grid]');
    if (!section || !gridEl || !recommendations.length) return;

    const index = buildCatalogIndex();
    const seen = new Set();
    const matches = [];

    for (const rec of recommendations) {
      const found = index.byId.get(rec.id) || index.byName.get(normalizeTitle(rec.name));
      if (!found || found === item || seen.has(found.title)) continue;
      seen.add(found.title);
      // El póster de la recomendación sirve de respaldo si ese título del catálogo
      // todavía no cargó su propia ficha de TMDB.
      matches.push({ item: found, poster: (found.tmdb && found.tmdb.poster) || rec.poster });
      if (matches.length >= 12) break;
    }

    // Si no tenemos ninguno de los recomendados, la sección simplemente no aparece.
    if (!matches.length) return;

    section.hidden = false;
    gridEl.innerHTML = matches.map((m, i) => {
      const name = m.item.title;
      return `
        <article class="similar-card" data-similar-idx="${i}" tabindex="0" role="button"
                 aria-label="Ver ${escapeHtml(name)}">
          <div class="similar-poster">
            ${m.poster
              ? `<img src="${m.poster}" alt="${escapeHtml(name)}" loading="lazy">`
              : `<div class="similar-poster-fallback">${escapeHtml(name)}</div>`}
          </div>
          <div class="similar-name">${escapeHtml(name)}</div>
        </article>`;
    }).join('');

    gridEl.querySelectorAll('.similar-card').forEach((card) => {
      const target = matches[parseInt(card.dataset.similarIdx, 10)].item;
      const open = () => goDetail(target);
      card.addEventListener('click', open);
      card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
  }

  // ══════════════════════════════════════════════════════════
  // VISTA REPRODUCTOR — simula un reproductor real con todo bloqueado.
  // Entra completo en el viewport: nunca scrollea.
  // ══════════════════════════════════════════════════════════
  const ICON_LOCK_SM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

  // Controles vivos: responden al click, pero lo único que hacen es disparar el
  // intento de reproducción (carga → paywall). Se leen como un reproductor real.
  const PLAYER_CONTROLS = {
    left: [
      { label: 'Reproducir', svg: '<path d="M8 5v14l11-7z"/>', fill: true },
      { label: 'Siguiente episodio', svg: '<path d="M6 5l9 7-9 7V5zM17 5h2v14h-2z"/>', fill: true },
      { label: 'Volumen', svg: '<path d="M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>', fill: false }
    ],
    right: [
      { label: 'Subtítulos', text: 'CC' },
      { label: 'Audio e idiomas', svg: '<path d="M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>', fill: false },
      { label: 'Configuración', svg: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>', fill: false },
      { label: 'Pantalla completa', svg: '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>', fill: false }
    ]
  };

  function controlHtml(c) {
    const inner = c.text
      ? c.text
      : `<svg viewBox="0 0 24 24" ${c.fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"'}>${c.svg}</svg>`;
    return `<button type="button" class="player-ctrl" data-fakeplay
              aria-label="${escapeHtml(c.label)}"
              title="${escapeHtml(c.label)}">${inner}</button>`;
  }

  // El reproductor tiene tres etapas: arranca como un player normal (frame nítido,
  // controles vivos), al tocar cualquier control simula que carga, y solo entonces
  // revela el paywall. Así el usuario ve lo que se está perdiendo antes del muro.
  const FAKE_LOAD_MS = 3000;
  let playerLoadTimer = null;

  function clearPlayerLoad() {
    if (playerLoadTimer) { clearTimeout(playerLoadTimer); playerLoadTimer = null; }
  }

  // Pasar de "cargando" a paywall. Solo corre si el usuario sigue en esa pantalla:
  // si se fue antes de los 3s, clearPlayerLoad() ya canceló el timer.
  function attemptPlay(stage) {
    // Una vez que arrancó la carga, los demás controles ya no reinician nada.
    if (!stage || !stage.classList.contains('is-idle')) return;
    clearPlayerLoad();
    stage.classList.remove('is-idle');
    stage.classList.add('is-loading');
    playerLoadTimer = setTimeout(() => {
      playerLoadTimer = null;
      stage.classList.remove('is-loading');
      stage.classList.add('is-paywall');
    }, FAKE_LOAD_MS);
  }

  function setPlayerBackdrop(stage, url) {
    if (!url) return;
    let bgEl = stage.querySelector('.player-bg');
    if (!bgEl) {
      bgEl = document.createElement('div');
      bgEl.className = 'player-bg';
      stage.prepend(bgEl);
    }
    bgEl.style.backgroundImage = `url('${url}')`;
  }

  async function renderPlayer(item, contextLabel, bgImage) {
    clearPlayerLoad();

    const tmdb = item.tmdb || {};
    // El fondo es el frame que el usuario creyó estar por reproducir: el still del
    // episodio si vino de la lista, o el backdrop del título.
    const bg = bgImage || tmdb.backdrop || tmdb.poster || '';
    const name = item.title;   // manda el titulo curado de catalog-data.js, no el de TMDB
    const duration = item.type === 'tv' ? '42:00' : '1:58:00';

    views.player.innerHTML = `
      <div class="player-stage is-idle" data-stage>
        ${bg ? `<div class="player-bg" style="background-image:url('${bg}')"></div>` : ''}

        <div class="player-topbar">
          <button type="button" class="player-back" data-close>${ICON_BACK} Volver</button>
          <button type="button" class="player-x" data-close aria-label="Cerrar reproductor">&#10005;</button>
        </div>

        <div class="player-center">
          <button type="button" class="player-bigplay" data-fakeplay
                  aria-label="Reproducir ${escapeHtml(name)}">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </button>

          <div class="player-loadbox" data-slot-loading>
            <div class="player-spinner" aria-hidden="true"></div>
            <p class="player-loading-text" role="status">Cargando video...</p>
          </div>

          <div class="player-bigplay player-bigplay-locked" data-slot-locked aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            <span class="player-bigplay-lock">${ICON_LOCK_SM}</span>
          </div>

          <div class="player-headline">
            <div class="player-eyebrow" data-eyebrow>Contenido para suscriptores</div>
            <h1 class="player-title">${escapeHtml(name)}</h1>
            ${contextLabel ? `<div class="player-context">${escapeHtml(contextLabel)}</div>` : ''}
          </div>

          <div class="player-paywall" data-paywall>
            <p class="player-paywall-text">Activá tu cuenta y mirá esto — y todo el catálogo — en Full HD 1080p desde $6 USD al mes.</p>
            <div class="player-actions">
              <a class="btn-whatsapp" href="${waLink(item.title)}" target="_blank" rel="noopener">${ICON_WA} Suscribirme ahora</a>
              <a class="btn-ghost" href="../index.html#pricing">Ver planes</a>
            </div>
          </div>
        </div>

        <div class="player-controls">
          <div class="player-scrub">
            <span class="player-time">00:00</span>
            <button type="button" class="player-track" data-fakeplay aria-label="Avanzar en el video">
              <span class="player-track-fill"></span>
            </button>
            <span class="player-time">${duration}</span>
          </div>
          <div class="player-buttons">
            <div class="player-buttons-left">${PLAYER_CONTROLS.left.map(controlHtml).join('')}</div>
            <div class="player-buttons-right">${PLAYER_CONTROLS.right.map(controlHtml).join('')}</div>
          </div>
        </div>
      </div>`;

    const stage = views.player.querySelector('[data-stage]');

    views.player.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', () => history.back());
    });

    // Cualquier control "intenta" reproducir: play grande, barra o botones de abajo.
    views.player.querySelectorAll('[data-fakeplay]').forEach((el) => {
      el.addEventListener('click', () => attemptPlay(stage));
    });

    // Enlace directo (?v=...&play=1): TMDB todavía no cargó este título, así que el
    // reproductor abriría sin frame de fondo. Lo traemos y lo insertamos sin tocar
    // la etapa actual — si el usuario ya le dio play, la carga sigue su curso.
    if (!item.tmdb) {
      const fetched = await searchTMDB(item.title, item.type, item.tmdbId);
      item.tmdb = fetched;
      if (!stage.isConnected) return; // el usuario ya navegó a otra cosa
      const t = item.tmdb || {};
      setPlayerBackdrop(stage, bgImage || t.backdrop || t.poster || '');
      const titleEl = stage.querySelector('.player-title');
      if (titleEl && t.name) titleEl.textContent = t.name;
    }
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

    // Enlace directo: /catalog/?v=<título>[&play=1] abre esa pantalla al cargar
    const params = new URLSearchParams(location.search);
    const deepLink = params.get('v');
    if (deepLink) {
      const item = findItemByTitle(deepLink);
      if (item) {
        history.replaceState({ view: 'detail', title: item.title }, '',
          `${location.pathname}?v=${encodeURIComponent(item.title)}`);
        goDetail(item, false);
        if (params.get('play') === '1') goPlayer(item, null, null);
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
        allItems[i + idx].tmdb = tmdbData;
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
