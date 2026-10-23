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
| `lib/repository.ts` es el único acceso a datos | Principio D: al conectar la API de Spring Boot se cambia la implementación, no las pantallas |
| Reglas de filtro/métricas en `features/*/lib` | Principio S: componentes solo presentan; lógica pura y testeable |
| `Button`/`Field` con props mínimas; `DataTable` genérico (tabla en ≥768 px, tarjetas en móvil) | Principios I y L: mismo contrato, dos presentaciones |
| `permissions.ts` mapea rol → permisos | Principio O: agregar un rol no toca componentes |
| Vigencia de oportunidad como dato (`status`) | Con Cache Components no se puede usar la fecha actual en el prerender sin Suspense; además evita presentar fechas ficticias como vencidas por reloj |
| Filtros en cliente con parámetros de URL (`useSearchParams` dentro de `Suspense`) | Enlaces compartibles (`?rubro=`, `?tipo=`) y páginas estáticas |
| `generateStaticParams` en fichas | Slugs conocidos; los no válidos devuelven 404 |
| Datos ficticios con dominio `.example` y sufijo «(demo)» | Evita presentarlos como reales |
| Sin librerías nuevas en el frontend (solo lucide-react) | `@supabase/supabase-js` quedó instalado pero sin uso: el backend es Spring Boot |
| Rol demo en `localStorage` | **No es seguridad.** `RoleGate` solo oculta UI |

## Autorización (limitación consciente)
`RoleGate` es protección visual en el cliente. La autorización real (Spring Security con JWT y permisos por rol
verificados en el backend) pertenece a la siguiente fase. Los datos de demostración son
públicos en el bundle.

## Backend: Spring Boot (decisión definitiva)
`backend/` — Java 17, Spring Boot 4.1.1, Maven, PostgreSQL con Flyway. Estructura por dominio:
`catalog/`, `opportunities/`, `config/`, `shared/`. Esquema en `db/migration`; datos ficticios en `db/demo`
(se excluyen en producción cambiando `NEXORA_FLYWAY_LOCATIONS`). DTOs JSON con los mismos nombres que `src/types`.

Estado: fase 1 (API pública de solo lectura) escrita y compilada, con tests unitarios de la búsqueda; **pendiente de verificar contra PostgreSQL**.

Modelo previsto: `users(id, email, password_hash, role)` · `businesses(owner_id…)` · `categories` · `offerings` ·
`opportunities` · `opportunity_requirements` · `opportunity_interests` · `contact_requests` · `audit_log`.

## Fases siguientes
1. Verificar la fase 1 con una prueba de integración (PostgreSQL en contenedor).
2. Conectar el frontend: `src/lib/repository.ts` pasa a llamar a la API (variable `NEXT_PUBLIC_API_URL`), sin tocar pantallas.
3. Spring Security: registro, login (JWT), roles visitante/emprendedor/admin/municipal con autorización en servidor.
4. Endpoints de escritura (perfil, productos, solicitudes de contacto, administración) con validación en servidor y auditoría.
5. Almacenamiento de imágenes y configuración por variables de entorno; sin secretos en el repositorio.
