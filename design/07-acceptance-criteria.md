# ✅ Acceptance Criteria - Portal Diagnóstico V1

## Definición de "V1 Completado"

El V1 del portal está listo cuando se cumplen TODOS los criterios siguientes:

---

## 1. Autenticación y Sistema Base

### 1.1 Login (SYS-01)
- [ ] Usuario puede hacer login con email + contraseña
- [ ] Validación de credenciales funciona correctamente
- [ ] Mensaje de error claro si credenciales incorrectas
- [ ] Redirección post-login según rol (cliente → CL-01, consultor → CO-01)
- [ ] Sesión persiste (refresh no pierde login)

### 1.2 Reset Password (SYS-02)
- [ ] Usuario puede solicitar reset con email
- [ ] Email de reset se envía correctamente
- [ ] Link de reset funciona y permite crear nueva contraseña
- [ ] Link expira tras 24h

### 1.3 Notificaciones (SYS-03)
- [ ] Badge muestra count de no leídas
- [ ] Dropdown lista notificaciones recientes
- [ ] Click en notificación navega a sección correspondiente
- [ ] Click marca como leída
- [ ] Filtro "No leídas" funciona

### 1.4 Perfil (SYS-04)
- [ ] Usuario puede ver su información
- [ ] Usuario puede editar nombre, teléfono
- [ ] Usuario puede cambiar contraseña
- [ ] Toggle modo claro/oscuro funciona y persiste
- [ ] Preferencias de notificación se guardan

---

## 2. Portal Cliente

### 2.1 Home Cliente (CL-01)
- [ ] Lista muestra todos los diagnósticos del usuario
- [ ] Cada card muestra: nombre, fase, estado, progreso
- [ ] Badge de "PAUSADO" visible cuando aplica
- [ ] CTA "Abrir" navega al diagnóstico
- [ ] Empty state si no hay diagnósticos

### 2.2 Dashboard (CL-02)
- [ ] Muestra 3 KPI cards con valores y variación
- [ ] Muestra resumen ejecutivo (texto)
- [ ] Muestra Top 3 iniciativas con métricas
- [ ] Links a Roadmap/Iniciativas funcionan
- [ ] Estado "No publicado" muestra mensaje apropiado

### 2.3 Matriz de Procesos (CL-03)
- [ ] Tabla muestra procesos con columnas correctas
- [ ] Toggle entre vista tabla/gráfico funciona
- [ ] Gráfico scatter plot renderiza correctamente
- [ ] Panel de comentarios visible y funcional
- [ ] Adjuntos en comentarios se pueden subir/ver

### 2.4 Roadmap (CL-04)
- [ ] Tabla muestra iniciativas priorizadas
- [ ] Vista timeline/gantt funciona (Frappe Gantt)
- [ ] Badges de prioridad visibles
- [ ] Comentarios con adjuntos funcionan

### 2.5 Iniciativas (CL-05)
- [ ] Lista/grid de iniciativas con métricas clave
- [ ] Filtros por estado funcionan
- [ ] Click navega a ficha de iniciativa

### 2.6 Ficha Iniciativa (CL-06)
- [ ] Todas las secciones visibles (objetivo, pasos, KPIs, riesgos, supuestos)
- [ ] Comentarios con adjuntos funcionan
- [ ] Botón "Aprobar" funciona y actualiza estado

### 2.7 Supuestos/Medición (CL-07)
- [ ] Tabla de supuestos visible con estados
- [ ] Checklist de medición visible
- [ ] Tabla KPIs antes/después visible
- [ ] Comentarios funcionan

### 2.8 Siguientes Pasos (CL-08)
- [ ] Cards por fase visibles
- [ ] CTA "Agendar" visible (aunque sea placeholder)

### 2.9 Revisión + Acta (CL-09)
- [ ] Información de reunión visible
- [ ] Resumen y decisiones visibles
- [ ] Adjuntos descargables
- [ ] Estado de entrega visible

