# 🔐 Reglas de Permisos - Portal Diagnóstico V1

## Matriz de Permisos por Rol

### Roles del Sistema

| Rol | Descripción | Scope |
|-----|-------------|-------|
| **Cliente** | Usuario final que contrata el diagnóstico | Solo sus diagnósticos propios |
| **Consultor** | Profesional que ejecuta el diagnóstico | Todos los clientes y diagnósticos |
| **Admin** (extensión Consultor) | Gestión de usuarios y configuración | Todo + admin |

---

## Permisos por Pantalla

### A) Pantallas de Sistema

| Pantalla | Cliente | Consultor | Notas |
|----------|---------|-----------|-------|
| SYS-01 Login | ✅ | ✅ | Mismo flujo, diferente destino post-login |
| SYS-02 Reset Password | ✅ | ✅ | - |
| SYS-03 Notificaciones | ✅ Solo suyas | ✅ Solo suyas | Filtrado por usuario |
| SYS-04 Perfil | ✅ | ✅ | - |

### B) Pantallas Cliente

| Pantalla | Cliente | Consultor | Notas |
|----------|---------|-----------|-------|
| CL-01 Home Cliente | ✅ | ❌ | Consultor usa Portfolio |
| CL-02 Dashboard | ✅ Solo si publicado | ✅ Siempre | - |
| CL-03 Matriz | ✅ Solo si publicado | ✅ Siempre | Puede comentar |
| CL-04 Roadmap | ✅ Solo si publicado | ✅ Siempre | Puede comentar |
| CL-05 Iniciativas | ✅ Solo si publicado | ✅ Siempre | - |
| CL-06 Ficha Iniciativa | ✅ Solo si publicado | ✅ Siempre | Puede comentar + aprobar |
| CL-07 Supuestos | ✅ Solo si publicado | ✅ Siempre | Puede comentar |
| CL-08 Siguientes Pasos | ✅ Solo si publicado | ✅ Siempre | - |
| CL-09 Revisión + Acta | ✅ Solo si publicado | ✅ Siempre | - |
| CL-10 Data Room | ✅ CRUD archivos | ✅ Read + gestión | - |

### C) Pantallas Consultor

| Pantalla | Cliente | Consultor | Notas |
|----------|---------|-----------|-------|
| CO-01 Portfolio | ❌ | ✅ | Panel multi-cliente |
| CO-02 Vista Cliente | ❌ | ✅ | Perfil + notas internas |
| CO-03 Operación | ❌ | ✅ | Cabina de mando |
| CO-04 Tareas | ❌ | ✅ | Tabla interna |
| CO-05 Inputs Cliente | ❌ | ✅ | Checklist datos |
| CO-06 Entregables | ❌ | ✅ | Publicación |
| CO-07 Notas Internas | ❌ | ✅ | Privado consultor |
| CO-08 Activos | ❌ | ✅ | Biblioteca plantillas |
| CO-09 Plantilla Tareas | ❌ | ✅ | Master template |
| CO-10 Admin | ❌ | ✅ (Admin) | Solo rol Admin |

---

## Permisos por Acción

### Data Room

| Acción | Cliente | Consultor |
|--------|---------|-----------|
| Ver estructura carpetas | ✅ | ✅ |
| Ver archivos | ✅ Propios | ✅ Todos |
| Subir archivos | ✅ | ✅ |
| Borrar archivos propios | ✅ | ✅ |
| Borrar archivos de otros | ❌ | ✅ |
| Crear carpetas | ❌ | ✅ |
| Ver historial completo | ❌ | ✅ |

### Comentarios

| Acción | Cliente | Consultor |
|--------|---------|-----------|
| Ver comentarios | ✅ De secciones publicadas | ✅ Todos |
| Crear comentario | ✅ | ✅ |
| Editar comentario propio | ✅ | ✅ |
| Eliminar comentario propio | ✅ | ✅ |
| Marcar como resuelto | ❌ | ✅ |
| Ver notas internas | ❌ | ✅ |

### Entregables

| Acción | Cliente | Consultor |
|--------|---------|-----------|
| Ver publicados | ✅ | ✅ |
| Ver borradores | ❌ | ✅ |
| Crear/Editar | ❌ | ✅ |
| Publicar | ❌ | ✅ |
| Despublicar | ❌ | ✅ |

### Iniciativas

| Acción | Cliente | Consultor |
|--------|---------|-----------|
| Ver ficha | ✅ Si publicada | ✅ |
| Comentar | ✅ | ✅ |
| Aprobar iniciativa | ✅ | ✅ (puede forzar) |
| Editar contenido | ❌ | ✅ |

### Diagnóstico

| Acción | Cliente | Consultor |
|--------|---------|-----------|
| Ver estado/fase | ✅ | ✅ |
| Cambiar fase | ❌ | ✅ |
| Pausar/reanudar reloj | ❌ | ✅ |
| Ver tareas internas | ❌ | ✅ |
| Ver notas internas | ❌ | ✅ |

### Usuarios/Clientes

