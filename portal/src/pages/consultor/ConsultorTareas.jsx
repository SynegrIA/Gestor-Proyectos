import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiFilter, FiDownload, FiMessageSquare, FiExternalLink, FiPaperclip } from 'react-icons/fi'
import CommentsSection from '../../components/common/CommentsSection'

const TAREAS_INICIALES = [
    { id: 1, fase: 'Día 0', tarea: 'Enviar email de bienvenida', quien: 'Consultor', estado: 'completada', fecha: '10 Ene', sla: '', notas: '' },
    { id: 2, fase: 'Día 0', tarea: 'Configurar accesos portal', quien: 'Consultor', estado: 'completada', fecha: '10 Ene', sla: '', notas: '' },
    { id: 3, fase: 'Día 1-2', tarea: 'Recibir datos financieros', quien: 'Cliente', estado: 'completada', fecha: '11 Ene', sla: '', notas: '' },
    { id: 4, fase: 'Día 1-2', tarea: 'Recibir export CRM', quien: 'Cliente', estado: 'pendiente', fecha: '', sla: '48h', notas: '', alerta: true },
    { id: 5, fase: 'Día 1-2', tarea: 'Entrevista CEO', quien: 'Ambos', estado: 'completada', fecha: '11 Ene', sla: '', notas: '' },
    { id: 6, fase: 'Día 1-2', tarea: 'Entrevista Dir. Ventas', quien: 'Ambos', estado: 'en_progreso', fecha: 'Hoy 15:00', sla: '', notas: '' },
    { id: 7, fase: 'Día 3-5', tarea: 'Análisis matriz de procesos', quien: 'Consultor', estado: 'pendiente', fecha: '', sla: '', notas: '' },
    { id: 8, fase: 'Día 3-5', tarea: 'Definir Top 3 iniciativas', quien: 'Consultor', estado: 'pendiente', fecha: '', sla: '', notas: '' },
    { id: 9, fase: 'Día 3-5', tarea: 'Calcular ROI por iniciativa', quien: 'Consultor', estado: 'pendiente', fecha: '', sla: '', notas: '' },
    { id: 10, fase: 'Día 6-7', tarea: 'Preparar presentación final', quien: 'Consultor', estado: 'pendiente', fecha: '', sla: '', notas: '' },
]

const FASES = ['Día 0', 'Día 1-2', 'Día 3-5', 'Día 6-7']
const RESPONSABLES = ['Consultor', 'Cliente', 'Ambos']
const ESTADOS = ['pendiente', 'en_progreso', 'completada']

const getEstadoBadge = (estado) => {
    const map = {
        'completada': { class: 'badge--success', label: '✓ Hecho' },
        'en_progreso': { class: 'badge--primary', label: '● En curso' },
        'pendiente': { class: 'badge--neutral', label: '○ Pendiente' }
    }
    return map[estado] || map['pendiente']
}

const TAREA_VACIA = {
    fase: 'Día 0',
    tarea: '',
    quien: 'Consultor',
    estado: 'pendiente',
    fecha: '',
    sla: '',
    notas: ''
}

