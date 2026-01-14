import { FiUsers, FiBook, FiPackage, FiList, FiActivity, FiTrendingUp } from 'react-icons/fi'
import { Link } from 'react-router-dom'

// Mock stats for dashboard
const STATS = [
    { label: 'Clientes Activos', value: 5, icon: FiUsers, color: 'var(--primary-500)', link: '/admin/clientes' },
    { label: 'Usuarios', value: 12, icon: FiUsers, color: 'var(--success-500)', link: '/admin/usuarios' },
    { label: 'Soluciones', value: 24, icon: FiBook, color: 'var(--info-500)', link: '/admin/catalogo' },
    { label: 'Activos', value: 18, icon: FiPackage, color: 'var(--warning-500)', link: '/admin/activos' },
    { label: 'Plantillas', value: 3, icon: FiList, color: 'var(--gray-500)', link: '/admin/plantillas' }
]

const RECENT_ACTIVITY = [
    { type: 'user', text: 'Nuevo usuario: pedro@acme.com', time: 'Hace 2h' },
    { type: 'client', text: 'Cliente "Tech Solutions" activado', time: 'Hace 5h' },
    { type: 'asset', text: 'Activo "Email Bienvenida" actualizado', time: 'Ayer' },
    { type: 'solution', text: 'Solución "Diagnóstico Express" creada', time: 'Hace 2 días' }
]

export default function AdminPanel() {
    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Panel de Administración</h1>
                <p className="page-subtitle">Resumen del sistema y acceso rápido a módulos</p>
            </div>

            {/* Stats Grid */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: 'var(--space-4)', 
                marginBottom: 'var(--space-6)' 
            }}>
                {STATS.map((stat, i) => (
                    <Link 
                        key={i} 
                        to={stat.link}
                        className="card" 
                        style={{ 
                            padding: 'var(--space-5)', 
                            textDecoration: 'none',
                            borderLeft: `4px solid ${stat.color}`,
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                                    {stat.label}
                                </div>
                            </div>
                            <stat.icon size={32} style={{ color: stat.color, opacity: 0.5 }} />
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
                {/* Quick Actions */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title"><FiTrendingUp style={{ marginRight: 8 }} /> Acciones Rápidas</h3>
                    </div>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <Link to="/admin/clientes" className="btn btn--secondary" style={{ justifyContent: 'flex-start' }}>
                            <FiUsers /> Gestionar Clientes
                        </Link>
                        <Link to="/admin/usuarios" className="btn btn--secondary" style={{ justifyContent: 'flex-start' }}>
                            <FiUsers /> Gestionar Usuarios
                        </Link>
                        <Link to="/admin/catalogo" className="btn btn--secondary" style={{ justifyContent: 'flex-start' }}>
                            <FiBook /> Editar Catálogo
                        </Link>
                        <Link to="/admin/activos" className="btn btn--secondary" style={{ justifyContent: 'flex-start' }}>
                            <FiPackage /> Gestionar Activos
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title"><FiActivity style={{ marginRight: 8 }} /> Actividad Reciente</h3>
                    </div>
                    <div className="card-body" style={{ padding: 0 }}>
                        {RECENT_ACTIVITY.map((item, i) => (
                            <div 
                                key={i} 
                                style={{ 
                                    padding: 'var(--space-3) var(--space-4)',
                                    borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid var(--border-color)' : 'none',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <span style={{ fontSize: 'var(--text-sm)' }}>{item.text}</span>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