| Acción | Cliente | Consultor | Admin |
|--------|---------|-----------|-------|
| Ver su perfil | ✅ | ✅ | ✅ |
| Editar su perfil | ✅ | ✅ | ✅ |
| Ver otros usuarios | ❌ | ✅ (del cliente) | ✅ |
| Crear usuarios | ❌ | ❌ | ✅ |
| Invitar usuarios | ❌ | ❌ | ✅ |
| Cambiar permisos | ❌ | ❌ | ✅ |
| Crear clientes | ❌ | ❌ | ✅ |

---

## Reglas de Visibilidad

### Contenido por Estado de Publicación

```
BORRADOR (solo consultor):
├── Dashboard → "El consultor está trabajando en tu diagnóstico"
├── Matriz → No visible
├── Roadmap → No visible
├── Iniciativas → No visible
└── etc.

PUBLICADO (cliente + consultor):
├── Todo visible
└── Comentarios activos

PARCIALMENTE PUBLICADO:
├── Solo secciones marcadas como "Publicado"
└── Resto muestra "Próximamente"
```

### Contenido por Estado del Diagnóstico

| Estado | Cliente puede ver | Acceso |
|--------|-------------------|--------|
| BORRADOR | Nada | No tiene acceso |
| ONBOARDING | Data Room, info básica | Limitado |
| EN_PROGRESO | Lo publicado | Normal |
| PAUSADO | Lo publicado + alerta | Normal + warning |
| REVISIÓN | Lo publicado | Normal |
| ENTREGADO | Todo | 60 días |
| ARCHIVADO | Nada | Sin acceso |

### Expiración de Acceso

```
Regla: Portal activo 60 días tras marcar ENTREGADO

Día 1-45: Acceso completo
Día 46-52: Banner "Tu acceso expira en X días"
Día 53-59: Banner más prominente + email recordatorio
Día 60: Último día de acceso
Día 61+: Estado ARCHIVADO, sin acceso cliente
```

---

## Notificaciones por Rol

### Cliente Recibe Notificación Cuando:

| Evento | Notificación |
|--------|--------------|
| Consultor comenta | ✅ In-app + email (configurable) |
| Consultor marca comentario resuelto | ✅ In-app |
| Cambio de fase | ✅ In-app + email |
| Diagnóstico pausado | ✅ In-app + email |
| Entregable publicado | ✅ In-app + email |
| Portal próximo a expirar | ✅ Email |

### Consultor Recibe Notificación Cuando:

| Evento | Notificación |
|--------|--------------|
| Cliente sube archivo | ✅ In-app |
| Cliente borra archivo | ✅ In-app |
| Cliente comenta | ✅ In-app + email (configurable) |
| Cliente aprueba iniciativa | ✅ In-app + email |
| SLA 48h próximo a vencer | ✅ In-app + email |
| SLA 48h vencido (auto-pausa) | ✅ In-app + email |

---

## Reglas de Negocio Críticas

### Regla 48h (Datos Mínimos)

```
IF (estado == EN_PROGRESO AND fase == "D1-2")
  AND (checklist_datos_minimos < 100%)
  AND (tiempo_desde_onboarding >= 48h)
THEN
  estado → PAUSADO
  notificar(cliente, "Diagnóstico pausado por falta de datos")
  notificar(consultor, "Diagnóstico pausado automáticamente")
```

### Regla 60 días (Expiración)

```
IF (estado == ENTREGADO)
  AND (dias_desde_entrega > 60)
THEN
  estado → ARCHIVADO
  cliente.acceso → revocado
  notificar_previo(cliente, [día 46, 52, 59])
```

### Regla de Publicación

```
PARA CADA entregable:
  IF (estado_entregable == PUBLICADO)
    cliente.puede_ver = true
    comentarios.habilitados = true
  ELSE
    cliente.puede_ver = false
    mostrar "Próximamente" o "En preparación"
```

---

## Implementación Técnica

### Middleware de Autorización

```python
# Pseudo-código para middleware de permisos

def check_permission(user, resource, action):
    # 1. Verificar rol
    if user.role == "admin":
        return True  # Admin puede todo
    
    # 2. Verificar scope (cliente solo ve lo suyo)
    if user.role == "cliente":
        if resource.diagnostico.cliente_id != user.cliente_id:
            raise PermissionDenied("No tienes acceso a este diagnóstico")
    
    # 3. Verificar estado de publicación
    if user.role == "cliente" and resource.tipo == "entregable":
        if not resource.publicado:
            raise PermissionDenied("Este contenido aún no está disponible")
    
    # 4. Verificar acción específica
    permissions = PERMISSION_MATRIX[user.role][resource.tipo]
    if action not in permissions:
        raise PermissionDenied(f"No puedes {action} en {resource.tipo}")
    
    return True
```

### Headers de Respuesta

```
X-User-Role: cliente | consultor | admin
X-Diagnostico-Access: read | write | none
X-Content-Published: true | false
X-Access-Expires: 2024-03-15T00:00:00Z
```
