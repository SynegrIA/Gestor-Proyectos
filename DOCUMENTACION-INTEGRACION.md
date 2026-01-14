# 📋 DOCUMENTACIÓN TÉCNICA - PORTAL DIAGNÓSTICO SYNERGIA

**Versión**: 1.0  
**Fecha**: 14 Enero 2026  
**Propósito**: Guía de integración para nuevo desarrollador - Migración a PostgreSQL

---

## 📊 RESUMEN EJECUTIVO

### ¿Qué hace el sistema?

**Portal web multi-rol** para la gestión integral de proyectos de diagnóstico empresarial que conecta consultores de Synergia con sus clientes corporativos. Permite ejecutar, documentar y entregar diagnósticos digitales de transformación empresarial de manera colaborativa.

### Lógica Principal del Sistema

#### 1. Sistema Multi-Rol con Permisos Granulares
- **Cliente**: Ve solo su diagnóstico y únicamente contenido publicado por el consultor
- **Consultor**: Gestiona múltiples diagnósticos, crea/edita/publica entregables
- **Admin**: Además de consultor, gestiona usuarios, plantillas y catálogos globales

#### 2. Flujo de Trabajo Central: Borrador → Publicación → Revisión
El consultor trabaja en modo "backstage":
- Crea y edita entregables (dashboard, matriz, roadmap, iniciativas)
- Los mantiene en estado `BORRADOR` invisible para el cliente
- Cuando están listos (`LISTO_PARA_REVISAR`), los publica
- El cliente solo ve contenido marcado como `is_published: true`

#### 3. Gestión de Estado mediante Contextos React
- **AuthContext**: Autenticación mock con 4 usuarios hardcoded (cliente, consultor, admin, owner)
- **ProjectContext**: Estado global del proyecto (matriz, iniciativas, roadmap, medición, supuestos)
- **ThemeContext**: Tema visual (light/dark)
- Todo se persiste en `localStorage` simulando una API REST

#### 4. Arquitectura de Entregables
Cada diagnóstico se compone de:
- **Dashboard**: Resumen ejecutivo con KPIs
- **Matriz de Procesos**: Análisis dolor/tiempo de procesos empresariales
- **Roadmap**: Cronograma Gantt de iniciativas priorizadas
- **Iniciativas**: Fichas individuales con ROI, esfuerzo, aprobación cliente
- **Medición**: Captura de tiempo real de tareas (time tracking)
- **Supuestos**: Hipótesis validables del diagnóstico
- **Data Room**: Repositorio documental compartido

#### 5. Sistema de Comentarios y Colaboración
- Cada sección publicada permite comentarios bilaterales
- El consultor puede marcar comentarios como "resueltos"
- Integración con widget de chat (futuro)

---

## 🗺️ MAPA MENTAL - ARQUITECTURA DEL CÓDIGO

