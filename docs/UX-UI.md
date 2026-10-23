# UX / UI — sistema de diseño

Dirección: la interfaz es **clara y luminosa** y toma su paleta del logo institucional Temuco Lab
(colores muestreados del logo: azul cielo ≈ #0090C0, verde hoja ≈ #48A878/#90C060, degradé naranja ≈ #F06030 → amarillo ≈ #F0C030).
Azul = color de acción (botones, enlaces, foco); verde y naranja/amarillo = acentos para distinguir ejes y rubros, nunca para texto sobre blanco
(el texto sobre fondos naranja/verde claro es siempre `ink`). El azul marino queda solo como color de texto/hover, no como fondo dominante.
Una franja con el recorrido de color del logo (`bg-brand-stripe`) marca el borde superior del header y del footer.
El elemento memorable del hero es la **búsqueda real** (funciona sin JS) junto a negocios del catálogo. Los seis ejes dejan de ser seis tarjetas
iguales: dos primarios (Vende en azul, Conecta en verde claro) y cuatro secundarios con icono en azul, verde o naranja, enlazados a oportunidades filtradas.

## Tokens (`src/app/globals.css`, `@theme`)
- Color: `blue-700/600/100/50` (primario), `leaf-600/400/100`, `sun-600/500/400/100`, `cyan-400/700/100` (foco e info), `navy-950…700` (solo apoyo), `canvas`, `surface`, `line`, `ink`, `muted`, `success|warning|danger` (+ `-soft`).
- Tipografía: Bricolage Grotesque (títulos, `font-display`) y Figtree (texto). Títulos con `text-wrap: balance`; cuerpo ≥16 px.
- Forma: radios 6/10/16 px; una sola sombra `shadow-raised`.
- Foco: anillo cian de 3 px en todo control. `prefers-reduced-motion` respetado; única animación de entrada: el hero.

## Componentes (`components/ui`)
Button (primary, secondary, ghost, danger, inverse; sm/md/lg; loading), Badge/DemoBadge, Alert (info, success, warning, danger),
TextField/TextAreaField/SelectField/CheckboxField (etiqueta, ayuda, error enlazados con `aria-describedby`/`aria-invalid`),
EmptyState, PageHeader, Container, DataTable (tabla ≥ md; tarjetas etiqueta/valor en móvil).
Estados cubiertos: hover, focus, disabled, loading, error, vacío, éxito.

## Responsive y accesibilidad
- Mobile-first; menú móvil con botón `aria-expanded`; navegación de paneles en cuadrícula táctil (sin scroll horizontal).
- Controles de ≥44 px de alto; `lang="es"`; enlace «Saltar al contenido»; un `h1` por página; `aria-current` en navegación.
- Filtros anuncian resultados con `aria-live`. Contraste verificado por diseño de tokens (texto `muted` ≈ 7:1 sobre blanco), no medido con herramienta automática.

## Reglas de contenido
Todo contenido ficticio lleva `DemoBadge` o aviso; los formularios dicen explícitamente qué no hacen (no crean cuenta, no envían).
Sin fotos de stock: los negocios usan monograma por rubro hasta tener imágenes reales.
