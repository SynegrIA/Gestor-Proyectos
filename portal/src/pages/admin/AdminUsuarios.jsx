import { useState, useMemo } from 'react'
import { FiPlus, FiEdit2, FiSearch, FiCheck, FiX, FiMail, FiShield } from 'react-icons/fi'
import { useAuth, ROLES } from '../../context/AuthContext'

const INITIAL_USUARIOS = [
    { id: 1, nombre: 'Juan García', email: 'juan@acme.com', rol: 'cliente', cliente: 'ACME Corp', estado: 'activo', ultimo_acceso: '2024-06-10' },
    { id: 2, nombre: 'Pedro Sánchez', email: 'pedro@acme.com', rol: 'cliente', cliente: 'ACME Corp', estado: 'activo', ultimo_acceso: '2024-06-08' },
    { id: 3, nombre: 'María López', email: 'maria@synergia.com', rol: 'consultor', cliente: '-', estado: 'activo', ultimo_acceso: '2024-06-11' },
    { id: 4, nombre: 'Carlos Admin', email: 'admin@synergia.com', rol: 'admin', cliente: '-', estado: 'activo', ultimo_acceso: '2024-06-11' },
    { id: 5, nombre: 'Ana Torres', email: 'ana@techsolutions.com', rol: 'cliente', cliente: 'Tech Solutions', estado: 'activo', ultimo_acceso: '2024-06-05' },
    { id: 6, nombre: 'Luis Inactivo', email: 'luis@ejemplo.com', rol: 'cliente', cliente: 'Industria X', estado: 'inactivo', ultimo_acceso: '2024-01-15' }
]

const ROL_LABELS = {
    owner: { label: 'Owner', color: 'var(--error-500)' },
    admin: { label: 'Admin', color: 'var(--warning-500)' },
    consultor: { label: 'Consultor', color: 'var(--primary-500)' },
    cliente: { label: 'Cliente', color: 'var(--success-500)' }
}

const CLIENTES_LIST = ['ACME Corp', 'Tech Solutions', 'Retail Plus', 'Industria X', 'Logística MX']

