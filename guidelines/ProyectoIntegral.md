# Documento de Conceptualización Integral - Voisins Unis

## 1. Análisis Funcional
El sistema **Voisins Unis** es una plataforma integral para la gestión territorial de familias, diseñada para equipos de trabajo social. Su objetivo es digitalizar y centralizar la información de los vecinos, permitiendo un seguimiento detallado, análisis de datos para la toma de decisiones y automatización de reportes.

### Funcionalidades Principales
- **Gestión de Familias (CRUD)**: Registro detallado de núcleos familiares, datos socioeconómicos, laborales y educativos.
- **Dashboard y Analítica**: Visualización de métricas clave (KPIs) en tiempo real, distribución geográfica y demográfica.
- **Asistente IA**: Módulo de inteligencia artificial para detectar patrones de vulnerabilidad y sugerir intervenciones.
- **Reportes Automatizados**: Generación de informes en PDF/Excel para presentar a autoridades o coordinadores.
- **Seguridad y Auditoría**: Control de acceso basado en roles (RBAC) y registro de actividad.

### Actores del Sistema
- **Trabajador Social**: Carga y actualiza datos, registra observaciones, consulta dashboard operativo.
- **Coordinador/Admin**: Visualiza métricas globales, gestiona usuarios, configura parámetros del sistema.

## 2. Flujograma Integral

```mermaid
graph TD
    User((Usuario))
    subgraph Frontend [SPA React/Vite]
        Login[Login View]
        Dash[Dashboard View]
        FamView[Families View]
        RepView[Reports View]
        AIView[AI Analytics View]
        Store[Estado Global / Query Cache]
    end

    subgraph Backend [API Node.js/Express]
        AuthMW[Auth Middleware]
        AuthCont[Auth Controller]
        FamCont[Families Controller]
        RepCont[Reports Controller]
        AICont[AI Controller]
        
        subgraph Services
            AuthServ[Auth Service]
            FamServ[Families Service]
            RepServ[Reports Service]
            AIServ[AI Service]
        end
    end

    subgraph Data [Persistencia & Externos]
        DB[(PostgreSQL DB)]
        FileStore[Object Storage (S3/MinIO)]
        LLM[LLM Provider (OpenAI/Anthropic)]
    end

    User --> Login
    Login -->|Credenciales| AuthCont
    AuthCont -->|Valida| AuthServ
    AuthServ -->|Consulta| DB
    AuthServ -->|JWT| Login

    User --> Dash
    Dash -->|Request Data| FamCont
    FamCont -->|Get Stats| FamServ
    FamServ -->|Query Aggregations| DB

    User --> FamView
    FamView -->|CRUD| FamCont
    FamCont -->|Validate & Process| FamServ
    FamServ -->|Persist| DB

    User --> AIView
    AIView -->|Prompt/Context| AICont
    AICont -->|Process| AIServ
    AIServ -->|Fetch Context| DB
    AIServ -->|Generate Insight| LLM

    User --> RepView
    RepView -->|Request Report| RepCont
    RepCont -->|Generate| RepServ
    RepServ -->|Fetch Data| DB
    RepServ -->|Store PDF| FileStore
```

## 3. Documentación Completa

### Stack Tecnológico
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Shadcn/UI, Recharts, React Query.
- **Backend**: Node.js, Express (o NestJS), TypeScript.
- **Base de Datos**: PostgreSQL (Relacional) + Prisma ORM.
- **IA**: Integración con OpenAI API / Anthropic API.
- **Infraestructura**: Docker containers, CI/CD pipelines.

### Arquitectura
- **Cliente-Servidor**: Arquitectura RESTful API.
- **Seguridad**: JWT para autenticación, HTTPS, validación de inputs (Zod).
- **Patrón de Diseño Backend**: Controller-Service-Repository (o Controller-Service con Prisma).

## 4. Reglamento de Desarrollo

### General
1.  **Idioma**: Código y comentarios en Inglés (o Español consistente), commits en Español imperativo.
2.  **Git Flow**: Ramas `main`, `develop`, `feature/*`, `fix/*`. PRs obligatorios.

