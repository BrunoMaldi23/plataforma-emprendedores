# Arquitectura

Next.js 16 (App Router, Cache Components + Partial Prefetching), React 19, TypeScript estricto, Tailwind 4.
Antes de tocar rutas se leyó la documentación incluida en `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Estructura

```
src/
  app/(site)/        Rutas y layouts. Un solo grupo con header/footer; dashboard/ y admin/ añaden su propio layout con RoleGate
  components/ui/     Componentes visuales sin lógica de negocio (Button, Field, Badge, Alert, DataTable…)
  components/layout/ Header, footer, navegación de panel
  features/<dominio>/ catalog · opportunities · auth · dashboard · admin · forms
     components/     UI específica del dominio
     lib/            Reglas puras (filtros, métricas) fáciles de probar
  data/              Datos ficticios tipados (única fuente)
  lib/               repository (acceso a datos), validation, permissions, format, text
  types/             Contratos de dominio
```

## Decisiones

| Decisión | Motivo |
|---|---|
| `lib/repository.ts` es el único acceso a datos | Principio D: al conectar el backend se cambia la implementación, no las pantallas |
| Reglas de filtro/métricas en `features/*/lib` | Principio S: componentes solo presentan; lógica pura y testeable |
| `Button`/`Field` con props mínimas; `DataTable` genérico (tabla en ≥768 px, tarjetas en móvil) | Principios I y L: mismo contrato, dos presentaciones |
| `permissions.ts` mapea rol → permisos | Principio O: agregar un rol no toca componentes |
| Vigencia de oportunidad como dato (`status`) | Con Cache Components no se puede usar la fecha actual en el prerender sin Suspense; además evita presentar fechas ficticias como vencidas por reloj |
| Filtros en cliente con parámetros de URL (`useSearchParams` dentro de `Suspense`) | Enlaces compartibles (`?rubro=`, `?tipo=`) y páginas estáticas |
| `generateStaticParams` en fichas | Slugs conocidos; los no válidos devuelven 404 |
| Datos ficticios con dominio `.example` y sufijo «(demo)» | Evita presentarlos como reales |
| Sin librerías nuevas en el frontend (solo lucide-react) | `@supabase/supabase-js` quedó instalado pero sin uso; el backend lo define otra persona |
| Rol demo en `localStorage` | **No es seguridad.** `RoleGate` solo oculta UI |

## Autorización (limitación consciente)
`RoleGate` es protección visual en el cliente. La autorización real (sesión, permisos por rol) debe validarse **en el servidor del backend**.
Los datos de demostración son públicos en el bundle. Las rutas `/admin` y `/dashboard` exportan `instant = false` porque el rol solo existe en el cliente;
al pasar la sesión al servidor, esas líneas se retiran.

## Backend
Fuera del alcance de este repositorio: lo desarrolla otra persona. El frontend deja un punto único de lectura (`lib/repository.ts`) y puntos
de escritura identificados; todo está listado en [`INTEGRACION-BACKEND.md`](INTEGRACION-BACKEND.md).
