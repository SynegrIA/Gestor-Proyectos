import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FiDownload, FiCalendar, FiUsers, FiCheck, FiSave, FiEdit2, FiPlus, FiTrash2, FiLink, FiFileText, FiRefreshCw, FiCheckSquare } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useProjectData } from '../../context/ProjectContext'

export default function DiagnosticoRevision() {
    const { id } = useParams()
    const { user } = useAuth()
    const isConsultor = user?.role === 'consultor'
    const { projectData } = useProjectData()

    // Estado del Acta
    const [acta, setActa] = useState({
        isPublished: false,
        publishedDate: null,
        fecha: '15 Enero 2024, 10:00 - 11:00',
        asistentes: 'Juan García, María López, Pedro Sánchez',
        resumen: 'Se presentaron los hallazgos del diagnóstico y las 3 iniciativas prioritarias. El cliente aprobó las iniciativas #1 y #2 para implementación inmediata. La iniciativa #3 queda en backlog para Q2.',
        manualDecisions: [
            'Agendar kick-off de implementación: 22 Enero'
        ],
        agreedActions: [
            { id: 1, action: 'Revisar presupuesto implementación', responsible: 'Cliente', date: '2024-01-20', isConverted: false }
        ],
        attachments: [
            { id: 1, name: 'Resumen_Ejecutivo_Final.pdf', type: 'file', url: '#' },
            { id: 2, name: 'Acta_Reunion_15Ene.pdf', type: 'file', url: '#' }
        ]
    })

    const [isEditing, setIsEditing] = useState(false)
    const [newManualDecision, setNewManualDecision] = useState('')
    const [showDeliverableSelector, setShowDeliverableSelector] = useState(false)

    // Sincronización de decisiones automáticas
    const autoDecisions = (projectData.iniciativas || [])
        .filter(i => ['APROBADA', 'DESCARTADA', 'POSTPONED', 'POSPUESTA'].includes(i.estado_cliente))
        .map(i => {
            let icon = '✅';
            let label = 'Aprobada';
            if (i.estado_cliente === 'DESCARTADA') { icon = '❌'; label = 'Descartada'; }
            if (i.estado_cliente === 'POSTPONED' || i.estado_cliente === 'POSPUESTA') { icon = '⏸️'; label = 'Pospuesta'; }
            
            return {
                id: `auto-${i.id}`,
                text: `${label} iniciativa #${i.id}: ${i.titulo}`,
                type: 'auto',
                status: i.estado_cliente
            }
        })

    const handleTogglePublish = () => {
        setActa(prev => ({
            ...prev,
            isPublished: !prev.isPublished,
            publishedDate: !prev.isPublished ? new Date().toISOString() : prev.publishedDate
        }))
    }

    const handleSave = () => {
        setIsEditing(false)
        // Guardar en backend real aquí
    }

    const addManualDecision = () => {
        if (!newManualDecision.trim()) return
        setActa(prev => ({
            ...prev,
            manualDecisions: [...prev.manualDecisions, newManualDecision]
        }))
        setNewManualDecision('')
    }

    const removeManualDecision = (index) => {
        setActa(prev => ({
            ...prev,
            manualDecisions: prev.manualDecisions.filter((_, i) => i !== index)
        }))
    }

    const addAgreedAction = () => {
        setActa(prev => ({
            ...prev,
            agreedActions: [...prev.agreedActions, { 
                id: Date.now(), 
                action: '', 
                responsible: 'Ambos', 
                date: '', 
                isConverted: false 
            }]
        }))
    }

    const updateAgreedAction = (id, field, value) => {
        setActa(prev => ({
            ...prev,
            agreedActions: prev.agreedActions.map(a => a.id === id ? { ...a, [field]: value } : a)
        }))
    }

    const removeAgreedAction = (id) => {
        setActa(prev => ({
            ...prev,
            agreedActions: prev.agreedActions.filter(a => a.id !== id)
        }))
    }

    const convertToTask = (action) => {
        // En un caso real, esto llamaría a un servicio de tareas
        const newTask = {
            id: Date.now(),
            fase: 'Cierre',
            tarea: action.action,
            quien: action.responsible === 'Ambos' ? 'Consultor' : action.responsible,
            estado: 'pendiente',
            fecha: action.date || 'Sin fecha',
            descripcion: 'Tarea generada desde el Acta de Cierre.',
            comentarios: []
        }
        
        const existingTasks = JSON.parse(localStorage.getItem(`tasks_${id}`) || '[]')
        localStorage.setItem(`tasks_${id}`, JSON.stringify([...existingTasks, newTask]))
        
        updateAgreedAction(action.id, 'isConverted', true)
        alert(`Tarea creada: ${action.action} para ${action.responsible}`)
    }

    const attachDeliverable = (name, url) => {
        setActa(prev => ({
            ...prev,
            attachments: [...prev.attachments, { id: Date.now(), name, type: 'link', url }]
        }))
        setShowDeliverableSelector(false)
    }

    const autoFillSummary = () => {
        const total = (projectData.iniciativas || []).length
        const aprobadas = (projectData.iniciativas || []).filter(i => i.estado_cliente === 'APROBADA').length
        const pospuestas = (projectData.iniciativas || []).filter(i => i.estado_cliente === 'POSPUESTA' || i.estado_cliente === 'POSTPONED').length
        
        let nextMilestone = ''
        if (acta.agreedActions.length > 0) {
            const firstAction = acta.agreedActions[0]
            nextMilestone = ` El próximo hito es "${firstAction.action}" para el ${firstAction.date}.`
        }

        const newSummary = `Se han analizado un total de ${total} iniciativas. De ellas, ${aprobadas} han sido aprobadas para ejecución inmediata y ${pospuestas} han sido pospuestas para futuras etapas.${nextMilestone}`
        
        setActa(prev => ({ ...prev, resumen: newSummary }))
    }

    if (!isConsultor && !acta.isPublished) {
        return (
            <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
                <FiFileText size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }} />
                <h3>Acta no disponible</h3>
                <p>El acta de la reunión de cierre aún no ha sido publicada por el equipo consultor.</p>
            </div>
        )
    }

    return (
        <div style={{ paddingBottom: 'var(--space-12)' }}>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Revisión Final y Acta</h1>
                    <p className="page-subtitle">Documentación de la reunión de cierre</p>
                </div>
                {isConsultor && (
                    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right', marginRight: 'var(--space-2)' }}>
                            <div className={`badge ${acta.isPublished ? 'badge--success' : 'badge--warning'}`}>
                                {acta.isPublished ? 'PUBLICADA' : 'BORRADOR'}
                            </div>
                            {acta.isPublished && acta.publishedDate && (
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                                    {new Date(acta.publishedDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                        <button 
                            className={`btn ${acta.isPublished ? 'btn--outline' : 'btn--primary'}`}
                            onClick={handleTogglePublish}
                        >
                            {acta.isPublished ? 'Ocultar al cliente' : 'Publicar acta al cliente'}
                        </button>
                        <button 
                            className={`btn ${isEditing ? 'btn--success' : 'btn--secondary'}`}
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        >
                            {isEditing ? <><FiSave /> Guardar</> : <><FiEdit2 /> Editar Acta</>}
                        </button>
                    </div>
                )}
            </div>

            {/* Change 2: Editable fields */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1 }}>
                            <FiCalendar /> <strong>Fecha:</strong> 
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    className="input" 
                                    style={{ flex: 1 }}
                                    value={acta.fecha} 
                                    onChange={e => setActa(prev => ({ ...prev, fecha: e.target.value }))} 
                                />
                            ) : acta.fecha}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 2 }}>
                            <FiUsers /> <strong>Asistentes:</strong> 
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    className="input" 
                                    style={{ flex: 1 }}
                                    value={acta.asistentes} 
                                    onChange={e => setActa(prev => ({ ...prev, asistentes: e.target.value }))} 
                                />
                            ) : acta.asistentes}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-header" style={{ justifyContent: 'space-between' }}>
                    <h3 className="card-title">Resumen de la Reunión</h3>
                    {isEditing && (
                        <button className="btn btn--ghost btn--sm" onClick={autoFillSummary}>
                            <FiRefreshCw /> Autorrellenar resumen
                        </button>
                    )}
                </div>
                <div className="card-body">
                    {isEditing ? (
                        <textarea 
                            className="input" 
                            rows={4} 
                            style={{ width: '100%' }}
                            value={acta.resumen}
                            onChange={e => setActa(prev => ({ ...prev, resumen: e.target.value }))}
                        />
                    ) : (
                        <p>{acta.resumen}</p>
                    )}
                </div>
            </div>

            {/* Change 3: Decisions */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-header">
                    <h3 className="card-title">Decisiones Tomadas</h3>
                </div>
                <div className="card-body">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {/* Auto decisions */}
                        {autoDecisions.map(decision => (
                            <div key={decision.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <span className="badge badge--success" style={{ 
                                    backgroundColor: decision.status === 'DESCARTADA' ? 'var(--danger-100)' : 
                                                    (decision.status === 'APROBADA' ? 'var(--success-100)' : 'var(--warning-100)'),
                                    color: decision.status === 'DESCARTADA' ? 'var(--danger-700)' : 
                                           (decision.status === 'APROBADA' ? 'var(--success-700)' : 'var(--warning-700)')
                                }}>{decision.status === 'DESCARTADA' ? '❌' : (decision.status === 'APROBADA' ? '✅' : '⏸️')}</span> 
                                <span style={{ fontWeight: '500' }}>{decision.text}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>(Sincronizado)</span>
                            </div>
                        ))}
                        
                        {/* Manual decisions */}
                        {acta.manualDecisions.map((decision, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <span className="badge badge--success"><FiCheck /></span> 
                                {isEditing ? (
                                    <div style={{ display: 'flex', gap: 'var(--space-2)', flex: 1 }}>
                                        <input 
                                            type="text" 
                                            className="input" 
                                            style={{ flex: 1 }}
                                            value={decision}
                                            onChange={e => {
                                                const newDecs = [...acta.manualDecisions]
                                                newDecs[index] = e.target.value
                                                setActa(prev => ({ ...prev, manualDecisions: newDecs }))
                                            }}
                                        />
                                        <button className="btn btn--ghost btn--sm text-danger" onClick={() => removeManualDecision(index)}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                ) : decision}
                            </div>
                        ))}

                        {isEditing && (
                            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                                <input 
                                    type="text" 
                                    className="input" 
                                    placeholder="Nueva decisión..." 
                                    style={{ flex: 1 }}
                                    value={newManualDecision}
                                    onChange={e => setNewManualDecision(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && addManualDecision()}
                                />
                                <button className="btn btn--secondary" onClick={addManualDecision}>
                                    <FiPlus /> Añadir decisión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Change 4: Agreed Actions */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-header" style={{ justifyContent: 'space-between' }}>
                    <h3 className="card-title">Acciones Acordadas</h3>
                    {isEditing && (
                        <button className="btn btn--ghost btn--sm" onClick={addAgreedAction}>
                            <FiPlus /> Añadir acción
                        </button>
                    )}
                </div>
                <div className="card-body">
                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: 'var(--space-2)' }}>Acción</th>
                                <th style={{ padding: 'var(--space-2)', width: '150px' }}>Responsable</th>
                                <th style={{ padding: 'var(--space-2)', width: '150px' }}>Fecha</th>
                                <th style={{ padding: 'var(--space-2)', width: '120px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {acta.agreedActions.map(action => (
                                <tr key={action.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                    <td style={{ padding: 'var(--space-2)' }}>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                className="input" 
                                                style={{ width: '100%' }}
                                                value={action.action}
                                                onChange={e => updateAgreedAction(action.id, 'action', e.target.value)}
                                            />
                                        ) : action.action}
                                    </td>
                                    <td style={{ padding: 'var(--space-2)' }}>
                                        {isEditing ? (
                                            <select 
                                                className="input"
                                                value={action.responsible}
                                                onChange={e => updateAgreedAction(action.id, 'responsible', e.target.value)}
                                            >
                                                <option value="Cliente">Cliente</option>
                                                <option value="Consultor">Consultor</option>
                                                <option value="Ambos">Ambos</option>
                                            </select>
                                        ) : action.responsible}
                                    </td>
                                    <td style={{ padding: 'var(--space-2)' }}>
                                        {isEditing ? (
                                            <input 
                                                type="date" 
                                                className="input" 
                                                value={action.date}
                                                onChange={e => updateAgreedAction(action.id, 'date', e.target.value)}
                                            />
                                        ) : action.date}
                                    </td>
                                    <td style={{ padding: 'var(--space-2)' }}>
                                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                            {!action.isConverted ? (
                                                <button 
                                                    className="btn btn--ghost btn--sm" 
                                                    title="Convertir en tarea"
                                                    onClick={() => convertToTask(action)}
                                                    disabled={!action.action}
                                                >
                                                    <FiCheckSquare size={14} />
                                                </button>
                                            ) : (
                                                <span className="text-success text-xs"><FiCheck /> Tarea OK</span>
                                            )}
                                            {isEditing && (
                                                <button className="btn btn--ghost btn--sm text-danger" onClick={() => removeAgreedAction(action.id)}>
                                                    <FiTrash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {acta.agreedActions.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: 'var(--space-4)', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        No hay acciones acordadas registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Change 5: Attachments */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-header" style={{ justifyContent: 'space-between' }}>
                    <h3 className="card-title">Documentos Adjuntos</h3>
                    {isEditing && (
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <button className="btn btn--ghost btn--sm" onClick={() => setShowDeliverableSelector(!showDeliverableSelector)}>
                                <FiLink /> Vincular entregable
                            </button>
                            <button className="btn btn--ghost btn--sm">
                                <FiPlus /> Subir archivo
                            </button>
                        </div>
                    )}
                </div>
                <div className="card-body">
                    {showDeliverableSelector && (
                        <div style={{ 
                            marginBottom: 'var(--space-4)', 
                            padding: 'var(--space-4)', 
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px dashed var(--border-color)'
                        }}>
                            <h4 style={{ fontSize: '0.9rem', marginBottom: 'var(--space-2)' }}>Selecciona un entregable publicado:</h4>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                <button className="btn btn--xs btn--outline" onClick={() => attachDeliverable('Dashboard Ejecutivo', '#/cliente/diagnostico/1/dashboard')}>Dashboard</button>
                                <button className="btn btn--xs btn--outline" onClick={() => attachDeliverable('Matriz de Procesos', '#/cliente/diagnostico/1/matriz')}>Matriz</button>
                                <button className="btn btn--xs btn--outline" onClick={() => attachDeliverable('Roadmap de Iniciativas', '#/cliente/diagnostico/1/roadmap')}>Roadmap</button>
                                <button className="btn btn--xs btn--outline" onClick={() => attachDeliverable('Fichas de Iniciativa', '#/cliente/diagnostico/1/iniciativas')}>Fichas</button>
                            </div>
                        </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {acta.attachments.map(doc => (
                            <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <a href={doc.url} className="btn btn--ghost" style={{ justifyContent: 'flex-start', flex: 1 }}>
                                    {doc.type === 'file' ? <FiDownload /> : <FiLink />} {doc.name}
                                </a>
                                {isEditing && (
                                    <button 
                                        className="btn btn--ghost btn--sm text-danger"
                                        onClick={() => setActa(prev => ({ 
                                            ...prev, 
                                            attachments: prev.attachments.filter(a => a.id !== doc.id) 
                                        }))}
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {acta.isPublished && (
                <div className="alert alert--success">
                    <strong>✅ ENTREGADO</strong> — Fecha de entrega: {new Date(acta.publishedDate).toLocaleDateString()} — Portal activo hasta: 15 Marzo 2024 (60 días)
                </div>
            )}
        </div>
    )
}
