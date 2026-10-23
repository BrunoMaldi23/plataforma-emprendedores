# MVP — alcance y estado real

Todo el contenido es ficticio y está identificado como tal. Ver `_bmad-output/planning-artifacts/` para brief y PRD.

| Área | Ruta | Estado |
|---|---|---|
| Inicio | `/` | Funcional: búsqueda (GET a catálogo), rubros, ejes con enlaces reales |
| Catálogo | `/emprendimientos` | Funcional: búsqueda sin tildes, filtros rubro/sector, URL compartible, vacío y limpiar |
| Ficha | `/emprendimientos/[slug]` | Funcional; contacto **simulado** (valida, no envía) |
| Oportunidades | `/oportunidades`, `/[slug]` | Funcional: filtro por categoría, detalle, «Me interesa» (localStorage) |
| Acceso | `/login`, `/registro` | Validación y estados; **sin cuenta real**; selector de rol demo |
| Emprendedor | `/dashboard/*` | Perfil y productos editables **en memoria**, solicitudes con estados locales, intereses guardados |
| Admin | `/admin/*` | Métricas derivadas, tablas responsivas, aprobar/ocultar, publicar/cerrar, nuevo rubro (locales) |
| Municipal | `/admin` | Mismo panel en solo lectura (sin botones de edición) |
| Errores | `/acceso-denegado`, 404, error global | Implementados |

## No implementado
Autenticación y autorización reales, persistencia, envío de correos, fotos reales, IA, pagos, integraciones.
