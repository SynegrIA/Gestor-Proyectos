import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiFlag, FiBookmark } from 'react-icons/fi'

const NOTAS = [
    { id: 1, fecha: '12 Ene 2024', titulo: 'Entrevista CEO', contenido: 'El CEO menciona que la prioridad es reducir tiempo de facturación. Muy receptivo a automatización. Menciona que el equipo de finanzas está sobrecargado.', tags: ['entrevista', 'prioridad'], flag: 'importante' },
    { id: 2, fecha: '11 Ene 2024', titulo: 'Accesos ERP recibidos', contenido: 'Credenciales funcionan correctamente. Sistema es SAP Business One versión 10. API REST disponible.', tags: ['técnico'], flag: null },
    { id: 3, fecha: '11 Ene 2024', titulo: 'Contexto financiero', contenido: 'Facturación mensual: 150 facturas. Error rate actual: ~8%. Tiempo promedio: 30 min por factura.', tags: ['datos', 'finanzas'], flag: 'dato_clave' },
    { id: 4, fecha: '10 Ene 2024', titulo: 'Onboarding completado', contenido: 'Reunión de kick-off realizada. Participantes: Juan García (CEO), Pedro Sánchez (CFO), Ana López (Dir. Ventas). Siguiente paso: recibir datos.', tags: ['reunión'], flag: null },
]

const FLAGS = [
    { id: 'importante', label: '🔴 Importante', color: 'var(--danger-500)' },
    { id: 'dato_clave', label: '📊 Dato clave', color: 'var(--info-500)' },
    { id: 'seguimiento', label: '👀 Seguimiento', color: 'var(--warning-500)' },
    { id: 'riesgo', label: '⚠️ Riesgo', color: 'var(--danger-600)' },
]

export default function ConsultorNotas() {
    const { id } = useParams()
    const [showNewNote, setShowNewNote] = useState(false)

    return (
        <div>
            <Link to={`/consultor/proyecto/${id}/operacion`} className="btn btn--ghost" style={{ marginBottom: 'var(--space-4)' }}>
                <FiArrowLeft /> Volver a Control
            </Link>

            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Notas Internas</h1>
                    <p className="page-subtitle">Apuntes privados del consultor (no visibles para el cliente)</p>
                </div>
                <button className="btn btn--primary" onClick={() => setShowNewNote(true)}>
                    <FiPlus /> Nueva nota
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 'var(--space-6)' }}>
                {/* Sidebar - Flags */}
                <div>
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title"><FiFlag /> Flags</h4>
                        </div>
                        <div className="card-body" style={{ padding: 'var(--space-2)' }}>
                            {FLAGS.map(flag => (
                                <button
                                    key={flag.id}
                                    className="btn btn--ghost btn--sm"
                                    style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 'var(--space-1)' }}
                                >
                                    {flag.label}
                                    <span className="text-muted" style={{ marginLeft: 'auto' }}>
                                        {NOTAS.filter(n => n.flag === flag.id).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card" style={{ marginTop: 'var(--space-4)' }}>
                        <div className="card-header">
                            <h4 className="card-title"><FiBookmark /> Tags</h4>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                                {['entrevista', 'prioridad', 'técnico', 'datos', 'finanzas', 'reunión'].map(tag => (
                                    <span key={tag} className="badge badge--neutral" style={{ cursor: 'pointer' }}>#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main - Notes list */}
                <div>
                    {showNewNote && (
                        <div className="card" style={{ marginBottom: 'var(--space-4)', border: '2px solid var(--primary-300)' }}>
                            <div className="card-body">
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Título de la nota..."
                                    style={{ marginBottom: 'var(--space-3)', fontWeight: 'var(--font-semibold)' }}
                                />
                                <textarea
                                    className="form-input"
                                    rows={4}
                                    placeholder="Escribe tu nota aquí..."
                                    style={{ marginBottom: 'var(--space-3)' }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                        <select className="form-input" style={{ width: 'auto', padding: 'var(--space-1) var(--space-2)' }}>
                                            <option value="">Sin flag</option>
                                            {FLAGS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                                        </select>
                                        <input type="text" className="form-input" placeholder="Tags (separados por coma)" style={{ width: '200px' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                        <button className="btn btn--ghost" onClick={() => setShowNewNote(false)}>Cancelar</button>
                                        <button className="btn btn--primary">Guardar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {NOTAS.map(nota => {
                        const flagInfo = FLAGS.find(f => f.id === nota.flag)
                        return (
                            <div key={nota.id} className="card" style={{ marginBottom: 'var(--space-3)' }}>
                                <div className="card-body">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                                        <div>
                                            <h4 style={{ margin: 0 }}>{nota.titulo}</h4>
                                            <span className="text-sm text-muted">{nota.fecha}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            {flagInfo && (
                                                <span className="badge" style={{ background: flagInfo.color, color: 'white' }}>
                                                    {flagInfo.label}
                                                </span>
                                            )}
                                            <button className="btn btn--ghost btn--icon btn--sm"><FiEdit2 /></button>
                                            <button className="btn btn--ghost btn--icon btn--sm"><FiTrash2 /></button>
                                        </div>
                                    </div>
                                    <p style={{ margin: '0 0 var(--space-3)', lineHeight: 1.6 }}>{nota.contenido}</p>
                                    <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                        {nota.tags.map(tag => (
                                            <span key={tag} className="badge badge--neutral">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
