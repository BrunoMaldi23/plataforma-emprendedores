# Roadmap

1. **MVP prototipo (esta fase)** — navegable, datos ficticios, sin backend.
2. **Backend Spring Boot** — fase 1 (lectura de catálogo y oportunidades, PostgreSQL + Flyway) escrita en `backend/`; falta verificarla contra PostgreSQL, conectar el frontend, y agregar Spring Security (JWT, roles), endpoints de escritura y almacenamiento de archivos.
3. **Calidad** — pruebas unitarias de `features/*/lib` y `lib/validation`; E2E (Playwright) de: búsqueda → ficha → contacto, registro, control por rol; auditoría de accesibilidad automatizada.
4. **Operación del piloto** — carga real de emprendimientos y oportunidades, flujo de revisión, auditoría administrativa persistente, vistas agregadas para el rol municipal.
5. **Después** — notificaciones, estadísticas reales, integraciones municipales, matching; evaluar IA y pagos solo con caso de uso definido.
