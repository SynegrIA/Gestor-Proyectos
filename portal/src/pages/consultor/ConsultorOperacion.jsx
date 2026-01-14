import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiCheck, FiClock, FiAlertTriangle, FiPause, FiChevronRight, FiChevronDown, FiMail, FiExternalLink, FiPlus, FiMessageSquare, FiFileText } from 'react-icons/fi'

// Definición de fases con Nombre + Rango de días
const FASES_DIAGNOSTICO = {
    0: {
        id: 'dia0',
        label: 'Día 0',
        nombre: 'Preparación y Setup',
        rango: 'Día 0',
        descripcion: 'Antes de empezar'
    },
    1: {
        id: 'dia1_2',
        label: 'Inmersión (D1–2)',
        nombre: 'Inmersión y entrevistas',
        rango: 'Días 1–2',
        descripcion: 'Recogida de datos'
    },
    2: {
        id: 'dia3_5',
        label: 'Análisis (D3–5)',
        nombre: 'Análisis y Oportunidades',
        rango: 'Días 3–5',
        descripcion: 'Análisis profundo'
    },
    3: {
        id: 'dia6_7',
        label: 'Cierre (D6–7)',
        nombre: 'Entrega Final',
        rango: 'Días 6–7',
        descripcion: 'Presentación y Cierre'
    }
}

