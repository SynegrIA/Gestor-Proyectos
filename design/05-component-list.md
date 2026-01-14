# 🧩 Component List - Portal Diagnóstico V1

## Componentes UI del Sistema

### 1. Navegación y Layout

| Componente | Descripción | Variantes |
|------------|-------------|-----------|
| **Sidebar** | Menú lateral colapsable | expandido, colapsado, mobile drawer |
| **Topbar** | Header con logo, notificaciones, perfil | cliente, consultor |
| **Breadcrumb** | Navegación contextual | simple, con dropdown |
| **Tab Bar** | Pestañas horizontales | underline, pills, con badge |
| **Footer** | Pie de página | minimal (solo copyright) |

### 2. Cards y Contenedores

```
┌──────────────────────────────────────┐
│  [CARD KPI]                          │
│  ┌────────────────────────────────┐  │
│  │  Icon/Badge (opcional)         │  │
│  │                                │  │
│  │       VALOR GRANDE             │  │
│  │       45.2K                    │  │
│  │                                │  │
│  │  Label: Ahorro anual           │  │
│  │  Variación: ▲ +15%            │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

| Componente | Props | Uso |
|------------|-------|-----|
| **Card KPI** | valor, label, icono, variación, color | Dashboard, métricas |
| **Card Diagnóstico** | nombre, fase, estado, progreso, CTA | Home cliente/consultor |
| **Card Iniciativa** | título, ahorro, esfuerzo, payback, badge | Listado iniciativas |
| **Card Fase** | número, título, descripción, estado | Siguientes pasos |
| **Card Alerta** | tipo, título, descripción, acciones | Portfolio consultor |
| **Card Archivo** | nombre, tamaño, fecha, acciones | Data Room |
| **Panel** | título, contenido, acciones | Contenedor genérico |

### 3. Tablas

| Componente | Features | Uso |
|------------|----------|-----|
| **DataTable** | sort, filter, search, pagination | Tareas, activos, usuarios |
| **TableSimple** | solo filas/columnas | Supuestos, KPIs antes/después |
| **TableEditable** | celdas editables inline | Tareas consultor |
| **TableMatrix** | colores por celda | Matriz de procesos |

**Props DataTable:**
- columns: array de {key, label, sortable, width}
- data: array de objetos
- actions: array de {icon, onClick}
- filters: array de {key, options}
- searchable: boolean
- paginated: boolean (default: >10 rows)

### 4. Formularios

| Componente | Variantes | Validación |
|------------|-----------|------------|
| **Input** | text, email, password, number | required, pattern, min/max |
| **Textarea** | basic, rico (WYSIWYG) | minLength, maxLength |
| **Select** | single, multi, searchable | required |
| **Checkbox** | single, group | required |
| **Radio** | horizontal, vertical | required |
| **Toggle** | on/off | - |
| **DatePicker** | single, range | min/max date |
| **FileUpload** | drag&drop, browse | types, maxSize |

### 5. Botones y Acciones

| Componente | Variantes | Uso |
|------------|-----------|-----|
| **Button** | primary (degradado), secondary (outline), ghost, danger | CTAs |
| **IconButton** | solo icono, con tooltip | Acciones en tabla |
| **ButtonGroup** | horizontal | Toggles de vista |
| **LinkButton** | como texto, underline on hover | Links internos |
| **FAB** | Floating Action Button | Mobile, acciones principales |

**Estados de botón:** default, hover, active, disabled, loading

### 6. Feedback y Estados

| Componente | Variantes | Uso |
|------------|-----------|-----|
| **Badge** | success, warning, danger, info, neutral | Estados, counts |
| **ProgressBar** | lineal, circular | Progreso diagnóstico, uploads |
| **Spinner** | pequeño, grande | Carga de datos |
| **Skeleton** | text, card, table | Loading states |
| **Alert** | success, warning, error, info | Mensajes inline |
| **Toast** | success, warning, error, info | Notificaciones temporales |
| **EmptyState** | ilustración + texto + CTA | Estados vacíos |
| **ErrorState** | ilustración + mensaje + retry | Errores de carga |

### 7. Modales y Overlays

| Componente | Tamaños | Uso |
|------------|---------|-----|
| **Modal** | sm, md, lg, fullscreen | Formularios, confirmaciones |
| **Drawer** | left, right | Filters, detalles |
| **Dropdown** | menú, select | Acciones, navegación |
| **Tooltip** | top, bottom, left, right | Ayuda contextual |
| **Popover** | contenido rico | Previews, detalles rápidos |

### 8. Timeline y Progreso

```
── Timeline de Fases ──────────────────────────
   ✓ Día 0      ● Días 1-2    ○ Días 3-5    ○ Días 6-7
   Onboard.     Datos         Análisis      Revisión
   ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
                    ↑ Actual
