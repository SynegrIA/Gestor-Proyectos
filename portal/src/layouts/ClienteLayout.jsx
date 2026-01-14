import { Outlet, NavLink, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    FiHome, FiGrid, FiMap, FiLayers, FiTarget,
    FiArrowRight, FiCheckSquare, FiFolder, FiBell, FiSettings, FiClock
} from 'react-icons/fi'
import ChatWidget from '../components/common/ChatWidget'
import './Layout.css'

const NAV_ITEMS_HOME = [
    { to: '/cliente', icon: FiHome, label: 'Mis Diagnósticos', exact: true }
]

const NAV_ITEMS_DIAGNOSTICO = [
    { to: 'dashboard', icon: FiHome, label: 'Inicio' },
    { to: 'pendientes', icon: FiCheckSquare, label: 'Pendientes' },
    { to: 'resultados', icon: FiLayers, label: 'Resultados' },
    { to: 'data-room', icon: FiFolder, label: 'Archivos' },
    { to: 'cierre', icon: FiCheckSquare, label: 'Cierre' }
]

export default function ClienteLayout() {
    const { user, logout } = useAuth()
    const location = useLocation()
    const { id: diagnosticoId } = useParams()

    const isDiagnosticoView = location.pathname.includes('/diagnostico/')
    const navItems = isDiagnosticoView ? NAV_ITEMS_DIAGNOSTICO : NAV_ITEMS_HOME
    const basePath = isDiagnosticoView ? `/cliente/diagnostico/${diagnosticoId}` : ''

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar__logo">
                    <div className="sidebar__logo-icon">S</div>
                    <span className="sidebar__logo-text">Synergia</span>
                </div>

                <nav className="sidebar__nav">
                    {isDiagnosticoView && (
                        <div className="sidebar__section">
                            <NavLink to="/cliente" className="nav-item nav-item--back">
                                <FiHome className="nav-item__icon" />
                                <span>← Volver a inicio</span>
                            </NavLink>
                        </div>
                    )}

                    <div className="sidebar__section">
                        {!isDiagnosticoView && (
                            <div className="sidebar__section-title">Principal</div>
                        )}
                        {isDiagnosticoView && (
                            <div className="sidebar__section-title">Diagnóstico</div>
                        )}
                        {navItems.map(item => (
                            <NavLink
                                key={item.to}
                                to={isDiagnosticoView ? `${basePath}/${item.to}` : item.to}
                                end={item.exact}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <item.icon className="nav-item__icon" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </nav>

                <div className="sidebar__footer">
                    <NavLink to="/cliente/settings" className="nav-item">
                        <FiSettings className="nav-item__icon" />
                        <span>Ajustes</span>
                    </NavLink>
                </div>
            </aside>

            {/* Main content */}
            <main className="main-content">
                <header className="topbar">
                    <div className="topbar__left">
                        <div className="topbar__title-group">
                            <h1 className="topbar__title">
                                {isDiagnosticoView ? 'Diagnóstico Q1 2024' : 'Mis Diagnósticos'}
                            </h1>
                            {isDiagnosticoView && (
                                <div className="project-context">
                                    <span className="badge badge--success">En curso</span>
                                    <span className="phase-label">Fase: Análisis</span>
                                    <div className="progress-mini">
                                        <div className="progress-mini__bar" style={{ width: '42%' }}></div>
                                        <span className="progress-mini__text">Día 3/7</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="user-menu">
                        <button className="notification-btn">
                            <FiBell size={20} />
                            <span className="notification-btn__badge">3</span>
                        </button>

                        <div className="user-dropdown">
                            <div className="user-avatar">{user?.avatar}</div>
                            <span className="user-name">{user?.name}</span>
                        </div>
                    </div>
                </header>

                <div className="page-content">
                    <Outlet />
                </div>
            </main>
            <ChatWidget userRole="cliente" />
        </div>
    )
}
