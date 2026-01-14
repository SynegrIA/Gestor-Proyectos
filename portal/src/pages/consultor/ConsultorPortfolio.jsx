import { Link } from 'react-router-dom'
import { 
    FiAlertTriangle, FiClock, FiArrowRight, FiFilter, FiPlus, 
    FiBriefcase, FiCodesandbox, FiMonitor, FiCloud, FiChevronDown, FiChevronUp, FiSearch, FiCalendar
} from 'react-icons/fi'
import React, { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'

// Tipos de productos (Categorías principales)
const TIPOS_PRODUCTO = {
    consultoria: { nombre: 'Consultoría', icon: <FiBriefcase />, color: 'var(--primary-500)', descripcion: 'Diagnósticos y asesoría estratégica' },
    desarrollo: { nombre: 'Desarrollo a Medida', icon: <FiCodesandbox />, color: 'var(--success-500)', descripcion: 'Software y soluciones personalizadas' },
    formacion: { nombre: 'Formación', icon: <FiMonitor />, color: 'var(--warning-500)', descripcion: 'Cursos y capacitación de equipos' },
    saas: { nombre: 'SaaS', icon: <FiCloud />, color: 'var(--info-500)', descripcion: 'Productos de suscripción' }
}

const FLAGS = {
    BLOQUEADO: { label: 'Bloqueado', color: 'var(--danger-500)', icon: <FiAlertTriangle /> },
    RIESGO: { label: 'Riesgo', color: 'var(--warning-500)', icon: <FiClock /> },
    PENDIENTE_CLIENTE: { label: 'Pendiente Cliente', color: 'var(--info-500)', icon: <FiClock /> },
    SIN_FLAG: { label: 'Sin Flag', color: 'var(--gray-400)', icon: null }
}

const INITIAL_PROYECTOS = [
    { id: 1, cliente: 'ACME Corp', proyecto: 'Diagnóstico Eficiencia Q1', tipo: 'consultoria', fase: 'Análisis de datos', estado: 'PAUSADO', flag: 'BLOQUEADO', proximo_hito: '2026-01-20', assigned_consultant_id: 2 },
    { id: 2, cliente: 'ACME Corp', proyecto: 'Agente Ventas IA', tipo: 'desarrollo', fase: 'Desarrollo', estado: 'EN_PROGRESO', flag: 'SIN_FLAG', proximo_hito: '2026-01-25', assigned_consultant_id: 2 },
    { id: 3, cliente: 'Tech Solutions', proyecto: 'Implementación CRM', tipo: 'consultoria', fase: 'Diseño', estado: 'EN_PROGRESO', flag: 'RIESGO', proximo_hito: '2026-01-15', assigned_consultant_id: 2 },
    { id: 4, cliente: 'Tech Solutions', proyecto: 'Workshop IA Generativa', tipo: 'formacion', fase: 'Agendado', estado: 'PENDIENTE', flag: 'PENDIENTE_CLIENTE', proximo_hito: '2026-02-01', assigned_consultant_id: 2 },
    { id: 5, cliente: 'Retail Plus', proyecto: 'App Logística', tipo: 'desarrollo', fase: 'Testing', estado: 'REVISION', flag: 'SIN_FLAG', proximo_hito: '2026-01-18', assigned_consultant_id: 2 },
    { id: 6, cliente: 'Industria X', proyecto: 'Diagnóstico Inicial', tipo: 'consultoria', fase: 'Completo', estado: 'ENTREGADO', flag: 'SIN_FLAG', proximo_hito: '2025-12-20', assigned_consultant_id: 2 },
    { id: 7, cliente: 'Industria X', proyecto: 'Licencia Synergia Flow', tipo: 'saas', fase: 'Activo', estado: 'EN_PROGRESO', flag: 'SIN_FLAG', proximo_hito: '2026-06-01', assigned_consultant_id: 2 },
    { id: 8, cliente: 'Logística MX', proyecto: 'Dashboard Operativo', tipo: 'saas', fase: 'Setup', estado: 'EN_PROGRESO', flag: 'BLOQUEADO', proximo_hito: '2026-01-14', assigned_consultant_id: 2 },
    { id: 9, cliente: 'Otro Consultor Client', proyecto: 'Proyecto Ajeno', tipo: 'consultoria', fase: 'Entrevistas', estado: 'EN_PROGRESO', flag: 'SIN_FLAG', proximo_hito: '2026-01-30', assigned_consultant_id: 99 },
]

const ALERTAS = [
    { tipo: 'danger', texto: 'ACME Corp - Diagnóstico bloqueado: Faltan datos', producto: 'consultoria' },
    { tipo: 'warning', texto: 'Tech Solutions - Confirmar fecha Workshop', producto: 'formacion' },
    { tipo: 'info', texto: 'Retail Plus - Revisión App Logística pendiente', producto: 'desarrollo' },
]

const getEstadoBadge = (estado) => {
    const map = {
        'EN_PROGRESO': { class: 'badge--primary', label: 'En Progreso' },
        'PAUSADO': { class: 'badge--danger', label: 'Pausado' },
        'REVISION': { class: 'badge--warning', label: 'Revisión' },
        'ENTREGADO': { class: 'badge--success', label: 'Entregado' },
        'PENDIENTE': { class: 'badge--neutral', label: 'Pendiente' },
    }
    return map[estado] || { class: 'badge--neutral', label: estado }
}

export default function ConsultorPortfolio() {
    const { user } = useAuth()
    const [proyectos, setProyectos] = useState(INITIAL_PROYECTOS)
    
    // Filtros
    const [search, setSearch] = useState('')
    const [filterEstado, setFilterEstado] = useState('todos')
    const [filterLinea, setFilterLinea] = useState('todos')
    const [filterFlag, setFilterFlag] = useState('todos')
    
    // UI State
    const [alertsExpanded, setAlertsExpanded] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Expandir alertas si hay bloqueados al cargar
    React.useEffect(() => {
        const misBloqueados = proyectos.some(p => p.assigned_consultant_id === user?.id && p.flag === 'BLOQUEADO')
        if (misBloqueados) setAlertsExpanded(true)
    }, [user?.id, proyectos])
    const [newProject, setNewProject] = useState({
        cliente: '',
        proyecto: '',
        tipo: 'consultoria',
        estado: 'EN_PROGRESO',
        fase: 'Onboarding',
        proximo_hito: new Date().toISOString().split('T')[0]
    })

    // 1) Filtrado por consultor y filtros UI
    const proyectosFiltrados = useMemo(() => {
        return proyectos.filter(p => {
            const matchesConsultant = p.assigned_consultant_id === user?.id
            if (!matchesConsultant) return false

            const matchesSearch = p.cliente.toLowerCase().includes(search.toLowerCase()) || 
                                 p.proyecto.toLowerCase().includes(search.toLowerCase())
            const matchesEstado = filterEstado === 'todos' || p.estado === filterEstado
            const matchesLinea = filterLinea === 'todos' || p.tipo === filterLinea
            const matchesFlag = filterFlag === 'todos' || p.flag === filterFlag

            return matchesSearch && matchesEstado && matchesLinea && matchesFlag
        }).sort((a, b) => {
            // Ordenar por hito más cercano
            if (!a.proximo_hito) return 1
            if (!b.proximo_hito) return -1
            return new Date(a.proximo_hito) - new Date(b.proximo_hito)
        })
    }, [proyectos, user?.id, search, filterEstado, filterLinea, filterFlag])

    // 2) Alertas (Flags crítico/riesgo)
    const alertas = useMemo(() => {
        return proyectos
            .filter(p => p.assigned_consultant_id === user?.id && (p.flag === 'BLOQUEADO' || p.flag === 'RIESGO' || p.flag === 'PENDIENTE_CLIENTE'))
            .map(p => ({
                id: p.id,
                cliente: p.cliente,
                proyecto: p.proyecto,
                flag: p.flag,
                texto: p.flag === 'BLOQUEADO' ? 'Requiere acción inmediata' : 'Hito cercano a vencer',
                tipo: p.flag === 'BLOQUEADO' ? 'danger' : p.flag === 'RIESGO' ? 'warning' : 'info'
            }))
    }, [proyectos, user?.id])

    // KPIs
    const kpis = useMemo(() => {
        const misProyectos = proyectos.filter(p => p.assigned_consultant_id === user?.id)
        return {
            total: misProyectos.length,
            consultoria: misProyectos.filter(p => p.tipo === 'consultoria').length,
            desarrollo: misProyectos.filter(p => p.tipo === 'desarrollo').length,
            formacion: misProyectos.filter(p => p.tipo === 'formacion').length,
            saas: misProyectos.filter(p => p.tipo === 'saas').length,
            bloqueados: misProyectos.filter(p => p.flag === 'BLOQUEADO').length
        }
    }, [proyectos, user?.id])

    // Acciones
    const handleAddProject = (e) => {
        e.preventDefault()
        const id = proyectos.length + 1
        setProyectos([...proyectos, { ...newProject, id, assigned_consultant_id: user.id, flag: 'SIN_FLAG' }])
        setIsModalOpen(false)
        setNewProject({
            cliente: '',
            proyecto: '',
            tipo: 'consultoria',
            estado: 'EN_PROGRESO',
            fase: 'Onboarding',
            proximo_hito: new Date().toISOString().split('T')[0]
        })
    }

    const updateProjectFlag = (id, flag) => {
        setProyectos(prev => prev.map(p => p.id === id ? { ...p, flag } : p))
    }

    const updateProjectHito = (id, date) => {
        setProyectos(prev => prev.map(p => p.id === id ? { ...p, proximo_hito: date } : p))
    }

    const resolveFlag = (id) => {
        setProyectos(prev => prev.map(p => p.id === id ? { ...p, flag: 'SIN_FLAG' } : p))
    }

    return (
        <div className="portfolio-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Portfolio</h1>
                    <p className="page-subtitle">Tus proyectos activos</p>
                </div>
            </div>

            {/* SECCIÓN B: Flags/Alertas (Collapsible) */}
            <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 0, overflow: 'hidden' }}>
                <div 
                    className="card-header" 
                    style={{ 
                        cursor: 'pointer', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        background: alertas.length > 0 && kpis.bloqueados > 0 ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                        padding: 'var(--space-4)'
                    }}
                    onClick={() => setAlertsExpanded(!alertsExpanded)}
                >
                    <h3 className="card-title" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <FiAlertTriangle style={{ color: alertas.length > 0 ? 'var(--danger-500)' : 'var(--gray-400)' }} />
                        Alertas Activas ({alertas.length})
                    </h3>
                    {alertsExpanded ? <FiChevronUp /> : <FiChevronDown />}
                </div>
                
                {alertsExpanded && (
                    <div className="card-body" style={{ padding: 'var(--space-4)' }}>
                        {alertas.length === 0 ? (
                            <p className="text-sm text-muted">No hay alertas críticas en tus proyectos.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {alertas.slice(0, 5).map(alerta => (
                                    <div key={alerta.id} className={`alert alert--${alerta.tipo}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                            <span className="badge" style={{ backgroundColor: FLAGS[alerta.flag].color, color: 'white' }}>{FLAGS[alerta.flag].label}</span>
                                            <div>
                                                <strong>{alerta.cliente}</strong> - {alerta.proyecto}
                                                <div className="text-xs" style={{ opacity: 0.8 }}>{alerta.texto}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                            <button onClick={() => resolveFlag(alerta.id)} className="btn btn--ghost btn--sm">Marcar resuelta</button>
                                            <Link to={`/consultor/proyecto/${alerta.id}/operacion`} className="btn btn--primary btn--sm">Abrir</Link>
                                        </div>
                                    </div>
                                ))}
                                {alertas.length > 5 && (
                                    <button className="btn btn--link btn--sm" style={{ alignSelf: 'center' }}>Ver todas ({alertas.length})</button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* SECCIÓN C: KPIs superiores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center', borderTop: '4px solid var(--primary-500)' }}>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--primary-600)' }}>{kpis.total}</div>
                    <div className="text-xs text-muted font-bold uppercase">Proyectos Activos</div>
                </div>
                {Object.entries(TIPOS_PRODUCTO).map(([key, info]) => (
                    <div key={key} className="card" style={{ padding: 'var(--space-4)', textAlign: 'center', borderTop: `4px solid ${info.color}` }}>
                        <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>{kpis[key]}</div>
                        <div className="text-xs text-muted font-bold uppercase">{info.nombre}</div>
                    </div>
                ))}
                <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center', borderTop: '4px solid var(--danger-500)', background: kpis.bloqueados > 0 ? 'var(--danger-50)' : 'transparent' }}>
                    <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', color: 'var(--danger-600)' }}>{kpis.bloqueados}</div>
                    <div className="text-xs text-muted font-bold uppercase">Bloqueados</div>
                </div>
            </div>

            {/* SECCIÓN E: Filtros */}
            <div className="card" style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                        <input 
                            type="text" 
                            className="input" 
                            placeholder="Buscar cliente o proyecto..." 
                            style={{ paddingLeft: '40px', width: '100%' }}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select className="input" style={{ width: 'auto' }} value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
                        <option value="todos">Todos los estados</option>
                        <option value="EN_PROGRESO">En Progreso</option>
                        <option value="PAUSADO">Pausado</option>
                        <option value="REVISION">En Revisión</option>
                    </select>
                    <select className="input" style={{ width: 'auto' }} value={filterLinea} onChange={e => setFilterLinea(e.target.value)}>
                        <option value="todos">Todas las líneas</option>
                        {Object.entries(TIPOS_PRODUCTO).map(([key, info]) => (
                            <option key={key} value={key}>{info.nombre}</option>
                        ))}
                    </select>
                    <select className="input" style={{ width: 'auto' }} value={filterFlag} onChange={e => setFilterFlag(e.target.value)}>
                        <option value="todos">Todos los flags</option>
                        {Object.entries(FLAGS).map(([key, info]) => (
                            <option key={key} value={key}>{info.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* SECCIÓN D: Tabla */}
            <div className="card">
                <div className="card-header" style={{ justifyContent: 'space-between', display: 'flex' }}>
                    <h3 className="card-title">Todos los Proyectos</h3>
                    <button className="btn btn--primary" onClick={() => setIsModalOpen(true)}>
                        <FiPlus /> Nuevo proyecto
                    </button>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Proyecto</th>
                                    <th>Línea</th>
                                    <th>Fase/Detalle</th>
                                    <th>Estado</th>
                                    <th>Flag</th>
                                    <th>Próximo Hito</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proyectosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--gray-400)' }}>
                                            No tienes proyectos asignados ahora mismo.
                                        </td>
                                    </tr>
                                ) : (
                                    proyectosFiltrados.map(p => {
                                        const badge = getEstadoBadge(p.estado)
                                        const tipoInfo = TIPOS_PRODUCTO[p.tipo]
                                        return (
                                            <tr key={p.id}>
                                                <td><strong>{p.cliente}</strong></td>
                                                <td>{p.proyecto}</td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                        <span style={{ color: tipoInfo.color }}>{tipoInfo.icon}</span>
                                                        <span className="text-sm">{tipoInfo.nombre}</span>
                                                    </div>
                                                </td>
                                                <td><span className="text-sm">{p.fase}</span></td>
                                                <td><span className={`badge ${badge.class}`}>{badge.label}</span></td>
                                                <td>
                                                    <select 
                                                        value={p.flag} 
                                                        onChange={(e) => updateProjectFlag(p.id, e.target.value)}
                                                        style={{ 
                                                            border: 'none', 
                                                            background: 'transparent', 
                                                            fontSize: 'var(--text-xs)',
                                                            color: FLAGS[p.flag].color,
                                                            fontWeight: 'bold',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {Object.entries(FLAGS).map(([key, info]) => (
                                                            <option key={key} value={key} style={{ color: 'var(--gray-700)' }}>
                                                                {info.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    <input 
                                                        type="date" 
                                                        value={p.proximo_hito} 
                                                        onChange={(e) => updateProjectHito(p.id, e.target.value)}
                                                        style={{ border: 'none', background: 'transparent', fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}
                                                    />
                                                </td>
                                                <td>
                                                    <Link to={`/consultor/proyecto/${p.id}/operacion`} className="btn btn--ghost btn--sm">
                                                        Abrir <FiArrowRight />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* SECCIÓN F: Crear proyecto (Wizard Modal) */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '500px', maxWidth: '90%', padding: 'var(--space-6)' }}>
                        <h2 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Nuevo Proyecto</h2>
                        <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                            <div>
                                <label className="text-xs font-bold uppercase text-muted">Cliente</label>
                                <input 
                                    required 
                                    className="input" 
                                    value={newProject.cliente} 
                                    onChange={e => setNewProject({...newProject, cliente: e.target.value})} 
                                    placeholder="Nombre del cliente"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-muted">Nombre del Proyecto</label>
                                <input 
                                    required 
                                    className="input" 
                                    value={newProject.proyecto} 
                                    onChange={e => setNewProject({...newProject, proyecto: e.target.value})} 
                                    placeholder="Ej: Diagnóstico Q1"
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted">Línea</label>
                                    <select className="input" value={newProject.tipo} onChange={e => setNewProject({...newProject, tipo: e.target.value})}>
                                        {Object.entries(TIPOS_PRODUCTO).map(([key, info]) => (
                                            <option key={key} value={key}>{info.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase text-muted">Próximo Hito</label>
                                    <input 
                                        type="date" 
                                        required 
                                        className="input" 
                                        value={newProject.proximo_hito} 
                                        onChange={e => setNewProject({...newProject, proximo_hito: e.target.value})} 
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                                <button type="button" className="btn btn--ghost" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                                <button type="submit" className="btn btn--primary">Guardar Proyecto</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
