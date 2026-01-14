import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
    FiPlus, FiEdit2, FiTrash2, FiMail, FiUsers, FiShield, 
    FiCheck, FiSearch, FiArrowRight, FiMoreVertical 
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const INITIAL_CLIENTES = [
    { id: 1, nombre: 'ACME Corp', sector: 'Tecnología', usuarios: 3, estado: 'activo' },
    { id: 2, nombre: 'Tech Solutions', sector: 'Servicios', usuarios: 2, estado: 'activo' },
    { id: 3, nombre: 'Retail Plus', sector: 'Retail', usuarios: 4, estado: 'activo' },
    { id: 4, nombre: 'Industria X', sector: 'Manufactura', usuarios: 2, estado: 'inactivo' },
    { id: 5, nombre: 'Logística MX', sector: 'Logística', usuarios: 1, estado: 'activo' },
    { id: 6, nombre: 'Otro Consultor Client', sector: 'Otros', usuarios: 1, estado: 'activo' },
]

const INITIAL_PROYECTOS = [
    { id: 1, cliente: 'ACME Corp', proyecto: 'Diagnóstico Eficiencia Q1', tipo: 'consultoria', assigned_consultant_id: 2 },
    { id: 2, cliente: 'ACME Corp', proyecto: 'Agente Ventas IA', tipo: 'desarrollo', assigned_consultant_id: 2 },
    { id: 3, cliente: 'Tech Solutions', proyecto: 'Implementación CRM', tipo: 'consultoria', assigned_consultant_id: 2 },
    { id: 4, cliente: 'Tech Solutions', proyecto: 'Workshop IA Generativa', tipo: 'formacion', assigned_consultant_id: 2 },
    { id: 5, cliente: 'Retail Plus', proyecto: 'App Logística', tipo: 'desarrollo', assigned_consultant_id: 2 },
    { id: 6, cliente: 'Industria X', proyecto: 'Diagnóstico Inicial', tipo: 'consultoria', assigned_consultant_id: 2 },
    { id: 7, cliente: 'Industria X', proyecto: 'Licencia Synergia Flow', tipo: 'saas', assigned_consultant_id: 2 },
    { id: 8, cliente: 'Logística MX', proyecto: 'Dashboard Operativo', tipo: 'saas', assigned_consultant_id: 2 },
    { id: 9, cliente: 'Otro Consultor Client', proyecto: 'Proyecto Ajeno', tipo: 'consultoria', assigned_consultant_id: 99 },
]

const USUARIOS = [
    { id: 1, nombre: 'Juan García', email: 'juan@acme.com', rol: 'cliente', cliente: 'ACME Corp', estado: 'activo' },
    { id: 2, nombre: 'Pedro Sánchez', email: 'pedro@acme.com', rol: 'cliente', cliente: 'ACME Corp', estado: 'activo' },
    { id: 3, nombre: 'María López', email: 'maria@synergia.com', rol: 'consultor', cliente: '-', estado: 'activo' },
    { id: 4, nombre: 'Carlos Ruiz', email: 'carlos@synergia.com', rol: 'consultor', cliente: '-', estado: 'activo' },
    { id: 5, nombre: 'Ana Torres', email: 'ana@techsolutions.com', rol: 'cliente', cliente: 'Tech Solutions', estado: 'activo' },
]

