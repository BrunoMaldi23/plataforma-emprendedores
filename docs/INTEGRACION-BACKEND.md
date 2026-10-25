# Integración con el backend

El frontend es independiente del backend. Hoy todo sale de datos ficticios (`src/data/`) y las acciones de escritura están
simuladas en el cliente. Este documento describe **qué espera la interfaz**; la tecnología y la forma exacta de la API las decide
quien desarrolle el backend (los nombres de rutas de abajo son una propuesta).

## Dónde se conecta
- **Lectura:** todas las pantallas leen a través de `src/lib/repository.ts`. Reemplazar sus funciones por llamadas a la API no exige
  cambiar las pantallas (las funciones pasarían a ser `async`; las páginas ya son componentes de servidor).
- **Escritura:** hoy es simulada. Los puntos a reemplazar son:
  - `src/features/forms/use-demo-form.ts` (`simulate`): contacto, registro, login, perfil, productos.
  - `src/features/admin/state/admin-store.tsx`: todas las acciones del panel (cada una debe pasar a ser una llamada a la API).
  - `src/features/dashboard/components/requests-list.tsx`: cambio de estado de solicitudes.
  - `src/features/opportunities/saved-store.ts`: «Me interesa» (hoy en `localStorage`).
  - `src/features/auth/demo-session.ts`: rol de demostración (`localStorage`); debe reemplazarse por la sesión real.
- **Tipos:** `src/types/index.ts` es el contrato de datos que usa la interfaz (ids como `string`, fechas ISO `yyyy-mm-dd`,
  precios en CLP enteros). La API debería devolver esas formas o un adaptador en `repository.ts` las traduce.

## Recursos y operaciones que usa la interfaz (propuesta)
| Operación | Quién | Notas |
|---|---|---|
| Listar rubros | público | `Category { id, name, description }` |
| Listar emprendimientos (búsqueda, rubro, sector) | público | solo `approved`; hoy el texto se filtra en cliente (sin tildes, todos los términos) |
| Ficha de emprendimiento por `slug` + productos/servicios | público | 404 si no está aprobado |
| Listar oportunidades (por categoría) / detalle por `slug` | público | solo `published`; **`status` (open/upcoming/closed) es un dato, no se deriva de la fecha** |
| Enviar solicitud de contacto a un negocio | visitante | `{ name, email, message }` |
| Registro / login / sesión actual | visitante | roles: `visitor`, `entrepreneur`, `admin`, `municipal` |
| Ver y editar mi negocio (nombre, frase, descripción, rubro, sector, correo, Instagram, etiquetas ≤ 6) y **crear, editar y eliminar** mis productos/servicios | emprendedor | solo su propio negocio |
| Listar mis solicitudes y cambiar estado (`new`/`answered`/`archived`) | emprendedor | |
| Marcar/desmarcar interés en una oportunidad y listar las mías | emprendedor | |
| Panel: listar todos los emprendimientos; **crear, editar, eliminar**; cambiar estado (`approved`/`pending`/`hidden`) | admin (escritura), municipal (solo lectura) | `slug` único; `foundedYear` opcional |
| Panel: crear, editar, publicar/despublicar, cerrar/reabrir, eliminar (borradores) oportunidades | admin | `slug` único |
| Panel: crear, editar, eliminar rubros | admin | **no se puede eliminar un rubro con emprendimientos** |
| Panel: bitácora de actividad (listar, filtrar por área) | admin y municipal | cada acción de escritura del panel debe generar un registro `{ at, area, actor, action, target }` |

## Permisos (`src/lib/permissions.ts`)
- `visitor`: sin permisos de panel.
- `entrepreneur`: `dashboard:access` (solo sus datos).
- `admin`: `admin:read` + `admin:write`.
- `municipal`: solo `admin:read` (la interfaz oculta todo botón de edición, pero **la autorización debe validarse en el servidor**).

## Validaciones que ya aplica la interfaz (`src/lib/validation.ts`)
Deben repetirse en el servidor: correo válido; contraseña ≥ 8 caracteres con letra y número y confirmación igual; mensaje de contacto ≥ 10;
descripción de perfil ≥ 30; precio solo dígitos; rubro: nombre ≥ 3 sin repetir (sin distinguir mayúsculas) y descripción ≥ 10;
oportunidad: título ≥ 5, resumen ≥ 10, descripción ≥ 20, entidad e inicio obligatorios, cierre no anterior al inicio, enlace `http(s)://` opcional.

## Convenciones que conviene acordar
- **Errores de campo:** la interfaz muestra errores por campo; lo ideal es recibir `{ campo: "mensaje" }` (en español) con HTTP 422.
- **Sesión:** se recomienda cookie `httpOnly` (compatible con componentes de servidor). Si se usa token en cabecera, hay que decidir cómo se envía desde el servidor de Next.
- **CORS / URL base:** variable de entorno propuesta `NEXT_PUBLIC_API_URL` (solo URLs públicas; sin secretos en el repositorio ni en el cliente).
- **Paginación:** hoy no existe (listas pequeñas); acordar cuando el volumen crezca.
- **Contenido ficticio:** al conectar datos reales, retirar las insignias «Datos de demostración» y los avisos de demostración (buscar `DemoBadge`, `Alert` de demostración y los textos «(demo)» de `src/data`).

## «Deshacer» y estados de carga
La interfaz ofrece **Deshacer** en un aviso (toast) tras cada cambio. Hoy revierte el estado local; con backend hay dos opciones a acordar: (a) borrado lógico +
operación de restauración, o (b) volver a enviar el estado anterior (los mismos `PUT`/`POST`). Mientras una acción está en curso, el botón muestra «procesando»
(`useRowFeedback`, `simulateLatency` en `src/lib/use-row-feedback.ts` se reemplaza por la promesa real de la llamada).

## Referencia opcional
La carpeta `backend/` (Spring Boot + PostgreSQL, solo lectura de catálogo y oportunidades) y `compose.yaml` se crearon como **borrador de referencia**
antes de definir que el backend lo haría otra persona. No forman parte del frontend y pueden reemplazarse o eliminarse libremente.