### 2.10 Data Room (CL-10)
- [ ] Estructura de carpetas visible (Finanzas/CRM/ERP/Procesos/Otros)
- [ ] Subir archivo funciona (drag&drop + browse)
- [ ] Progress bar durante upload
- [ ] Archivos listados con nombre, tamaño, fecha
- [ ] Borrar archivo propio funciona
- [ ] Búsqueda de archivos funciona
- [ ] Barra de progreso "datos mínimos" visible
- [ ] Warning si faltan datos requeridos

---

## 3. Portal Consultor

### 3.1 Portfolio (CO-01)
- [ ] Tabla muestra todos los diagnósticos de todos los clientes
- [ ] Filtros por fase, estado, consultor funcionan
- [ ] Búsqueda funciona
- [ ] Panel de alertas muestra bloqueos 48h y expiraciones
- [ ] KPI cards de resumen funcionan
- [ ] Click en diagnóstico navega a operación

### 3.2 Vista Cliente (CO-02)
- [ ] Información del cliente visible
- [ ] Tabs Diagnósticos/Contactos/Notas funcionan
- [ ] Lista de diagnósticos visible
- [ ] Contactos CRUD funciona
- [ ] Notas internas CRUD funciona

### 3.3 Operación (CO-03)
- [ ] Header con estado, fase, día, reloj visible
- [ ] Timeline de fases funcional
- [ ] Checklist de fase actual editable
- [ ] Panel de bloqueos visible
- [ ] Progreso entregables visible
- [ ] Botones "Pausar reloj", "Cambiar fase" funcionan

### 3.4 Tareas (CO-04)
- [ ] Tabla con todas las columnas requeridas
- [ ] Filtros por fase, día, quién funcionan
- [ ] Edición inline de estado funciona
- [ ] Vinculación con plantillas visibles
- [ ] Export CSV funciona

### 3.5 Inputs Cliente (CO-05)
- [ ] Checklist de datos requeridos visible
- [ ] Estado de cada item (recibido/falta)
- [ ] Links a archivos en Data Room funcionan
- [ ] Countdown SLA 48h visible
- [ ] Botones "Marcar recibido", "Enviar recordatorio" funcionan
- [ ] "Pausar/Reanudar reloj" funciona

### 3.6 Entregables (CO-06)
- [ ] Lista de entregables con estado visible
- [ ] Editor de contenido funciona
- [ ] Guardar borrador funciona
- [ ] Vista previa funciona
- [ ] Publicar cambia visibilidad para cliente
- [ ] Notificación se envía al publicar

### 3.7 Notas Internas (CO-07)
- [ ] Lista de notas visible
- [ ] CRUD de notas funciona
- [ ] Tags funcionan
- [ ] Panel de flags visible
- [ ] CRUD de flags funciona

### 3.8 Activos Reutilizables (CO-08)
- [ ] Tabla con activos visible
- [ ] Filtros por tipo, fase, estado funcionan
- [ ] Detalle de activo muestra toda la información
- [ ] Preview de archivo funciona
- [ ] Historial de versiones visible
- [ ] Subir nueva versión funciona

### 3.9 Plantilla Master Tareas (CO-09)
- [ ] Tabla master editable
- [ ] Agrupación por fase visible
- [ ] CRUD de tareas funciona
- [ ] Vinculación con plantillas funciona
- [ ] Guardar cambios persiste

### 3.10 Admin (CO-10)
- [ ] CRUD de clientes funciona
- [ ] CRUD de usuarios funciona
- [ ] Invitación por email funciona
- [ ] Asignación de permisos funciona
- [ ] Reset de acceso para usuarios funciona

---

## 4. Flujos Críticos de Negocio

### 4.1 Regla 48h
- [ ] Sistema detecta datos mínimos faltantes tras 48h
- [ ] Diagnóstico pasa automáticamente a PAUSADO
- [ ] Notificación enviada a cliente y consultor
- [ ] Consultor puede reanudar manualmente