```

| Componente | Variantes | Uso |
|------------|-----------|-----|
| **PhaseTimeline** | horizontal, vertical | Fases diagnóstico |
| **Checklist** | editable, readonly | Tareas, inputs |
| **StepProgress** | numbered, icons | Wizards, onboarding |
| **Gantt** | con Frappe Gantt | Roadmap timeline |

### 9. Comentarios

```
┌──────────────────────────────────────────────────────┐
│  [COMENTARIO]                                        │
│  ┌────────────────────────────────────────────────┐  │
│  │  👤 Avatar   Nombre Usuario · Hace 2h          │  │
│  │  ──────────────────────────────────────────    │  │
│  │  Contenido del comentario con texto normal     │  │
│  │  y posibles **negritas** o _cursivas_.         │  │
│  │                                                │  │
│  │  📎 archivo_adjunto.pdf (2.1 MB)               │  │
│  │                                                │  │
│  │  [Responder] [Resolver]              [⋮ Más]   │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  [+ Añadir comentario]                               │
└──────────────────────────────────────────────────────┘
```

| Componente | Features | Uso |
|------------|----------|-----|
| **CommentThread** | avatar, nombre, fecha, contenido, adjuntos | Todas las secciones comentables |
| **CommentInput** | textarea + upload + submit | Nuevo comentario |
| **CommentActions** | responder, resolver, editar, eliminar | Acciones por comentario |

### 10. Gráficos (Recharts)

| Gráfico | Variantes | Uso |
|---------|-----------|-----|
| **BarChart** | horizontal, vertical, stacked | Comparativas |
| **LineChart** | single, multi-line | Tendencias |
| **PieChart** | pie, donut | Distribuciones |
| **ScatterPlot** | burbujas con tamaño variable | Matriz impacto/esfuerzo |
| **HeatMap** | tabla con colores | Matriz de procesos |

### 11. Notificaciones

```
┌──────────────────────────────────────┐
│  [NOTIFICATION ITEM]                 │
│  ┌────────────────────────────────┐  │
│  │  🔵 (unread indicator)         │  │
│  │  📄 Icono tipo                 │  │
│  │  Título de la notificación     │  │
│  │  Descripción breve...          │  │
│  │  Hace 2h · Diagnóstico ACME    │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

| Componente | Features | Uso |
|------------|----------|-----|
| **NotificationBell** | badge con count, dropdown | Header |
| **NotificationList** | filtros, agrupado por fecha | Panel notificaciones |
| **NotificationItem** | icono, título, preview, timestamp | Individual |
| **NotificationBadge** | número, "9+" si >9 | Indicador |

### 12. Data Room / File Management

| Componente | Features | Uso |
|------------|----------|-----|
| **FolderTree** | expandible, colapsable, badges | Navegación carpetas |
| **FileList** | nombre, tamaño, fecha, acciones | Listado de archivos |
| **FileUploader** | drag&drop, progress, multi-file | Subida de archivos |
| **FilePreview** | PDF, imágenes, office docs | Vista previa |
| **VersionHistory** | lista de versiones con restore | Historial archivo |

---

## Tokens del Design System

### Colores

```css
/* Primary - Violetas */
--primary-50: #f5f3ff;
--primary-100: #ede9fe;
--primary-200: #ddd6fe;
--primary-300: #c4b5fd;
--primary-400: #a78bfa;
--primary-500: #8b5cf6;  /* Main */
--primary-600: #7c3aed;
--primary-700: #6d28d9;
--primary-800: #5b21b6;
--primary-900: #4c1d95;

/* Secondary - Índigo */
--secondary-50: #eef2ff;
--secondary-100: #e0e7ff;
--secondary-500: #6366f1;
--secondary-700: #4338ca;
--secondary-900: #312e81;

/* Accent - Magenta */
--accent-400: #e879f9;
--accent-500: #d946ef;
--accent-600: #c026d3;

/* Neutrals - Grises fríos */
--gray-50: #f8fafc;
--gray-100: #f1f5f9;
--gray-200: #e2e8f0;
--gray-300: #cbd5e1;
--gray-400: #94a3b8;
--gray-500: #64748b;
--gray-600: #475569;
--gray-700: #334155;
--gray-800: #1e293b;
--gray-900: #0f172a;

/* Estados - Desaturados */
--success-500: #22c55e;
--success-50: #f0fdf4;
--warning-500: #f59e0b;
--warning-50: #fffbeb;
--danger-500: #ef4444;
--danger-50: #fef2f2;
--info-500: #3b82f6;
--info-50: #eff6ff;

/* Degradados */
--gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
--gradient-dark: linear-gradient(135deg, #4c1d95 0%, #312e81 100%);
--gradient-accent: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
```

### Tipografía

```css
/* Font family */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Espaciado

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### Sombras

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

### Bordes

```css
--radius-sm: 0.25rem;   /* 4px */
--radius: 0.375rem;     /* 6px */
--radius-md: 0.5rem;    /* 8px */
--radius-lg: 0.75rem;   /* 12px */
--radius-xl: 1rem;      /* 16px */
--radius-full: 9999px;  /* Pills */
```

### Z-index

```css
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
--z-toast: 1080;
```

---

## Estados de Componentes

### Empty States

| Pantalla | Ilustración | Mensaje | CTA |
|----------|-------------|---------|-----|
| Sin diagnósticos (cliente) | 📊 | "Aún no tienes diagnósticos" | - |
| Sin diagnósticos (consultor) | 📊 | "No hay diagnósticos activos" | "+ Nuevo" |
| Data Room vacío | 📁 | "Sube tus primeros archivos" | "Subir archivo" |
| Sin comentarios | 💬 | "Sé el primero en comentar" | "Añadir comentario" |
| Sin notificaciones | 🔔 | "Todo al día" | - |
| Búsqueda sin resultados | 🔍 | "No hay resultados para..." | "Limpiar filtros" |

### Loading States

| Tipo | Componente | Uso |
|------|------------|-----|
| Página completa | Spinner centrado + overlay | Primera carga |
| Tabla | Skeleton rows (3-5) | Carga de datos |
| Card | Skeleton card | Carga de card |
| Botón | Spinner dentro del botón | Submit en progreso |
| Inline | Spinner pequeño | Actualización parcial |

### Error States

| Tipo | Componente | Acción |
|------|------------|--------|
| Error de red | Alert banner + retry | "Reintentar" |
| Error 404 | Página completa | "Volver al inicio" |
| Error de validación | Inline bajo campo | Mensaje descriptivo |
| Error de upload | Toast + retry | "Reintentar" |
| Timeout | Modal | "Reintentar" o "Cancelar" |
