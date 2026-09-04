# TauroTV / Bankai+ — catálogo del sitio

Sitio de streaming (Bankai+, antes Tauro TV). Este directorio tiene la web
estática y el Excel maestro que alimenta el catálogo que se muestra en
`/catalog`. Fabián edita el Excel a mano; cuando agrega títulos nuevos,
corré `node tools/sync.js` para que se propaguen solos con los mismos
estándares que ya tiene el resto del catálogo.

## Si Fabián dice algo como "sincronizá lo nuevo" o "agregué títulos al Excel"

```
node tools/sync.js
```

Este comando solo. No hace falta ningún otro paso. Lee el
`VORTEX_Catalogo_Master.xlsx` real (siempre en frío, nunca una copia vieja),
busca en la pestaña **Catalogo** las filas que tengan **Título** pero cuyo
**ID_Anterior** todavía no aparezca en **Catalogo ordenado**, las resuelve
contra TMDB, y reescribe:

1. `Catalogo ordenado` — con Categoría, Título ES/EN, Año, Colección, Época,
   etc., siguiendo las mismas reglas que ya tiene el resto de las 1398 filas.
2. `Catalogo` — le pone el ID nuevo en la columna A (o `SIN VINCULO` si no
   se pudo resolver con confianza).
3. `catalog-data.js` — el archivo que lee la página web.

Al final imprime tres números: cuántas se agregaron solas, cuántas ya
existían (solo se enlazaron), y cuántas quedaron en duda — esas últimas no
se inventan, se listan en `tools/dudas_ultima_corrida.txt` para que las
resuelvas vos con Fabián (ver "Cuando el sync no está seguro" más abajo).

Antes de tocar el `.xlsx` real deja un respaldo con fecha y hora en
`tools/backups/` (se quedan los últimos 10 nada más). Si algo sale mal, ese
respaldo es la forma de volver atrás.

## El archivo de memoria real es tools/data/resuelto.json

Esto es lo importante para no perder contexto entre sesiones: **todo lo que
se sabe de cada título vive en `tools/data/resuelto.json`**, no en esta
conversación. Es un array de ~1400 fichas, cada una con su `tmdb` (id,
título ES/EN/original, año, géneros, calificación, dónde se puede ver...),
`coleccionTmdb`, `epoca_app`, `coleccion_app`, `agregadoApp`, y el `excel`
que la liga de vuelta a su fila en la pestaña Catalogo vieja. `tools/sync.js`
lee y escribe ese archivo cada vez que corre. **No lo borres ni lo edites a
mano** — si necesitás corregir algo puntual, hacelo con un script chiquito
que lo cargue, lo modifique, y lo vuelva a guardar (hay un ejemplo abajo).

Si esta conversación se borra, la próxima sesión de Claude puede leer este
CLAUDE.md, mirar `resuelto.json`, y seguir exactamente donde quedó — no hace
falta que Fabián re-explique nada del proyecto.

## Estructura del proyecto

```
TAUROTV/
  index.html, catalog/index.html      — el sitio
  catalog-data.js                     — GENERADO, no editar a mano
  js/catalog-app.js                   — front-end del catalogo (filtros,
                                          reproductor falso, TMDB en vivo)
  css/catalog-page.css
  VORTEX_Catalogo_Master.xlsx         — el Excel maestro (fuente de verdad)
  tools/
    sync.js                           — el comando principal (ver arriba)
    lib/
      zip.js         — lee y escribe el .xlsx sin dependencias externas
      xlsx_leer.js   — lee cualquier hoja del .xlsx a un array de filas
      tmdb.js        — todo el trato con la API de TMDB (buscar, ficha,
                        idiomaDe...). El token sale de js/catalog-app.js
      titulos.js     — titleCase(), elegirTitulo() (ES vs EN), alias()
      similitud.js   — dice()/tokenSim()/parecido() para el fuzzy matching
    data/
      resuelto.json          — LA memoria del catalogo (ver arriba)
      mapa_ids_fuzzy.json    — enlaces Catalogo-viejo -> tmdb para filas
                                 que se resolvieron por parecido de texto
                                 en vez de por ID directo (franquicias con
                                 varias secuelas: se verificaron a mano)
      agregados.txt           — lista de titulos que Fabián ya subió a la
                                 app (alimenta la columna Agregado a la App)
      agregados_fijos.json    — enlaces a mano para esa lista cuando el
                                 parecido de texto solo no alcanza
      notas.js                — notas migradas del Catalogo viejo por ID
    historial/                — scripts de una sola vez que ya cumplieron
                                 su funcion (quedan de referencia, no se
                                 vuelven a correr solos — ver mas abajo)
    backups/                 — copias con fecha y hora del .xlsx antes de
                                 cada corrida de sync.js (se guardan 10)
```

