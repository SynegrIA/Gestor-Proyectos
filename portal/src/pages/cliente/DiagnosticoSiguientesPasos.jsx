import { useState, useMemo } from 'react'
import { FiCalendar, FiEye, FiEyeOff, FiCheckCircle, FiInfo, FiArrowRight, FiClock, FiTrendingUp } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useProjectData } from '../../context/ProjectContext'

export default function DiagnosticoSiguientesPasos() {
    const { isConsultor, isCliente } = useAuth()
    const { projectData } = useProjectData()
    const initiatives = projectData.iniciativas || []
    
    // Estado de publicación (en real vendría de BD)
    const [isPublicado, setIsPublicado] = useState(false)
    const [notification, setNotification] = useState(null)

    // Notas del consultor
    const [consultantNotes, setConsultantNotes] = useState(() => {
        const saved = localStorage.getItem('diagnostico_consultant_notes')
        return saved || projectData.siguientesPasos?.nextStepsConsultantNotes || ''
    })
    const [lastEdited, setLastEdited] = useState(() => {
        const saved = localStorage.getItem('diagnostico_consultant_notes_meta')
        return saved ? JSON.parse(saved) : {
            at: projectData.siguientesPasos?.lastEditedAt || new Date().toISOString(),
            by: projectData.siguientesPasos?.lastEditedBy || 'Consultor'
        }
    })

    // Estado de selección de iniciativas por fase
    const [selections, setSelections] = useState({
        1: [1], // Fase 1: Seguimiento automático
        2: [2], // Fase 2: Dashboard
        3: [3, 4] // Fase 3: Limpieza CRM, Ruta Logística
    })

    // Notas por fase
    const [phaseNotes, setPhaseNotes] = useState(() => {
        const saved = localStorage.getItem('diagnostico_phase_notes')
        return saved ? JSON.parse(saved) : {
            1: 'Fase inicial centrada en victorias rápidas con bajo esfuerzo y alto impacto visual.',
            2: 'Desarrollo de las capacidades analíticas core para la toma de decisiones basada en datos.',
            3: 'Consolidación de procesos secundarios y preparación para la escala del sistema.'
        }
    })

    // Modal Agendar
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [agendarStep, setAgendarStep] = useState(null) // 'proponer' o 'enlace'

    // Auto-save phase notes
    const savePhaseNote = (num, text) => {
        const next = { ...phaseNotes, [num]: text }
        setPhaseNotes(next)
        localStorage.setItem('diagnostico_phase_notes', JSON.stringify(next))
    }

    const toggleIniciativa = (faseNum, iniId) => {
        if (!isConsultor) return
        setSelections(prev => {
            const current = prev[faseNum] || []
            const next = current.includes(iniId) 
                ? current.filter(id => id !== iniId)
                : [...current, iniId]
            return { ...prev, [faseNum]: next }
        })
    }

    const selectedIniciativas = useMemo(() => {
        const allIds = Object.values(selections).flat()
        return initiatives.filter(ini => allIds.includes(ini.id))
    }, [initiatives, selections])

    const stats = useMemo(() => {
        const totalROI = selectedIniciativas.reduce((acc, ini) => acc + (ini.roi_eur_anual || 0), 0)
        const totalEffort = selectedIniciativas.reduce((acc, ini) => acc + (ini.esfuerzo_horas || 0), 0)
        const priority1 = initiatives.find(ini => ini.orden === 1)?.titulo || 'N/A'
        
        return { totalROI, totalEffort, priority1 }
    }, [selectedIniciativas, initiatives])

    const FASES_CONFIG = [
        { num: 1, titulo: 'Quick Wins', tiempo: 'Semanas 1-2', color: '#10b981' },
        { num: 2, titulo: 'Automatización Core', tiempo: 'Semanas 3-6', color: '#3b82f6' },
        { num: 3, titulo: 'Optimización & Backlog', tiempo: 'Mes 2-3', color: '#8b5cf6' }
    ]

    const handlePublicar = () => {
        setIsPublicado(!isPublicado)
        if (!isPublicado) {
            setNotification('Siguientes pasos publicados al cliente')
            setTimeout(() => setNotification(null), 3000)
        }
    }

    if (isCliente && !isPublicado) {
        return (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) var(--space-4)' }}>
                <FiInfo size={48} color="var(--text-muted)" style={{ marginBottom: 'var(--space-4)' }} />
                <h2>Siguientes pasos en preparación</h2>
                <p className="text-muted">Tu consultor está terminando de definir la hoja de ruta post-diagnóstico.</p>
            </div>
        )
    }

    return (
        <div className="siguientes-pasos-page">
            {notification && (
                <div className="toast-notification">
                    <FiCheckCircle /> {notification}
                </div>
            )}

            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Siguientes Pasos</h1>
                    <p className="page-subtitle">Tu camino post-diagnóstico y plan de acción</p>
                </div>
                {isConsultor && (
                    <button 
                        className={`btn ${isPublicado ? 'btn--secondary' : 'btn--primary'}`}
                        onClick={handlePublicar}
                        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                    >
                        {isPublicado ? <><FiEyeOff /> Ocultar al cliente</> : <><FiEye /> Publicar al cliente</>}
                    </button>
                )}
            </div>

            {/* SECCIÓN: Resumen Impacto */}
            <div className="card" style={{ marginBottom: 'var(--space-6)', borderLeft: '4px solid var(--color-primary)' }}>
                <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
                    <div>
                        <p className="text-xs text-muted" style={{ textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>Impacto Total Estimado</p>
                        <h3 style={{ margin: 0, color: 'var(--color-success)' }}>€{stats.totalROI.toLocaleString()}/año</h3>
                    </div>
                    <div>
                        <p className="text-xs text-muted" style={{ textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>Esfuerzo Total</p>
                        <h3 style={{ margin: 0 }}>{stats.totalEffort} horas</h3>
                    </div>
                    <div>
                        <p className="text-xs text-muted" style={{ textTransform: 'uppercase', marginBottom: 'var(--space-1)' }}>Prioridad #1</p>
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>{stats.priority1}</h3>
                    </div>
                </div>
            </div>

            {/* SECCIÓN: Notas del Consultor */}
            {(isConsultor || (isCliente && isPublicado && consultantNotes)) && (
                <div className="card" style={{ marginBottom: 'var(--space-6)', backgroundColor: 'var(--bg-secondary)', borderLeft: '4px solid var(--color-warning)' }}>
                    <div className="card-body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <FiInfo size={18} /> Notas del Consultor
                            </h3>
                            {isConsultor && (
                                <span className="text-xs text-muted">
                                    Última edición: {new Date(lastEdited.at).toLocaleString()} por {lastEdited.by}
                                </span>
                            )}
                        </div>
                        
                        {isConsultor ? (
                            <div>
                                <textarea 
                                    className="form-control"
                                    rows="6"
                                    placeholder="Añade aquí recomendaciones, contexto, riesgos o condiciones para avanzar..."
                                    value={consultantNotes}
                                    onChange={(e) => setConsultantNotes(e.target.value)}
                                    style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: 'var(--space-2)', fontSize: '0.95rem' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button 
                                        className="btn btn--primary btn--sm"
                                        onClick={() => {
                                            const meta = { at: new Date().toISOString(), by: 'Consultor' }
                                            setLastEdited(meta)
                                            localStorage.setItem('diagnostico_consultant_notes', consultantNotes)
                                            localStorage.setItem('diagnostico_consultant_notes_meta', JSON.stringify(meta))
                                            setNotification('Notas guardadas correctamente')
                                            setTimeout(() => setNotification(null), 3000)
                                        }}
                                    >
                                        Guardar Notas
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text-normal)' }}>
                                {consultantNotes}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {FASES_CONFIG.map(fase => {
                    const selectedForPhase = initiatives.filter(ini => selections[fase.num]?.includes(ini.id))
                    const faseROI = selectedForPhase.reduce((acc, ini) => acc + (ini.roi_eur_anual || 0), 0)

                    return (
                        <div key={fase.num} className="card">
                            <div className="card-body">
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                                    <div style={{ 
                                        width: '40px', height: '40px', 
                                        background: fase.color, 
                                        color: 'white', borderRadius: 'var(--radius-full)', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        fontWeight: 'var(--font-bold)', flexShrink: 0 
                                    }}>
                                        {fase.num}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                                            <h3 style={{ margin: 0 }}>FASE {fase.num}: {fase.titulo}</h3>
                                            <button 
                                                className="btn btn--secondary btn--sm"
                                                onClick={() => {
                                                    setIsModalOpen(true)
                                                    setAgendarStep(null)
                                                }}
                                            >
                                                Agendar →
                                            </button>
                                        </div>
                                        <p className="text-sm text-muted" style={{ margin: '0 0 var(--space-3)' }}>{fase.tiempo}</p>
                                        
                                        {/* Nota explicativa de la fase */}
                                        <div style={{ marginBottom: 'var(--space-4)' }}>
                                            {isConsultor ? (
                                                <div style={{ position: 'relative' }}>
                                                    <textarea 
                                                        className="form-control"
                                                        rows="2"
                                                        placeholder="Criterio o explicación de esta fase..."
                                                        value={phaseNotes[fase.num] || ''}
                                                        onChange={(e) => savePhaseNote(fase.num, e.target.value)}
                                                        style={{ 
                                                            width: '100%', padding: 'var(--space-2)', 
                                                            fontSize: '0.85rem', borderRadius: 'var(--radius-md)',
                                                            border: '1px solid var(--border-color)',
                                                            backgroundColor: 'var(--surface-50)'
                                                        }}
                                                    />
                                                    <span style={{ position: 'absolute', bottom: '4px', right: '4px', fontSize: '8px', color: 'var(--text-muted)', fontWeight: 'bold' }}>EXPLICACIÓN FASE (EDITABLE)</span>
                                                </div>
                                            ) : (
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', padding: 'var(--space-3)', background: 'var(--surface-50)', borderRadius: 'var(--radius-md)', borderLeft: `3px solid ${fase.color}` }}>
                                                    {phaseNotes[fase.num]}
                                                </p>
                                            )}
                                        </div>

                                        {/* Lista de Iniciativas */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                                            {isConsultor ? (
                                                <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                                                    <p className="text-xs font-bold" style={{ marginBottom: 'var(--space-2)' }}>Seleccionar iniciativas para esta fase:</p>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                                        {initiatives.map(ini => (
                                                            <label key={ini.id} style={{ 
                                                                display: 'flex', alignItems: 'center', gap: 'var(--space-2)', 
                                                                padding: 'var(--space-1) var(--space-3)', border: '1px solid var(--border-color)',
                                                                borderRadius: 'var(--radius-full)', fontSize: '0.85rem', cursor: 'pointer',
                                                                background: selections[fase.num]?.includes(ini.id) ? 'var(--color-primary-light)' : 'transparent',
                                                                borderColor: selections[fase.num]?.includes(ini.id) ? 'var(--color-primary)' : 'var(--border-color)'
                                                            }}>
                                                                <input 
                                                                    type="checkbox" 
                                                                    checked={selections[fase.num]?.includes(ini.id)}
                                                                    onChange={() => toggleIniciativa(fase.num, ini.id)}
                                                                    style={{ display: 'none' }}
                                                                />
                                                                {ini.titulo}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <ul style={{ margin: 0, paddingLeft: 'var(--space-5)' }}>
                                                    {selectedForPhase.map(ini => (
                                                        <li key={ini.id} style={{ marginBottom: 'var(--space-1)' }}>
                                                            <strong>{ini.titulo}</strong>
                                                            <span className="text-muted" style={{ fontSize: '0.85rem', marginLeft: 'var(--space-2)' }}>
                                                                (ROI: €{ini.roi_eur_anual?.toLocaleString()} | {ini.esfuerzo_horas}h)
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        <div className="alert alert--success" style={{ padding: 'var(--space-2) var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <FiTrendingUp />
                                            <span><strong>Impacto fase:</strong> €{faseROI.toLocaleString()} ahorro/año</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <style>{`
                .toast-notification {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    background: #1e293b;
                    color: white;
                    padding: 12px 20px;
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 2000;
                    box-shadow: var(--shadow-lg);
                    animation: slideUp 0.3s ease-out;
                }

                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .modal-overlay {
                    animation: fadeIn 0.2s ease-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .form-control:focus {
                    outline: none;
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 2px var(--color-primary-light);
                }
            `}</style>
            {/* MODAL AGENDAR SIMPLE */}
            {isModalOpen && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', margin: 'var(--space-4)' }}>
                        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>Agendar siguiente paso</h3>
                            <button className="btn btn--ghost" onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <div className="card-body">
                            {!agendarStep ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    <button 
                                        className="btn btn--secondary" 
                                        style={{ justifyContent: 'flex-start', height: 'auto', padding: 'var(--space-4)' }}
                                        onClick={() => setAgendarStep('proponer')}
                                    >
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ fontWeight: 'bold' }}>Proponer 3 huecos</div>
                                            <div className="text-xs text-muted">Sugerir fechas y horas específicas</div>
                                        </div>
                                    </button>
                                    <button 
                                        className="btn btn--secondary"
                                        style={{ justifyContent: 'flex-start', height: 'auto', padding: 'var(--space-4)' }}
                                        onClick={() => setAgendarStep('enlace')}
                                    >
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ fontWeight: 'bold' }}>Abrir enlace de calendario</div>
                                            <div className="text-xs text-muted">Usar Calendly, Hubspot o similar</div>
                                        </div>
                                    </button>
                                </div>
                            ) : agendarStep === 'proponer' ? (
                                <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); setNotification('Propuesta enviada'); setTimeout(() => setNotification(null), 3000); }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                        <div>
                                            <label className="text-xs font-bold">Hueco 1</label>
                                            <input type="datetime-local" className="form-control" required style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold">Hueco 2</label>
                                            <input type="datetime-local" className="form-control" style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold">Hueco 3</label>
                                            <input type="datetime-local" className="form-control" style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold">Notas adicionales</label>
                                            <textarea className="form-control" rows="2" style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}></textarea>
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                                            <button type="button" className="btn btn--ghost" onClick={() => setAgendarStep(null)}>Volver</button>
                                            <button type="submit" className="btn btn--primary" style={{ flex: 1 }}>Enviar propuesta</button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    <p className="text-sm">Se abrirá el calendario configurado por el consultor:</p>
                                    <div style={{ padding: 'var(--space-3)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                                        https://calendly.com/synergia-consultoria/reunion-seguimiento
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                                        <button className="btn btn--ghost" onClick={() => setAgendarStep(null)}>Volver</button>
                                        <button className="btn btn--primary" style={{ flex: 1 }} onClick={() => { window.open('#', '_blank'); setIsModalOpen(false); }}>Abrir calendario</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

