# MVP — alcance y estado real

Todo el contenido es ficticio y está identificado como tal. Ver `_bmad-output/planning-artifacts/` para brief y PRD.

| Área | Ruta | Estado |
|---|---|---|
| Inicio | `/` | Funcional: búsqueda (GET a catálogo), rubros, ejes con enlaces reales |
| Catálogo | `/emprendimientos` | Funcional: búsqueda sin tildes, filtros rubro/sector, URL compartible, vacío y limpiar |
| Ficha | `/emprendimientos/[slug]` | Funcional; contacto **simulado** (valida, no envía) |
| Oportunidades | `/oportunidades`, `/[slug]` | Funcional: filtro por categoría, detalle, «Me interesa» (localStorage) |
| Acceso | `/login`, `/registro` | Validación y estados; **sin cuenta real**; selector de rol demo |
| Emprendedor | `/dashboard/*` | Estado compartido entre secciones (en memoria): perfil completo editable (rubro, sector, Instagram, etiquetas) con «guardar/descartar», productos y servicios con alta, edición y eliminación, solicitudes con filtros, búsqueda y estados, intereses guardados. Avisos con «Deshacer» y resumen siempre coherente |
| Admin | `/admin/*` | Estado compartido entre secciones (en memoria): resumen con pendientes y actividad reciente, emprendimientos (búsqueda, filtros con contadores, aprobar/ocultar), oportunidades (crear, editar, publicar, cerrar/reabrir, eliminar borradores), rubros (crear, editar, eliminar si no están en uso), actividad con filtros y exportación CSV. Emprendimientos: crear, editar, eliminar, aprobar/ocultar. Cada acción queda en la bitácora y se puede deshacer |
| Municipal | `/admin` | Mismo panel en solo lectura (sin botones de edición) |
| Errores | `/acceso-denegado`, 404, error global | Implementados |

## No implementado
Autenticación y autorización reales, persistencia, envío de correos, fotos reales, IA, pagos, integraciones.
