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
    description: 'Plataforma de streaming premium para Latinoamérica. Contenido legal, calidad Full HD, soporte en español.',
    region: 'LATAM',
    copyright: '2026 Bankai +. Todos los derechos reservados.',
  },

  // ── LINKS DE CONTACTO ───────────────────────────────────
  // Número de WhatsApp — solo dígitos con código de país (sin +, sin espacios)
  contact: {
    // Todos los links de WhatsApp del sitio usan este número (js/config-bind.js)
    whatsappNumber: '50661719869',           // ← cambiá solo este número
    whatsapp: 'https://wa.me/50661719869',
    // Todos los mailto: del sitio y los correos que se muestran usan este
    email: 'taurotressietes@gmail.com',
  },

  // ── REDES SOCIALES ─────────────────────────────────
  // De acá salen los iconos del footer de TODAS las páginas
  // (los dibuja js/config-bind.js, no hay que tocar ningún HTML).
  //
  // Dejá en '' la red que todavía no exista: ese icono simplemente no
  // se muestra. Nunca queda un enlace muerto en el sitio.
  // Pegá la URL completa, tal cual la abre el navegador.
  social: {
    youtube:   'https://www.youtube.com/@Bankaiplus7',
    instagram: 'https://www.instagram.com/bankaiplus/',
    facebook:  'https://www.facebook.com/p/Bankai--61591003693655/',
    tiktok:    '',   // ej. 'https://www.tiktok.com/@bankaiplus'
    telegram:  '',   // ej. 'https://t.me/bankaiplus'
  },

  // ── VIDEOS DEL CANAL DE YOUTUBE ─────────────────────
  // Alimentan la sección "Preview" del landing (js/videos.js):
  //   • el PRIMERO de la lista es el que se ve grande al entrar,
  //   • los demás quedan en la fila de abajo y se reproducen en el
  //     mismo marco, sin sacar al visitante del sitio.
  //
  // Para sumar un video nuevo: copiá el ID del final de su URL de
  // YouTube — en https://www.youtube.com/watch?v=ABC123 el ID es
  // ABC123 — y agregá una línea más a la lista.
  // 'label' es la etiqueta chica que se ve arriba del título (opcional).
  videos: {
    channel: 'https://www.youtube.com/@Bankaiplus7',
    list: [
      { id: '-e0V4FQoLs0', label: 'Tráiler',   title: 'Bankai+: películas, series, anime y K-Drama en un solo lugar' },
      { id: 'NDDuFnuI1H8', label: 'Guía',      title: 'Guía rápida: todo lo que podés hacer en la app' },
      { id: '3shc5TlpUJY', label: 'Empezar',   title: 'Cómo registrarte en Bankai+ y descargar la app' },
      { id: 'iswfONx8r4I', label: 'Fire TV',   title: 'Cómo instalar Bankai+ en Fire TV Stick con Downloader' },
      { id: 'AzO7MwMjVUc', label: 'Catálogo',  title: 'El catálogo: más de 1.400 películas, series y anime' },
      { id: 'KD1WhOdtyjo', label: 'Ajustes',   title: 'Configuración: ajustá la app a tu gusto' },
      { id: '2BdgzHmYL7g', label: 'Planes',    title: 'Planes: pantallas, perfiles y hasta 3 meses gratis' },
      { id: '8-hFe6vDVKY', label: 'Soporte',   title: '¿Necesitás ayuda? Así encontrás nuestro soporte' },
      { id: 'F3gDE5Svz_E', label: 'Resellers', title: 'Ganá dinero vendiendo Bankai+ — Programa Reseller' },
    ],
  },

  // ── DESCARGA DE LA APP (página /descargar) ──────────────
  // Los dos botones de descarga salen de acá. Es el único lugar
  // donde hay que pegar las URLs.
  // Si alguna queda vacía (''), ese botón cae automáticamente a
  // WhatsApp pidiendo el link — nunca queda un botón muerto.
  downloads: {
    playStore: 'https://play.google.com/store/apps/details?id=org.vortextv.playall',
    apk:       'https://tinyurl.com/vortex352',

    // Código para la app Downloader (Fire TV Stick, TV Box sin Play Store).
    // Se muestra en el hero de /descargar con botón de copiar.
    downloaderCode: '9516238',

    // Nombre real de la app en la tienda y código de servidor que hay que
    // poner en el login para que apunte a Bankai +.
    appName: 'Vortex',
    serverCode: 'TAURO777',
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
    { number: '1400+', label: 'Títulos' },
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