```
PORTAL DIAGNÓSTICO SYNERGIA
│
├─ 🎯 CORE APPLICATION
│  ├─ main.jsx ──────────────────► Entry point de la app
│  ├─ App.jsx ───────────────────► Router principal + ProtectedRoute wrapper
│  └─ index.css / App.css ───────► Estilos globales
│
├─ 🔐 CONTEXTOS GLOBALES (React Context)
│  ├─ AuthContext.jsx ───────────► Gestión de autenticación
│  │                                ├─ MOCK_USERS (4 usuarios hardcoded)
│  │                                ├─ login(email, password) → password: "123456"
│  │                                ├─ logout()
│  │                                └─ user state + role checks
│  │
│  ├─ ProjectContext.jsx ────────► Estado del proyecto de diagnóstico
│  │                                ├─ projectData (dashboard, matriz, roadmap, etc.)
│  │                                ├─ publications (control de publicación entregables)
│  │                                ├─ updateIniciativas(), addSupuesto(), etc.
│  │                                └─ Sync con localStorage
│  │
│  └─ ThemeContext.jsx ──────────► Tema light/dark
│
├─ 📊 DATOS MOCK (a reemplazar con PostgreSQL)
│  ├─ mockProjectData.js ────────► MOCK_PROJECT_DATA
│  │                                ├─ dashboard: { summary, kpis[] }
│  │                                ├─ matriz: { processes[] }
│  │                                ├─ roadmap: { initiatives[] }
│  │                                ├─ medicion: { timeEntries[] }
│  │                                ├─ iniciativas: [ {...}, {...} ]
│  │                                ├─ supuestos: [ {...} ]
│  │                                └─ planMedicion: { ... }
│  │
│  ├─ deliverables.js ────────────► INITIAL_PUBLICATIONS
│  │                                ├─ Tipos: DASHBOARD, MATRIZ, ROADMAP, INICIATIVA
│  │                                ├─ checkIsReady(type, data) → valida si está listo
│  │                                └─ Estado: BORRADOR | LISTO_PARA_REVISAR
│  │
│  ├─ solutionsCatalog.js ────────► SOLUTIONS_CATALOG (catálogo de soluciones)
│  └─ assetsCatalog.js ───────────► Assets reutilizables
│
├─ 🏗️ LAYOUTS (Menús + Estructura)
│  ├─ ClienteLayout.jsx ──────────► Sidebar + topbar para Cliente
│  │                                └─ Navegación condicional: Home vs Diagnóstico
│  │
│  ├─ ConsultorLayout.jsx ────────► Sidebar para Consultor
│  │                                ├─ Portfolio / Clientes
│  │                                ├─ Biblioteca (Activos/Plantillas)
│  │                                └─ Navegación contextual por diagnóstico
│  │
│  └─ AdminLayout.jsx ────────────► Sidebar para Admin
│                                   └─ Panel / Clientes / Usuarios / Catálogo / Activos
│
├─ 📄 PÁGINAS - SISTEMA
│  ├─ auth/
│  │  ├─ LoginPage.jsx ───────────► Login con MOCK_USERS
│  │  └─ ResetPasswordPage.jsx ───► (Mock)
│  │
│  └─ settings/
│     └─ SettingsPage.jsx ─────────► Configuración usuario
│
├─ 📄 PÁGINAS - CLIENTE
│  ├─ ClienteHome.jsx ────────────► Dashboard de diagnósticos del cliente
│  ├─ ClienteTareas.jsx ──────────► (Pendientes de implementar)
│  │
│  └─ Diagnóstico/ (vistas solo si publicadas)
│     ├─ DiagnosticoDashboard.jsx ───► ⚠️ BORRADO (era vista resumen)
│     ├─ DiagnosticoMatriz.jsx ──────► Matriz procesos (pain/time)
│     ├─ DiagnosticoRoadmap.jsx ─────► ⚠️ BORRADO (era Gantt timeline)
│     ├─ DiagnosticoIniciativas.jsx ─► Lista de iniciativas
│     ├─ DiagnosticoFichaIniciativa.jsx ► Detalle + aprobación
│     ├─ DiagnosticoSupuestos.jsx ───► ⚠️ BORRADO (era validación supuestos)
│     ├─ DiagnosticoMedicion.jsx ────► Captura time tracking
│     ├─ DiagnosticoResultados.jsx ──► Hub de navegación resultados
│     ├─ DiagnosticoSiguientesPasos.jsx ► Plan de acción
│     ├─ DiagnosticoRevision.jsx ────► Acta de cierre
│     ├─ DiagnosticoDataRoom.jsx ────► Repositorio archivos
│     └─ DiagnosticoCierre.jsx ──────► Finalización proyecto
│
├─ 📄 PÁGINAS - CONSULTOR
│  ├─ ConsultorPortfolio.jsx ─────► Vista multi-cliente
│  ├─ ConsultorVistaCliente.jsx ──► Perfil cliente + notas
│  ├─ ConsultorOperacion.jsx ─────► Panel de control diagnóstico
│  ├─ ConsultorTareas.jsx ────────► Gestión interna tareas
│  ├─ ConsultorInputs.jsx ────────► Checklist datos cliente
│  ├─ ConsultorEntregables.jsx ───► Publicación de entregables
│  ├─ ConsultorEntregablesPreview.jsx ► Vista previa pre-publicación
│  ├─ ConsultorNotas.jsx ─────────► Notas privadas consultor
│  ├─ ConsultorActivos.jsx ───────► Biblioteca assets
│  ├─ ConsultorPlantillaTareas.jsx ► Master template tareas
│  ├─ ConsultorCatalogo.jsx ──────► Catálogo soluciones
│  ├─ ConsultorAdmin.jsx ─────────► (Admin delegado)
│  └─ DiagnosticoCierre.jsx ──────► Vista consultor de cierre
│
├─ 📄 PÁGINAS - ADMIN
│  ├─ AdminPanel.jsx ─────────────► Dashboard admin
│  ├─ AdminClientes.jsx ──────────► CRUD clientes
│  ├─ AdminUsuarios.jsx ──────────► CRUD usuarios
│  ├─ AdminCatalogo.jsx ──────────► Gestión catálogo soluciones
│  ├─ AdminActivos.jsx ───────────► Gestión biblioteca
│  ├─ AdminPlantillas.jsx ────────► Plantillas globales
│  └─ AdminAjustes.jsx ───────────► Configuración sistema
│
├─ 🧩 COMPONENTES COMUNES
│  ├─ ChatWidget.jsx ─────────────► Widget chat flotante
│  └─ CommentsSection.jsx ────────► Sistema comentarios reutilizable
│
└─ 🛠️ UTILIDADES
   └─ assetLinksHelper.js ────────► Helpers para gestión assets
```