export default function ConsultorOperacion() {
    const { id } = useParams()

    const TAREAS_INICIALES = [
        { id: 1, fase: 0, title: 'Pago recibido + NDA firmado', responsible: 'CONSULTOR', completed: true },
        { id: 2, fase: 0, title: 'Formulario inicial completado', responsible: 'CLIENTE', completed: true },
        { id: 3, fase: 0, title: 'Carpeta Drive compartida creada', responsible: 'CONSULTOR', completed: true },
        { id: 4, fase: 1, title: 'Sesión de inmersión (60–90 min)', responsible: 'CONSULTOR', completed: true },
        { id: 5, fase: 1, title: 'Entrevistas por departamento (hasta 5)', responsible: 'CONSULTOR', completed: false, dueDate: 'Hoy' },
        { id: 6, fase: 1, title: 'Recogida de datos financieros', responsible: 'CLIENTE', completed: false, required: true, dueDate: 'Ayer' },
        { id: 7, fase: 1, title: 'Export CRM (clientes + ventas)', responsible: 'CLIENTE', completed: false, required: true, dueDate: 'Ayer' },
        { id: 8, fase: 2, title: 'Detectar fugas y oportunidades', responsible: 'CONSULTOR', completed: false },
        { id: 9, fase: 2, title: 'Definir KPIs antes/después', responsible: 'CONSULTOR', completed: false },
        { id: 10, fase: 3, title: 'Cargar: Resumen + KPIs', responsible: 'CONSULTOR', completed: false },
        { id: 11, fase: 3, title: 'Revisión final (60 min)', responsible: 'CONSULTOR', completed: false }
    ]

    const BLOQUEOS_INICIALES = [
        {
            id: 1,
            title: 'Falta: Export CRM',
            reason: 'Necesario para análisis de fugas',
            origin: 'Data Room',
            type: 'Pendiente Cliente',
            severity: 'Alta',
            createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000), // 36h hace
            sla: 48,
            contextLink: `/consultor/proyecto/${id}/data-room`
        }
    ]

    const ACTIVIDAD_INICIAL = [
        { id: 1, event: 'Sesión de inmersión marcada como completada', timestamp: 'Hace 2 horas', user: 'Consultor' },
        { id: 2, event: 'Nueva carpeta "Finanzas" creada en Data Room', timestamp: 'Hace 5 horas', user: 'Consultor' },
        { id: 3, event: 'Bloqueo detectado: Export CRM faltante', timestamp: 'Hace 36 horas', user: 'Sistema' },
        { id: 4, event: 'Fase avanzada a Inmersión (D1-2)', timestamp: 'Ayer', user: 'Consultor' },
        { id: 5, event: 'Diagnóstico iniciado', timestamp: 'Hace 3 días', user: 'Sistema' }
    ]

    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(1)
    const [tasks, setTasks] = useState(TAREAS_INICIALES)
    const [blockages, setBlockages] = useState(BLOQUEOS_INICIALES)
    const [activities, setActivities] = useState(ACTIVIDAD_INICIAL)
    const [showAllTasks, setShowAllTasks] = useState(false)
    const [showBlockModal, setShowBlockModal] = useState(false)
    const [isBlockExpanded, setIsBlockExpanded] = useState(true)
    const [newBlock, setNewBlock] = useState({ title: '', reason: '', type: 'Pendiente cliente', severity: 'Media' })

    // Siguiente mejor acción
    const getNextBestAction = () => {
        const activeBlock = blockages[0] // Prioridad 1: Bloqueos
        if (activeBlock) {
            return {
                title: activeBlock.title,
                desc: activeBlock.reason,
                type: 'block',
                urgency: '36h de 48h',
                link: activeBlock.contextLink
            }
        }
        const nextTask = tasks.find(t => !t.completed && t.fase <= currentPhaseIndex)
        if (nextTask) {
            return {
                title: nextTask.title,
                desc: `Siguiente tarea pendiente de la fase ${FASES_DIAGNOSTICO[nextTask.fase].label}`,
                type: 'task',
                link: `/consultor/proyecto/${id}/tareas`
            }
        }
        return null
    }

    const nextAction = getNextBestAction()

    const handleCheck = (taskId) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t))
        const task = tasks.find(t => t.id === taskId)
        const newLog = {
            id: Date.now(),
            event: `${task.title} marcado como ${!task.completed ? 'completado' : 'pendiente'}`,
            timestamp: 'Ahora mismo',
            user: 'Consultor'
        }
        setActivities(prev => [newLog, ...prev.slice(0, 4)])
    }

    const addManualBlock = () => {
        const block = {
            ...newBlock,
            id: Date.now(),
            origin: 'Manual',
            createdAt: new Date(),
            contextLink: '#'
        }
        setBlockages(prev => [block, ...prev])
        setShowBlockModal(false)
        setNewBlock({ title: '', reason: '', type: 'Pendiente cliente', severity: 'Media' })
        setActivities(prev => [{
            id: Date.now(),
            event: `Nuevo bloqueo manual: ${block.title}`,
            timestamp: 'Ahora mismo',
            user: 'Consultor'
        }, ...prev.slice(0, 4)])
    }

    const currentPhase = FASES_DIAGNOSTICO[currentPhaseIndex]

    return (
        <div className="operacion-control">
            <Link to="/consultor/portfolio" className="btn btn--ghost" style={{ marginBottom: 'var(--space-4)' }}>
                <FiArrowLeft /> Volver al Portfolio
            </Link>

            <div className="page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 className="page-title">Control de Proyecto</h1>
                        <p className="page-subtitle">ACME Corp · Optimización Q1</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span className="badge badge--primary" style={{ marginBottom: '4px' }}>Día 2 de 7</span>
                        <div className="text-sm text-muted">Diagnóstico en tiempo</div>
                    </div>
                </div>
            </div>

            {/* Siguiente Mejor Acción Card */}
            {nextAction && (
                <div className="card" style={{ marginBottom: 'var(--space-6)', borderLeft: `4px solid ${nextAction.type === 'block' ? 'var(--danger-500)' : 'var(--primary-500)'}` }}>
                    <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
                                <span className="text-xs" style={{ fontWeight: 'bold', textTransform: 'uppercase', color: nextAction.type === 'block' ? 'var(--danger-500)' : 'var(--primary-500)' }}>
                                    {nextAction.type === 'block' ? 'Siguiente Acción (Bloqueo)' : 'Siguiente Acción'}
                                </span>
                                {nextAction.urgency && <span className="badge badge--warning text-xs">{nextAction.urgency}</span>}
                            </div>
                            <h3 style={{ margin: 0, fontSize: 'var(--text-lg)' }}>{nextAction.title}</h3>
                            <p className="text-muted" style={{ margin: 0 }}>{nextAction.desc}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <Link to={nextAction.link} className="btn btn--primary">
                                Abrir para resolver
                            </Link>
                            {nextAction.type === 'task' && <button className="btn btn--ghost">Marcar resuelta</button>}
                        </div>
                    </div>
                </div>
            )}

            {/* Status Header */}
            <div className="card" style={{ marginBottom: 'var(--space-6)', background: 'var(--gradient-header)', color: 'white' }}>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
                        <div>
                            <div className="text-sm" style={{ opacity: 0.8 }}>Estado</div>
                            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>🟣 EN PROGRESO</div>
                        </div>
                        <div>
                            <div className="text-sm" style={{ opacity: 0.8 }}>Fase Actual</div>
                            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>
                                {currentPhase.nombre} ({currentPhase.rango})
                            </div>
                            <div className="text-xs">{currentPhase.descripcion}</div>
                        </div>
                        <div>
                            <div className="text-sm" style={{ opacity: 0.8 }}>Progreso Fase</div>
                            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>
                                {Math.round((tasks.filter(t => t.fase === currentPhaseIndex && t.completed).length / tasks.filter(t => t.fase === currentPhaseIndex).length) * 100) || 0}%
                            </div>
                        </div>
                        <div>
                            <div className="text-sm" style={{ opacity: 0.8 }}>Reloj</div>
                            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)' }}>⏱️ 45h restantes</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phase Timeline interactivo */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body">
                    <div className="phase-timeline">
                        {Object.values(FASES_DIAGNOSTICO).map((fase, index) => {
                            const isActive = index === currentPhaseIndex
                            const isCompleted = index < currentPhaseIndex

                            return (
                                <div
                                    key={fase.id}
                                    className={`phase-item ${isActive ? 'phase-item--active' : ''} ${isCompleted ? 'phase-item--completed' : ''}`}
                                    onClick={() => setCurrentPhaseIndex(index)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="phase-item__indicator">
                                        {isCompleted ? <FiCheck /> : (isActive ? '●' : '○')}
                                    </div>
                                    <div className="phase-item__label">{fase.label}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 'var(--space-6)' }}>
                {/* Checklist Tareas */}
                <div className="card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="card-title">Checklist: {currentPhase.nombre}</h3>
                        <button className="btn btn--sm btn--ghost" onClick={() => setShowAllTasks(!showAllTasks)}>
                            {showAllTasks ? 'Ver Fase Actual' : 'Ver todo'}
                        </button>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {tasks
                                .filter(t => showAllTasks || t.fase === currentPhaseIndex)
                                .map(item => (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-color)' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', cursor: 'pointer', flex: 1 }}>
                                            <input
                                                type="checkbox"
                                                checked={item.completed}
                                                onChange={() => handleCheck(item.id)}
                                            />
                                            <span style={{ 
                                                textDecoration: item.completed ? 'line-through' : 'none', 
                                                color: item.completed ? 'var(--text-muted)' : 'inherit' 
                                            }}>
                                                {item.title}
                                            </span>
                                        </label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            {item.dueDate && <span className="text-xs text-muted"><FiClock size={12} /> {item.dueDate}</span>}
                                            <span className={`badge ${item.responsible === 'CONSULTOR' ? 'badge--primary' : 'badge--secondary'} text-xs`}>
                                                {item.responsible}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                    <div className="card-footer" style={{ borderTop: '1px solid var(--border-color)', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-sm text-muted">
                            Faltan {tasks.filter(t => t.fase === currentPhaseIndex && !t.completed).length} tareas en esta fase.
                        </span>
                        <button
                            className="btn btn--primary btn--sm"
                            onClick={() => currentPhaseIndex < 3 && setCurrentPhaseIndex(currentPhaseIndex + 1)}
                            disabled={currentPhaseIndex >= 3}
                        >
                            Siguiente fase <FiChevronRight />
                        </button>
                    </div>
                </div>

                {/* Bloqueos Activos */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <div className="card" style={{ borderTop: '4px solid var(--danger-500)', height: 'fit-content' }}>
                        <div 
                            className="card-header" 
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => setIsBlockExpanded(!isBlockExpanded)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                {isBlockExpanded ? <FiChevronDown /> : <FiChevronRight />}
                                <h3 className="card-title" style={{ margin: 0 }}><FiAlertTriangle color="var(--danger-500)" /> Bloqueos Activos</h3>
                                {!isBlockExpanded && blockages.length > 0 && <span className="badge badge--danger text-xs">{blockages.length}</span>}
                            </div>
                            <button 
                                className={`btn btn--icon btn--sm ${showBlockModal ? 'btn--primary' : 'btn--ghost'}`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setShowBlockModal(!showBlockModal)
                                    if (!isBlockExpanded) setIsBlockExpanded(true)
                                }}
                                title="Añadir bloqueo manual"
                            >
                                <FiPlus />
                            </button>
                        </div>
                        
                        {isBlockExpanded && (
                            <div className="card-body">
                                {showBlockModal && (
                                    <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                                        <h4 style={{ marginTop: 0, marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>Nuevo Bloqueo Manual</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                            <input 
                                                type="text" 
                                                placeholder="Título del bloqueo" 
                                                className="form-input" 
                                                value={newBlock.title}
                                                onChange={(e) => setNewBlock({...newBlock, title: e.target.value})}
                                                style={{ fontSize: 'var(--text-sm)' }}
                                            />
                                            <select 
                                                className="form-input"
                                                value={newBlock.type}
                                                onChange={(e) => setNewBlock({...newBlock, type: e.target.value})}
                                                style={{ fontSize: 'var(--text-sm)' }}
                                            >
                                                <option>Pendiente cliente</option>
                                                <option>Técnico</option>
                                                <option>Agenda</option>
                                                <option>Otro</option>
                                            </select>
                                            <textarea 
                                                placeholder="Motivo/Detalle" 
                                                className="form-input" 
                                                rows="2"
                                                value={newBlock.reason}
                                                onChange={(e) => setNewBlock({...newBlock, reason: e.target.value})}
                                                style={{ fontSize: 'var(--text-sm)' }}
                                            ></textarea>
                                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                <button className="btn btn--primary btn--xs" onClick={addManualBlock}>Guardar</button>
                                                <button className="btn btn--ghost btn--xs" onClick={() => setShowBlockModal(false)}>Cancelar</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {blockages.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                        {blockages.map(block => (
                                            <div key={block.id} className="alert alert--warning" style={{ margin: 0, padding: 'var(--space-3)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                    <strong>{block.title}</strong>
                                                    <span className="text-xs" style={{ fontWeight: 'bold' }}>{block.severity}</span>
                                                </div>
                                                <div className="text-sm">{block.reason}</div>
                                                <div className="text-xs text-muted" style={{ marginTop: 'var(--space-2)' }}>
                                                    Origen: {block.origin} · Hace 36h
                                                </div>
                                                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                                                    <Link to={block.contextLink || '#'} className="btn btn--secondary btn--xs">Abrir para resolver</Link>
                                                    <button className="btn btn--ghost btn--xs" onClick={() => setBlockages(prev => prev.filter(b => b.id !== block.id))}>Marcar resuelto</button>
                                                </div>
                                            </div>
                                        ))}
                                        <p className="text-xs text-muted" style={{ fontStyle: 'italic' }}>
                                            💡 Sugerencia: si no se resuelve en 12h, pausar diagnóstico.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center text-muted py-4">
                                        No hay bloqueos activos.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actividad Reciente */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Actividad reciente</h3>
                        </div>
                        <div className="card-body" style={{ padding: '0 var(--space-4)' }}>
                            <div className="activity-feed">
                                {activities.map(act => (
                                    <div key={act.id} style={{ padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: 'var(--space-3)' }}>
                                        <div style={{ marginTop: '3px' }}>
                                            {act.user === 'Sistema' ? <FiClock size={14} className="text-muted" /> : <FiCheck size={14} className="text-primary" />}
                                        </div>
                                        <div>
                                            <div className="text-sm" style={{ fontWeight: 500 }}>{act.event}</div>
                                            <div className="text-xs text-muted">{act.user} · {act.timestamp}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="card" style={{ marginTop: 'var(--space-6)', background: 'var(--bg-light)' }}>
                <div className="card-body" style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
                    <button className="btn btn--secondary"><FiPause /> Pausar reloj</button>
                    <button className="btn btn--secondary" onClick={() => currentPhaseIndex < 3 && setCurrentPhaseIndex(currentPhaseIndex + 1)} disabled={currentPhaseIndex >= 3}>
                        Avanzar fase
                    </button>
                    <Link to={`/consultor/proyecto/${id}/data-room`} className="btn btn--ghost"><FiExternalLink /> Ver Data Room</Link>
                </div>
            </div>
        </div>
    )
}
