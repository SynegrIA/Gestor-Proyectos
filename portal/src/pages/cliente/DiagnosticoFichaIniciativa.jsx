import { useState, useMemo } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
    FiArrowLeft, FiCheck, FiX, FiClock, FiTrendingUp, FiActivity,
    FiAlertTriangle, FiPaperclip, FiDatabase, FiMessageSquare,
    FiEdit2, FiSave, FiEye, FiEyeOff, FiMoreVertical, FiChevronRight,
    FiUser, FiExternalLink, FiPlus, FiTrash2
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import CommentsSection from '../../components/common/CommentsSection'

const MOCK_DETAIL = {
    id: "1",
    orden: 1,
    titulo: 'Seguimiento automático de presupuestos',
    estado_visibilidad: 'PUBLICADA',
    estado_cliente: 'PENDIENTE',
    confianza: 'ALTA',
    area: 'Ventas',
    resumen: 'Implementación de un sistema automatizado de seguimiento de presupuestos mediante CRM para evitar la fuga de ventas por falta de insistencia.',
    resultado_esperado: 'Aumento esperado del 12% en la tasa de conversión de presupuestos a facturas.',
    kpi_objetivo: 'Tasa de Conversión de Presupuestos',
    kpi_antes: '22%',
    kpi_despues: '34%',
    medicion: [
        'Dashboard de CRM con embudo de ventas',
        'Reporte mensual de presupuestos vs facturas',
        'Tracking automático de aperturas de email'
    ],
    roi_eur_anual: 25000,
    esfuerzo_horas: 35,
    payback_meses: 2,
    alcance: {
        incluye: [
            'Configuración técnica del módulo de seguimientos en CRM',
            'Definición estratégica de 3 flujos de contacto automáticos',
            'Personalización de 5 plantillas de correo persuasivas',
            'Dashboard de control para la dirección comercial'
        ],
        no_incluye: [
            'Limpieza de base de datos histórica',
            'Suscripciones a herramientas de terceros (Zapier/CRM)',
            'Soporte técnico post-implantación (>30 días)'
        ],
        requisitos: [
            'Acceso con permisos de administrador al CRM actual',
            'Definición de owner del proyecto por parte del cliente',
            'Disponibilidad de 2h/semana del responsable de ventas'
        ],
        estimacion: {
            duracion: '3-5 semanas',
            complejidad: 'MEDIA',
            dependencias: 'Validación de accesos CRM y API'
        }
    },
    datos_necesarios: [
        { item: 'Exportación de presupuestos 2023', estado: 'RECIBIDO', dataroom_file_id: 'DR-882' },
        { item: 'Acceso admin al CRM', estado: 'FALTANTE' },
        { item: 'Listado de comerciales y emails', estado: 'RECIBIDO', dataroom_file_id: 'DR-901' }
    ],
    supuestos: [
        { supuesto: 'El CRM actual permite integraciones vía Zapier/Make', impacto: 'ALTO', confianza: 'ALTA' },
        { supuesto: 'Los comerciales usarán la herramienta diariamente', impacto: 'MEDIO', confianza: 'MEDIA' }
    ],
    riesgos: [
        { riesgo: 'Spam filters bloqueen emails automáticos', mitigacion: 'Configurar DKIM/SPF correctamente.' },
        { riesgo: 'Falta de datos en campos obligatorios', mitigacion: 'Limpieza previa de la base de datos.' }
    ],
    evidencia: [
        { id: 'ev1', nombre: 'captura_crm_actual.png', source: 'comment', author: 'Juan García' },
        { id: 'ev2', nombre: 'proyeccion_roi_v2.xlsx', source: 'dataroom', link: '#' }
    ],
    last_updated: '2024-01-15'
}

