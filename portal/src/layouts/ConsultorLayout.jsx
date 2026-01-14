import { Outlet, NavLink, useLocation, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    FiPieChart, FiUsers, FiBook, FiList, FiSettings,
    FiBell, FiActivity, FiCheckSquare, FiFileText, FiFolder,
    FiMessageSquare, FiSend, FiShield, FiClock, FiTarget, FiLayers,
    FiChevronDown, FiChevronRight, FiMonitor
} from 'react-icons/fi'
import ChatWidget from '../components/common/ChatWidget'
import './Layout.css'
import { useState, useEffect } from 'react'

const NAV_ITEMS_GLOBAL = [
    { to: '/consultor/portfolio', icon: FiPieChart, label: 'Portfolio' },
    { to: '/consultor/clientes', icon: FiUsers, label: 'Clientes' }
]

const NAV_ITEMS_BIBLIOTECA = [
    { to: '/consultor/catalogo', icon: FiBook, label: 'Catálogo de Soluciones' },
    { to: '/consultor/activos', icon: FiBook, label: 'Activos Reutilizables' },
    { to: '/consultor/plantilla-tareas', icon: FiList, label: 'Plantilla Tareas' }
]

const NAV_ITEMS_ADMIN = [
    { to: '/consultor/admin', icon: FiShield, label: 'Administración' }
]

