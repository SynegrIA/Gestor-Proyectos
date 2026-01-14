import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { 
    FiCheckCircle, FiClock, FiMessageSquare, FiAlertCircle, 
    FiFilter, FiUpload, FiEye, FiArrowRight, FiX, FiInfo, FiTrendingUp, FiCheck
} from 'react-icons/fi'
import CommentsSection from '../../components/common/CommentsSection'

const TAREAS_MOCK = [
    { 
        id: 1, 
        fase: 'Entrevistas', 
        tarea: 'Entrevista con CEO', 
        quien: 'Consultor', 
        estado: 'completada', 
        fecha: '10 Ene', 
        descripcion: 'Reunión estratégica para alinear objetivos del diagnóstico.',
        roiContext: 'Establece el baseline de expectativas de la dirección.',
        comentarios: [{ id: 101, author: 'Alex', text: 'Ya envié las notas de la reunión.', date: '10 Ene', avatar: 'A' }] 
    },
    { 
        id: 2, 
        fase: 'Datos', 
        tarea: 'Export de datos CRM', 
        quien: 'Cliente', 
        estado: 'en_progreso', 
        fecha: '15 Ene', 
        vencePrompt: 'Vence en 2 días',
        alerta: true, 
        pendingId: 4,
        category: 'CRM',
        resolver_url: '../data-room?category=CRM&pendingId=4',
        descripcion: 'Exportación de los últimos 12 meses de interacciones comerciales.',
        roiContext: 'Necesario para identificar fugas en el embudo de ventas.',
        comentarios: [] 
    },
    { 
        id: 3, 
        fase: 'Análisis', 
        tarea: 'Análisis de procesos ventas', 
        quien: 'Consultor', 
        estado: 'pendiente', 
        fecha: '18 Ene', 
        descripcion: 'Mapeo detallado de los 5 sub-procesos comerciales identificados.',
        roiContext: 'Base para la propuesta de automatización #1.',
        comentarios: [] 
    },
    { 
        id: 4, 
        fase: 'Datos', 
        tarea: 'Carga de ERP histórico', 
        quien: 'Cliente', 
        estado: 'bloqueada', 
        fecha: '12 Ene', 
        vencida: true,
        motivoBloqueo: 'Pendiente acceso a VPN del departamento IT.',
        descripcion: 'Subida de ficheros CSV del ERP para análisis de costes.',
        roiContext: 'Vital para el cálculo del ahorro anual estimado de €45K.',
        comentarios: [{ id: 102, author: 'Marcos (IT)', text: 'Estamos revisando el permiso de VPN.', date: 'Hoy', avatar: 'M' }] 
    }
]