export default function ConsultorTareas() {
    const { id } = useParams()
    const [tareas, setTareas] = useState(() => {
        const saved = localStorage.getItem(`tasks_${id}`)
        return saved ? [...TAREAS_INICIALES, ...JSON.parse(saved)] : TAREAS_INICIALES
    })
    const [showModal, setShowModal] = useState(false)
    const [editingTarea, setEditingTarea] = useState(null)
    const [formData, setFormData] = useState(TAREA_VACIA)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [filterTab, setFilterTab] = useState('todas')
    const [filterResponsable, setFilterResponsable] = useState('todos')
    const [noteModalTarea, setNoteModalTarea] = useState(null)
    const [tempNote, setTempNote] = useState('')

    // Sincronizar cambios (simulado)
    useEffect(() => {
        const sync = () => {
            const saved = localStorage.getItem(`tasks_${id}`)
            if (saved) {
                const extraTasks = JSON.parse(saved)
                const allTasks = [...TAREAS_INICIALES]
                extraTasks.forEach(et => {
                    const idx = allTasks.findIndex(t => t.id === et.id)
                    if (idx > -1) allTasks[idx] = et
                    else allTasks.push(et)
                })
                setTareas(allTasks)
            }
        }
        window.addEventListener('storage', sync)
        const interval = setInterval(sync, 2000)
        return () => {
            window.removeEventListener('storage', sync)
            clearInterval(interval)
        }
    }, [id])

    // Filtrar tareas
    const filteredTareas = tareas.filter(t => {
        // Filtro por tab
        if (filterTab === 'pendientes' && t.estado !== 'pendiente') return false
        if (filterTab === 'hoy' && !t.fecha?.includes('Hoy')) return false
        if (filterTab === 'alerta' && !t.alerta) return false

        // Filtro por responsable
        if (filterResponsable !== 'todos' && t.quien !== filterResponsable) return false

        return true
    })

    // Abrir modal para crear
    const handleNuevaTarea = () => {
        setEditingTarea(null)
        setFormData(TAREA_VACIA)
        setShowModal(true)
    }

    // Abrir modal para editar
    const handleEditarTarea = (tarea) => {
        setEditingTarea(tarea)
        setFormData({ ...tarea })
        setShowModal(true)
    }

    // Guardar tarea (crear o editar)
    const handleGuardar = () => {
        if (!formData.tarea.trim()) {
            alert('El nombre de la tarea es obligatorio')
            return
        }

        if (editingTarea) {
            // Editar existente
            setTareas(tareas.map(t =>
                t.id === editingTarea.id ? { ...formData, id: editingTarea.id } : t
            ))
        } else {
            // Crear nueva
            const nuevaTarea = {
                ...formData,
                id: Math.max(...tareas.map(t => t.id)) + 1
            }
            setTareas([...tareas, nuevaTarea])
        }

        setShowModal(false)
        setEditingTarea(null)
        setFormData(TAREA_VACIA)
    }

    // Eliminar tarea
    const handleEliminar = (tareaId) => {
        setTareas(tareas.filter(t => t.id !== tareaId))
        setDeleteConfirm(null)
    }

    // Toggle estado rápido
    const toggleEstado = (tareaId) => {
        setTareas(tareas.map(t => {
            if (t.id === tareaId) {
                const nuevoEstado = t.estado === 'completada' ? 'pendiente' : 'completada'
                return { ...t, estado: nuevoEstado, fecha: nuevoEstado === 'completada' ? 'Hoy' : '' }
            }
            return t
        }))
    }

    const handleStatusChange = (tareaId, nuevoEstado) => {
        setTareas(tareas.map(t =>
            t.id === tareaId ? { ...t, estado: nuevoEstado, fecha: nuevoEstado === 'completada' ? 'Hoy' : t.fecha } : t
        ))
    }

    const openNoteModal = (tarea) => {
        setNoteModalTarea(tarea)
        setTempNote(tarea.notas || '')
    }

    const saveNote = () => {
        setTareas(tareas.map(t =>
            t.id === noteModalTarea.id ? { ...t, notas: tempNote } : t
        ))
        setNoteModalTarea(null)
    }

    // Actualizar nota inline
    const handleNotaChange = (tareaId, nota) => {
        setTareas(tareas.map(t =>
            t.id === tareaId ? { ...t, notas: nota } : t
        ))
    }

    return (
        <div>
            <Link to={`/consultor/proyecto/${id}/operacion`} className="btn btn--ghost" style={{ marginBottom: 'var(--space-4)' }}>
                <FiArrowLeft /> Volver a Control
            </Link>

            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Tareas del Diagnóstico</h1>
                    <p className="page-subtitle">Gestión de tareas por fase</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn--ghost"><FiFilter /> Filtrar</button>
                    <button className="btn btn--ghost"><FiDownload /> Exportar CSV</button>
                    <button className="btn btn--primary" onClick={handleNuevaTarea}>
                        <FiPlus /> Nueva tarea
                    </button>
                </div>
            </div>

            {/* Filtros rápidos */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button
                        className={`btn ${filterTab === 'todas' ? 'btn--secondary' : 'btn--ghost'} btn--sm`}
                        onClick={() => setFilterTab('todas')}
                    >
                        Todas ({tareas.length})
                    </button>
                    <button
                        className={`btn ${filterTab === 'pendientes' ? 'btn--secondary' : 'btn--ghost'} btn--sm`}
                        onClick={() => setFilterTab('pendientes')}
                    >
                        Pendientes ({tareas.filter(t => t.estado === 'pendiente').length})
                    </button>
                    <button
                        className={`btn ${filterTab === 'hoy' ? 'btn--secondary' : 'btn--ghost'} btn--sm`}
                        onClick={() => setFilterTab('hoy')}
                    >
                        Hoy
                    </button>
                    <button
                        className={`btn ${filterTab === 'alerta' ? 'btn--secondary' : 'btn--ghost'} btn--sm`}
                        onClick={() => setFilterTab('alerta')}
                    >
                        Con alerta ({tareas.filter(t => t.alerta).length})
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span className="text-sm text-muted">Responsable:</span>
                    <select 
                        className="form-input" 
                        style={{ width: 'auto', padding: 'var(--space-1) var(--space-4) var(--space-1) var(--space-2)', height: '32px', fontSize: 'var(--text-sm)' }}
                        value={filterResponsable}
                        onChange={(e) => setFilterResponsable(e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        <option value="Consultor">Consultor</option>
                        <option value="Cliente">Cliente</option>
                        <option value="Ambos">Ambos</option>
                    </select>
                </div>
            </div>

            <div className="card">
                <div className="card-body" style={{ padding: 0 }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}></th>
                                <th style={{ width: '90px' }}>Fase</th>
                                <th>Tarea</th>
                                <th style={{ width: '100px' }}>Responsable</th>
                                <th style={{ width: '100px' }}>Fecha/SLA</th>
                                <th style={{ width: '110px' }}>Estado</th>
                                <th style={{ width: '180px' }}>Notas</th>
                                <th style={{ width: '90px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTareas.map(tarea => {
                                const badge = getEstadoBadge(tarea.estado)
                                return (
                                    <>
                                        <tr key={tarea.id} style={{ background: tarea.alerta ? 'var(--danger-50)' : undefined }}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={tarea.estado === 'completada'}
                                                    onChange={() => toggleEstado(tarea.id)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </td>
                                            <td><span className="text-sm text-muted">{tarea.fase}</span></td>
                                            <td>
                                                <span style={{
                                                    fontWeight: tarea.alerta ? 'var(--font-semibold)' : undefined,
                                                    textDecoration: tarea.estado === 'completada' ? 'line-through' : undefined,
                                                    opacity: tarea.estado === 'completada' ? 0.7 : 1
                                                }}>
                                                    {tarea.tarea}
                                                </span>
                                                {tarea.alerta && <span style={{ color: 'var(--danger-600)', marginLeft: 8 }}>⚠️</span>}
                                            </td>
                                            <td>
                                                <span className={`badge ${tarea.quien === 'Cliente' ? 'badge--info' : tarea.quien === 'Consultor' ? 'badge--primary' : 'badge--neutral'}`}>
                                                    {tarea.quien}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span className="text-sm">{tarea.fecha}</span>
                                                    {tarea.sla && (
                                                        <span className={`badge ${tarea.alerta ? 'badge--danger' : 'badge--neutral'}`} style={{ fontSize: '10px', width: 'fit-content' }}>
                                                            SLA {tarea.sla}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <select
                                                    className={`badge ${badge.class}`}
                                                    value={tarea.estado}
                                                    onChange={(e) => handleStatusChange(tarea.id, e.target.value)}
                                                    style={{ border: 'none', cursor: 'pointer', outline: 'none', padding: '2px 8px', appearance: 'none' }}
                                                >
                                                    <option value="pendiente">○ Pendiente</option>
                                                    <option value="en_progreso">● En curso</option>
                                                    <option value="completada">✓ Hecho</option>
                                                </select>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {tarea.notas ? (
                                                        <button 
                                                            className="btn btn--ghost btn--sm" 
                                                            onClick={() => openNoteModal(tarea)}
                                                            style={{ padding: '2px 4px', fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', gap: '4px' }}
                                                        >
                                                            <FiMessageSquare /> Ver notas ({tarea.notas.split('\n').filter(n => n.trim()).length})
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            className="btn btn--ghost btn--sm text-muted" 
                                                            onClick={() => openNoteModal(tarea)}
                                                            style={{ border: '1px dashed var(--border-color)', fontSize: 'var(--text-xs)' }}
                                                        >
                                                            + Añadir nota
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                    {tarea.quien === 'Cliente' && (
                                                        <Link 
                                                            to={`/consultor/proyecto/${id}/inputs-cliente`} 
                                                            className="btn btn--ghost btn--icon btn--sm" 
                                                            title="Ver en Pendientes Cliente"
                                                            style={{ color: 'var(--primary-600)' }}
                                                        >
                                                            <FiExternalLink />
                                                        </Link>
                                                    )}
                                                    <button
                                                        className="btn btn--ghost btn--icon btn--sm"
                                                        onClick={() => handleEditarTarea(tarea)}
                                                        title="Editar"
                                                    >
                                                        <FiEdit2 />
                                                    </button>
                                                    <button
                                                        className="btn btn--ghost btn--icon btn--sm"
                                                        onClick={() => setDeleteConfirm(tarea.id)}
                                                        title="Eliminar"
                                                        style={{ color: 'var(--danger-600)' }}
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {tarea.showComments && (
                                            <tr>
                                                <td colSpan={8} style={{ padding: 'var(--space-4)', background: 'var(--gray-50)' }}>
                                                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                                                        <CommentsSection
                                                            comments={tarea.comentarios || []}
                                                            onAddComment={(c) => {
                                                                const updatedTareas = tareas.map(t =>
                                                                    t.id === tarea.id ? { ...t, comentarios: [...(t.comentarios || []), c] } : t
                                                                )
                                                                setTareas(updatedTareas)
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                )
                            })}
                            {filteredTareas.length === 0 && (
                                <tr>
                                    <td colSpan={8} style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                                        <div className="text-muted">No hay tareas que coincidan con el filtro</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Crear/Editar */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 'var(--z-modal)'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '550px' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="card-title">
                                {editingTarea ? 'Editar Tarea' : 'Nueva Tarea'}
                            </h3>
                            <button className="btn btn--ghost btn--icon btn--sm" onClick={() => setShowModal(false)}>
                                <FiX />
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label className="form-label">Nombre de la tarea *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ej: Entrevista con Director de Ventas"
                                    value={formData.tarea}
                                    onChange={(e) => setFormData({ ...formData, tarea: e.target.value })}
                                    autoFocus
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                <div className="form-group">
                                    <label className="form-label">Fase</label>
                                    <select
                                        className="form-input"
                                        value={formData.fase}
                                        onChange={(e) => setFormData({ ...formData, fase: e.target.value })}
                                    >
                                        {FASES.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Responsable</label>
                                    <select
                                        className="form-input"
                                        value={formData.quien}
                                        onChange={(e) => setFormData({ ...formData, quien: e.target.value })}
                                    >
                                        {RESPONSABLES.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                <div className="form-group">
                                    <label className="form-label">Estado</label>
                                    <select
                                        className="form-input"
                                        value={formData.estado}
                                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="en_progreso">En curso</option>
                                        <option value="completada">Completada</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Fecha / Deadline</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ej: 15 Ene, Hoy 15:00"
                                        value={formData.fecha}
                                        onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                <div className="form-group">
                                    <label className="form-label">SLA (si aplica)</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ej: 48h"
                                        value={formData.sla}
                                        onChange={(e) => setFormData({ ...formData, sla: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.alerta || false}
                                            onChange={(e) => setFormData({ ...formData, alerta: e.target.checked })}
                                        />
                                        Marcar como alerta ⚠️
                                    </label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Notas</label>
                                <textarea
                                    className="form-input"
                                    rows={2}
                                    placeholder="Notas adicionales..."
                                    value={formData.notas}
                                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', borderTop: '1px solid var(--border-color)', padding: 'var(--space-4)' }}>
                            <button className="btn btn--ghost" onClick={() => setShowModal(false)}>
                                Cancelar
                            </button>
                            <button className="btn btn--primary" onClick={handleGuardar}>
                                <FiSave /> {editingTarea ? 'Guardar cambios' : 'Crear tarea'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirmar Eliminación */}
            {deleteConfirm && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 'var(--z-modal)'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                        <div className="card-header">
                            <h3 className="card-title">Confirmar eliminación</h3>
                        </div>
                        <div className="card-body">
                            <p>¿Estás seguro de que quieres eliminar esta tarea?</p>
                            <p className="text-muted text-sm">Esta acción no se puede deshacer.</p>
                        </div>
                        <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', borderTop: '1px solid var(--border-color)', padding: 'var(--space-4)' }}>
                            <button className="btn btn--ghost" onClick={() => setDeleteConfirm(null)}>
                                Cancelar
                            </button>
                            <button className="btn btn--danger" onClick={() => handleEliminar(deleteConfirm)}>
                                <FiTrash2 /> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Notas */}
            {noteModalTarea && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 'var(--z-modal)'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 className="card-title">Notas: {noteModalTarea.tarea}</h3>
                            <button className="btn btn--ghost btn--icon btn--sm" onClick={() => setNoteModalTarea(null)}>
                                <FiX />
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label className="form-label">Nota</label>
                                <textarea
                                    className="form-input"
                                    rows={5}
                                    placeholder="Escribe notas sobre el progreso o detalles de la tarea..."
                                    value={tempNote}
                                    onChange={(e) => setTempNote(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="form-group">
                                <button className="btn btn--ghost btn--sm">
                                    <FiPaperclip /> Adjuntar archivo
                                </button>
                                <p className="text-xs text-muted" style={{ marginTop: 'var(--space-1)' }}>
                                    Documentación de respaldo, capturas o entregables intermedios.
                                </p>
                            </div>
                        </div>
                        <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', borderTop: '1px solid var(--border-color)', padding: 'var(--space-4)' }}>
                            <button className="btn btn--ghost" onClick={() => setNoteModalTarea(null)}>
                                Cancelar
                            </button>
                            <button className="btn btn--primary" onClick={saveNote}>
                                <FiSave /> Guardar nota
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
