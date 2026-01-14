import { useState, useMemo } from 'react'
import { FiPlus, FiEdit2, FiSearch, FiCheck, FiX, FiMoreVertical, FiEye, FiTrash2 } from 'react-icons/fi'

const INITIAL_CLIENTES = [
    { id: 1, nombre: 'ACME Corp', sector: 'Tecnología', contacto: 'Juan García', email: 'juan@acme.com', proyectos: 2, estado: 'activo', creado: '2024-01-15' },
    { id: 2, nombre: 'Tech Solutions', sector: 'Servicios', contacto: 'Ana Torres', email: 'ana@techsolutions.com', proyectos: 2, estado: 'activo', creado: '2024-02-10' },
    { id: 3, nombre: 'Retail Plus', sector: 'Retail', contacto: 'María López', email: 'maria@retailplus.com', proyectos: 1, estado: 'activo', creado: '2024-03-05' },
    { id: 4, nombre: 'Industria X', sector: 'Manufactura', contacto: 'Carlos Ruiz', email: 'carlos@industriax.com', proyectos: 2, estado: 'inactivo', creado: '2023-11-20' },
    { id: 5, nombre: 'Logística MX', sector: 'Logística', contacto: 'Pedro Sánchez', email: 'pedro@logisticamx.com', proyectos: 1, estado: 'activo', creado: '2024-04-01' }
]

export default function AdminClientes() {
    const [clientes, setClientes] = useState(INITIAL_CLIENTES)
    const [search, setSearch] = useState('')
    const [filterEstado, setFilterEstado] = useState('todos')
    const [showModal, setShowModal] = useState(false)
    const [editingClient, setEditingClient] = useState(null)

    const clientesFiltrados = useMemo(() => {
        return clientes.filter(c => {
            const matchesSearch = c.nombre.toLowerCase().includes(search.toLowerCase()) ||
                                  c.contacto.toLowerCase().includes(search.toLowerCase())
            const matchesEstado = filterEstado === 'todos' || c.estado === filterEstado
            return matchesSearch && matchesEstado
        })
    }, [clientes, search, filterEstado])

    const handleToggleEstado = (id) => {
        setClientes(prev => prev.map(c => 
            c.id === id ? { ...c, estado: c.estado === 'activo' ? 'inactivo' : 'activo' } : c
        ))
    }

    const handleEdit = (cliente) => {
        setEditingClient(cliente)
        setShowModal(true)
    }

    const handleNew = () => {
        setEditingClient(null)
        setShowModal(true)
    }

    const handleSave = (data) => {
        if (editingClient) {
            setClientes(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...data } : c))
        } else {
            const newCliente = {
                ...data,
                id: Date.now(),
                proyectos: 0,
                creado: new Date().toISOString().split('T')[0]
            }
            setClientes(prev => [...prev, newCliente])
        }
        setShowModal(false)
    }

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Gestión de Clientes</h1>
                    <p className="page-subtitle">Administra empresas cliente del sistema</p>
                </div>
                <button className="btn btn--primary" onClick={handleNew}>
                    <FiPlus /> Nuevo Cliente
                </button>
            </div>

            {/* Filtros */}
            <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                        <input 
                            type="text" 
                            className="input" 
                            placeholder="Buscar cliente..." 
                            style={{ paddingLeft: '40px', width: '100%' }}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
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
                                <th>Empresa</th>
                                <th>Sector</th>
                                <th>Contacto</th>
                                <th>Email</th>
                                <th>Proyectos</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientesFiltrados.map(c => (
                                <tr key={c.id}>
                                    <td style={{ fontWeight: 'var(--font-medium)' }}>{c.nombre}</td>
                                    <td>{c.sector}</td>
                                    <td>{c.contacto}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{c.email}</td>
                                    <td>
                                        <span className="badge badge--neutral">{c.proyectos}</span>
                                    </td>
                                    <td>
                                        <span className={`badge ${c.estado === 'activo' ? 'badge--success' : 'badge--neutral'}`}>
                                            {c.estado === 'activo' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                            <button className="btn btn--ghost btn--icon btn--sm" onClick={() => handleEdit(c)} title="Editar">
                                                <FiEdit2 />
                                            </button>
                                            <button 
                                                className="btn btn--ghost btn--icon btn--sm" 
                                                onClick={() => handleToggleEstado(c.id)}
                                                title={c.estado === 'activo' ? 'Desactivar' : 'Activar'}
                                            >
                                                {c.estado === 'activo' ? <FiX /> : <FiCheck />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {clientesFiltrados.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
                                        No se encontraron clientes
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <ClienteModal 
                    cliente={editingClient} 
                    onSave={handleSave} 
                    onClose={() => setShowModal(false)} 
                />
            )}
        </div>
    )
}

function ClienteModal({ cliente, onSave, onClose }) {
    const [formData, setFormData] = useState({
        nombre: cliente?.nombre || '',
        sector: cliente?.sector || '',
        contacto: cliente?.contacto || '',
        email: cliente?.email || '',
        estado: cliente?.estado || 'activo'
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
                    <h3 className="card-title">{cliente ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
                    <button className="btn btn--ghost btn--icon" onClick={onClose}><FiX /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div>
                            <label className="label">Nombre de la empresa *</label>
                            <input 
                                type="text" 
                                className="input" 
                                value={formData.nombre}
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Sector</label>
                            <input 
                                type="text" 
                                className="input" 
                                value={formData.sector}
                                onChange={e => setFormData({ ...formData, sector: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Contacto principal</label>
                            <input 
                                type="text" 
                                className="input" 
                                value={formData.contacto}
                                onChange={e => setFormData({ ...formData, contacto: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="label">Email</label>
                            <input 
                                type="email" 
                                className="input" 
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
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
                        <button type="submit" className="btn btn--primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
