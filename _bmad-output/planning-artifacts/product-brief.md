# NEXORA — Product Brief (MVP piloto Temuco)

> Estado: borrador de trabajo del equipo de Innovación y Desarrollo Tecnológico. Nombre provisional.
> Alcance de esta fase: **prototipo navegable con datos ficticios**. No hay backend, autenticación ni datos reales.

## Problema
Los emprendimientos de Temuco son poco visibles para compradores locales, y las oportunidades de apoyo
(ferias, capacitaciones, fondos, convocatorias) están dispersas entre instituciones. La municipalidad
no tiene una vista agregada del ecosistema para decidir dónde apoyar.

## Usuarios
| Rol | Necesidad principal | Permisos en el MVP |
|---|---|---|
| Visitante / comprador | Encontrar negocios, productos y servicios locales y contactarlos | Solo lectura pública; puede enviar solicitud de contacto |
| Emprendedor | Mantener su perfil y catálogo, descubrir oportunidades, ver solicitudes | Solo su propio negocio (`/dashboard`) |
| Administrador de plataforma | Moderar perfiles, publicar oportunidades, ordenar rubros | Lectura y escritura en `/admin` |
| Usuario municipal | Consultar indicadores agregados del piloto | Solo lectura en `/admin` (resumen, actividad) |

## Propuesta de valor
Un solo lugar donde (1) los compradores encuentran emprendimientos locales y (2) los emprendedores
descubren oportunidades concretas y gestionan su presencia; y (3) la municipalidad ve el ecosistema
con datos agregados.

## Alcance del MVP (esta fase)
- Catálogo con búsqueda y filtros por rubro y ubicación, fichas individuales y contacto.
- Oportunidades con filtro por categoría, detalle y registro de interés (demostrativo).
- Login / registro con validación (sin cuenta real) y selector de rol de demostración.
- Área del emprendedor: resumen, perfil editable (local), productos, solicitudes, oportunidades guardadas.
- Área administrativa: métricas derivadas de datos de demostración, gestión de perfiles, oportunidades,
  rubros y actividad, con operaciones demostrativas.

## Exclusiones
IA generativa, pagos, integraciones municipales, apps nativas, matching avanzado, notificaciones
multicanal, autenticación/autorización productivas, persistencia real.

## Flujos principales
1. **Comprador**: Inicio → buscar → catálogo filtrado → ficha → enviar solicitud de contacto.
2. **Emprendedor**: Registro → (demo) acceso → dashboard → editar perfil → agregar producto → guardar oportunidad.
3. **Administrador**: Acceso demo → resumen → revisar emprendimientos pendientes → publicar oportunidad.
4. **Municipal**: Acceso demo → resumen e indicadores → actividad (sin acciones de edición).

## Arquitectura de información
```
/                         Inicio
/emprendimientos          Catálogo (búsqueda, filtros)
  /[slug]                 Ficha + solicitud de contacto
/oportunidades            Listado (filtro categoría)
  /[slug]                 Detalle + marcar interés
/login  /registro         Acceso (demo)
/dashboard                Resumen emprendedor
  /perfil /productos /solicitudes /oportunidades
/admin                    Resumen
  /emprendimientos /oportunidades /categorias /actividad
/acceso-denegado          Sin permisos para el rol actual
```

## Riesgos
- Confundir contenido ficticio con real → etiquetado "Demostración" visible en todo contenido y avisos.
- Autorización solo visual en el prototipo → documentado; la real va en el backend Spring Boot (Spring Security + autorización por rol en servidor).
- Alcance amplio → priorizar catálogo y oportunidades; admin read-mostly.