---

## 🔄 GUÍA DE INTEGRACIÓN CON POSTGRESQL

### ⚠️ ARCHIVOS CON DATOS MOCK A REEMPLAZAR

#### 1. Autenticación → `portal/src/context/AuthContext.jsx`

**Ubicación**: Líneas 13-44

```javascript
// ❌ ELIMINAR MOCK_USERS
const MOCK_USERS = {
  'cliente@acme.com': {
    id: 1,
    email: 'cliente@acme.com',
    name: 'Juan García',
    role: ROLES.CLIENTE,
    company: 'ACME Corporation',
    avatar: 'JG'
  },
  'consultor@synergia.com': { ... },
  'admin@synergia.com': { ... },
  'owner@synergia.com': { ... }
}
```

**Ubicación**: Líneas 64-84 - Función `login()`

```javascript
// ❌ REEMPLAZAR LÓGICA MOCK
const login = async (email, password) => {
  setLoading(true)
  setError(null)

  // ACTUAL: Mock con setTimeout
  await new Promise(resolve => setTimeout(resolve, 800))
  const mockUser = MOCK_USERS[email.toLowerCase()]
  if (mockUser && password === '123456') {
    setUser(mockUser)
    // ...
  }

  // ✅ CAMBIAR A: API REST
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    
    if (response.ok) {
      setUser(data.user)
      localStorage.setItem('token', data.token)
      return { success: true, user: data.user }
    } else {
      setError(data.error)
      return { success: false, error: data.error }
    }
  } catch (error) {
    setError('Error de conexión')
    return { success: false, error: 'Error de conexión' }
  } finally {
    setLoading(false)
  }
}
```

**Tablas PostgreSQL necesarias:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- 'owner', 'admin', 'consultor', 'cliente'
  company VARCHAR(255),
  avatar VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  token VARCHAR(512) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### 2. Datos de Proyecto → `portal/src/context/ProjectContext.jsx`

**Ubicación**: Líneas 9-27

```javascript
// ❌ ESTADO INICIAL CON LOCALSTORAGE
const [projectData, setProjectData] = useState(() => {
  const saved = localStorage.getItem('synergia_project_data');
  if (!saved) return MOCK_PROJECT_DATA;
  try {
    const parsed = JSON.parse(saved);
    return {
      ...MOCK_PROJECT_DATA,
      ...parsed,
      // ...
    };
  } catch (e) {
    return MOCK_PROJECT_DATA;
  }
});

// ✅ CAMBIAR A: Fetch desde API
const [projectData, setProjectData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProjectData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setProjectData(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchProjectData();
}, [projectId]);
```

**Ubicación**: Líneas 29-43 - Publications

```javascript
// ❌ PUBLICATIONS CON LOCALSTORAGE
const [publications, setPublications] = useState(() => {
  const saved = localStorage.getItem('synergia_publications');
  if (saved) return JSON.parse(saved);
  return [...INITIAL_PUBLICATIONS, ...iniciativasDocs];
});

// ✅ CAMBIAR A: Fetch desde API
const [publications, setPublications] = useState([]);

useEffect(() => {
  const fetchPublications = async () => {
    const response = await fetch(`/api/projects/${projectId}/publications`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    setPublications(data);
  };
  fetchPublications();
}, [projectId]);
```

**Ubicación**: Líneas 55-72 - Funciones de actualización

