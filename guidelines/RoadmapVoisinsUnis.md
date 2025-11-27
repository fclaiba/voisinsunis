# Roadmap de Sprints – Voisins Unis

| Sprint | Duración | Objetivos clave | Entregables | Dependencias | Métricas |
| --- | --- | --- | --- | --- | --- |
| Sprint 0 – Preparación | 1 semana | • Validar alcance y recursos<br>• Definir arquitectura técnica final<br>• Configurar entornos dev/staging/CI | • Documento de alcance actualizado<br>• Repositorios y pipelines activos<br>• Backlog priorizado | Documento funcional actual | Ambiente listo, backlog ordenado |
| Sprint 1 – Backend básico y autenticación | 2 semanas | • Implementar API base (familias, catálogos)<br>• Integrar autenticación (JWT/OAuth)<br>• Conectar front a endpoints CRUD | • Servicios REST (`/families`, `/catalogs/*`)<br>• Hook de datos en `App`/`FamiliesView`<br>• Módulo de login/logout | Sprint 0 | Cobertura >60%, login funcional, latencia <300 ms |
| Sprint 2 – Gestión de familias avanzada | 2 semanas | • Persistir observaciones y archivos adjuntos<br>• Implementar import/export reales<br>• Manejo de estados de carga y errores | • Endpoints `PATCH /families/:id/observations`, import/export<br>• UI con loaders/toasts<br>• Validaciones formulario | Sprint 1 | Exportación exitosa, 0 errores críticos, UX sin bloqueos |
| Sprint 3 – Analítica & dashboards | 2 semanas | • Generar métricas agregadas server-side<br>• Optimizar visualizaciones y caching<br>• Preparar endpoints para IA | • `/analytics/*` (KPIs, tendencias, geodistribución)<br>• Hooks de datos agregados<br>• Ajustes UI de gráficos | Sprint 1 | Tiempo carga <2 s, coherencia KPIs, reducción cálculo cliente |
| Sprint 4 – Reportes y programación | 1.5 semanas | • Construir servicio de reportes (PDF/CSV)<br>• Programar envíos automáticos y notificaciones<br>• UI/UX para historial y estados | • Worker/report scheduler<br>• Endpoints `POST /reports/run`, `POST /reports/schedule`<br>• Integración con vista `Reports` | Sprint 2 | Reporte <1 min, notificaciones confiables, logs auditables |
| Sprint 5 – IA y recomendaciones | 2 semanas | • Integrar motor IA (propio/API externa)<br>• Mejorar chat con histórico y feedback<br>• Añadir panel de insights accionables | • Servicio IA (`POST /ai/insights`, `POST /ai/chat`)<br>• Persistencia de mensajes<br>• UI con tags, confianza, favoritos | Sprint 3 | 90% sesiones IA exitosas, respuesta <5 s, seguimiento hits |
| Sprint 6 – Seguridad, pruebas y accesibilidad | 1.5 semanas | • Hardening (roles, auditoría, rate limiting)<br>• Tests end-to-end y performance<br>• WCAG AA y soporte multi-idioma | • RBAC completo, logs centralizados<br>• Suite Cypress carga completa<br>• Traducciones i18n (ES/EN) | Sprint 1-5 | >80% cobertura E2E, Lighthouse >90, WCAG AA comprobado |
| Sprint 7 – Deploy y capacitación | 1 semana | • Orquestar release productiva<br>• Preparar manuales y formación usuarios<br>• Establecer monitoreo y soporte | • Playbook de despliegue<br>• Manual operativo + videos<br>• Monitoreo (APM, alertas) | Sprints previos finalizados | Deploy sin regresiones, NPS piloto ≥8/10 |

## Observaciones
- El roadmap asume equipo multidisciplinario (frontend, backend, QA, UX, data). Ajustar duración según capacidad real.
- Cada sprint debe cerrar con demo, retro y actualización de documentación (`ProyectoIntegral.md`, APIs, diagramas).
- Priorizar deuda técnica dentro de cada sprint para evitar acumulación y asegurar mantenibilidad.