## Las 6 pestañas del Excel

| Pestaña | Qué es |
|---|---|
| **Catalogo ordenado** | **La que importa.** Fuente de `catalog-data.js`. 25 columnas, ver abajo. |
| Catalogo | La hoja vieja de Fabián. Solo sirve para escribir títulos nuevos (columna Titulo) — todo lo demás se recalcula. La columna A y K (ID_Anterior) las administra `sync.js`, no tocarlas a mano. |
| Inicio | Dashboard con formulas COUNTIF/COUNTIFS contra `Catalogo ordenado`. No se toca. |
| Guia, Todo lo que hay, pedidos | Sin relacion con el pipeline. `sync.js` no las toca. |

### Las 25 columnas de "Catalogo ordenado" (A a Y)

`ID | Categoria | Tipo | Titulo Español (LATAM) | Titulo Inglés | Año |
Temporadas | Episodios | Duración (min) | Géneros | Calificación |
Clasificación | Casa | Disco Duro | Estado | Audio Dual | Tercer Audio |
TMDB ID | TMDB URL | Póster | Notas | Agregado a la App | Añadido a Redes
Sociales | Colección | Época`

Panel congelado en E2 (se ve fijo A-D + fila 1). Filtro automático en todo
el rango.

## Reglas y estándares (así se decidió, así hay que seguir)

- **TMDB ID es la fuente de verdad.** El sitio nunca busca por texto — va
  directo a `/movie/{id}` o `/tv/{id}`. Toda fila necesita un TMDB ID real.
- **Disco Duro puede quedar vacío.** Si un título está confirmado (tiene
  TMDB ID) pero no se sabe en qué disco físico vive, la fila igual va en
  Catalogo ordenado con esa columna en blanco. No se descarta nada por no
  tener disco — así lo pidió Fabián explícitamente.
- **Título mostrado**: español LATAM por default; inglés cuando el nombre
  del archivo/fila se parece más al inglés (`elegirTitulo()` en
  `titulos.js`) — ej. "Jeepers Creepers" en vez de "El demonio", porque así
  se conoce en LATAM. Siempre Title Case (`titleCase()`), preservando
  acrónimos (`WALL·E`, `SPY×FAMILY`).
- **Colección**: agrupa peliculas/series del mismo universo (Toy Story,
  The Walking Dead...). Se arma en dos pasadas dentro de `sync.js`:
  1. `belongs_to_collection` oficial de TMDB para peliculas (confiable,
     automático).
  2. Una lista a mano (`MANUAL_COLECCIONES` en `sync.js`) para franquicias
     que TMDB no junta solo — sobre todo anime con series + peliculas
     (Naruto, Dragon Ball, Baki, Digimon, Berserk...) y casos como The
     Walking Dead (todo TV, sin pelicula).
  Solo cuenta como colección si quedan 2 o más miembros en el catálogo —
  si de una saga hay una sola pelicula, la columna queda vacía (no tiene
  sentido "agrupar" con uno solo).
- **Época**: cuándo conviene más publicarla. Dos niveles de confianza:
  1. **Objetivo** (keywords oficiales de TMDB — `KEYWORD_A_EPOCA` en
     `sync.js`): Navidad, Halloween, Año Nuevo, Pascua, Día de Muertos, San
     Valentín, Acción de Gracias, Día de la Madre, Día del Padre. Esto se
     recalcula solo para títulos nuevos (no vuelve a pegarle a la API a los
     ~1400 que ya tienen `epoca_app` seteado).
  2. **Subjetivo** (Día de la Madre por género Romance, Día del Padre por
     género Acción/Crimen + una lista de comedias para adultos nombradas a
     mano, Día del Niño por infantiles con más de 3300 votos en TMDB): esto
     se armó una sola vez con `tools/historial/epocas_subjetivas.js` y no
     está integrado al sync automático — si Fabián agrega un título nuevo
     que debería caer en alguna de esas categorías, hay que aplicarlo a
     mano o extender `sync.js` para que lo haga solo.
  Todo lo que no cae en ninguna keyword queda en "Cualquier Momento".
  Un título puede tener varias épocas a la vez, separadas por coma en la
  misma celda (ej. "Navidad, Halloween" para El Extraño Mundo de Jack).
- **Agregado a la App**: viene de `tools/data/agregados.txt` (la lista que
  Fabián pasó de lo que ya subió). Si Fabián agrega más títulos a esa app,
  hay que sumarlos a `agregados.txt` y correr la lógica de
  `tools/historial/marcar_agregados.js` — esto tampoco está integrado al
  sync automático todavía. Los títulos nuevos que entran por `sync.js`
  arrancan en "No" hasta que Fabián confirme que ya están en la app.
