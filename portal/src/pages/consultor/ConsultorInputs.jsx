import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiCheck, FiClock, FiMail, FiAlertTriangle, FiPause, FiPlus, FiX, FiExternalLink } from 'react-icons/fi'

const INITIAL_INPUTS = [
    { id: 1, categoria: 'Finanzas', item: 'Balance Q4 2023', estado: 'recibido', fecha: '10 Ene', archivo: 'Balance_Q4.xlsx', tipo: 'Archivo requerido' },
    { id: 2, categoria: 'Finanzas', item: 'P&L 2023', estado: 'recibido', fecha: '10 Ene', archivo: 'PyG_2023.pdf', tipo: 'Archivo requerido' },
    { id: 3, categoria: 'Finanzas', item: 'Presupuesto 2024', estado: 'recibido', fecha: '11 Ene', archivo: 'Presupuesto_2024.xlsx', tipo: 'Archivo requerido' },
    { id: 4, categoria: 'CRM', item: 'Export clientes activos', estado: 'pendiente', solicitado: '10 Ene', sla: 12, tipo: 'Archivo requerido', resolver_url: '../data-room?category=CRM&pendingId=4' },
    { id: 5, categoria: 'CRM', item: 'Histórico ventas 12m', estado: 'pendiente', solicitado: '10 Ene', sla: 12, tipo: 'Archivo requerido', resolver_url: '../data-room?category=CRM&pendingId=5' },
    { id: 6, categoria: 'ERP', item: 'Maestro productos', estado: 'recibido', fecha: '11 Ene', archivo: 'Maestro.csv', tipo: 'Archivo requerido' },
    { id: 7, categoria: 'ERP', item: 'Accesos lectura ERP', estado: 'recibido', fecha: '10 Ene', archivo: '-', tipo: 'Confirmación / Respuesta' },
    { id: 8, categoria: 'Procesos', item: 'Organigrama', estado: 'recibido', fecha: '10 Ene', archivo: 'Org.pdf', tipo: 'Archivo requerido' },
    { id: 9, categoria: 'Procesos', item: 'Mapa de procesos actual', estado: 'recibido', fecha: '11 Ene', archivo: 'Mapa.pdf', tipo: 'Archivo requerido' },
]