export default function DiagnosticoFichaIniciativa() {
    const { id: diagnosticoId, iniciativaId } = useParams()
    const { isConsultor, isCliente } = useAuth()
    const navigate = useNavigate()

    const [data, setData] = useState(MOCK_DETAIL)
    const [comments, setComments] = useState([
        { id: 1, author: 'Sonia (Consultora)', text: 'He revisado el ROI con los datos de diciembre y sale incluso algo más alto.', date: '2 días', avatar: 'S' }
    ])
    const [isEditing, setIsEditing] = useState(false)
    const [isDiscrepoOpen, setIsDiscrepoOpen] = useState(false)
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
    const [selectedDataItem, setSelectedDataItem] = useState(null)
    const [discrepancyReason, setDiscrepancyReason] = useState('')
    const [discrepancyType, setDiscrepancyType] = useState('ROI')
    const [notification, setNotification] = useState(null)

    // Mock de archivos en Data Room
    const MOCK_DATA_ROOM = [
        { id: 1, name: "Balance_General_2023.pdf", folder: "Finanzas" },
        { id: 2, name: "Listado_Precios_Vigente.xlsx", folder: "Comercial" },
        { id: 3, name: "Organigrama_Sistemas.png", folder: "RRHH" },
        { id: 4, name: "Contrato_Proveedor_Logistica.pdf", folder: "Legal" },
    ]

    const handleLinkFile = (file) => {
        // Actualizar el item en el estado local de la iniciativa
        const updatedDatos = data.datos_necesarios.map(d => 
            d.item === selectedDataItem.item ? { ...d, link: file.name, estado: 'RECIBIDO' } : d
        )
        setData({ ...data, datos_necesarios: updatedDatos })
        setIsLinkModalOpen(false)
        addSystemComment(`Se ha vinculado el archivo "${file.name}" del Data Room a "${selectedDataItem.item}"`, 'Sistema')
        showNotify('Archivo vinculado correctamente')
    }

    const showNotify = (msg) => {
        setNotification(msg)
        setTimeout(() => setNotification(null), 3000)
    }

    const handleSave = () => {
        setIsEditing(false)
        showNotify('Cambios guardados correctamente')
    }

    const addSystemComment = (text, author = 'Sistema') => {
        setComments(prev => [...prev, {
            id: Date.now(),
            author,
            text,
            date: 'Ahora mismo',
            avatar: author === 'Sistema' ? '🤖' : '👤'
        }])
    }

    const handleApprove = () => {
        setData({ ...data, estado_cliente: 'APROBADA' })
        addSystemComment(`La iniciativa ha sido APROBADA por el cliente.`, 'Cliente')
        showNotify('Iniciativa aprobada')
    }

    const handleDiscrepo = () => {
        setData({ ...data, estado_cliente: 'EN_REVISION' })
        addSystemComment(`DISCREPANCIA elevada (${discrepancyType}): ${discrepancyReason}`, 'Cliente')
        setIsDiscrepoOpen(false)
        showNotify('Iniciativa enviada a revisión')
    }

    const toggleVisibility = () => {
        setData({ ...data, estado_visibilidad: data.estado_visibilidad === 'BORRADOR' ? 'PUBLICADA' : 'BORRADOR' })
        showNotify(data.estado_visibilidad === 'BORRADOR' ? 'Iniciativa publicada' : 'Iniciativa ocultada')
    }

    if (isCliente && data.estado_visibilidad === 'BORRADOR') {
        return (
            <div className="error-state">
                <h2>No disponible</h2>
                <p>Esta iniciativa aún no ha sido publicada por el equipo de consultoría.</p>
                <button className="btn btn--primary" onClick={() => navigate(-1)}>Volver</button>
            </div>
        )
    }

    return (
        <div className="ficha-page">
            <div className="ficha-header">
                <div className="header-top">
                    <nav className="breadcrumb">
                        <Link to={`/${isConsultor ? 'consultor/proyecto' : 'cliente/diagnostico'}/${diagnosticoId}/${isConsultor ? 'iniciativas' : 'resultados/iniciativas'}`}>
                            {isConsultor ? 'Iniciativas' : 'Resultados'}
                        </Link>
                        <FiChevronRight size={12} />
                        <span>Ficha #{data.orden}</span>
                    </nav>
                </div>

                <div className="header-main">
                    <div className="header-info">
                        <div className="title-group">
                            <span className="rank-badge">#{data.orden}</span>
                            <h1 className="ficha-title">{data.titulo}</h1>
                        </div>
                        <div className="badges-group">
                            <span className={`badge ${data.estado_cliente === 'APROBADA' ? 'badge--success' : data.estado_cliente === 'EN_REVISION' ? 'badge--warning' : 'badge--info'}`}>
                                {data.estado_cliente}
                            </span>
                            <span className={`badge-pill badge-pill--${data.confianza.toLowerCase()}`}>
                                Confianza {data.confianza}
                            </span>
                            <span className="badge-pill badge-pill--gray">{data.area}</span>
                        </div>
                    </div>

                    <div className="header-actions">
                        {isConsultor ? (
                            <>
                                <button className={`btn ${data.estado_visibilidad === 'PUBLICADA' ? 'btn--outline' : 'btn--primary'}`} onClick={toggleVisibility}>
                                    {data.estado_visibilidad === 'PUBLICADA' ? <><FiEyeOff /> Ocultar</> : <><FiEye /> Publicar (Voz Cliente)</>}
                                </button>
                                {isEditing ? (
                                    <button className="btn btn--success" onClick={handleSave}><FiSave /> Guardar</button>
                                ) : (
                                    <button className="btn btn--white" onClick={() => setIsEditing(true)}><FiEdit2 /> Editar Ficha</button>
                                )}
                            </>
                        ) : (
                            <>
                                {data.estado_cliente !== 'APROBADA' ? (
                                    <>
                                        <button className="btn btn--outline" onClick={() => setIsDiscrepoOpen(true)}>Discrepo</button>
                                        <button className="btn btn--success" onClick={handleApprove}>Aprobar iniciativa</button>
                                    </>
                                ) : (
                                    <button className="btn btn--success btn-pulse" onClick={() => showNotify('Solicitud enviada')}>
                                        Solicitar propuesta de implantación
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="header-metrics">
                    <div className="h-metric">
                        <span className="h-metric__label">ROI Estimado</span>
                        <span className="h-metric__value">€{data.roi_eur_anual.toLocaleString()}/año</span>
                    </div>
                    <div className="h-metric">
                        <span className="h-metric__label">Esfuerzo</span>
                        <span className="h-metric__value">{data.esfuerzo_horas} h</span>
                    </div>
                    <div className="h-metric">
                        <span className="h-metric__label">Payback</span>
                        <span className="h-metric__value">{data.payback_meses} meses</span>
                    </div>
                </div>
            </div>

            <div className="ficha-grid">
                <div className="ficha-main">
                    <section className="f-section">
                        <h2 className="f-section__title">Resumen Ejecutivo</h2>
                        <div className="card">
                            <div className="card-body f-resumen">
                                <div className="resumen-item">
                                    <label>¿Qué es?</label>
                                    {isEditing ? <textarea className="form-input" defaultValue={data.resumen} /> : <p>{data.resumen}</p>}
                                </div>
                                <div className="resumen-grid-2">
                                    <div className="resumen-item">
                                        <label>Resultado esperado</label>
                                        {isEditing ? <input className="form-input" defaultValue={data.resultado_esperado} /> : <p>{data.resultado_esperado}</p>}
                                    </div>
                                    <div className="resumen-item">
                                        <label>Última actualización</label>
                                        <p className="text-muted">{data.last_updated}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="f-section">
                        <h2 className="f-section__title">Impacto y Medición</h2>
                        <div className="card">
                            <div className="card-body f-impacto">
                                <div className="kpi-box">
                                    <div className="kpi-info">
                                        <label>KPI Objetivo</label>
                                        <h3>{data.kpi_objetivo}</h3>
                                    </div>
                                    <div className="kpi-values">
                                        <div className="kpi-v">
                                            <span>Antes</span>
                                            <strong>{data.kpi_antes}</strong>
                                        </div>
                                        <div className="kpi-v kpi-v--target">
                                            <span>Objetivo</span>
                                            <strong>{data.kpi_despues}</strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="medicion-list">
                                    <label>¿Cómo se mide?</label>
                                    <ul>
                                        {data.medicion.map((m, i) => <li key={i}>{m}</li>)}
                                        {isEditing && <button className="btn-add-item"><FiPlus /> Añadir métrica</button>}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="f-section">
                        <div className="section-header-flex">
                            <h2 className="f-section__title">Alcance (Implantación)</h2>
                            <span className="section-subtitle">Resumen de alto nivel para entender qué se construirá (sin detalle operativo).</span>
                        </div>
                        
                        <div className="alcance-grid">
                            <div className="card">
                                <div className="card-body">
                                    <label className="label-caps">Qué incluye</label>
                                    <ul className="bullet-list">
                                        {data.alcance.incluye.map((item, i) => (
                                            <li key={i}>
                                                {isEditing ? (
                                                    <div className="edit-list-item">
                                                        <input 
                                                            className="form-input" 
                                                            value={item} 
                                                            onChange={(e) => {
                                                                const newIncluye = [...data.alcance.incluye]
                                                                newIncluye[i] = e.target.value
                                                                setData({...data, alcance: {...data.alcance, incluye: newIncluye}})
                                                            }}
                                                        />
                                                        <button className="btn-icon-xs" onClick={() => {
                                                            const newIncluye = data.alcance.incluye.filter((_, idx) => idx !== i)
                                                            setData({...data, alcance: {...data.alcance, incluye: newIncluye}})
                                                        }}><FiX /></button>
                                                    </div>
                                                ) : item}
                                            </li>
                                        ))}
                                        {isEditing && (
                                            <button className="btn btn--ghost btn--xs" onClick={() => {
                                                setData({...data, alcance: {...data.alcance, incluye: [...data.alcance.incluye, 'Nuevo item']}})
                                            }}><FiPlus /> Añadir</button>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <label className="label-caps">Qué NO incluye</label>
                                    <ul className="bullet-list bullet-list--negative">
                                        {data.alcance.no_incluye.map((item, i) => (
                                            <li key={i}>
                                                {isEditing ? (
                                                    <div className="edit-list-item">
                                                        <input 
                                                            className="form-input" 
                                                            value={item} 
                                                            onChange={(e) => {
                                                                const newNoIncluye = [...data.alcance.no_incluye]
                                                                newNoIncluye[i] = e.target.value
                                                                setData({...data, alcance: {...data.alcance, no_incluye: newNoIncluye}})
                                                            }}
                                                        />
                                                        <button className="btn-icon-xs" onClick={() => {
                                                            const newNoIncluye = data.alcance.no_incluye.filter((_, idx) => idx !== i)
                                                            setData({...data, alcance: {...data.alcance, no_incluye: newNoIncluye}})
                                                        }}><FiX /></button>
                                                    </div>
                                                ) : item}
                                            </li>
                                        ))}
                                        {isEditing && (
                                            <button className="btn btn--ghost btn--xs" onClick={() => {
                                                setData({...data, alcance: {...data.alcance, no_incluye: [...data.alcance.no_incluye, 'Nuevo item']}})
                                            }}><FiPlus /> Añadir</button>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="card mt-4">
                            <div className="card-body">
                                <label className="label-caps">Requisitos del Cliente</label>
                                <div className="requisitos-grid">
                                    <ul className="bullet-list">
                                        {data.alcance.requisitos.map((item, i) => (
                                            <li key={i}>
                                                {isEditing ? (
                                                    <div className="edit-list-item">
                                                        <input 
                                                            className="form-input" 
                                                            value={item} 
                                                            onChange={(e) => {
                                                                const newReq = [...data.alcance.requisitos]
                                                                newReq[i] = e.target.value
                                                                setData({...data, alcance: {...data.alcance, requisitos: newReq}})
                                                            }}
                                                        />
                                                        <button className="btn-icon-xs" onClick={() => {
                                                            const newReq = data.alcance.requisitos.filter((_, idx) => idx !== i)
                                                            setData({...data, alcance: {...data.alcance, requisitos: newReq}})
                                                        }}><FiX /></button>
                                                    </div>
                                                ) : item}
                                            </li>
                                        ))}
                                        {isEditing && (
                                            <button className="btn btn--ghost btn--xs" onClick={() => {
                                                setData({...data, alcance: {...data.alcance, requisitos: [...data.alcance.requisitos, 'Nuevo requisito']}})
                                            }}><FiPlus /> Añadir</button>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="alcance-note">
                            <FiAlertTriangle />
                            <span>Este alcance es orientativo. La propuesta detallada se entrega tras la validación final del diagnóstico.</span>
                        </div>
                    </section>

                    <section className="f-section">
                        <h2 className="f-section__title">Estimación de Implantación</h2>
                        <div className="card">
                            <div className="card-body estimation-summary">
                                <div className="est-item">
                                    <label>Duración estimada</label>
                                    {isEditing ? (
                                        <input 
                                            className="form-input" 
                                            value={data.alcance.estimacion.duracion} 
                                            onChange={(e) => setData({...data, alcance: {...data.alcance, estimacion: {...data.alcance.estimacion, duracion: e.target.value}}})}
                                        />
                                    ) : (
                                        <p><strong>{data.alcance.estimacion.duracion}</strong></p>
                                    )}
                                </div>
                                <div className="est-item">
                                    <label>Complejidad</label>
                                    {isEditing ? (
                                        <select 
                                            className="form-input"
                                            value={data.alcance.estimacion.complejidad}
                                            onChange={(e) => setData({...data, alcance: {...data.alcance, estimacion: {...data.alcance.estimacion, complejidad: e.target.value}}})}
                                        >
                                            <option value="BAJA">BAJA</option>
                                            <option value="MEDIA">MEDIA</option>
                                            <option value="ALTA">ALTA</option>
                                        </select>
                                    ) : (
                                        <span className={`badge-pill badge-pill--${data.alcance.estimacion.complejidad.toLowerCase() === 'media' ? 'info' : data.alcance.estimacion.complejidad.toLowerCase() === 'baja' ? 'success' : 'warning'}`}>
                                            {data.alcance.estimacion.complejidad}
                                        </span>
                                    )}
                                </div>
                                <div className="est-item">
                                    <label>Dependencias clave</label>
                                    {isEditing ? (
                                        <textarea 
                                            className="form-input"
                                            value={data.alcance.estimacion.dependencias}
                                            onChange={(e) => setData({...data, alcance: {...data.alcance, estimacion: {...data.alcance.estimacion, dependencias: e.target.value}}})}
                                        />
                                    ) : (
                                        <p>{data.alcance.estimacion.dependencias}</p>
                                    )}
                                </div>
                            </div>
                            <div className="card-footer-note">
                                <p className="text-muted text-xs">La propuesta final puede variar según validación de datos.</p>
                            </div>
                        </div>
                    </section>

                    <section className="f-section">
                        <h2 className="f-section__title">Datos Necesarios</h2>
                        <div className="card">
                            <div className="card-body p-0">
                                <table className="f-table">
                                    <thead>
                                        <tr>
                                            <th>Item / Documento</th>
                                            <th>Estado</th>
                                            <th>Archivo</th>
                                            {isConsultor && <th>Acción</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.datos_necesarios.map((d, i) => (
                                            <tr key={i}>
                                                <td>
                                                    {isEditing ? (
                                                        <input 
                                                            type="text" 
                                                            className="table-input"
                                                            value={d.item}
                                                            onChange={(e) => {
                                                                const newDatos = [...data.datos_necesarios]
                                                                newDatos[i].item = e.target.value
                                                                setData({...data, datos_necesarios: newDatos})
                                                            }}
                                                        />
                                                    ) : d.item}
                                                </td>
                                                <td>
                                                    <span className={`badge-dot ${d.estado === 'RECIBIDO' ? 'badge-dot--success' : 'badge-dot--warning'}`}>
                                                        {d.estado}
                                                    </span>
                                                </td>
                                                <td>
                                                    {d.link ? (
                                                        <Link to="#" className="file-link"><FiDatabase /> {d.link}</Link>
                                                    ) : d.dataroom_file_id ? (
                                                        <Link to="#" className="file-link"><FiDatabase /> {d.dataroom_file_id}</Link>
                                                    ) : '-'}
                                                </td>
                                                {isConsultor && (
                                                    <td>
                                                        <div className="table-actions">
                                                            <button 
                                                                className="btn btn--ghost btn--xs"
                                                                onClick={() => {
                                                                    setSelectedDataItem(d)
                                                                    setIsLinkModalOpen(true)
                                                                }}
                                                            >
                                                                Vincular
                                                            </button>
                                                            {isEditing && (
                                                                <button 
                                                                    className="btn btn--ghost btn--xs text-danger"
                                                                    onClick={() => {
                                                                        const newDatos = data.datos_necesarios.filter((_, idx) => idx !== i)
                                                                        setData({...data, datos_necesarios: newDatos})
                                                                    }}
                                                                >
                                                                    <FiTrash2 />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {isEditing && (
                                    <div style={{padding: 'var(--space-2)'}}>
                                        <button 
                                            className="btn btn--ghost btn--full btn--xs"
                                            onClick={() => {
                                                const newItem = { item: 'Nuevo requerimiento', estado: 'FALTANTE' }
                                                setData({ ...data, datos_necesarios: [...data.datos_necesarios, newItem] })
                                            }}
                                        >
                                            <FiPlus /> Añadir requerimiento
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <div className="f-grid-2">
                        <section className="f-section">
                            <h2 className="f-section__title">Supuestos</h2>
                            <div className="card">
                                <div className="card-body f-supuestos">
                                    {data.supuestos.map((s, i) => (
                                        <div key={i} className="supuesto-item">
                                            <p className="s-text">{s.supuesto}</p>
                                            <div className="s-badges">
                                                <span className="text-xs">Impacto: <strong>{s.impacto}</strong></span>
                                                <span className="text-xs">Confianza: <strong>{s.confianza}</strong></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                        <section className="f-section">
                            <h2 className="f-section__title">Riesgos</h2>
                            <div className="card">
                                <div className="card-body f-riesgos">
                                    {data.riesgos.map((r, i) => (
                                        <div key={i} className="riesgo-item">
                                            <p className="r-text"> {r.riesgo}</p>
                                            <p className="r-mitigacion">Mitigación: {r.mitigacion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    <section className="f-section">
                        <h2 className="f-section__title">Conversación y Evidencias</h2>
                        <div className="card">
                            <div className="card-body">
                                <CommentsSection 
                                    comments={comments} 
                                    onAddComment={(c) => setComments(prev => [...prev, c])}
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="ficha-sidebar">
                    <div className="sticky-sidebar">
                        <div className="side-card side-card--primary">
                            <label>Retorno de Inversión</label>
                            <div className="side-metric">
                                <FiTrendingUp />
                                <div>
                                    <h3>€{data.roi_eur_anual.toLocaleString()} <small>/ año</small></h3>
                                    <p>€{(data.roi_eur_anual / 12).toFixed(0).toLocaleString()} / mes</p>
                                </div>
                            </div>
                        </div>

                        <div className="side-card">
                            <div className="side-grid">
                                <div>
                                    <label>Esfuerzo</label>
                                    <div className="mini-val"><FiClock /> {data.esfuerzo_horas}h</div>
                                </div>
                                <div>
                                    <label>Payback</label>
                                    <div className="mini-val"><FiActivity /> {data.payback_meses}m</div>
                                </div>
                            </div>
                        </div>

                        <div className="side-card">
                            <label>Estado Aprobación</label>
                            <div className="approval-status">
                                <span className={`badge-pill badge-pill--${data.estado_cliente === 'APROBADA' ? 'success' : 'warning'}`}>{data.estado_cliente}</span>
                            </div>
                        </div>

                        <div className="side-actions">
                            {isCliente && (
                                <>
                                    {data.estado_cliente !== 'APROBADA' ? (
                                        <>
                                            <button className="btn btn--primary btn--full" onClick={handleApprove}>
                                                Aprobar iniciativa
                                            </button>
                                            <button className="btn btn--outline btn--full mt-2" onClick={() => setIsDiscrepoOpen(true)}>
                                                Discrepo / Revisar
                                            </button>
                                        </>
                                    ) : (
                                        <button className="btn btn--success btn--full btn-pulse" onClick={() => showNotify('Solicitud enviada al equipo de consultoría')}>
                                            Solicitar propuesta de implantación
                                        </button>
                                    )}
                                </>
                            )}
                            {isConsultor && (
                                <button className="btn btn--primary btn--full" onClick={handleSave}>
                                    Publicar actualizaciones
                                </button>
                            )}
                        </div>

                        <div className="side-updates">
                            <p><FiCheck /> Supuestos verificados</p>
                            <p><FiCheck /> ROI calculado con datos reales</p>
                            <p className="text-warning"><FiAlertTriangle /> Revisar paso #3 con el cliente</p>
                        </div>
                    </div>
                </div>
            </div>

            {isDiscrepoOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Indicar discrepancia</h3>
                            <button className="btn-close" onClick={() => setIsDiscrepoOpen(false)}><FiX /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>¿Cuál es el motivo?</label>
                                <select className="form-input" value={discrepancyType} onChange={(e) => setDiscrepancyType(e.target.value)}>
                                    <option value="ROI">Cálculo de ROI</option>
                                    <option value="ESFUERZO">Esfuerzo estimado</option>
                                    <option value="PLAN">Plan de pasos</option>
                                    <option value="SUPUESTOS">Supuestos de partida</option>
                                    <option value="OTROS">Otros</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Explica el motivo</label>
                                <textarea 
                                    className="form-input" 
                                    rows="4" 
                                    placeholder="Detalla qué no encaja o qué información falta..."
                                    value={discrepancyReason}
                                    onChange={(e) => setDiscrepancyReason(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="file-upload">
                                <button className="btn btn--white btn--sm"><FiPaperclip /> Adjuntar evidencia</button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn--white" onClick={() => setIsDiscrepoOpen(false)}>Cancelar</button>
                            <button className="btn btn--warning" onClick={handleDiscrepo}>Enviar a revisión</button>
                        </div>
                    </div>
                </div>
            )}

            {isLinkModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Vincular con Data Room</h3>
                            <button className="btn-close" onClick={() => setIsLinkModalOpen(false)}><FiX /></button>
                        </div>
                        <div className="modal-body">
                            <p style={{marginBottom: '16px', fontSize: '14px'}}>
                                Selecciona el archivo para: <strong>{selectedDataItem?.item}</strong>
                            </p>
                            <div className="dr-selector-list" style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                                {MOCK_DATA_ROOM.map(file => (
                                    <div key={file.id} style={{
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        padding: '12px',
                                        border: '1px solid var(--gray-100)',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'var(--gray-50)'
                                    }}>
                                        <div>
                                            <div style={{fontWeight: 600, fontSize: '14px'}}>{file.name}</div>
                                            <div style={{fontSize: '12px', color: 'var(--text-muted)'}}>{file.folder}</div>
                                        </div>
                                        <button 
                                            className="btn btn--primary btn--xs"
                                            onClick={() => handleLinkFile(file)}
                                        >
                                            Seleccionar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn--white" onClick={() => setIsLinkModalOpen(false)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            {notification && (
                <div className="toast-notification">
                    <FiCheck /> {notification}
                </div>
            )}

            <style>{`
                .ficha-page {
                    padding: var(--space-6);
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .ficha-header {
                    margin-bottom: var(--space-8);
                }

                .breadcrumb {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                    margin-bottom: var(--space-4);
                }

                .breadcrumb a { color: inherit; text-decoration: none; }
                .breadcrumb a:hover { color: var(--violet-600); }

                .header-main {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: var(--space-6);
                }

                .title-group {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                    margin-bottom: var(--space-2);
                }

                .ficha-title {
                    margin: 0;
                    font-size: var(--text-3xl);
                    font-weight: 800;
                    color: var(--text-main);
                }

                .rank-badge {
                    background: var(--gradient-primary);
                    color: white;
                    padding: 4px 12px;
                    border-radius: var(--radius-full);
                    font-weight: var(--font-bold);
                }

                .badges-group {
                    display: flex;
                    gap: 8px;
                }

                .header-actions {
                    display: flex;
                    gap: 12px;
                }

                .header-metrics {
                    display: flex;
                    gap: var(--space-12);
                    padding: var(--space-4) 0;
                    border-top: 1px solid var(--gray-100);
                }

                .h-metric {
                    display: flex;
                    flex-direction: column;
                }

                .h-metric__label {
                    font-size: 10px;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .h-metric__value {
                    font-size: var(--text-xl);
                    font-weight: var(--font-bold);
                }

                .ficha-grid {
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    gap: var(--space-8);
                    align-items: start;
                }

                .f-section {
                    margin-bottom: var(--space-10);
                }

                .f-section__title {
                    font-size: var(--text-lg);
                    margin-bottom: var(--space-4);
                    font-weight: var(--font-bold);
                }

                .resumen-item label, .kpi-info label, .medicion-list label {
                    display: block;
                    font-size: var(--text-xs);
                    font-weight: var(--font-bold);
                    color: var(--text-muted);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                }

                .f-resumen p { margin: 0; line-height: 1.6; }
                .resumen-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-6);
                    margin-top: var(--space-6);
                    padding-top: var(--space-6);
                    border-top: 1px solid var(--gray-50);
                }

                .f-impacto {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-8);
                }

                .kpi-box {
                    background: var(--gray-50);
                    padding: var(--space-5);
                    border-radius: var(--radius-lg);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .kpi-info h3 { margin: 0; font-size: var(--text-xl); }

                .kpi-values {
                    display: flex;
                    gap: var(--space-8);
                    margin-top: var(--space-4);
                }

                .kpi-v span { display: block; font-size: 10px; color: var(--text-muted); }
                .kpi-v strong { font-size: var(--text-2xl); }
                .kpi-v--target strong { color: var(--violet-600); }

                .medicion-list ul {
                    margin: 0;
                    padding-left: var(--space-5);
                    color: var(--text-secondary);
                }

                .medicion-list li { margin-bottom: 8px; }

                .section-header-flex {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    margin-bottom: var(--space-4);
                }
                .section-subtitle {
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                }

                .label-caps {
                    display: block;
                    font-size: 10px;
                    font-weight: var(--font-bold);
                    color: var(--text-muted);
                    text-transform: uppercase;
                    margin-bottom: var(--space-3);
                    letter-spacing: 0.05em;
                }

                .alcance-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-4);
                }

                .bullet-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .bullet-list li {
                    position: relative;
                    padding-left: 20px;
                    margin-bottom: 8px;
                    font-size: var(--text-sm);
                    color: var(--text-secondary);
                }
                .bullet-list li::before {
                    content: "•";
                    position: absolute;
                    left: 0;
                    color: var(--violet-500);
                    font-weight: bold;
                }
                .bullet-list--negative li::before {
                    color: var(--danger-400);
                }

                .alcance-note {
                    margin-top: var(--space-4);
                    padding: var(--space-3) var(--space-4);
                    background: var(--violet-50);
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: var(--text-xs);
                    color: var(--violet-700);
                    border: 1px solid var(--violet-100);
                }

                .estimation-summary {
                    display: grid;
                    grid-template-columns: 1fr 1fr 2fr;
                    gap: var(--space-6);
                }
                .est-item label {
                    display: block;
                    font-size: 10px;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    margin-bottom: 4px;
                }
                .est-item p { margin: 0; font-size: var(--text-sm); }

                .card-footer-note {
                    padding: var(--space-3) var(--space-6);
                    background: var(--gray-50);
                    border-top: 1px solid var(--gray-100);
                }

                .edit-list-item {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }
                .btn-icon-xs {
                    background: none; border: none; color: var(--danger-400); cursor: pointer;
                }

                .btn-pulse {
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
                }

                .f-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: var(--text-sm);
                }
                .f-table th {
                    text-align: left;
                    padding: 12px 16px;
                    background: var(--gray-50);
                    color: var(--text-muted);
                    font-weight: var(--font-semibold);
                    text-transform: uppercase;
                    font-size: 10px;
                }
                .f-table td {
                    padding: 12px 16px;
                    border-top: 1px solid var(--gray-100);
                }

                .f-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-6);
                }

                .supuesto-item, .riesgo-item {
                    padding: 12px;
                    border-bottom: 1px solid var(--gray-50);
                }
                .supuesto-item:last-child, .riesgo-item:last-child { border: none; }
                .s-text, .r-text { margin: 0 0 4px; font-size: var(--text-sm); }
                .s-badges { display: flex; gap: 12px; color: var(--text-muted); }
                .r-mitigacion { font-size: var(--text-xs); color: var(--text-muted); margin: 0; }

                .sticky-sidebar {
                    position: sticky;
                    top: var(--space-6);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-4);
                }

                .side-card {
                    background: white;
                    padding: var(--space-5);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--gray-200);
                    box-shadow: var(--shadow-sm);
                }

                .side-card--primary {
                    background: var(--gradient-primary);
                    color: white;
                    border: none;
                }

                .side-card label {
                    display: block;
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 12px;
                    opacity: 0.8;
                }

                .side-metric {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }
                .side-metric svg { font-size: 32px; }
                .side-metric h3 { margin: 0; font-size: var(--text-2xl); }
                .side-metric p { margin: 4px 0 0; font-size: var(--text-xs); opacity: 0.9; }

                .side-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-4);
                }
                .mini-val {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: var(--font-bold);
                }

                .table-input {
                    width: 100%;
                    border: 1px solid var(--gray-200);
                    border-radius: var(--radius-sm);
                    padding: 4px 8px;
                    font-size: var(--text-sm);
                    background: white;
                }

                .table-actions {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }

                .side-updates {
                    padding: var(--space-2);
                }
                .side-updates p {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: var(--text-xs);
                    color: var(--text-muted);
                    margin-bottom: 8px;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1100;
                }
                .modal {
                    background: white;
                    width: 500px;
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                    box-shadow: var(--shadow-2xl);
                }
                .modal-header {
                    padding: var(--space-5);
                    border-bottom: 1px solid var(--gray-100);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-body { padding: var(--space-6); }
                .modal-footer {
                    padding: var(--space-5);
                    background: var(--gray-50);
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }
                .form-group { margin-bottom: var(--space-4); }
                .form-group label { display: block; margin-bottom: 8px; font-size: var(--text-sm); font-weight: var(--font-medium); }

                .error-state {
                    height: 400px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }

                .toast-notification {
                    position: fixed;
                    bottom: 24px; right: 24px;
                    background: var(--text-main);
                    color: white;
                    padding: 12px 24px;
                    border-radius: var(--radius-md);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: var(--shadow-lg);
                    animation: slideUp 0.3s ease-out;
                    z-index: 2000;
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .btn-remove-step {
                    position: absolute;
                    top: 8px; right: 8px;
                    background: none; border: none;
                    color: var(--danger-400);
                    cursor: pointer;
                    display: none;
                }
                .plan-step:hover .btn-remove-step { display: block; }
            `}</style>
        </div>
    )
}
