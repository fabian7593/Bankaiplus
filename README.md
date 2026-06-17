# Tauro TV — Landing Page

## Estructura del proyecto

```
TAUROTV/
├── index.html               ← Página principal
├── css/
│   ├── variables.css        ← Colores, tipografías, espaciado
│   ├── base.css             ← Reset, estilos globales, botones
│   ├── nav.css              ← Navegación + menú hamburger móvil
│   ├── hero.css             ← Sección hero
│   ├── sections.css         ← Features, catálogo, pasos, devices, FAQ, CTA
│   ├── pricing.css          ← Planes y precios
│   ├── footer.css           ← Footer
│   └── responsive.css       ← Media queries (1200 / 900 / 640 / 400px)
├── js/
│   ├── config.js            ← ⭐ CONFIGURACIÓN: textos, precios, imágenes, links
│   ├── main.js              ← Scroll reveal, FAQ, nav, hamburger
│   └── pricing.js           ← Toggle mensual/anual
└── images/
    ├── og.jpg               ← Imagen para redes sociales (1200×630px)
    └── (tus imágenes aquí)
```

---

## Cómo personalizar

### Cambiar precios o links de contacto
Editá **`js/config.js`** — está todo comentado y documentado.

### Cambiar colores
Editá **`css/variables.css`** — cambiás una variable y se actualiza todo el sitio.

### Agregar imágenes
1. Colocá las imágenes en la carpeta `/images/`
2. Actualizá las rutas en `js/config.js` bajo la sección `images:`

---

## Tamaños de imágenes recomendados

| Imagen | Tamaño | Formato | Peso máx. |
|--------|--------|---------|-----------|
| `og.jpg` (social) | 1200 × 630 px | JPG | < 200 KB |
| Hero background | 1920 × 1080 px | WebP/JPG | < 300 KB |
| TV mockup / screenshot | 1160 × 725 px | WebP | < 150 KB |
| Poster vertical (catálogo) | 400 × 600 px | WebP | < 80 KB c/u |
| Poster horizontal featured | 800 × 450 px | WebP | < 100 KB |

> **Tip:** Usá [Squoosh](https://squoosh.app/) para comprimir imágenes a WebP fácilmente.

---

## GitHub Pages

Para publicar en GitHub Pages:
1. Subí la carpeta a un repositorio de GitHub
2. En Settings → Pages → Branch: `main`, carpeta: `/ (root)`
3. Tu sitio estará en `https://tuusuario.github.io/nombre-repo/`

**No necesitás ningún build step** — es HTML/CSS/JS puro.

---

## Notas sobre los colores

La paleta actual (negro + dorado) funciona bien para un posicionamiento **premium/sofisticado**.
Si querés más urgencia en los CTAs, podés cambiar `--red-bright` en `variables.css` a un rojo
más vivo como `#E63946` para los botones secundarios.
