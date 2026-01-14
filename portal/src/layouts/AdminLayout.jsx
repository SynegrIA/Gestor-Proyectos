import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    FiPieChart, FiUsers, FiBook, FiList, FiSettings,
    FiLogOut, FiGrid, FiPackage, FiShield
} from 'react-icons/fi'
import './Layout.css'

const NAV_ITEMS_PRINCIPAL = [
    { to: '/admin', icon: FiPieChart, label: 'Panel', end: true },
    { to: '/admin/clientes', icon: FiUsers, label: 'Clientes' }
]

const NAV_ITEMS_CONFIG = [
    { to: '/admin/usuarios', icon: FiShield, label: 'Usuarios & Permisos' },
    { to: '/admin/catalogo', icon: FiBook, label: 'Catálogo de Soluciones' },
    { to: '/admin/activos', icon: FiPackage, label: 'Activos Reutilizables' },
    { to: '/admin/plantillas', icon: FiList, label: 'Plantillas de Tareas' },
    { to: '/admin/ajustes', icon: FiSettings, label: 'Ajustes' }
]

export default function AdminLayout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar__logo">
                    <div className="sidebar__logo-icon" style={{ background: 'var(--error-500)' }}>A</div>
                    <span className="sidebar__logo-text">Admin</span>
                </div>

                <nav className="sidebar__nav">
                    {/* Principal */}
                    <div className="sidebar__section">
                        <div className="sidebar__section-title">Principal</div>
                        {NAV_ITEMS_PRINCIPAL.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <item.icon className="nav-item__icon" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* Configuración */}
                    <div className="sidebar__section">
                        <div className="sidebar__section-title">Configuración</div>
                        {NAV_ITEMS_CONFIG.map(item => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <item.icon className="nav-item__icon" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>

                    {/* Volver al portal */}
                    <div className="sidebar__section" style={{ marginTop: 'auto' }}>
                        <NavLink
                            to="/consultor"
                            className="nav-item"
                        >
                            <FiGrid className="nav-item__icon" />
                            <span>Ir al Portal</span>
                        </NavLink>
                    </div>
                </nav>

                {/* User section */}
                <div className="sidebar__user">
                    <div className="sidebar__user-avatar">{user?.avatar || 'U'}</div>
                    <div className="sidebar__user-info">
                        <div className="sidebar__user-name">{user?.name || 'Usuario'}</div>
                        <div className="sidebar__user-role" style={{ color: 'var(--error-400)' }}>
                            {user?.role === 'owner' ? 'Owner' : 'Administrador'}
                        </div>
                    </div>
                    <button 
                        className="sidebar__logout" 
                        onClick={handleLogout}
                        title="Cerrar sesión"
                    >
                        <FiLogOut />
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}