```javascript
// ❌ ACTUALIZAR SOLO ESTADO LOCAL
const updateProcesses = (newProcesses) => {
  setProjectData(prev => ({
    ...prev,
    matriz: { ...prev.matriz, processes: newProcesses }
  }));
};

// ✅ CAMBIAR A: Persistir en BD
const updateProcesses = async (newProcesses) => {
  try {
    const response = await fetch(`/api/projects/${projectId}/matriz`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ processes: newProcesses })
    });
    const updatedMatriz = await response.json();
    
    setProjectData(prev => ({
      ...prev,
      matriz: updatedMatriz
    }));
  } catch (error) {
    console.error('Error updating processes:', error);
    throw error;
  }
};
```

**Tablas PostgreSQL necesarias:**
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  consultor_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'ACTIVO', -- 'ACTIVO', 'PAUSADO', 'CERRADO'
  phase VARCHAR(100), -- 'Análisis', 'Implementación', etc.
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE deliverable_publications (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  deliverable_type VARCHAR(50) NOT NULL, -- 'dashboard', 'matriz', 'roadmap', 'iniciativa'
  deliverable_ref_id INTEGER, -- NULL para dashboard/matriz/roadmap, ID iniciativa para tipo 'iniciativa'
  is_published BOOLEAN DEFAULT FALSE,
  status_auto VARCHAR(50) DEFAULT 'BORRADOR', -- 'BORRADOR', 'LISTO_PARA_REVISAR'
  nombre_detalle VARCHAR(255), -- Solo para iniciativas
  last_published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dashboards (
  id SERIAL PRIMARY KEY,
  project_id INTEGER UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  summary TEXT,
  kpis JSONB, -- Array de {label, value}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE matrices (
  id SERIAL PRIMARY KEY,
  project_id INTEGER UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  processes JSONB, -- Array de procesos o tabla normalizada (ver opción 2)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Opción 2: Normalizar procesos
CREATE TABLE processes (
  id SERIAL PRIMARY KEY,
  matriz_id INTEGER REFERENCES matrices(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  pain INTEGER, -- 1-10
  time_min INTEGER, -- minutos
  eur_month DECIMAL(10,2),
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE initiatives (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  orden INTEGER,
  titulo VARCHAR(255) NOT NULL,
  resumen TEXT,
  estado_visibilidad VARCHAR(50) DEFAULT 'BORRADOR', -- 'BORRADOR', 'PUBLICADA'
  estado_cliente VARCHAR(50) DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'APROBADA', 'POSPUESTA', 'DESCARTADA'
  roi_eur_anual DECIMAL(10,2),
  esfuerzo_horas INTEGER,
  payback_meses DECIMAL(4,1),
  confianza VARCHAR(50), -- 'ALTA', 'MEDIA', 'BAJA'
  area VARCHAR(100),
  comentarios_count INTEGER DEFAULT 0,
  adjuntos_count INTEGER DEFAULT 0,
  supuestos_clave TEXT,
  is_top BOOLEAN DEFAULT FALSE,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assumptions (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  estado VARCHAR(50) DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'VALIDADO', 'RECHAZADO'
  impacto VARCHAR(50), -- 'ALTO', 'MEDIO', 'BAJO'
  categoria VARCHAR(100),
  notas TEXT,
  validado_por INTEGER REFERENCES users(id),
  validado_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE time_entries (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  nombre VARCHAR(255),
  rol VARCHAR(100),
  departamento VARCHAR(100),
  fecha DATE,
  notas TEXT,
  magic_button TEXT,
  tasks JSONB, -- Array de tareas con {id, tarea, herramienta, tiempoVez, vecesDia, etc.}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Opción 2: Normalizar tareas
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  time_entry_id INTEGER REFERENCES time_entries(id) ON DELETE CASCADE,
  tarea VARCHAR(255) NOT NULL,
  herramienta VARCHAR(100),
  tiempo_vez INTEGER, -- minutos
  veces_dia INTEGER,
  veces_semana INTEGER,
  dolor INTEGER, -- 1-10
  validacion VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'validado'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plan_medicion (
  id SERIAL PRIMARY KEY,
  project_id INTEGER UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  coste_hora_default DECIMAL(6,2) DEFAULT 25.00,
  configuracion JSONB, -- Configuración adicional
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE siguientes_pasos (
  id SERIAL PRIMARY KEY,
  project_id INTEGER UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  next_steps_consultant_notes TEXT,
  last_edited_at TIMESTAMP,
  last_edited_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### 3. Mock Data Inicial → `portal/src/data/mockProjectData.js`

**TODO: ELIMINAR ARCHIVO COMPLETO** después de migrar a BD

Este archivo contiene toda la estructura de datos mock:
- `dashboard`: resumen + KPIs
- `matriz`: procesos
- `roadmap`: iniciativas
- `medicion`: timeEntries
- `iniciativas`: array de iniciativas
- `supuestos`: array de supuestos
- `planMedicion`: configuración

**Acción**: Una vez implementada la API y las tablas PostgreSQL, este archivo debe eliminarse completamente.

---

#### 4. Catálogos → `portal/src/data/solutionsCatalog.js` y `assetsCatalog.js`

**Ubicación**: Exportaciones estáticas

```javascript
// ❌ DATOS HARDCODED
export const SOLUTIONS_CATALOG = [
  {
    id: 'SOL-001',
    nombre: 'Automatización de Facturación B2B',
    descripcion: '...',
    // ...
  },
  // ...
]

// ✅ CAMBIAR A: Fetch desde API
// En el componente que lo usa (AdminCatalogo, ConsultorCatalogo):
const [solutionsCatalog, setSolutionsCatalog] = useState([]);

useEffect(() => {
  const fetchCatalog = async () => {
    const response = await fetch('/api/catalogs/solutions', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    const data = await response.json();
    setSolutionsCatalog(data);
  };
  fetchCatalog();
}, []);
```

**Tablas PostgreSQL necesarias:**
```sql
CREATE TABLE solutions_catalog (
  id VARCHAR(50) PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  problema TEXT,
  outcome TEXT,
  tipo_solucion JSONB, -- Array de strings
  sector JSONB, -- Array de strings
  departamento JSONB, -- Array de strings
  complejidad INTEGER, -- 1-5
  ttv VARCHAR(50), -- Time to value
  duracion_estandar INTEGER, -- días/horas
  precio_setup DECIMAL(10,2),
  precio_mrr DECIMAL(10,2),
  precio_aprox VARCHAR(255),
  entregables JSONB, -- Array de strings
  requisitos JSONB, -- Array de strings
  riesgos JSONB, -- Array de strings
  estado VARCHAR(50) DEFAULT 'Activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assets_catalog (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(100), -- 'template', 'document', 'script', etc.
  url TEXT,
  tags JSONB, -- Array de tags
  categoria VARCHAR(100),
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### 5. Entregables → `portal/src/data/deliverables.js`

**Ubicación**: Líneas 38-42

```javascript
// ❌ ELIMINAR INITIAL_PUBLICATIONS
export const INITIAL_PUBLICATIONS = [
  { id: 1, deliverable_type: 'dashboard', ... },
  { id: 2, deliverable_type: 'matriz', ... },
  { id: 3, deliverable_type: 'roadmap', ... },
];
```

**✅ MANTENER** la lógica de negocio `checkIsReady()` - esto NO es mock, es validación:

```javascript
export const DELIVERABLE_TYPES = {
  DASHBOARD: 'dashboard',
  MATRIZ: 'matriz',
  ROADMAP: 'roadmap',
  INICIATIVA: 'iniciativa'
};

// ✅ MANTENER - Lógica de validación
export const checkIsReady = (type, data) => {
  switch (type) {
    case DELIVERABLE_TYPES.DASHBOARD:
      return !!data.summary && data.kpis?.length >= 3 && data.kpis.every(k => !!k.value);
    
    case DELIVERABLE_TYPES.MATRIZ:
      return data.processes?.length >= 5 && data.processes.every(p => 
        p.pain !== undefined && p.time_min !== undefined
      );
    
    case DELIVERABLE_TYPES.ROADMAP:
      return data.initiatives?.length >= 3 && data.initiatives.every(i => 
        !!i.roi_eur_anual && !!i.esfuerzo_horas
      );
    
    case DELIVERABLE_TYPES.INICIATIVA:
      return !!data.titulo && !!data.resumen && !!data.roi_eur_anual && !!data.esfuerzo_horas;
    
    default:
      return false;
  }
};
```

---

### 🔌 ENDPOINTS REST API SUGERIDOS

#### Autenticación
```
POST   /api/auth/login
       Body: { email, password }
       Response: { success: true, user: {...}, token: "jwt..." }

POST   /api/auth/logout
       Headers: Authorization: Bearer <token>

GET    /api/auth/me
       Headers: Authorization: Bearer <token>
       Response: { user: {...} }
```

#### Proyectos
```
GET    /api/projects
       Headers: Authorization: Bearer <token>
       Response: [ { id, name, client, status, phase, ... }, ... ]
       Nota: Filtrar por role (cliente solo ve los suyos)

GET    /api/projects/:id
       Response: {
         id, name, status, phase,
         dashboard: { summary, kpis },
         matriz: { processes },
         roadmap: { initiatives },
         iniciativas: [...],
         medicion: { timeEntries },
         supuestos: [...],
         siguientesPasos: {...}
       }

PATCH  /api/projects/:id
       Body: { name?, status?, phase?, ... }
```

#### Publicaciones
```
GET    /api/projects/:id/publications
       Response: [
         { deliverable_type, deliverable_ref_id, is_published, status_auto, ... }
       ]

PATCH  /api/projects/:id/publications/:type
       Body: { is_published: true/false }
       Nota: :type puede ser 'dashboard', 'matriz', 'roadmap'

PATCH  /api/projects/:id/publications/iniciativa/:initId
       Body: { is_published: true/false }
```

#### Matriz
```
GET    /api/projects/:id/matriz
       Response: { processes: [...] }

PUT    /api/projects/:id/matriz
       Body: { processes: [...] }

POST   /api/projects/:id/matriz/processes
       Body: { name, pain, time_min, eur_month }

DELETE /api/projects/:id/matriz/processes/:processId
```

#### Iniciativas
```
GET    /api/projects/:id/initiatives
       Response: [ {...}, {...} ]

POST   /api/projects/:id/initiatives
       Body: { titulo, resumen, roi_eur_anual, ... }

PATCH  /api/projects/:id/initiatives/:initId
       Body: { titulo?, estado_cliente?, ... }

DELETE /api/projects/:id/initiatives/:initId
```

#### Supuestos
```
GET    /api/projects/:id/assumptions
       Response: [ { id, texto, estado, impacto, ... } ]

POST   /api/projects/:id/assumptions
       Body: { texto, estado, impacto, categoria }

PATCH  /api/projects/:id/assumptions/:id
       Body: { estado?, notas?, ... }

DELETE /api/projects/:id/assumptions/:id
```

#### Medición
```
GET    /api/projects/:id/medicion
       Response: {
         costeHoraDefault: 25,
         timeEntries: [...]
       }

POST   /api/projects/:id/time-entries
       Body: { nombre, rol, departamento, fecha, tasks: [...] }

PATCH  /api/projects/:id/time-entries/:entryId
DELETE /api/projects/:id/time-entries/:entryId
```

#### Dashboard
```
GET    /api/projects/:id/dashboard
       Response: { summary, kpis: [...] }

PUT    /api/projects/:id/dashboard
       Body: { summary, kpis: [...] }
```

#### Comentarios
```
GET    /api/deliverables/:type/:id/comments
       Params: type = 'matriz' | 'iniciativa' | 'roadmap' | etc.
               id = project_id (para matriz/roadmap) o initiative_id (para iniciativa)
       Response: [ { id, user, text, created_at, resolved, ... } ]

POST   /api/deliverables/:type/:id/comments
       Body: { text }

PATCH  /api/comments/:commentId
       Body: { text?, resolved? }

DELETE /api/comments/:commentId
```

#### Catálogos
```
GET    /api/catalogs/solutions
       Response: [ { id, nombre, descripcion, ... } ]

POST   /api/catalogs/solutions (Admin only)
       Body: { nombre, descripcion, tipo_solucion, ... }

PATCH  /api/catalogs/solutions/:id (Admin only)
DELETE /api/catalogs/solutions/:id (Admin only)

GET    /api/catalogs/assets
POST   /api/catalogs/assets
PATCH  /api/catalogs/assets/:id
DELETE /api/catalogs/assets/:id
```

#### Usuarios (Admin)
```
GET    /api/users
       Response: [ { id, email, name, role, company, ... } ]

POST   /api/users
       Body: { email, password, name, role, company }

PATCH  /api/users/:id
       Body: { name?, role?, company?, ... }

DELETE /api/users/:id
```

#### Data Room / Archivos
```
GET    /api/projects/:id/documents
       Response: [ { id, name, type, url, uploaded_by, created_at, ... } ]

POST   /api/projects/:id/documents
       Body: FormData { file, folder? }

DELETE /api/projects/:id/documents/:docId
```

---

## ✅ CHECKLIST DE MIGRACIÓN

### Fase 1: Infraestructura
- [ ] Crear esquema PostgreSQL con todas las tablas (ver DDL arriba)
- [ ] Configurar backend (Node.js + Express / Python + Flask / etc.)
- [ ] Implementar sistema de autenticación JWT
- [ ] Configurar CORS y seguridad (helmet, rate limiting)
- [ ] Setup de conexión a BD (pg / Prisma / TypeORM)

### Fase 2: API Core
- [ ] Implementar endpoints de autenticación (`/api/auth/*`)
- [ ] Implementar endpoints de proyectos (`/api/projects/*`)
- [ ] Implementar middleware de autorización por rol
- [ ] Implementar endpoints de publicaciones
- [ ] Testing de endpoints con Postman/Thunder Client

### Fase 3: Migración Frontend - Autenticación
- [ ] Modificar `AuthContext.jsx`:
  - [ ] Eliminar `MOCK_USERS`
  - [ ] Reemplazar función `login()` con fetch a `/api/auth/login`
  - [ ] Implementar refresh token (opcional pero recomendado)
  - [ ] Gestión de JWT en localStorage (o mejor: httpOnly cookies)

### Fase 4: Migración Frontend - Datos de Proyecto
- [ ] Modificar `ProjectContext.jsx`:
  - [ ] Reemplazar `localStorage` inicial con `useEffect` fetch
  - [ ] Actualizar `updateProcesses()` para POST/PUT a API
  - [ ] Actualizar `updateIniciativas()` para persistir en BD
  - [ ] Actualizar `addSupuesto()`, `updateSupuesto()` para API
  - [ ] Actualizar `publications` con fetch desde API
  - [ ] Implementar loading states y error handling

### Fase 5: Migración de Entregables
- [ ] Crear endpoints para cada tipo de entregable
- [ ] Modificar páginas cliente para fetch condicional (solo si publicado)
- [ ] Modificar páginas consultor para edición persistente
- [ ] Implementar lógica de publicación (botón "Publicar" → PATCH `/publications/:type`)

### Fase 6: Catálogos y Assets
- [ ] Migrar `solutionsCatalog.js` a tabla `solutions_catalog`
- [ ] Migrar `assetsCatalog.js` a tabla `assets_catalog`
- [ ] Actualizar componentes `AdminCatalogo` y `ConsultorCatalogo` para fetch
- [ ] Implementar CRUD de catálogo (Admin)

### Fase 7: Comentarios y Colaboración
- [ ] Crear tabla `comments` en PostgreSQL
- [ ] Implementar endpoints `/api/deliverables/:type/:id/comments`
- [ ] Actualizar componente `CommentsSection.jsx` para fetch desde API
- [ ] Implementar notificaciones en tiempo real (WebSocket opcional)

### Fase 8: Data Room
- [ ] Crear tabla `documents` en PostgreSQL
- [ ] Configurar storage (AWS S3 / Azure Blob / local filesystem)
- [ ] Implementar upload de archivos con multer/formidable
- [ ] Implementar endpoints `/api/projects/:id/documents`
- [ ] Actualizar `DiagnosticoDataRoom.jsx` para fetch y upload

### Fase 9: Limpieza
- [ ] Eliminar `mockProjectData.js`
- [ ] Eliminar `INITIAL_PUBLICATIONS` de `deliverables.js`
- [ ] Eliminar todas las referencias a `localStorage` para datos de proyecto
- [ ] Limpiar imports no utilizados

### Fase 10: Testing y Deployment
- [ ] Testing end-to-end de flujo completo (login → crear iniciativa → publicar)
- [ ] Testing de permisos por rol
- [ ] Migración de datos mock iniciales a BD (seeders)
- [ ] Configurar variables de entorno (DB_URL, JWT_SECRET, etc.)
- [ ] Deploy backend + frontend + BD

---

## 📦 STACK TECNOLÓGICO ACTUAL

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Router**: React Router DOM 7.12.0
- **Estado**: React Context API + localStorage (❌ a migrar)
- **Gráficos**: 
  - Recharts 3.6.0 (KPIs y métricas)
  - Frappe Gantt 1.0.4 (roadmap timeline)
- **Iconos**: React Icons 5.5.0 (Feather Icons)
- **Fecha/Hora**: dayjs 1.11.19
- **Estilos**: CSS puro (sin framework CSS)

### Dependencias Clave
```json
{
  "dependencies": {
    "dayjs": "^1.11.19",
    "frappe-gantt": "^1.0.4",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.12.0",
    "recharts": "^3.6.0"
  }
}
```

### Backend (A IMPLEMENTAR)
Sugerencias:
- **Node.js** + Express + PostgreSQL (pg / Prisma)
- **Python** + FastAPI + SQLAlchemy
- **C#** + ASP.NET Core + Entity Framework
- **Go** + Gin + GORM

### Base de Datos (A IMPLEMENTAR)
- **PostgreSQL 14+** (recomendado)
- Extensiones útiles: `uuid-ossp`, `pg_trgm` (búsqueda full-text)

---

## 🔑 CONSIDERACIONES DE SEGURIDAD

### Autenticación
- ✅ Implementar bcrypt/argon2 para hash de passwords
- ✅ JWT con expiración corta (15min access token + refresh token)
- ✅ Guardar refresh token en httpOnly cookies (no localStorage)
- ✅ Implementar rate limiting en `/api/auth/login` (max 5 intentos/min)

### Autorización
- ✅ Middleware de verificación de rol en cada endpoint
- ✅ Cliente solo puede acceder a SUS proyectos (`project.client_id === user.id`)
- ✅ Consultor puede acceder a todos los proyectos
- ✅ Admin tiene acceso total + endpoints de gestión

### Datos Sensibles
- ✅ NUNCA enviar password_hash al frontend
- ✅ Sanitizar inputs (SQL injection, XSS)
- ✅ Validar datos en backend (no confiar solo en frontend)
- ✅ Implementar HTTPS en producción

### Archivos
- ✅ Validar tipos de archivo permitidos (PDF, DOCX, XLSX, PNG, JPG)
- ✅ Limitar tamaño máximo (ej: 10MB)
- ✅ Renombrar archivos con UUID para evitar colisiones
- ✅ Escanear con antivirus (ClamAV) en producción (opcional)

---

## 📚 RECURSOS ADICIONALES

### Documentación Interna
- `design/01-navigation-map.md` - Mapa de navegación completo
- `design/06-permissions-rules.md` - Matriz de permisos detallada
- `design/07-acceptance-criteria.md` - Criterios de aceptación

### Scripts Útiles
```bash
# Desarrollo frontend
cd portal
npm run dev       # Servidor desarrollo en http://localhost:5173

# Build producción
npm run build     # Genera dist/ para deploy
npm run preview   # Vista previa del build
```

### Variables de Entorno (A CREAR)
```env
# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/synergia_db
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development

# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🆘 CONTACTO Y SOPORTE

**Desarrollador Original**: [Tu nombre/email]  
**Fecha de Entrega**: 14 Enero 2026  
**Repositorio**: SynegrIA/Gestor-Proyectos (branch: master, default: main)

---

## 📝 NOTAS FINALES

### Archivos Borrados Recientemente
⚠️ Los siguientes archivos fueron eliminados antes de la integración:
- `DiagnosticoDashboard.jsx` (cliente)
- `DiagnosticoRoadmap.jsx` (cliente)
- `DiagnosticoSupuestos.jsx` (cliente)

**Impacto**: Verificar que `App.jsx` no tenga imports rotos de estos componentes.

### Estado del Código
- ✅ Compilación: Última ejecución con errores (ver terminal)
- ✅ Mock Data: Completamente funcional con localStorage
- ⚠️ Producción: **NO USAR** - requiere migración completa a BD

### Próximos Pasos Recomendados
1. Configurar entorno PostgreSQL local
2. Implementar API de autenticación primero (es bloqueante)
3. Migrar datos de un proyecto como PoC
4. Hacer tests de integración antes de migrar todo
5. Mantener rama con mocks como backup durante migración

---

**FIN DE LA DOCUMENTACIÓN**
