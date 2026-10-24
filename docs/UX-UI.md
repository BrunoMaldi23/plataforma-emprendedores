# UX / UI — sistema de diseño

Dirección: la interfaz es **clara y luminosa** y toma su paleta del logo institucional Temuco Lab
(colores muestreados del logo: azul cielo ≈ #0090C0, verde hoja ≈ #48A878/#90C060, degradé naranja ≈ #F06030 → amarillo ≈ #F0C030).
Azul = color de acción (botones, enlaces, foco); verde y naranja/amarillo = acentos para distinguir ejes y rubros, nunca para texto sobre blanco
(el texto sobre fondos naranja/verde claro es siempre `ink`). El azul marino queda solo como color de texto/hover, no como fondo dominante.
Una franja con el recorrido de color del logo (`bg-brand-stripe`) marca el borde superior del header y del footer.
El elemento memorable del hero es el **mapa de nodos** (`features/home/components/nexus-map.tsx`): el logo al centro y los seis ejes
(Vende, Conecta, Participa, Aprende, Financia, Crece) alrededor, uno por color del logo. Activar un nodo (hover, foco o toque) anima su conexión
y muestra una tarjeta con un ejemplo real tomado de los datos de demostración y un enlace a la ruta correspondiente. Junto al titular se mantiene la
**búsqueda real** (funciona sin JS). Fondo: tres resplandores muy suaves con los colores del logo y la trama de puntos.
Movimiento: flotación lenta de nodos, flujo en la conexión activa y pulso del logo; todo se desactiva con `prefers-reduced-motion`.
Accesibilidad: los nodos son botones con `aria-pressed`, alcanzables por teclado; la tarjeta es `aria-live="polite"`. Etiquetas siempre en `ink`.

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

## Tarjeta de emprendimiento (catálogo)
Tarjeta grande (≈ 384 × 433 px en escritorio): portada de 128 px con color y trazo propios del rubro (`features/catalog/category-theme.ts`),
etiqueta del rubro, avatar con la inicial superpuesto al borde de la portada, nombre (24 px), sector, frase, hasta 3 etiquetas (+N) y
pie con cantidad de productos/servicios, precio «desde» y flecha de acción. Toda la tarjeta es clicable (enlace en el nombre con área
extendida); hover: elevación de 4 px, borde azul y flecha activa. Grilla: 1 columna (móvil), 2 (≥768 px), 3 (≥1280 px).
Sin fotos reales: el avatar es un monograma.

## Cuenta (demostración)
Con un rol activo, el header muestra un **menú de cuenta** (`components/layout/account-menu.tsx`): rol, ir al panel, cambiar de rol y salir
(en móvil, las mismas acciones dentro del menú desplegable). Los paneles incluyen un **resumen de rol** (`features/auth/components/role-summary.tsx`)
que además avisa del «modo solo lectura» del usuario municipal. «Salir» vuelve al rol visitante. Todo es de demostración: no hay sesión real.

## Acceso y registro
Layout dividido (`features/auth/components/auth-shell.tsx`): panel de marca con beneficios y trazo de nodos (solo ≥1024 px, misma altura que el formulario)
y formulario a la derecha. Campos con icono y marcador de posición; contraseña con mostrar/ocultar (`ui/password-field.tsx`) y requisitos en vivo
(`password-checklist.tsx`); formulario de registro agrupado en `fieldset` («Sobre ti y tu negocio», «Tu acceso»). Al enviar con errores: resumen
`role="alert"` con la cantidad de campos y foco en el primer campo inválido. El selector de rol de demostración usa tarjetas completas (rol activo con
`aria-pressed` y etiqueta «Rol activo»).

## Fichas de detalle
**Emprendimiento** (`/emprendimientos/[slug]`): ruta de navegación, portada por rubro con avatar superpuesto, nombre y botón «Contactar»,
barra de 4 datos clave (`ui/fact-tile.tsx`), cuerpo en dos columnas (sobre el negocio y oferta con icono y precio / formulario de contacto fijo
al hacer scroll) y «Otros emprendimientos» con las tarjetas del catálogo.
**Oportunidad** (`/oportunidades/[slug]`): portada teñida según la categoría (`features/opportunities/type-theme.ts`) con icono grande decorativo,
aviso de contenido ficticio integrado, datos clave, requisitos como lista de tarjetas con check, línea de tiempo y acciones en la columna fija,
y «Otras oportunidades» al final.
**Login**: pestañas accesibles (flechas, Inicio, Fin) «Ingresar» / «Explorar con un rol» para mantener ambas columnas del mismo alto sin scroll.

**Tamaño común de acceso:** `AuthShell` fija un alto mínimo de 46 rem (736 px) para la tarjeta, de modo que «Ingresar» y «Registrar» ocupan exactamente el mismo espacio en escritorio (mismo ancho y alto, panel de marca incluido). Si aparecen errores de validación y el contenido crece, la tarjeta se amplía solo lo necesario.

## Panel de administración
Estado común (`features/admin/state/admin-store.tsx`, en memoria): todas las secciones leen y escriben el mismo estado, cada acción genera un aviso
(`admin-toast`) y una entrada en la bitácora, y el menú lateral muestra el contador de perfiles pendientes. Patrón de cada sección: encabezado con
acción principal, barra de filtros (chips con contador + búsqueda + selectores), contador de resultados con `aria-live`, estado vacío con «Limpiar filtros»
y tabla que en móvil pasa a tarjetas. Formularios y confirmaciones en diálogos nativos (`ui/dialog.tsx`: foco atrapado, Escape, clic en el fondo). El usuario
municipal ve las mismas pantallas sin ningún botón de edición. Las oportunidades creadas en el panel no existen en el sitio público hasta que haya backend.

## Movimiento y transiciones de página
`<html data-scroll-behavior="smooth">`: los enlaces internos (p. ej. «Contactar» → `#contacto`) se desplazan suavemente, pero los cambios de ruta saltan al inicio de inmediato
(sin el desplazamiento animado que Next advierte en consola). La navegación del header usa una grilla `1fr | auto | 1fr` en escritorio para que los enlaces no se muevan
cuando cambia el ancho del bloque de acciones (sesión iniciada o no).

**Formularios al salir de la página:** Next conserva las páginas visitadas, así que `useDemoForm` descarta lo no enviado cuando sales de la sección (valores, errores y estado).
Con `keepSavedOnLeave` (perfil del emprendedor) se conserva lo que sí se guardó y se descarta lo editado después.

**Mapa del hero (v2):** rotación automática de los ejes cada 5 s con barra de progreso; se pausa con el cursor o el foco, tiene botón «Pausar/Reanudar» (esquina del mapa), elegir un nodo a mano la detiene y no arranca con `prefers-reduced-motion`.
Mientras rota sola la tarjeta no se anuncia a lectores de pantalla (`aria-live="off"`); en pausa o con selección manual sí (`polite`). Foco de luz del color del eje que sigue al nodo,
satélites que orbitan en el anillo exterior y entrada escalonada de los nodos al cargar. Cada eje muestra una cifra calculada sobre los datos de demostración.