export default function ClienteTareas() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [tareas, setTareas] = useState(() => {
        const saved = localStorage.getItem(`tasks_${id}`)
        return saved ? [...TAREAS_MOCK, ...JSON.parse(saved)] : TAREAS_MOCK
    })
    const [filter, setFilter] = useState('todos')
    const [selectedTarea, setSelectedTarea] = useState(null)

    // Sincronizar con localStorage para ver cambios del consultor en tiempo real (simulado)
    useEffect(() => {
        const handleStorageChange = () => {
            const saved = localStorage.getItem(`tasks_${id}`)
            if (saved) {
                const extraTasks = JSON.parse(saved)
                // Evitar duplicados por ID
                const allTasks = [...TAREAS_MOCK]
                extraTasks.forEach(et => {
                    const idx = allTasks.findIndex(t => t.id === et.id)
                    if (idx > -1) allTasks[idx] = et
                    else allTasks.push(et)
                })
                setTareas(allTasks)
            }
        }
        window.addEventListener('storage', handleStorageChange)
        // También poll cada 2 segundos para el demo local
        const interval = setInterval(handleStorageChange, 2000)
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            clearInterval(interval)
        }
    }, [id])

    const handleCompletarTarea = (tareaId) => {
        const tarea = tareas.find(t => t.id === tareaId)
        const updatedTareas = tareas.map(t => {
            if (t.id === tareaId) {
                return { ...t, estado: 'completada' }
            }
            return t
        })
        setTareas(updatedTareas)

        // Sincronizar hacia afuera (localStorage)
        const saved = JSON.parse(localStorage.getItem(`tasks_${id}`) || '[]')
        const updatedSaved = saved.map(t => t.id === tareaId ? { ...t, estado: 'completada' } : t)
        localStorage.setItem(`tasks_${id}`, JSON.stringify(updatedSaved))

        // Si la tarea viene de un ClientPending (taskId), sincronizarlo también
        const inputs = JSON.parse(localStorage.getItem(`inputs_${id}`) || '[]')
        const updatedInputs = inputs.map(i => {
            if (i.taskId === tareaId) {
                return { ...i, estado: 'recibido', fecha: 'Hoy' }
            }
            return i
        })
        localStorage.setItem(`inputs_${id}`, JSON.stringify(updatedInputs))

        // Notificar al consultor (V1)
        const consultorNotifications = JSON.parse(localStorage.getItem(`notifications_consultor_${id}`) || '[]')
        consultorNotifications.push({
            id: Date.now(),
            mensaje: `El cliente ha completado la tarea: ${tarea?.tarea || 'Tarea'}`,
            fecha: 'Ahora',
            tipo: 'tarea'
        })
        localStorage.setItem(`notifications_consultor_${id}`, JSON.stringify(consultorNotifications))
        
        alert('Tarea completada y consultor notificado.')
    }

    const stats = {
        total: tareas.length,
        tuyas: tareas.filter(t => t.quien === 'Cliente' && t.estado !== 'completada').length,
        nuestras: tareas.filter(t => t.quien === 'Consultor' && t.estado !== 'completada').length,
        bloqueos: tareas.filter(t => t.estado === 'bloqueada').length
    }

    const filteredTareas = tareas.filter(t => {
        if (filter === 'todos') return true
        if (filter === 'tuyas') return t.quien === 'Cliente'
        if (filter === 'nuestras') return t.quien === 'Consultor'
        if (filter === 'bloqueadas') return t.estado === 'bloqueada'
        return true
    })

    const getEstadoStyle = (estado) => {
        switch (estado) {
            case 'completada': return { icon: <FiCheckCircle />, color: 'var(--success-600)', bg: 'var(--success-50)', label: 'Completada' }
            case 'en_progreso': return { icon: <FiClock />, color: 'var(--warning-600)', bg: 'var(--warning-50)', label: 'En progreso' }
            case 'bloqueada': return { icon: <FiAlertCircle />, color: 'var(--danger-600)', bg: 'var(--danger-50)', label: 'Bloqueada' }
            default: return { icon: <FiClock />, color: 'var(--text-muted)', bg: 'var(--bg-secondary)', label: 'Pendiente' }
        }
    }

    return (
        <div className="cliente-tareas">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Pendientes</h1>
                    <p className="page-subtitle">Gestión de acciones y seguimiento del diagnóstico</p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="summary-grid">
                <div className="summary-card" onClick={() => setFilter('tuyas')}>
                    <div className="summary-card__value">{stats.tuyas}</div>
                    <div className="summary-card__label">Pendientes tuyos</div>
                    <div className="summary-card__indicator cli"></div>
                </div>
                <div className="summary-card" onClick={() => setFilter('nuestras')}>
                    <div className="summary-card__value">{stats.nuestras}</div>
                    <div className="summary-card__label">Pendientes nuestros</div>
                    <div className="summary-card__indicator con"></div>
                </div>
                <div className="summary-card" onClick={() => setFilter('bloqueadas')}>
                    <div className="summary-card__value text-danger">{stats.bloqueos}</div>
                    <div className="summary-card__label">Bloqueos</div>
                    <div className="summary-card__indicator blo"></div>
                </div>
            </div>

            {/* Accesos Directos (UX EXTRA) */}
            <div className="card" style={{ marginBottom: 'var(--space-6)', borderLeft: '4px solid var(--primary-color)' }}>
                <div className="card-body" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap', padding: 'var(--space-4)' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <h3 style={{ fontSize: '1rem', margin: 0, marginBottom: 'var(--space-1)' }}>Acciones rápidas</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Faltan completar algunos datos clave para avanzar</p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Link to="../medicion-tiempos" className="btn btn--secondary btn--sm">
                            <FiClock /> Validar datos de tiempo
                        </Link>
                        <Link to="../data-room" className="btn btn--ghost btn--sm">
                            <FiUpload /> Subir archivos faltantes
                        </Link>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filter-chips">
                {[
                    { id: 'todos', label: 'Todos' },
                    { id: 'tuyas', label: 'Solo tuyos' },
                    { id: 'nuestras', label: 'Solo nuestros' },
                    { id: 'bloqueadas', label: 'Bloqueadas' }
                ].map(f => (
                    <button 
                        key={f.id} 
                        className={`chip ${filter === f.id ? 'active' : ''}`}
                        onClick={() => setFilter(f.id)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th>Tarea</th>
                                <th>Responsable</th>
                                <th>Fecha objetivo</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTareas.map(tarea => {
                                const st = getEstadoStyle(tarea.estado)
                                return (
                                    <tr key={tarea.id} className="row-hover" onClick={() => setSelectedTarea(tarea)}>
                                        <td>
                                            <div className="status-badge" style={{ color: st.color, background: st.bg }}>
                                                {st.icon}
                                                <span>{st.label}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-medium">{tarea.tarea}</div>
                                            <div className="text-[11px] text-muted flex items-center gap-1">
                                                <span className="phase-tag">Fase: {tarea.fase}</span>
                                                {tarea.estado === 'bloqueada' && (
                                                    <span className="text-danger flex items-center gap-1">
                                                        <FiInfo size={10} /> {tarea.motivoBloqueo}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${tarea.quien === 'Cliente' ? 'badge--info' : 'badge--primary'}`}>
                                                {tarea.quien}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex flex-col">
                                                <span className={tarea.vencida ? 'text-danger font-bold' : ''}>{tarea.fecha}</span>
                                                {tarea.vencida && <span className="text-[10px] text-danger uppercase">Vencida</span>}
                                                {tarea.vencePrompt && <span className="text-[10px] text-warning font-medium">{tarea.vencePrompt}</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                {tarea.quien === 'Cliente' && tarea.estado !== 'completada' ? (
                                                    tarea.tipo === 'Confirmación / Respuesta' ? (
                                                        <button 
                                                            className="btn btn--success btn--sm"
                                                            onClick={(e) => { e.stopPropagation(); handleCompletarTarea(tarea.id); }}
                                                        >
                                                            <FiCheck /> Listo
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            className="btn btn--primary btn--sm"
                                                            onClick={(e) => { e.stopPropagation(); navigate(tarea.resolver_url || '../data-room'); }}
                                                        >
                                                            <FiUpload /> Subir
                                                        </button>
                                                    )
                                                ) : (
                                                    <button className="btn btn--ghost btn--sm">
                                                        <FiEye /> Ver
                                                    </button>
                                                )}
                                                {tarea.comentarios.length > 0 && (
                                                    <div className="text-muted flex items-center gap-1 text-xs">
                                                        <FiMessageSquare size={14} /> {tarea.comentarios.length}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Side Drawer */}
            {selectedTarea && (
                <div className="drawer-overlay" onClick={() => setSelectedTarea(null)}>
                    <div className="drawer" onClick={e => e.stopPropagation()}>
                        <div className="drawer__header">
                            <div className="flex flex-col">
                                <span className="text-xs text-muted uppercase tracking-wider mb-1">Fase: {selectedTarea.fase}</span>
                                <h2 className="drawer__title">{selectedTarea.tarea}</h2>
                            </div>
                            <button className="drawer__close" onClick={() => setSelectedTarea(null)}>
                                <FiX size={24} />
                            </button>
                        </div>
                        
                        <div className="drawer__content">
                            <div className="drawer__section">
                                <h4 className="drawer__section-title">Descripción</h4>
                                <p className="text-sm text-secondary">{selectedTarea.descripcion}</p>
                            </div>

                            <div className="drawer__section bg-primary-50 p-4 rounded-lg border border-primary-100">
                                <h4 className="drawer__section-title flex items-center gap-2 text-primary-700">
                                    <FiTrendingUp size={16} /> Impacto en el Diagnóstico
                                </h4>
                                <p className="text-sm text-primary-600 font-medium">{selectedTarea.roiContext}</p>
                            </div>

                            {selectedTarea.estado === 'bloqueada' && (
                                <div className="drawer__section bg-danger-50 p-4 rounded-lg border border-danger-100">
                                    <h4 className="drawer__section-title flex items-center gap-2 text-danger-700">
                                        <FiAlertCircle size={16} /> Motivo del Bloqueo
                                    </h4>
                                    <p className="text-sm text-danger-600">{selectedTarea.motivoBloqueo}</p>
                                </div>
                            )}

                            <div className="drawer__section">
                                <CommentsSection 
                                    comments={selectedTarea.comentarios}
                                    onAddComment={(c) => {
                                        setTareas(tareas.map(t => 
                                            t.id === selectedTarea.id ? { ...t, comentarios: [...t.comentarios, c] } : t
                                        ))
                                    }}
                                />
                            </div>
                        </div>

                        <div className="drawer__footer">
                            <button className="btn btn--ghost flex-1" onClick={() => setSelectedTarea(null)}>Cerrar</button>
                            {selectedTarea.quien === 'Cliente' && selectedTarea.estado !== 'completada' && (
                                selectedTarea.tipo === 'Confirmación / Respuesta' ? (
                                    <button 
                                        className="btn btn--success flex-1"
                                        onClick={() => { handleCompletarTarea(selectedTarea.id); setSelectedTarea(null); }}
                                    >
                                        <FiCheck /> Marcar como Completada
                                    </button>
                                ) : (
                                    <button 
                                        className="btn btn--primary flex-1"
                                        onClick={() => navigate(selectedTarea.resolver_url || '../data-room')}
                                    >
                                        <FiUpload /> Subir Archivo
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: var(--space-4);
                    margin-bottom: var(--space-6);
                }

                .summary-card {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    padding: var(--space-4);
                    border-radius: var(--radius-lg);
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                    position: relative;
                    overflow: hidden;
                }

                .summary-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                .summary-card__value {
                    font-size: var(--text-2xl);
                    font-weight: var(--font-bold);
                    margin-bottom: 2px;
                }

                .summary-card__label {
                    font-size: var(--text-xs);
                    color: var(--text-secondary);
                    font-weight: var(--font-medium);
                }

                .summary-card__indicator {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                }

                .summary-card__indicator.cli { background: var(--info-500); }
                .summary-card__indicator.con { background: var(--primary-500); }
                .summary-card__indicator.blo { background: var(--danger-500); }

                .filter-chips {
                    display: flex;
                    gap: var(--space-2);
                    margin-bottom: var(--space-4);
                }

                .chip {
                    padding: var(--space-1) var(--space-4);
                    border-radius: var(--radius-full);
                    font-size: var(--text-xs);
                    font-weight: var(--font-medium);
                    border: 1px solid var(--border-color);
                    background: var(--bg-primary);
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .chip:hover { border-color: var(--primary-300); }
                .chip.active {
                    background: var(--primary-600);
                    color: white;
                    border-color: var(--primary-600);
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 10px;
                    border-radius: var(--radius-full);
                    font-size: 10px;
                    font-weight: var(--font-bold);
                    text-transform: uppercase;
                    letter-spacing: 0.02em;
                }

                .phase-tag {
                    background: var(--gray-100);
                    padding: 1px 6px;
                    border-radius: 4px;
                }

                .row-hover { cursor: pointer; }
                .row-hover:hover { background: var(--gray-50) !important; }

                /* Drawer Styles */
                .drawer-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.4);
                    z-index: var(--z-modal);
                    display: flex;
                    justify-content: flex-end;
                }

                .drawer {
                    width: 100%;
                    max-width: 500px;
                    background: var(--bg-primary);
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }

                .drawer__header {
                    padding: var(--space-6);
                    border-bottom: 1px solid var(--border-light);
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .drawer__title {
                    font-size: var(--text-xl);
                    margin: 0;
                }

                .drawer__close {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    padding: 4px;
                    border-radius: var(--radius-md);
                }

                .drawer__close:hover { background: var(--gray-100); }

                .drawer__content {
                    flex: 1;
                    overflow-y: auto;
                    padding: var(--space-6);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-8);
                }

                .drawer__section-title {
                    font-size: var(--text-xs);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-muted);
                    margin-bottom: var(--space-3);
                }

                .drawer__footer {
                    padding: var(--space-6);
                    border-top: 1px solid var(--border-light);
                    display: flex;
                    gap: var(--space-4);
                }

                @media (max-width: 768px) {
                    .summary-grid { grid-template-columns: 1fr; }
                    .drawer { max-width: 100%; }
                }
            `}</style>
        </div>
    )
}
