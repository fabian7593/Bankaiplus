/**
 * ============================================================
 * BANKAI + — ARCHIVO DE CONFIGURACIÓN
 * ============================================================
 * Modificá este archivo para cambiar textos, precios,
 * imágenes, links de contacto y cualquier dato del sitio.
 * NO necesitás tocar el HTML ni el CSS para cambios básicos.
 * ============================================================
 */

const CONFIG = {

  // ── DATOS GENERALES ─────────────────────────────────────
  site: {
    name: 'Bankai +',
    tagline: 'Streaming Premium',
    subtitle: 'Streaming sin límites',
    description: 'Plataforma de streaming premium para Costa Rica y Latinoamérica. Contenido legal, calidad Full HD, soporte en español.',
    region: 'Costa Rica · LATAM',
    copyright: '2026 Bankai +. Todos los derechos reservados.',
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
    { number: '1300+', label: 'Títulos' },
    { number: 'HD',   label: 'Calidad Full 1080p' },
    { number: '4',    label: 'Perfiles Family' },
    { number: '24/7', label: 'Soporte' },
  ],

  // ── PRECIOS ──────────────────────────────────────────────
  // ⚠️ EL DÓLAR ES LA MONEDA BASE.
  //    Definís los precios en USD y los colones se calculan solos
  //    con el tipo de cambio del BCR (redondeado a ₡50 para que
  //    siempre queden números presentables).
  //
  //    Para subir precios → tocá SOLO el bloque `usd`.
  //    El tipo de cambio NO se toca a mano: se consulta automáticamente.
  //
  // Reglas de descuento:
  //   Semestral → "pague 5, lleve 6" = total de 5 mensualidades por 6 meses
  //   Anual     → "pague 9, lleve 12" = total de 9 mensualidades por 12 meses
  pricing: {
    // Moneda que ve el visitante al entrar. 'usd' | 'crc'
    // Con 'usd' el sitio abre en dólares y el usuario cambia a colones
    // manualmente con el toggle de región.
    defaultCurrency: 'usd',

    // ── Tipo de cambio: automático desde el BCR ──────────
    // El sitio consulta esta API (GET, sin headers) y convierte los
    // precios USD a colones solo. No hay que actualizar nada a mano.
    exchangeRateApi: 'https://apis.gometa.org/tdc/tdc.json',

    // Campo de la API a usar: 'venta' (lo que cuesta comprar 1 USD)
    // o 'compra'. Se usa 'venta' para no perder margen en la conversión.
    exchangeRateField: 'venta',

    // Si la API falla, no responde, tarda demasiado o devuelve un valor
    // absurdo, se usa este tipo de cambio.
    exchangeRateFallback: 470,

    // Horas que se guarda el tipo de cambio en el navegador antes de
    // volver a consultar la API (el BCR lo actualiza 1 vez al día).
    exchangeRateCacheHours: 6,

    // Precios MENSUALES en USD — fuente de verdad de todo el sitio.
    // Los colones se calculan solos: USD × tipo de cambio, redondeado a ₡50.
    usd: {
      basic:    6,       // 1 pantalla
      standard: 10.00,   // 2 pantallas
      family:   13.33,   // 4 pantallas
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