export default function ConsultorInputs() {
    const { id } = useParams()
    const [inputs, setInputs] = useState(() => {
        const saved = localStorage.getItem(`inputs_${id}`)
        return saved ? JSON.parse(saved) : INITIAL_INPUTS
    })

    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        item: '',
        categoria: 'Otros',
        tipo: 'Archivo requerido',
        sla: '',
        descripcion: ''
    })

    useEffect(() => {
        const handleStorageSync = () => {
            const saved = localStorage.getItem(`inputs_${id}`)
            if (saved) {
                setInputs(JSON.parse(saved))
            }
        }
        window.addEventListener('storage', handleStorageSync)
        const interval = setInterval(handleStorageSync, 2000)
        return () => {
            window.removeEventListener('storage', handleStorageSync)
            clearInterval(interval)
        }
    }, [id])

    useEffect(() => {
        localStorage.setItem(`inputs_${id}`, JSON.stringify(inputs))
    }, [inputs, id])

    const recibidos = inputs.filter(i => i.estado === 'recibido').length
    const total = inputs.length
    const porcentaje = Math.round((recibidos / total) * 100)
    const pendientes = inputs.filter(i => i.estado === 'pendiente' || i.estado === 'por-validar')

    const handleSave = () => {
        if (!formData.item) return alert('El título es requerido')

        const newId = Math.max(...inputs.map(i => i.id), 0) + 1
        const taskId = Date.now() // ID único para vinculación a tarea (OBJETO V1)

        const nuevoPendiente = {
            ...formData,
            id: newId,
            taskId: taskId,
            estado: 'pendiente',
            solicitado: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
            resolver_url: formData.tipo === 'Archivo requerido' 
                ? `/consultor/proyecto/${id}/data-room?category=${formData.categoria}` 
                : `/consultor/proyecto/${id}/inputs-cliente`
        }

        // Simular creación de Task vinculada (responsable=CLIENTE)
        const globalTasks = JSON.parse(localStorage.getItem(`tasks_${id}`) || '[]')
        const newTask = {
            id: taskId,
            tarea: formData.item,
            quien: 'Cliente',
            responsable: 'CLIENTE',
            fase: 'Diagnóstico', // O fase actual del diagnóstico si estuviera en context
            pendingId: newId,
            category: formData.categoria,
            estado: 'pendiente',
            fecha: formData.sla ? `${formData.sla}h` : 'Pendiente',
            descripcion: formData.descripcion,
            tipo: formData.tipo,
            resolver_url: formData.tipo === 'Archivo requerido' 
                ? `/cliente/diagnostico/${id}/data-room?category=${formData.categoria}&pendingId=${newId}` 
                : `/cliente/diagnostico/${id}/pendientes`
        }
        localStorage.setItem(`tasks_${id}`, JSON.stringify([...globalTasks, newTask]))

        // Sincronizar hacia abajo y simular notificación al portal del cliente (V1)
        const clientNotifications = JSON.parse(localStorage.getItem(`notifications_cliente_${id}`) || '[]')
        clientNotifications.push({
            id: Date.now(),
            mensaje: `El consultor ha solicitado: ${formData.item}`,
            fecha: 'Ahora',
            tipo: 'tarea',
            url: nuevoPendiente.resolver_url
        })
        localStorage.setItem(`notifications_cliente_${id}`, JSON.stringify(clientNotifications))

        setInputs([...inputs, nuevoPendiente])
        setShowModal(false)
        setFormData({ item: '', categoria: 'Otros', tipo: 'Archivo requerido', sla: '', descripcion: '' })
        alert('Pendiente creado y notificado al cliente.')
    }

    const handleMarcarRecibido = (inputId) => {
        const item = inputs.find(i => i.id === inputId)
        if (!item) return

        // Actualizar Input
        const updatedInputs = inputs.map(i => 
            i.id === inputId ? { ...i, estado: 'recibido', fecha: 'Hoy' } : i
        )
        setInputs(updatedInputs)

        // Sincronizar con Task vinculada (OBJETO V1: Task.estado sincronizado)
        if (item.taskId) {
            const globalTasks = JSON.parse(localStorage.getItem(`tasks_${id}`) || '[]')
            const updatedTasks = globalTasks.map(t => 
                t.id === item.taskId ? { ...t, estado: 'completada' } : t
            )
            localStorage.setItem(`tasks_${id}`, JSON.stringify(updatedTasks))
        }
        alert('Item marcado como recibido. La tarea vinculada en el portal del cliente se ha completado.')
    }

    return (
        <div>
            <Link to={`/consultor/proyecto/${id}/operacion`} className="btn btn--ghost" style={{ marginBottom: 'var(--space-4)' }}>
                <FiArrowLeft /> Volver a Control
            </Link>

            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Pendientes Cliente</h1>
                    <p className="page-subtitle">Checklist de datos requeridos para el diagnóstico</p>
                </div>
            </div>

            {/* Progress */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                        <span className="font-semibold">Progreso datos mínimos</span>
                        <span className="font-semibold">{recibidos}/{total} ({porcentaje}%)</span>
                    </div>
                    <div className="progress progress--lg">
                        <div className="progress__bar" style={{ width: `${porcentaje}%` }}></div>
                    </div>
                    {porcentaje < 100 && (
                        <div className="alert alert--warning" style={{ marginTop: 'var(--space-3)' }}>
                            <FiAlertTriangle /> <strong>SLA 48h activo:</strong> Quedan {pendientes[0]?.sla || 0}h para recibir datos mínimos
                        </div>
                    )}
                </div>
            </div>

            {/* Pendientes destacados */}
            {pendientes.length > 0 && (
                <div className="card" style={{ marginBottom: 'var(--space-6)', borderLeft: '4px solid var(--danger-500)' }}>
                    <div className="card-header">
                        <h3 className="card-title"><FiClock /> Pendientes con SLA</h3>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <button className="btn btn--primary btn--sm" onClick={() => setShowModal(true)}>
                                <FiPlus /> Nuevo pendiente
                            </button>
                            <button className="btn btn--secondary btn--sm"><FiMail /> Enviar recordatorio</button>
                            <button className="btn btn--ghost btn--sm"><FiPause /> Pausar reloj</button>
                        </div>
                    </div>
                    <div className="card-body">
                        {pendientes.map(item => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--border-light)' }}>
                                <div>
                                    <span className="badge badge--info" style={{ marginRight: 8 }}>{item.categoria}</span>
                                    <strong>{item.item}</strong>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <span className="text-sm text-muted">Solicitado: {item.solicitado}</span>
                                    <span className="text-danger font-semibold">⏱️ {item.sla}h restantes</span>
                                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                        {item.resolver_url && (
                                            <a href={item.resolver_url} className="btn btn--secondary btn--sm">
                                                <FiExternalLink /> Abrir para resolver
                                            </a>
                                        )}
                                        <button className="btn btn--ghost btn--sm" onClick={() => handleMarcarRecibido(item.id)}>Marcar recibido</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tabla completa */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Lista completa de inputs</h3>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Categoría</th>
                                <th>Item requerido</th>
                                <th>Estado</th>
                                <th>Fecha</th>
                                <th>Archivo / Link</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inputs.map(item => (
                                <tr key={item.id}>
                                    <td><span className="badge badge--neutral">{item.categoria}</span></td>
                                    <td>
                                        <div className="font-medium">{item.item}</div>
                                        <div className="text-xs text-muted">{item.tipo}</div>
                                    </td>
                                    <td>
                                        {item.estado === 'recibido' ? (
                                            <span className="badge badge--success"><FiCheck /> Recibido</span>
                                        ) : item.estado === 'por-validar' ? (
                                            <span className="badge badge--info"><FiClock /> Por validar</span>
                                        ) : (
                                            <span className="badge badge--warning"><FiClock /> Pendiente</span>
                                        )}
                                    </td>
                                    <td>{item.fecha || item.solicitado}</td>
                                    <td>
                                        {item.archivo && item.archivo !== '-' ? (
                                            <a href="#" className="text-primary">{item.archivo}</a>
                                        ) : (
                                            item.estado === 'pendiente' && item.resolver_url ? (
                                                <Link to={item.resolver_url} className="text-xs text-primary flex items-center gap-1">
                                                    Ir a resolver <FiExternalLink size={10} />
                                                </Link>
                                            ) : '-'
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                            {item.estado !== 'recibido' ? (
                                                <>
                                                    {item.resolver_url && (
                                                        <Link to={item.resolver_url} className="btn btn--secondary btn--sm" title="Abrir para resolver">
                                                            <FiExternalLink />
                                                        </Link>
                                                    )}
                                                    <button className="btn btn--ghost btn--sm" onClick={() => handleMarcarRecibido(item.id)}>Marcar recibido</button>
                                                </>
                                            ) : (
                                                <button className="btn btn--ghost btn--sm">Ver en Data Room</button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Nuevo Pendiente */}
            {showModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="card-header" style={{ justifyContent: 'space-between' }}>
                            <h3 className="card-title">Nuevo Pendiente Cliente</h3>
                            <button className="btn btn--ghost btn--sm" onClick={() => setShowModal(false)}><FiX /></button>
                        </div>
                        <div className="card-body">
                            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                                <label className="form-label">Título (Item requerido) *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Ej: Balance 2023 consolidado"
                                    value={formData.item}
                                    onChange={e => setFormData({ ...formData, item: e.target.value })}
                                />
                            </div>
                            
                            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                                <div className="form-group">
                                    <label className="form-label">Categoría</label>
                                    <select 
                                        className="form-control"
                                        value={formData.categoria}
                                        onChange={e => setFormData({ ...formData, categoria: e.target.value })}
                                    >
                                        <option>CRM</option>
                                        <option>ERP</option>
                                        <option>Finanzas</option>
                                        <option>Procesos</option>
                                        <option>Otros</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tipo de resolución</label>
                                    <select 
                                        className="form-control"
                                        value={formData.tipo}
                                        onChange={e => setFormData({ ...formData, tipo: e.target.value })}
                                    >
                                        <option>Archivo requerido</option>
                                        <option>Confirmación / Respuesta</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                                <label className="form-label">SLA / Plazo (horas opcional)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    placeholder="Ej: 48"
                                    value={formData.sla}
                                    onChange={e => setFormData({ ...formData, sla: e.target.value })}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                                <label className="form-label">Descripción (opcional)</label>
                                <textarea 
                                    className="form-control" 
                                    rows="2"
                                    placeholder="Instrucciones adicionales para el cliente..."
                                    value={formData.descripcion}
                                    onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                                <button className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button className="btn btn--primary" onClick={handleSave}>Crear y Notificar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