export default function AdminUsuarios() {
    const { user, isOwner } = useAuth()
    const [usuarios, setUsuarios] = useState(INITIAL_USUARIOS)
    const [search, setSearch] = useState('')
    const [filterRol, setFilterRol] = useState('todos')
    const [filterEstado, setFilterEstado] = useState('todos')
    const [showModal, setShowModal] = useState(false)
    const [editingUser, setEditingUser] = useState(null)

    const usuariosFiltrados = useMemo(() => {
        return usuarios.filter(u => {
            const matchesSearch = u.nombre.toLowerCase().includes(search.toLowerCase()) ||
                                  u.email.toLowerCase().includes(search.toLowerCase())
            const matchesRol = filterRol === 'todos' || u.rol === filterRol
            const matchesEstado = filterEstado === 'todos' || u.estado === filterEstado
            return matchesSearch && matchesRol && matchesEstado
        })
    }, [usuarios, search, filterRol, filterEstado])

    const handleToggleEstado = (id) => {
        setUsuarios(prev => prev.map(u => 
            u.id === id ? { ...u, estado: u.estado === 'activo' ? 'inactivo' : 'activo' } : u
        ))
    }

    const handleEdit = (usuario) => {
        setEditingUser(usuario)
        setShowModal(true)
    }

    const handleNew = () => {
        setEditingUser(null)
        setShowModal(true)
    }

    const handleSave = (data) => {
        if (editingUser) {
            setUsuarios(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...data } : u))
        } else {
            const newUser = {
                ...data,
                id: Date.now(),
                ultimo_acceso: '-'
            }
            setUsuarios(prev => [...prev, newUser])
        }
        setShowModal(false)
    }

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Usuarios & Permisos</h1>
                    <p className="page-subtitle">Gestiona usuarios del sistema y sus roles</p>
                </div>
                <button className="btn btn--primary" onClick={handleNew}>
                    <FiPlus /> Invitar Usuario
                </button>
            </div>

            {/* Filtros */}
            <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                        <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                        <input 
                            type="text" 
                            className="input" 
                            placeholder="Buscar usuario..." 
                            style={{ paddingLeft: '40px', width: '100%' }}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <select 
                        className="input" 
                        style={{ width: 'auto' }} 
                        value={filterRol} 
                        onChange={e => setFilterRol(e.target.value)}
                    >
                        <option value="todos">Todos los roles</option>
                        <option value="admin">Admin</option>
                        <option value="consultor">Consultor</option>
                        <option value="cliente">Cliente</option>
                    </select>
                    <select 
                        className="input" 
                        style={{ width: 'auto' }} 
                        value={filterEstado} 
                        onChange={e => setFilterEstado(e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        <option value="activo">Activos</option>
                        <option value="inactivo">Inactivos</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="card">
                <div className="card-body" style={{ padding: 0 }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Cliente</th>
                                <th>Último acceso</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.map(u => (
                                <tr key={u.id}>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <div style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: '50%',
                                                background: ROL_LABELS[u.rol]?.color || 'var(--gray-300)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontSize: 'var(--text-sm)',
                                                fontWeight: 'var(--font-bold)'
                                            }}>
                                                {u.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            {u.nombre}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                                    <td>
                                        <span className="badge" style={{ 
                                            background: `${ROL_LABELS[u.rol]?.color}20`, 
                                            color: ROL_LABELS[u.rol]?.color,
                                            border: `1px solid ${ROL_LABELS[u.rol]?.color}40`
                                        }}>
                                            <FiShield size={12} style={{ marginRight: 4 }} />
                                            {ROL_LABELS[u.rol]?.label}
                                        </span>
                                    </td>
                                    <td>{u.cliente}</td>
                                    <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>{u.ultimo_acceso}</td>
                                    <td>
                                        <span className={`badge ${u.estado === 'activo' ? 'badge--success' : 'badge--neutral'}`}>
                                            {u.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                            <button 
                                                className="btn btn--ghost btn--icon btn--sm" 
                                                onClick={() => handleEdit(u)} 
                                                title="Editar"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button 
                                                className="btn btn--ghost btn--icon btn--sm" 
                                                onClick={() => handleToggleEstado(u.id)}
                                                title={u.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                                disabled={u.rol === 'owner' && !isOwner}
                                            >
                                                {u.estado === 'activo' ? <FiX /> : <FiCheck />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {usuariosFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
                                        No se encontraron usuarios
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <UsuarioModal 
                    usuario={editingUser}
                    isOwner={isOwner}
                    onSave={handleSave} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </div>
    )
}

function UsuarioModal({ usuario, isOwner, onSave, onClose }) {
    const [formData, setFormData] = useState({
        nombre: usuario?.nombre || '',
        email: usuario?.email || '',
        rol: usuario?.rol || 'cliente',
        cliente: usuario?.cliente || '',
        estado: usuario?.estado || 'activo'
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '500px', maxWidth: '90vw' }}>
                <div className="card-header">
                    <h3 className="card-title">{usuario ? 'Editar Usuario' : 'Invitar Usuario'}</h3>
                    <button className="btn btn--ghost btn--icon" onClick={onClose}><FiX /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div>
                            <label className="label">Nombre completo *</label>
                            <input 
                                type="text" 
                                className="input" 
                                value={formData.nombre}
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Email *</label>
                            <input 
                                type="email" 
                                className="input" 
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Rol *</label>
                            <select 
                                className="input"
                                value={formData.rol}
                                onChange={e => setFormData({ ...formData, rol: e.target.value })}
                            >
                                <option value="cliente">Cliente</option>
                                <option value="consultor">Consultor</option>
                                <option value="admin">Administrador</option>
                                {isOwner && <option value="owner">Owner</option>}
                            </select>
                        </div>
                        {formData.rol === 'cliente' && (
                            <div>
                                <label className="label">Cliente asociado</label>
                                <select 
                                    className="input"
                                    value={formData.cliente}
                                    onChange={e => setFormData({ ...formData, cliente: e.target.value })}
                                >
                                    <option value="">Seleccionar cliente...</option>
                                    {CLIENTES_LIST.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="label">Estado</label>
                            <select 
                                className="input"
                                value={formData.estado}
                                onChange={e => setFormData({ ...formData, estado: e.target.value })}
                            >
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>
                    </div>
                    <div className="card-footer" style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn--primary">
                            <FiMail /> {usuario ? 'Guardar' : 'Enviar Invitación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
