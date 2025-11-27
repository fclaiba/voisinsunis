# Documento integral del proyecto Voisins Unis

## 1. Análisis funcional
- **Propósito general**: Voisins Unis es una SPA React/Vite que centraliza la gestión de familias, analítica social y configuración operativa para equipos territoriales.
- **Estructura de navegación**: `App.tsx` mantiene `activeSection` y renderiza vistas (`Dashboard`, `FamiliesView`, `Reports`, `Analytics`, `Settings`) con barras lateral y superior (`Sidebar`, `MobileSidebar`, `Header`).
- **Modelo de datos actual**: se nutre de `mockFamilies` (`data/mockData.ts`), instancia `useState` y distribuye el estado a cada vista; no existe persistencia remota.
- **Gestión de familias**: en `FamiliesView` los filtros (`FilterBar`), tabla (`FamilyTable`) y modales (`AddEditFamilyDialog`, `DeleteConfirmDialog`, `ObservationsPanel`) permiten CRUD in-memory, manejo de observaciones y exportaciones simuladas.
- **Dashboards y analítica**: `DashboardWithRealData` y `Analytics` generan KPIs, gráficos y “insights” con Recharts, alimentados por cálculos locales sobre `families`.
- **Reportes**: `Reports` ofrece plantillas, constructor y tabla histórica; las acciones de descarga/impresión están maquetadas pero aún sin lógica externa.
- **Configuración**: `Settings` agrupa perfil, notificaciones, seguridad, apariencia y privacidad con `Switch`, `Input` y `Select`; actualmente solo representan UI.
- **Asistente IA simulado**: `AIAnalytics` crea insights automáticos y un flujo de chat mockeado con timers y funciones heurísticas.
- **Experiencia responsive**: `Sidebar`/`MobileSidebar` y componentes de UI (`components/ui/*`) aseguran compatibilidad mobile/desktop.

## 2. Flujograma completo (textual)
1. **Inicio**
   - `main.tsx` monta `<App />` dentro de `ThemeProvider`.
2. **Carga inicial**
   - `App` inicializa `families` con `mockFamilies`, `filters` en estado por defecto.
   - Renderiza `Sidebar`, `MobileSidebar`, `Header` y la vista activa (`activeSection` = `dashboard`).
3. **Navegación**
   - Usuario selecciona sección → `setActiveSection` → `renderContent()` retorna vista correspondiente.
4. **Gestión de familias**
   - `FamiliesView` recibe `families`, calcula `filteredFamilies`.
   - Acciones:
     - **Filtrar**: `FilterBar` actualiza `filters` → `useMemo` recalcula dataset.
     - **Agregar/Editar**: abre `AddEditFamilyDialog` → `handleSaveFamily` invoca `handleAddFamily`/`handleEditFamily` (actualiza estado).
     - **Eliminar**: `DeleteConfirmDialog` → `handleConfirmDelete` → `handleDeleteFamily`.
     - **Observaciones**: `ObservationsPanel` → `handleSaveObservations`.
5. **Dashboard/Analytics**
   - Reciben `families`, derivan métricas y renderizan gráficos; `Analytics` ofrece pestaña IA que consume los mismos datos.
6. **Reportes**
   - Plantillas y constructor presentan datos calculados; botones de descarga aún sin backend.
7. **Configuración**
   - Controles de perfil y preferencias actualizan UI local (sin persistencia).
8. **Cierre**
   - Estado se mantiene en memoria hasta recarga manual; no hay almacenamiento persistente.

## 3. Documentación funcional y técnica
### Tecnologías base
- React 18, Vite, TypeScript.
- Librerías de UI: conjunto estilo shadcn (`components/ui/*`), Lucide icons, Recharts.
- Themado con `next-themes` (`ThemeProvider` + `ThemeToggle`).

### Organización de carpetas
- `App.tsx`: orquestador principal.
- `components/`: UI compartida y vistas especializadas.
- `components/views/`: pantallas completas.
- `data/`: datos mock y catálogos.
- `lib/utils.ts`: utilidades comunes (`cn`).
- `styles/`: estilos globales y Tailwind config.