export default function ConsultorLayout() {
    const { user } = useAuth()
    const location = useLocation()

    const [expandedGroups, setExpandedGroups] = useState(() => {
        const saved = localStorage.getItem('consultor_sidebar_groups')
        return saved ? JSON.parse(saved) : { analisis: false, interno: false }
    })

    useEffect(() => {
        localStorage.setItem('consultor_sidebar_groups', JSON.stringify(expandedGroups))
    }, [expandedGroups])

    const toggleGroup = (group) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }))
    }

    const isProyectoView = location.pathname.includes('/proyecto/')

    // Extract proyecto ID from path if we're in a proyecto view
    const pathMatch = location.pathname.match(/\/proyecto\/(\d+)/)
    const currentProyectoId = pathMatch ? pathMatch[1] : null

    return (
        <div className="app-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar__logo">
                    <div className="sidebar__logo-icon">S</div>
                    <span className="sidebar__logo-text">Synergia</span>
                </div>

                <nav className="sidebar__nav">
                    {/* Global navigation */}
                    <div className="sidebar__section">
                        <div className="sidebar__section-title">Principal</div>
                        {NAV_ITEMS_GLOBAL.map(item => (
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

                    {/* Biblioteca */}
                    <div className="sidebar__section">
                        <div className="sidebar__section-title">Biblioteca</div>
                        {NAV_ITEMS_BIBLIOTECA.map(item => (
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

                    {/* Proyecto context - solo si estamos en un proyecto */}
                    {isProyectoView && currentProyectoId && (
                        <div className="sidebar__section">
                            <div className="sidebar__section-title">PROYECTO</div>
                            <NavLink
                                to={`/consultor/proyecto/${currentProyectoId}/operacion`}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <FiActivity className="nav-item__icon" />
                                <span>Control</span>
                            </NavLink>
                            <NavLink
                                to={`/consultor/proyecto/${currentProyectoId}/tareas`}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <FiCheckSquare className="nav-item__icon" />
                                <span>Tareas</span>
                            </NavLink>
                            <NavLink
                                to={`/consultor/proyecto/${currentProyectoId}/inputs-cliente`}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <FiFileText className="nav-item__icon" />
                                <span style={{ flex: 1 }}>Pendientes Cliente</span>
                                <span className="nav-item__badge">3</span>
                            </NavLink>
                            <NavLink
                                to={`/consultor/proyecto/${currentProyectoId}/data-room`}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <FiFolder className="nav-item__icon" />
                                <span style={{ flex: 1 }}>Archivos</span>
                                <span className="nav-item__badge" style={{ backgroundColor: 'var(--warning-500)', color: 'white' }}>1</span>
                            </NavLink>
                            <NavLink
                                to={`/consultor/proyecto/${currentProyectoId}/cierre`}
                                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            >
                                <FiCheckSquare className="nav-item__icon" />
                                <span>Cierre</span>
                            </NavLink>

                            {/* GRUPO 2: ANÁLISIS */}
                            <div className="sidebar__group" style={{ marginTop: 'var(--space-4)' }}>
                                <button 
                                    className="sidebar__group-header" 
                                    onClick={() => toggleGroup('analisis')}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'between',
                                        background: 'none',
                                        border: 'none',
                                        padding: 'var(--space-2) var(--space-3)',
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 'var(--font-semibold)',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}
                                >
                                    <span style={{ flex: 1, textAlign: 'left' }}>ANÁLISIS</span>
                                    {expandedGroups.analisis ? <FiChevronDown /> : <FiChevronRight />}
                                </button>
                                {expandedGroups.analisis && (
                                    <div className="sidebar__group-content" style={{ display: 'flex', flexDirection: 'column' }}>
                                        <NavLink
                                            to={`/consultor/proyecto/${currentProyectoId}/medicion-tiempos`}
                                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                            style={{ paddingLeft: 'calc(var(--space-3) + 20px + var(--space-3))' }}
                                        >
                                            <FiClock className="nav-item__icon" />
                                            <span>Medición de tiempos</span>
                                        </NavLink>
                                        <NavLink
                                            to={`/consultor/proyecto/${currentProyectoId}/supuestos-medicion`}
                                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                            style={{ paddingLeft: 'calc(var(--space-3) + 20px + var(--space-3))' }}
                                        >
                                            <FiTarget className="nav-item__icon" />
                                            <span>Supuestos y medición</span>
                                        </NavLink>
                                        <NavLink
                                            to={`/consultor/proyecto/${currentProyectoId}/iniciativas`}
                                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                            style={{ paddingLeft: 'calc(var(--space-3) + 20px + var(--space-3))' }}
                                        >
                                            <FiLayers className="nav-item__icon" />
                                            <span>Iniciativas</span>
                                        </NavLink>
                                    </div>
                                )}
                            </div>

                            {/* GRUPO 3: INTERNO */}
                            <div className="sidebar__group" style={{ marginTop: 'var(--space-2)' }}>
                                <button 
                                    className="sidebar__group-header" 
                                    onClick={() => toggleGroup('interno')}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'between',
                                        background: 'none',
                                        border: 'none',
                                        padding: 'var(--space-2) var(--space-3)',
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        fontSize: 'var(--text-xs)',
                                        fontWeight: 'var(--font-semibold)',
                                        cursor: 'pointer',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}
                                >
                                    <span style={{ flex: 1, textAlign: 'left' }}>INTERNO</span>
                                    {expandedGroups.interno ? <FiChevronDown /> : <FiChevronRight />}
                                </button>
                                {expandedGroups.interno && (
                                    <div className="sidebar__group-content" style={{ display: 'flex', flexDirection: 'column' }}>
                                        <NavLink
                                            to={`/consultor/proyecto/${currentProyectoId}/notas-internas`}
                                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                            style={{ paddingLeft: 'calc(var(--space-3) + 20px + var(--space-3))' }}
                                        >
                                            <FiMessageSquare className="nav-item__icon" />
                                            <span>Notas internas</span>
                                        </NavLink>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Admin */}
                    <div className="sidebar__section">
                        <div className="sidebar__section-title">Sistema</div>
                        {NAV_ITEMS_ADMIN.map(item => (
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
                </nav>

                <div className="sidebar__footer">
                    <NavLink to="/consultor/settings" className="nav-item">
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
                                {isProyectoView ? 'Diagnóstico ACME Corp' :
                                    location.pathname.includes('/activos') ? 'Biblioteca de Activos' :
                                        location.pathname.includes('/admin') ? 'Administración' :
                                            location.pathname.includes('/clientes') ? 'Gestión de Clientes' :
                                                'Portfolio'}
                            </h1>
                            {isProyectoView && (
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
                            <span className="notification-btn__badge">5</span>
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
            <ChatWidget userRole="consultor" />
        </div>
    )
}