### 4.2 Regla 60 días
- [ ] Sistema calcula fecha de expiración (entrega + 60)
- [ ] Avisos previos enviados (día 46, 52, 59)
- [ ] Diagnóstico pasa a ARCHIVADO tras día 60
- [ ] Cliente pierde acceso tras archivado

### 4.3 Publicación de Entregables
- [ ] Borrador no visible para cliente
- [ ] Al publicar, cliente puede ver
- [ ] Notificación enviada al cliente
- [ ] Comentarios se habilitan en sección publicada

### 4.4 Comentarios con Adjuntos
- [ ] Cliente puede comentar en secciones publicadas
- [ ] Consultor puede comentar en cualquier momento
- [ ] Adjuntos se suben correctamente
- [ ] Notificación enviada al destinatario
- [ ] Consultor puede marcar como resuelto

---

## 5. Permisos

### 5.1 Aislamiento de Datos
- [ ] Cliente solo ve sus diagnósticos
- [ ] Cliente no puede acceder a URLs de otros clientes
- [ ] Cliente no puede ver notas internas
- [ ] Cliente no puede ver biblioteca de activos

### 5.2 Visibilidad por Estado
- [ ] Contenido no publicado muestra placeholder para cliente
- [ ] Diagnóstico archivado no accesible para cliente
- [ ] Consultor ve todo independiente del estado

---

## 6. UX/UI

### 6.1 Responsive
- [ ] Desktop (>1200px) funciona correctamente
- [ ] Tablet (768-1200px) usable
- [ ] Mobile (<768px) navegable (no optimizado)

### 6.2 Estados
- [ ] Empty states con ilustración y mensaje en todas las listas
- [ ] Loading states (skeleton) durante carga de datos
- [ ] Error states con mensaje claro y retry

### 6.3 Notificaciones
- [ ] Toast para acciones exitosas
- [ ] Toast para errores con opción retry
- [ ] Badge actualizado en tiempo real

### 6.4 Tema
- [ ] Modo claro funciona
- [ ] Modo oscuro funciona
- [ ] Transición suave entre modos
- [ ] Preferencia persiste

---

## 7. Rendimiento

- [ ] Login < 2s
- [ ] Dashboard < 3s (primera carga)
- [ ] Navegación entre secciones < 1s
- [ ] Upload de archivos con feedback de progreso
- [ ] Sin errores de consola críticos

---

## 8. Seguridad

- [ ] Tokens JWT con expiración
- [ ] Refresh tokens implementados
- [ ] HTTPS obligatorio
- [ ] Datos sensibles cifrados (AES-256)
- [ ] Rate limiting en login
- [ ] Validación de inputs en backend

---

## Checklist Final Pre-Launch

| Área | Check |
|------|-------|
| Todos los flujos cliente funcionan | ☐ |
| Todos los flujos consultor funcionan | ☐ |
| Regla 48h probada | ☐ |
| Regla 60 días probada | ☐ |
| Permisos verificados | ☐ |
| Emails transaccionales funcionan | ☐ |
| Responsive verificado | ☐ |
| Sin errores críticos en consola | ☐ |
| Backup de base de datos configurado | ☐ |
| Monitoreo de errores configurado | ☐ |

---

## Definición de "Done" por User Story

Cada funcionalidad se considera completa cuando:

1. ✅ **Funciona**: La feature hace lo que debe hacer
2. ✅ **Testing**: Probada manualmente en todos los escenarios
3. ✅ **Permisos**: Solo accesible por roles autorizados
4. ✅ **UI**: Sigue el design system definido
5. ✅ **Estados**: Empty, loading, error implementados
6. ✅ **Responsive**: Funciona en desktop y tablet
7. ✅ **Notificaciones**: Envía notificaciones si aplica
8. ✅ **Documentación**: API documentada si es nuevo endpoint