### Datos clave
- `Family` y `FilterState` en `types/family.ts`.
- `mockFamilies` incluye casos con observaciones, estudios y programas.
- Listas de soporte: `programasSocialesOptions`, `oficiosComunes`.

### Estado y flujo de datos
- El estado maestro (`families`, `filters`, “dialogs open”) vive en `App`, se pasa por props.
- Mutaciones centralizadas en `App` (`handleAddFamily`, `handleEditFamily`, etc.) garantizan consistencia.

### Dependencias externas relevantes
- `lucide-react` para iconografía.
- `recharts` para gráficos.
- `next-themes` para modo oscuro/claro.

### Limitaciones actuales
- Sin integración backend (CRUD, reportes, notificaciones).
- IA y reportes son simulaciones.
- Falta manejo de errores, loaders y validaciones formales.

## 4. Reglamento de desarrollo
1. **Estándares de código**
   - TypeScript estricto, componentes funcionales con hooks.
   - Utilizar `cn` para combinar clases Tailwind.
   - Documentar bloques complejos con comentarios concisos.
2. **UI/UX**
   - Mantener coherencia con paleta existente; al agregar overlays o nuevas UI preferir fondo blanco con texto/iconografía negra (según pauta del cliente).
   - Verificar responsividad en breakpoints móviles (`lg`, `md`).
3. **Estado y datos**
   - Centralizar cambios globales en contextos o stores compartidos antes de duplicar lógica.
   - Al integrar backend, encapsular llamadas en servicios o hooks dedicados.
4. **Versionado y ramas**
   - Convención sugerida: `main` estable, ramas de feature `feature/<descripcion>`, fix `fix/<descripcion>`.
   - Commits descriptivos en español, imperativo corto.
5. **Revisiones y testing**
   - PRs requieren al menos una revisión cruzada.
   - Añadir tests unitarios (React Testing Library) para lógica de filtros y helpers.
6. **Accesibilidad**
   - Usar etiquetas semánticas, textos alternativos e indicadores de foco visibles.
7. **Documentación continua**
   - Actualizar este documento al modificar módulos/funciones clave.

## 5. Módulos de software
| Módulo | Descripción | Archivos principales |
| --- | --- | --- |
| Núcleo de aplicación | Shell general, navegación, estado global | `App.tsx`, `Sidebar.tsx`, `MobileSidebar.tsx`, `Header.tsx` |
| Gestión de familias | CRUD, filtros, observaciones | `components/views/FamiliesView.tsx`, `FamilyTable.tsx`, `FilterBar.tsx`, `AddEditFamilyDialog.tsx`, `DeleteConfirmDialog.tsx`, `ObservationsPanel.tsx` |
| Dashboards y métricas | Indicadores y tarjetas resumidas | `components/views/DashboardWithRealData.tsx`, `DashboardStats.tsx`, `components/views/Dashboard.tsx` |
| Analítica avanzada e IA | Visualizaciones enriquecidas e insights automáticos | `components/views/Analytics.tsx`, `AIAnalytics.tsx` |
| Reportes | Gestión de reportes predefinidos y personalizados | `components/views/Reports.tsx` |
| Configuración | Preferencias de usuario y sistema | `components/views/Settings.tsx` |
| Infraestructura UI | Componentes base reutilizables | `components/ui/*`, `lib/utils.ts`, `ThemeToggle.tsx` |
| Datos y tipados | Mock data y tipos dominantes | `data/mockData.ts`, `types/family.ts` |

## 6. Componentes internos por módulo
- **Núcleo de aplicación**
  - `App`: controla estado global, render condicional.
  - `Sidebar` / `MobileSidebar`: navegación principal responsive.
  - `Header`: búsqueda, notificaciones, menú usuario, `ThemeToggle`.
