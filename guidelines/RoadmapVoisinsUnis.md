# Roadmap de Sprints – Voisins Unis

| Sprint | Duración | Objetivos clave | Entregables | Dependencias | Métricas |
| --- | --- | --- | --- | --- | --- |
| **Sprint 0: Setup & Arquitectura** | 1 semana | • Configurar Repo Monorepo (o separar Front/Back)<br>• Setup DB (PostgreSQL) y ORM<br>• Configurar CI/CD básico | • Repo inicializado<br>• Docker Compose (DB + API)<br>• "Hello World" API endpoint | N/A | Ambiente local corriendo en 1 comando |
| **Sprint 1: Auth & Core Backend** | 2 semanas | • Implementar Auth (JWT)<br>• API CRUD Familias básica<br>• Migración de datos Mock a DB | • Endpoints `/auth/*`<br>• Endpoints `/families` (GET/POST)<br>• Script de carga inicial | Sprint 0 | Login funcional, Datos persistentes |
| **Sprint 2: Conexión Frontend-Backend** | 2 semanas | • Reemplazar MockData en Frontend<br>• Conectar formularios a API<br>• Manejo de errores y Loaders | • `FamiliesView` conectado a API<br>• Feedback visual (Toasts)<br>• Paginación en tabla | Sprint 1 | CRUD completo desde UI |
| **Sprint 3: Analítica & Dashboard Real** | 2 semanas | • Endpoints de Agregación (Stats)<br>• Optimización de queries SQL<br>• Conectar Dashboard Charts | • Endpoints `/dashboard/stats`<br>• Gráficos con datos reales<br>• Filtros server-side | Sprint 2 | Tiempo de carga Dashboard < 1s |
| **Sprint 4: Módulo de Reportes** | 1.5 semanas | • Generación de PDF en Backend<br>• Endpoints de descarga<br>• Historial de reportes | • Servicio de PDF<br>• Botón "Exportar" funcional<br>• Tabla de reportes previos | Sprint 3 | PDF generado correctamente |
| **Sprint 5: Integración IA** | 2 semanas | • Servicio de conexión a LLM<br>• Prompt Engineering para análisis<br>• UI de Chat/Insights conectada | • Endpoint `/ai/analyze`<br>• Chat funcional en UI<br>• Guardado de insights | Sprint 3 | Respuestas coherentes del asistente |
| **Sprint 6: Pulido & Seguridad** | 1.5 semanas | • Auditoría de seguridad (Rate limiting, Helmet)<br>• Tests E2E (Cypress)<br>• Optimización final | • Reporte de seguridad<br>• Suite de tests pasando<br>• Build de producción optimizado | Sprint 5 | Coverage > 70% |
| **Sprint 7: Despliegue & Entrega** | 1 semana | • Deploy a Staging/Prod<br>• Documentación final de usuario<br>• Capacitación | • URL productiva<br>• Manual de usuario<br>• Handover técnico | Sprint 6 | Sistema en producción sin errores |

## Observaciones
- **Backend Stack**: Node.js + Express + PostgreSQL + Prisma.
- **Prioridad**: La persistencia de datos (Sprint 1-2) es crítica para dejar de usar mocks.
- **IA**: Se puede usar un mock de IA en Sprint 5 si no hay API Key disponible, pero la arquitectura debe estar lista.
