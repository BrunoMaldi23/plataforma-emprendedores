# NEXORA — PRD resumido (MVP prototipo)

## Requisitos funcionales
| ID | Requisito |
|---|---|
| RF1 | Buscar emprendimientos por nombre, descripción y etiquetas (sin distinguir tildes ni mayúsculas) |
| RF2 | Filtrar catálogo por rubro y comuna/sector; limpiar filtros; estado sin resultados |
| RF3 | Ficha de emprendimiento con productos/servicios y formulario de contacto validado |
| RF4 | Listado de oportunidades filtrable por categoría, con vigencia, entidad, requisitos y enlace |
| RF5 | Detalle de oportunidad; marcar interés (estado local, demostrativo) |
| RF6 | Registro y login con validación de campos, estados de envío/éxito/error, sin cuenta persistente |
| RF7 | Selector de rol de demostración que controla visibilidad de `/dashboard` y `/admin` |
| RF8 | Dashboard del emprendedor: perfil editable local, productos (alta/baja local), solicitudes, oportunidades guardadas |
| RF9 | Panel admin: métricas derivadas de los datos, tablas con filtros, operaciones demostrativas |
| RF10 | Rol municipal en modo solo lectura |

## Requisitos no funcionales
- RNF1 Responsive 360–1440 px sin scroll horizontal; menú móvil.
- RNF2 Accesibilidad: foco visible, etiquetas en formularios, contraste AA, navegación por teclado, `lang="es"`.
- RNF3 TypeScript estricto, sin `any`; datos tipados y separados de la UI.
- RNF4 Contenido ficticio siempre identificado; sin métricas inventadas presentadas como reales.
- RNF5 Sin secretos en el repositorio.

## Historias y criterios de aceptación (selección)
**H1 Buscar negocio** — Como comprador quiero buscar por palabra para encontrar un negocio.
 - Dado el catálogo, al escribir "café" se listan solo negocios cuyo nombre, descripción o etiquetas lo contienen.
 - Si no hay resultados se muestra un estado vacío con botón "Limpiar filtros".

**H2 Contactar** — Como comprador quiero enviar una solicitud a un negocio.
 - Los campos nombre, correo válido y mensaje (≥ 10 caracteres) son obligatorios; los errores aparecen junto al campo.
 - Al enviar se indica explícitamente que es una demostración y que no se envió nada.

**H3 Oportunidades** — Como emprendedor quiero filtrar oportunidades por categoría y ver sus requisitos.
 - El detalle muestra entidad, fechas, requisitos, enlace y la etiqueta "Contenido ficticio".

**H4 Registro** — Como emprendedor quiero registrarme.
 - Contraseña ≥ 8 caracteres con letra y número; confirmación debe coincidir; se aceptan términos.
 - El éxito aclara que la cuenta no fue creada (autenticación pendiente).

**H5 Perfil** — Como emprendedor edito mi perfil; los cambios viven solo en la sesión de la página.

**H6 Control por rol** — Un visitante que abre `/admin` ve "Acceso denegado"; un municipal ve `/admin` sin botones de edición.

**H7 Admin** — Como administrador veo métricas por rubro y estado calculadas desde los datos de demostración, y puedo aprobar/ocultar un perfil o publicar/cerrar una oportunidad (local).

## Decisiones clave
- Estado de vigencia de oportunidades es un campo de datos (no se calcula con la fecha actual) para mantener páginas prerenderizadas con Cache Components.
- Filtros y búsqueda en cliente sobre datos tipados; la lógica vive en `src/features/*/lib`, no en componentes.
- Rol de demostración en `localStorage`; **no es seguridad**.