- **Gestión de familias**
  - `FamiliesView`: compone filtros, barra de acciones, tabla y modales.
  - `FilterBar`: inputs y selects dinamizados por dataset.
  - `FamilyTable`: tabla interactiva con badges y acciones.
  - `AddEditFamilyDialog`: formulario multisección.
  - `DeleteConfirmDialog`: confirmación de borrado.
  - `ObservationsPanel`: sheet de observaciones extendidas.
- **Dashboards y métricas**
  - `DashboardWithRealData`: tarjetas hero, gráficos, listas.
  - `DashboardStats`: tarjetas compactas reutilizadas en otras vistas.
- **Analítica avanzada e IA**
  - `Analytics`: pestañas Overview / IA, combina múltiples gráficos.
  - `AIAnalytics`: insights automáticos y chat simulado.
- **Reportes**
  - `Reports`: tarjetas de plantillas, builder personalizado y tabla histórica.
- **Configuración**
  - `Settings`: secciones de perfil, notificaciones, seguridad, apariencia, datos y preferencias.
- **Infraestructura UI**
  - Suite de componentes base (`button`, `card`, `dialog`, `sheet`, `table`, etc.) utilizados transversalmente.

## 7. Funciones internas destacadas
- **`App.tsx`**
  - `renderContent()`: selección de vista según `activeSection`.
  - `getSectionTitle()`: describe título/subtítulo dinámico.
  - `handleAddFamily`, `handleEditFamily`, `handleDeleteFamily`, `handleSaveObservations`: CRUD y persistencia en memoria.
  - `clearFilters()`: reinicia `filters`.
- **`FamiliesView`**
  - `handleAddClick`, `handleEditClick`, `handleDeleteClick`, `handleViewObservations`: abren modales.
  - `handleSaveFamily`: decide entre agregar/editar.
  - `handleConfirmDelete`: orquesta borrado.
- **`FilterBar`**
  - `barriosUnicos`: deriva opciones dinámicas.
  - `onFilterChange`/`onClearFilters`: callbacks controlados vía props.
- **`FamilyTable`**
  - `getEstudiosBadge`: compone etiquetas según trayectoria educativa.
  - Renderiza acciones `onEdit`, `onDelete`, `onViewObservations`.
- **`AddEditFamilyDialog`**
  - `useEffect`: sincroniza formulario con modo/registro seleccionado.
  - `handleSave`: normaliza datos y delega en `onSave`.
  - `togglePrograma`: maneja selección múltiple de programas sociales.
- **`DeleteConfirmDialog`**
  - Render condicional de datos de familia, `onConfirm` para ejecutar eliminación.
- **`ObservationsPanel`**
  - `useEffect`: precarga observaciones ampliadas.
  - `handleSave`: envía actualizaciones al padre (`onSave`).
- **`DashboardWithRealData` / `DashboardStats`**
  - Cálculos de KPIs (`totalFamilies`, `familiesWithJobs`, etc.).
  - Generación de datasets para Recharts (programs, employment, geo-distribución).
- **`Analytics`**
  - Construye datasets combinados (`monthlyComparison`, `needsRadar`, `programsAnalysis`).
  - Gestiona tabs y renderiza `AIAnalytics`.
- **`AIAnalytics`**
  - `analyzePatterns`: genera insights automáticos con heurísticas.
  - `handleQuery`: controla flujo de chat y estado `isAnalyzing`.
  - `processQuery`: respuestas temáticas según palabras clave.
- **`Reports`**
  - Define plantillas (`reportTemplates`), tabla histórica (`recentReports`) y UI para constructor.
- **`Settings`**
  - Renderiza formularios y switches seccionados; mantiene UI cohesiva.
- **`Sidebar` / `MobileSidebar`**
  - `menuItems`, `onSectionChange`: controlan navegación, animaciones y cierre en mobile.
- **`Header`**
  - Maneja apertura del menú de perfil, contador de notificaciones, botón de menú móvil.

---
Este documento debe mantenerse actualizado conforme se añadan integraciones, endpoints o cambios estructurales al proyecto.

