import { Link, useParams } from 'react-router-dom'
import { 
    FiArrowLeft, FiBriefcase, FiCodesandbox, FiMonitor, 
    FiCloud, FiArrowRight, FiUsers, FiFileText, FiMessageSquare 
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import React, { useMemo } from 'react'

const TIPOS_PRODUCTO = {
    consultoria: { nombre: 'Consultoría', icon: <FiBriefcase />, color: 'var(--primary-500)' },
    desarrollo: { nombre: 'Desarrollo a Medida', icon: <FiCodesandbox />, color: 'var(--success-500)' },
    formacion: { nombre: 'Formación', icon: <FiMonitor />, color: 'var(--warning-500)' },
    saas: { nombre: 'SaaS', icon: <FiCloud />, color: 'var(--info-500)' }
}

const INITIAL_CLIENTES = [
    { id: 1, nombre: 'ACME Corp', sector: 'Tecnología', info: '150-200 empleados · Cliente desde Marzo 2023' },
    { id: 2, nombre: 'Tech Solutions', sector: 'Servicios', info: '50-100 empleados · Cliente desde Junio 2023' },
    { id: 3, nombre: 'Retail Plus', sector: 'Retail', info: '500+ empleados · Cliente desde Enero 2024' },
    { id: 4, nombre: 'Industria X', sector: 'Manufactura', info: '1000+ empleados · Cliente desde Mayo 2022' },
]

const INITIAL_PROYECTOS = [
    { id: 1, cliente: 'ACME Corp', proyecto: 'Diagnóstico Eficiencia Q1', tipo: 'consultoria', fase: 'Análisis de datos', estado: 'PAUSADO', assigned_consultant_id: 2 },
    { id: 2, cliente: 'ACME Corp', proyecto: 'Agente Ventas IA', tipo: 'desarrollo', fase: 'Desarrollo', estado: 'EN_PROGRESO', assigned_consultant_id: 2 },
    { id: 3, cliente: 'Tech Solutions', proyecto: 'Implementación CRM', tipo: 'consultoria', fase: 'Diseño', estado: 'EN_PROGRESO', assigned_consultant_id: 2 },
    { id: 4, cliente: 'Tech Solutions', proyecto: 'Workshop IA Generativa', tipo: 'formacion', fase: 'Agendado', estado: 'PENDIENTE', assigned_consultant_id: 2 },
    { id: 5, cliente: 'Retail Plus', proyecto: 'App Logística', tipo: 'desarrollo', fase: 'Testing', estado: 'REVISION', assigned_consultant_id: 2 },
    { id: 6, cliente: 'Industria X', proyecto: 'Diagnóstico Inicial', tipo: 'consultoria', fase: 'Completo', estado: 'ENTREGADO', assigned_consultant_id: 2 },
    { id: 7, cliente: 'Industria X', proyecto: 'Licencia Synergia Flow', tipo: 'saas', fase: 'Activo', estado: 'EN_PROGRESO', assigned_consultant_id: 2 },
    { id: 8, cliente: 'Logística MX', proyecto: 'Dashboard Operativo', tipo: 'saas', fase: 'Setup', estado: 'EN_PROGRESO', assigned_consultant_id: 2 },
]

const USUARIOS = [
    { id: 1, nombre: 'Juan García', email: 'juan@acme.com', rol: 'cliente', cliente: 'ACME Corp' },
    { id: 2, nombre: 'Pedro Sánchez', email: 'pedro@acme.com', rol: 'cliente', cliente: 'ACME Corp' },
    { id: 5, nombre: 'Ana Torres', email: 'ana@techsolutions.com', rol: 'cliente', cliente: 'Tech Solutions' },
]

export default function ConsultorVistaCliente() {
    const { clienteId } = useParams()
    const { user, isConsultor } = useAuth()
    const [activeTab, setActiveTab] = React.useState('proyectos')

    const cliente = INITIAL_CLIENTES.find(c => c.id === parseInt(clienteId)) || INITIAL_CLIENTES[0]
    
    const proyectos = useMemo(() => {
        return INITIAL_PROYECTOS.filter(p => p.cliente === cliente.nombre && (isConsultor ? p.assigned_consultant_id === user?.id : true))
    }, [cliente.nombre, user?.id, isConsultor])

    const usuarios = useMemo(() => {
        return USUARIOS.filter(u => u.cliente === cliente.nombre)
    }, [cliente.nombre])

    return (
        <div>
            <Link to="/consultor/clientes" className="btn btn--ghost" style={{ marginBottom: 'var(--space-4)' }}>
                <FiArrowLeft /> Volver a Clientes
            </Link>

            <div className="page-header">
                <div>
                    <h1 className="page-title">{cliente.nombre}</h1>
                    <p className="page-subtitle">Sector: {cliente.sector} · {cliente.info}</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-4)' }}>
                <button 
                    className={`btn ${activeTab === 'proyectos' ? 'btn--secondary' : 'btn--ghost'}`}
                    onClick={() => setActiveTab('proyectos')}
                >
                    <FiBriefcase /> Proyectos ({proyectos.length})
                </button>
                <button 
                    className={`btn ${activeTab === 'usuarios' ? 'btn--secondary' : 'btn--ghost'}`}
                    onClick={() => setActiveTab('usuarios')}
                >
                    <FiUsers /> Equipo Cliente ({usuarios.length})
                </button>
                {!isConsultor && (
                    <button className="btn btn--ghost"><FiFileText /> Documentación</button>
                )}
            </div>

            {activeTab === 'proyectos' && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Proyectos Activos</h3>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Nombre Proyecto</th>
                                        <th>Línea</th>
                                        <th>Estado</th>
                                        <th>Fase/Detalle</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proyectos.map(p => (
                                        <tr key={p.id}>
                                            <td><strong>{p.proyecto}</strong></td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                    <span style={{ color: TIPOS_PRODUCTO[p.tipo]?.color }}>{TIPOS_PRODUCTO[p.tipo]?.icon}</span>
                                                    <span className="text-sm">{TIPOS_PRODUCTO[p.tipo]?.nombre}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${p.estado === 'EN_PROGRESO' ? 'badge--primary' : p.estado === 'PAUSADO' ? 'badge--danger' : 'badge--neutral'}`}>
                                                    {p.estado}
                                                </span>
                                            </td>
                                            <td><span className="text-sm">{p.fase}</span></td>
                                            <td>
                                                <Link to={`/consultor/proyecto/${p.id}/operacion`} className="btn btn--ghost btn--sm">
                                                    Abrir proyecto <FiArrowRight />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'usuarios' && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Usuarios del Cliente (Solo lectura)</h3>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Acceso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--gray-400)' }}>
                                            No hay usuarios registrados para este cliente.
                                        </td>
                                    </tr>
                                ) : (
                                    usuarios.map(u => (
                                        <tr key={u.id}>
                                            <td><strong>{u.nombre}</strong></td>
                                            <td>{u.email}</td>
                                            <td><span className="badge badge--info">{u.rol}</span></td>
                                            <td>
                                                <span className="badge badge--success">Activo</span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {isConsultor && (
                        <div className="card-footer" style={{ background: 'var(--gray-50)', padding: 'var(--space-3)' }}>
                            <p className="text-xs text-muted" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                <FiMessageSquare /> Para invitar o modificar usuarios, contacta con el Administrador.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