### Frontend
1.  **Componentes**: Funcionales, tipados estrictos (`interface Props`).
2.  **Estado**: Preferir estado local o React Query para server-state. Context solo para global UI (theme, auth).
3.  **Estilos**: Tailwind CSS con `cn()` utility. Evitar CSS modules salvo excepciones.

### Backend
1.  **API Design**: RESTful standard (`GET /families`, `POST /families`, etc.).
2.  **Validación**: Zod schemas para todos los inputs en controladores.
3.  **Errores**: Middleware centralizado de manejo de errores. Estructura estándar de respuesta JSON.
4.  **Database**: Migraciones versionadas. No cambios manuales en DB productiva.

## 5. Módulos de Desarrollo

### Módulo 1: Frontend Core (Existente)
- Shell de aplicación, navegación, componentes UI base.
- Vistas: Dashboard, Families, Reports, Settings.

### Módulo 2: Backend Auth & Users (Faltante)
- **Descripción**: Gestión de identidad y acceso.
- **Componentes**: Login, Registro (Admin), Recuperación de contraseña, Gestión de Perfil.

### Módulo 3: Backend Families Core (Faltante)
- **Descripción**: API para gestión de familias.
- **Componentes**: CRUD Familias, Filtros avanzados (Server-side), Gestión de Observaciones.

### Módulo 4: Backend Analytics & Reports (Faltante)
- **Descripción**: Procesamiento de datos y generación de documentos.
- **Componentes**: Aggregation Pipelines, Generador de PDF (Puppeteer/PDFKit), Exportador Excel.

### Módulo 5: Backend AI Services (Faltante)
- **Descripción**: Capa de inteligencia.
- **Componentes**: Prompt Engineering, Context Builder, Integración LLM API.

## 6. Componentes Internos (Backend Detail)

### Controllers
- `AuthController`: `login`, `register`, `refreshToken`.
- `FamilyController`: `getAll` (paginated), `getById`, `create`, `update`, `delete`, `addObservation`.
- `DashboardController`: `getStats`, `getTrends`.
- `ReportController`: `generateReport`, `getReportHistory`.

### Services
- `AuthService`: Lógica de hash (bcrypt), firma de tokens.
- `FamilyService`: Lógica de negocio, validaciones complejas, llamadas a DB.
- `AIService`: Construcción de prompts con datos anonimizados, llamada a API externa.
- `StorageService`: Abstracción para guardar archivos (Local/S3).

### Middlewares
- `authenticateJWT`: Protege rutas privadas.
- `authorizeRole(role)`: Control de acceso por rol.
- `validateRequest(schema)`: Valida body/params contra Zod schema.
- `errorHandler`: Captura excepciones y formatea respuesta HTTP.

## 7. Funciones Internas (Backend Key Functions)

- **`FamilyService.createFamily(data)`**:
    - Valida unicidad (DNI).
    - Crea registro en DB.
    - Inicializa historial de observaciones.
    - Retorna objeto creado.

- **`DashboardService.getGlobalStats(filters)`**:
    - Ejecuta queries de agregación (`COUNT`, `GROUP BY`) en DB.
    - Calcula porcentajes (ej. % desempleo).
    - Retorna DTO para gráficos.

- **`AIService.analyzeFamilyRisk(familyId)`**:
    - Recupera datos completos de la familia.
    - Anonimiza PII (Información Personal Identificable).
    - Envía prompt a LLM: "Analiza riesgo social basado en: desempleo, 3 hijos, sin estudios...".
    - Parsea respuesta y guarda "Insight" en DB.

- **`ReportService.generateMonthlyPDF()`**:
    - Recopila estadísticas del mes.
    - Renderiza plantilla HTML con Handlebars/EJS.
    - Convierte HTML a PDF.
    - Guarda referencia en tabla `Reports`.

## 8. Roadmap de Sprints
*(Ver documento `RoadmapVoisinsUnis.md` para detalle temporal)*