- **Cuando el sync no está seguro**: nunca inventa un enlace. Si el
  parecido con el mejor candidato de TMDB es débil, la fila queda en
  `tools/dudas_ultima_corrida.txt` para revisión manual. Esto pasó ya con
  "IT 3" (no existe todavía en TMDB) y con franquicias de muchas secuelas
  donde el texto solo no alcanza para saber cuál es cuál (Star Trek, Mad
  Max, My Hero Academia) — esos se resolvieron a mano comparando contra el
  catálogo real, no adivinando.

## Cómo resolver una duda a mano (fuera de sync.js)

Si `tools/dudas_ultima_corrida.txt` deja algo pendiente, la forma de
resolverlo es buscar el TMDB ID correcto vos mismo y agregarlo directo:

```js
// tools/_fix_puntual.js — patron para resolver una duda a mano
const fs = require('fs');
const path = require('path');
const T = require('./lib/tmdb.js');
const resuelto = require('./data/resuelto.json');

(async () => {
  const f = await T.ficha(TMDB_ID_AQUI, 'movie'); // o 'tv'
  resuelto.push({
    base: f.espanol || f.ingles, nombreArchivo: 'Titulo tal como esta en Catalogo',
    tipo: 'movie', anio: f.anio, discos: [], casaRuta: '', categorias: ['Peliculas'],
    coleccion: '', nArchivos: 0, nTemporadas: 0, rutas: [], muestra: [],
    tmdb: f, casaFinal: 'General',
    excel: { id: 'VTX-XXXX', cat: '', tit: '', temp: '', casa: '', disco: '', estado: '', dual: '', tercero: '', notas: '' },
    motivo: '', detalle: '', override: 'resuelto a mano', agregadoApp: 'No',
  });
  fs.writeFileSync(path.join(__dirname, 'data', 'resuelto.json'), JSON.stringify(resuelto), 'utf8');
})();
```

Después corré `node tools/sync.js` de nuevo — como el `excel.id` ya quedó
puesto, la fila del Catalogo viejo se enlaza sola.

## Cosas que ya se rompieron una vez (para no repetirlas)

- Nunca escribas un regex de rango de caracteres de control Unicode (los
  que limpian XML invalido) directo en un archivo con la herramienta de
  escritura — una vez el editor grabo los bytes de control reales en vez
  del texto del escape y corrompió el archivo entero. `tools/lib/zip.js`
  ya resuelve esto limpiando por código numérico de caracter
  (`charCodeAt(i)`) en vez de un regex con rango escrito a mano. Si hace
  falta tocar esa función, mantené el mismo patrón (comparar números, no
  escribir el rango como texto literal).
- El .xlsx nunca se cachea entre corridas. `zip.extraerA()` siempre
  desempaqueta de cero el archivo real. Si en algún momento se vuelve a
  necesitar una carpeta de trabajo persistente, hay que tener cuidado: si
  Fabián edita el Excel a mano entre sesiones, una copia vieja en caché
  generaría una regresión silenciosa (esto fue justo el problema del
  esquema anterior, que vivía en una carpeta temporal de la sesión).
- Las celdas vacías de Excel vienen auto-cerradas (`<c r="D2" s="9"/>`); un
  regex que exija el cierre `</c>` se come las celdas siguientes.
  `xlsx_leer.js` y el regex de reemplazo en `sync.js` ya lo manejan bien —
  si se toca ese regex, probarlo contra una hoja real antes de confiar en
  el resultado.
- Dos títulos distintos pueden compartir el mismo nombre visible en
  español ("Invasión" = Starship Troopers 1997 Y una película coreana de
  2021 sin relación; "El despertar del diablo" = Evil Dead Y un reboot de
  The Hills Have Eyes). No es un bug — cada uno tiene su propio TMDB ID
  correcto — pero puede confundir si se lee el Excel por nombre en vez de
  por ID.

## Verificación después de cualquier cambio al Excel

```js
const { leerHoja } = require('./tools/lib/xlsx_leer.js');
const zip = require('./tools/lib/zip.js');
zip.extraerA('VORTEX_Catalogo_Master.xlsx', './tools/_check');
const co = leerHoja('./tools/_check', 'Catalogo ordenado');
// sin TMDB ID debe dar 0, #REF! en Inicio debe dar 0, sheets Guia/Todo lo
// que hay/pedidos deben conservar sus filas
```

Y en `catalog-data.js`, cargarlo con `vm.runInNewContext` y confirmar 0
titulos repetidos y 0 sin `tmdb`.
