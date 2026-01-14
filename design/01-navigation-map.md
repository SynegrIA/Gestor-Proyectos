# 🗺️ Mapa de Navegación - Portal Diagnóstico V1

## Estructura General

```mermaid
graph TD
    subgraph AUTH["🔐 Sistema (Auth)"]
        SYS01[SYS-01: Login]
        SYS02[SYS-02: Reset Password]
        SYS03[SYS-03: Notificaciones]
        SYS04[SYS-04: Perfil + Ajustes]
    end

    subgraph CLIENTE["👤 Portal Cliente"]
        CL01[CL-01: Home Cliente]
        CL01 --> CL02[CL-02: Dashboard]
        CL01 --> CL10[CL-10: Data Room]
        
        subgraph DIAGNOSTICO_CL["Diagnóstico Activo"]
            CL02 --> CL03[CL-03: Matriz Procesos]
            CL02 --> CL04[CL-04: Roadmap]
            CL02 --> CL05[CL-05: Iniciativas]
            CL05 --> CL06[CL-06: Ficha Iniciativa]
            CL02 --> CL07[CL-07: Supuestos]
            CL02 --> CL08[CL-08: Siguientes Pasos]
            CL02 --> CL09[CL-09: Revisión + Acta]
        end
    end

    subgraph CONSULTOR["⚙️ Panel Consultor"]
        CO01[CO-01: Portfolio Global]
        CO01 --> CO02[CO-02: Vista Cliente]
        CO02 --> CO03[CO-03: Operación]
        
        subgraph DIAGNOSTICO_CO["Gestión Diagnóstico"]
            CO03 --> CO04[CO-04: Tareas]
            CO03 --> CO05[CO-05: Inputs Cliente]
            CO03 --> CO06[CO-06: Entregables]
            CO03 --> CO07[CO-07: Notas Internas]
        end
        
        subgraph BIBLIOTECA["📚 Biblioteca"]
            CO08[CO-08: Activos Reutilizables]
            CO09[CO-09: Plantilla Master Tareas]
        end
        
        CO10[CO-10: Admin Usuarios]
    end

    SYS01 -->|Cliente| CL01
    SYS01 -->|Consultor| CO01
```

---

## 📐 Navegación por Rol

### Cliente (Menú Lateral - Dentro de Diagnóstico)

| Orden | Ítem | Pantalla ID | Icono |
|-------|------|-------------|-------|
| 1 | Dashboard | CL-02 | 📊 |
| 2 | Matriz de Procesos | CL-03 | 📋 |
| 3 | Roadmap | CL-04 | 🗓️ |
| 4 | Iniciativas | CL-05 | 💡 |
| 5 | Supuestos/Medición | CL-07 | 📐 |
| 6 | Siguientes Pasos | CL-08 | ➡️ |
| 7 | Revisión + Acta | CL-09 | ✅ |
| 8 | Data Room | CL-10 | 📁 |

**Header Cliente:**
- Logo + Nombre Empresa
- Selector de diagnóstico (si tiene varios)
- 🔔 Notificaciones (badge con count)
- 👤 Perfil

---

### Consultor (Menú Lateral Global)

| Orden | Ítem | Pantalla ID | Icono |
|-------|------|-------------|-------|
| **Principal** ||||
| 1 | Portfolio | CO-01 | 📊 |
| 2 | Clientes | CO-02 | 👥 |
| **Biblioteca** ||||
| 3 | Activos Reutilizables | CO-08 | 📚 |
| 4 | Plantilla Tareas | CO-09 | 📝 |
| **Admin** ||||
| 5 | Usuarios | CO-10 | ⚙️ |

**Menú Contextual (dentro de un diagnóstico):**
| Orden | Ítem | Pantalla ID |
|-------|------|-------------|
| 1 | Operación | CO-03 |
| 2 | Tareas | CO-04 |
| 3 | Inputs Cliente | CO-05 |
| 4 | Entregables | CO-06 |
| 5 | Notas Internas | CO-07 |
| 6 | Data Room | CL-10* |

*El consultor accede al mismo Data Room que el cliente

---

## 🔄 Flujos de Usuario Críticos

### Flujo 1: Cliente accede a su diagnóstico
```
Login → Home Cliente → Seleccionar Diagnóstico → Dashboard → [Navegar secciones]
```

### Flujo 2: Consultor gestiona diagnóstico
```
Login → Portfolio → Filtrar por estado → Seleccionar diagnóstico → Operación → [Tareas/Inputs/Entregables]
```

### Flujo 3: Cliente sube datos (Data Room)
```
Home Cliente → Data Room → Seleccionar carpeta → Subir archivo → Confirmar
[Sistema: Notifica a consultor + actualiza checklist inputs]
```

### Flujo 4: Consultor publica entregable
```
Operación → Entregables → Crear/Editar → Cambiar a "Publicado"
[Sistema: Notifica a cliente]
```

### Flujo 5: Pausa por datos (48h)
```
[Automático: Si checklist datos mínimos incompleto tras 48h]
Estado diagnóstico → PAUSADO → Badge rojo visible para ambos roles
Consultor puede: "Reanudar reloj" manualmente
```

---

## 🏷️ Estados del Diagnóstico

| Estado | Color | Descripción |
|--------|-------|-------------|
| `BORRADOR` | Gris | Recién creado, no visible para cliente |
| `ONBOARDING` | Azul | Día 0, blindaje inicial |
| `EN_PROGRESO` | Violeta | Días 1-5, activo |
| `PAUSADO` | Rojo | Reloj detenido (falta datos 48h) |
| `REVISIÓN` | Naranja | Días 6-7, cierre |
| `ENTREGADO` | Verde | Completado, portal activo 60 días |
| `ARCHIVADO` | Gris oscuro | Pasados 60 días post-entrega |

---

## 📱 Responsive Breakpoints

| Breakpoint | Comportamiento |
|------------|----------------|
| Desktop (>1200px) | Sidebar expandido + contenido principal |
| Tablet (768-1200px) | Sidebar colapsable + contenido adaptado |
| Mobile (<768px) | Sidebar como drawer + navegación bottom |

> [!NOTE]
> Para V1, priorizar Desktop y Tablet. Mobile como "usable" pero no optimizado.