export default function ConsultorAdmin() {
    const { user, isConsultor } = useAuth()
    const [activeTab, setActiveTab] = useState('clientes')
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [clientes, setClientes] = useState(INITIAL_CLIENTES)
    
    // Filtros
    const [search, setSearch] = useState('')
    const [filterEstado, setFilterEstado] = useState('todos')

    // Lógica de visibilidad para consultor
    const clientesFiltrados = useMemo(() => {
        return clientes.filter(c => {
            // Regla: Solo clientes con proyectos asignados al consultor
            const tieneProyectoAsignado = INITIAL_PROYECTOS.some(p => 
                p.cliente === c.nombre && p.assigned_consultant_id === user?.id
            )
            
            if (isConsultor && !tieneProyectoAsignado) return false

            const matchesSearch = c.nombre.toLowerCase().includes(search.toLowerCase())
            const matchesEstado = filterEstado === 'todos' || c.estado === filterEstado

            return matchesSearch && matchesEstado
        })
    }, [clientes, search, filterEstado, user?.id, isConsultor])

    const getProjectCount = (clienteNombre) => {
        return INITIAL_PROYECTOS.filter(p => p.cliente === clienteNombre && p.assigned_consultant_id === user?.id).length
    }

    const handleToggleEstado = (id) => {
        setClientes(prev => prev.map(c => 
            c.id === id ? { ...c, estado: c.estado === 'activo' ? 'inactivo' : 'activo' } : c
        ))
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">{isConsultor ? 'Clientes' : 'Administración'}</h1>
                <p className="page-subtitle">
                    {isConsultor 
                        ? 'Empresas con proyectos asignados a ti' 
                        : 'Gestión de clientes, usuarios y permisos'}
                </p>
            </div>

            {/* Tabs - Ocultar "Usuarios" para consultor en V1 */}
            {!isConsultor && (
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-color)', paddingBottom: 'var(--space-4)' }}>
                    <button
                        className={`btn ${activeTab === 'clientes' ? 'btn--secondary' : 'btn--ghost'}`}
                        onClick={() => setActiveTab('clientes')}
                    >
                        <FiUsers /> Clientes
                    </button>
                    <button
                        className={`btn ${activeTab === 'usuarios' ? 'btn--secondary' : 'btn--ghost'}`}
                        onClick={() => setActiveTab('usuarios')}
                    >
                        <FiShield /> Usuarios
                    </button>
                </div>
            )}

            {activeTab === 'clientes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {/* Filtros */}
                    <div className="card" style={{ padding: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                                <input 
                                    type="text" 
                                    className="input" 
                                    placeholder="Buscar empresa..." 
                                    style={{ paddingLeft: '40px', width: '100%' }}
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <select className="input" style={{ width: 'auto' }} value={filterEstado} onChange={e => setFilterEstado(e.target.value)}>
                                <option value="todos">Todos los estados</option>
                                <option value="activo">Activos</option>
                                <option value="inactivo">Inactivos</option>
                            </select>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Listado de Clientes ({clientesFiltrados.length})</h3>
                            {!isConsultor && (
                                <button className="btn btn--primary btn--sm"><FiPlus /> Nuevo cliente</button>
                            )}
                        </div>
                        <div className="card-body" style={{ padding: 0 }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Empresa</th>
                                        <th>Sector</th>
                                        <th>{isConsultor ? 'Mis Proyectos' : 'Usuarios'}</th>
                                        {!isConsultor && <th>Diagnósticos</th>}
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientesFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--gray-400)' }}>
                                                No se encontraron clientes.
                                            </td>
                                        </tr>
                                    ) : (
                                        clientesFiltrados.map(c => (
                                            <tr key={c.id}>
                                                <td><strong>{c.nombre}</strong></td>
                                                <td>{c.sector}</td>
                                                <td>{isConsultor ? getProjectCount(c.nombre) : c.usuarios}</td>
                                                {!isConsultor && <td>{c.diagnosticos}</td>}
                                                <td>
                                                    {isConsultor ? (
                                                        <select 
                                                            className={`badge ${c.estado === 'activo' ? 'badge--success' : 'badge--neutral'}`}
                                                            value={c.estado}
                                                            onChange={() => handleToggleEstado(c.id)}
                                                            style={{ border: 'none', appearance: 'none', cursor: 'pointer', paddingRight: 'var(--space-2)' }}
                                                        >
                                                            <option value="activo">● Activo</option>
                                                            <option value="inactivo">○ Inactivo</option>
                                                        </select>
                                                    ) : (
                                                        <span className={`badge ${c.estado === 'activo' ? 'badge--success' : 'badge--neutral'}`}>
                                                            {c.estado === 'activo' ? '● Activo' : '○ Inactivo'}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                                        <Link to={`/consultor/cliente/${c.id}`} className="btn btn--ghost btn--sm">
                                                            Abrir <FiArrowRight />
                                                        </Link>
                                                        {!isConsultor && (
                                                            <>
                                                                <button className="btn btn--ghost btn--icon btn--sm"><FiEdit2 /></button>
                                                                <button className="btn btn--ghost btn--icon btn--sm"><FiTrash2 /></button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'usuarios' && (
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Usuarios ({USUARIOS.length})</h3>
                        <button className="btn btn--primary btn--sm" onClick={() => setShowInviteModal(true)}>
                            <FiMail /> Invitar usuario
                        </button>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Cliente</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {USUARIOS.map(u => (
                                    <tr key={u.id}>
                                        <td><strong>{u.nombre}</strong></td>
                                        <td>{u.email}</td>
                                        <td>
                                            <span className={`badge ${u.rol === 'consultor' ? 'badge--primary' : 'badge--info'}`}>
                                                {u.rol === 'consultor' ? '👤 Consultor' : '🏢 Cliente'}
                                            </span>
                                        </td>
                                        <td>{u.cliente}</td>
                                        <td>
                                            <span className="badge badge--success"><FiCheck /> Activo</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                <button className="btn btn--ghost btn--sm">Editar</button>
                                                <button className="btn btn--ghost btn--sm">Reset acceso</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showInviteModal && (
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
                        <div className="card-header">
                            <h3 className="card-title">Invitar Usuario</h3>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-input" placeholder="usuario@empresa.com" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Rol</label>
                                <select className="form-input">
                                    <option value="cliente">Cliente</option>
                                    <option value="consultor">Consultor</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Cliente asociado</label>
                                <select className="form-input">
                                    <option value="">Sin cliente (solo consultores)</option>
                                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                            <button className="btn btn--ghost" onClick={() => setShowInviteModal(false)}>Cancelar</button>
                            <button className="btn btn--primary"><FiMail /> Enviar invitación</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
