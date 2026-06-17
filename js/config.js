/**
 * ============================================================
 * TAURO TV — ARCHIVO DE CONFIGURACIÓN
 * ============================================================
 * Modificá este archivo para cambiar textos, precios,
 * imágenes, links de contacto y cualquier dato del sitio.
 * NO necesitás tocar el HTML ni el CSS para cambios básicos.
 * ============================================================
 */

const CONFIG = {

  // ── DATOS GENERALES ─────────────────────────────────────
  site: {
    name: 'Tauro TV',
    tagline: 'Streaming Premium',
    subtitle: 'Streaming sin límites',
    description: 'Plataforma de streaming premium para Costa Rica y Latinoamérica. Contenido legal, calidad Full HD, soporte en español.',
    region: 'Costa Rica · LATAM',
    copyright: '2026 Tauro TV. Todos los derechos reservados.',
  },

  // ── LINKS DE CONTACTO ───────────────────────────────────
  // Número de WhatsApp — solo dígitos con código de país (sin +, sin espacios)
  contact: {
    whatsappNumber: '50661719869',           // ← cambiá solo este número
    whatsapp: 'https://wa.me/50661719869',   // se construye automáticamente abajo
    telegram: 'https://t.me/TUCANAL',
  },

  // ── NOMBRES DE PLANES (para mensajes de WhatsApp) ───────
  plans: {
    basic:    'Basic (1 pantalla)',
    standard: 'Standard (2 pantallas)',
    family:   'Family (4 pantallas)',
  },

  // ── IMÁGENES ────────────────────────────────────────────
  // Tamaños recomendados:
  //   og_image          → 1200×630px,  JPG,      < 200KB
  //   poster_vertical   → 400×600px,   WebP/JPG, < 80KB c/u (ratio 2:3)
  images: {
    hero_background: '',
    og_image: 'images/og.jpg',
  },

  // ── CATÁLOGO — Imágenes por categoría ───────────────────
  // Cada categoría tiene 3 imágenes que se muestran al tocar el botón.
  // Tamaño recomendado de cada imagen: 280×490px (ratio 2:3.5, horizontal compacto)
  // Formato: WebP o JPG · Peso: máximo 60KB cada una
  // Carpeta sugerida: /images/catalog/
  // Si src está vacío ('') se muestra un placeholder con el título.
  catalog: {
    anime: [
      { src: 'images/catalog/attack-on-titan.jpg', title: 'Attack on Titan',  genre: 'Anime · Acción' },
      { src: 'images/catalog/kimetsu.webp', title: 'Demon Slayer',     genre: 'Anime' },
      { src: 'images/catalog/deathnote.jpg', title: 'Death Note',       genre: 'Thriller' },
    ],
    peliculas: [
      { src: 'images/catalog/interestellar.jpg', title: 'Interstellar',     genre: 'Ciencia Ficción' },
      { src: 'images/catalog/johnwick.jpg', title: 'John Wick',        genre: 'Acción' },
      { src: 'images/catalog/oppenheimer.jpg', title: 'Oppenheimer',      genre: 'Drama' },
    ],
    series: [
      { src: 'images/catalog/breakingbad.jpg', title: 'Breaking Bad',     genre: 'Drama' },
      { src: 'images/catalog/walkingdead.webp', title: 'The Walking Dead', genre: 'Sci-Fi' },
      { src: 'images/catalog/euphoria.jpg', title: 'Euphoria',  genre: 'Drama' },
    ],
    infantil: [
      { src: 'images/catalog/totoro.jpg', title: 'Totoro',      genre: 'Animación' },
      { src: 'images/catalog/toystory.jpg', title: 'Toy Story',            genre: 'Infantil' },
      { src: 'images/catalog/frozen.webp', title: 'Frozen',       genre: 'Infantil' },
    ],
    accion: [
      { src: 'images/catalog/halo.jpg', title: 'Halo',             genre: 'Sci-Fi · Acción' },
      { src: 'images/catalog/lastofus.jpg', title: 'The Last of Us',       genre: 'Acción' },
      { src: 'images/catalog/mandalorian.webp', title: 'The Mandalorian',  genre: 'Sci-Fi' },
    ],
    comedia: [
      { src: 'images/catalog/big_bang_theory.webp', title: 'The Big Bang Theory',       genre: 'Comedia' },
      { src: 'images/catalog/chespi.jpg', title: 'Chespirito: Sin querer queriendo',      genre: 'Comedia' },
      { src: 'images/catalog/ted.jpg', title: 'Ted',        genre: 'Comedia' },
    ],
    drama: [
      { src: 'images/catalog/succession.webp', title: 'Succession',       genre: 'Drama' },
      { src: 'images/catalog/dahmer.webp', title: 'Monstruo: La historia de Jeffrey Dahmer',        genre: 'Drama / Thriller' },
      { src: 'images/catalog/bettercallsaul.jpg', title: 'Better Call Saul', genre: 'Drama' },
    ],
    cienciaficcion: [
      { src: 'images/catalog/dark.jpg', title: 'Dark',  genre: 'Sci-Fi' },
      { src: 'images/catalog/blackmirror.jpg', title: 'Black Mirror',     genre: 'Sci-Fi' },
      { src: 'images/catalog/westworld.jpg', title: 'Westworld',        genre: 'Sci-Fi' },
    ],
  },

  // ── SLIDER DEL TV (mockup en el hero) ───────────────────
  // Tamaño recomendado: 1280×800px · formato WebP · máximo 150KB c/u
  // Guardá las imágenes en /images/slider/ con los nombres de abajo.
  // Si el array está vacío o todas las src son '', muestra el logo placeholder.
  slider: {
    autoplaySpeed: 4000, // ms entre cambios automáticos (4000 = 4 segundos)
    images: [
      // Orden: más relevante → menos relevante en la industria actual
      { src: 'images/slider/house-of-the-dragon.jpg' },
      { src: 'images/slider/stranger-things.webp'    },
      { src: 'images/slider/the-boys.jpg'           },
      { src: 'images/slider/kimetsu.webp'             },
      { src: 'images/slider/halo.jpg'                },
      { src: 'images/slider/spider-noir.png'         },
    ],
  },

  // ── ESTADÍSTICAS DEL HERO ───────────────────────────────
  stats: [
    { number: '800+', label: 'Títulos' },
    { number: 'HD',   label: 'Calidad Full 1080p' },
    { number: '4',    label: 'Perfiles Family' },
    { number: '24/7', label: 'Soporte' },
  ],

  // ── TIPO DE CAMBIO (CRC por dólar) ──────────────────────
  // Solo se usa cuando el usuario está en Costa Rica.
  // Regla: el precio en dólares se redondea al entero más cercano,
  // luego se multiplica por este valor.
  // Ejemplo: $5.99 → $6 → ₡3,000
  exchangeRate: 500,

  // ── PRECIOS BASE EN USD (extranjeros / Centroamérica) ───
  // Reglas de descuento:
  //   Semestral → "pague 5, lleve 6" = total de 5 mensualidades por 6 meses
  //   Anual     → "pague 10, lleve 12" = total de 10 mensualidades por 12 meses
  pricing: {
    // Precios mensuales base (USD)
    usd: {
      basic:    5.99,
      standard: 8.99,
      family:   11.99,
    },
    // Precios mensuales base (CRC — para nacionales de Costa Rica)
    // Regla: redondear precio USD al entero más cercano × 500
    // basic:    round(5.99)=6  → 6×500 = ₡3,000
    // standard: round(8.99)=9  → 9×500 = ₡4,500
    // family:   round(11.99)=12→12×500 = ₡6,000
    crc: {
      basic:    3000,
      standard: 4500,
      family:   6000,
    },
  },

  // ── LINKS INTERNOS (footer y nav) ──────────────────────
  legal: {
    terms:    '#',
    privacy:  '#',
    refunds:  '#',
    usage:    '#',
  },
};
