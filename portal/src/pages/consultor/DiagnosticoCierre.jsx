import { NavLink, Outlet, useParams } from 'react-router-dom'
import { FiSend, FiCheckSquare, FiArrowRight } from 'react-icons/fi'

export default function DiagnosticoCierre() {
    const { id } = useParams()
    
    // En un caso real, esto vendría de un estado del diagnóstico
    const isEntregado = false 

    const tabs = [
        { id: 'entregables', label: 'Entregables', icon: FiSend, to: 'entregables' },
        { id: 'acta', label: 'Acta', icon: FiCheckSquare, to: 'acta' },
        { id: 'siguientes-pasos', label: 'Siguientes pasos', icon: FiArrowRight, to: 'siguientes-pasos' },
    ]

    return (
        <div className="cierre-container">
            {/* Nav Tabs */}
            <div className="tabs-container" style={{ 
                display: 'flex', 
                gap: 'var(--space-1)', 
                marginBottom: 'var(--space-6)', 
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: 'var(--space-2)',
                position: 'sticky',
                top: 0,
                backgroundColor: 'var(--bg-primary)',
                zIndex: 10,
                paddingTop: 'var(--space-2)'
            }}>
                {tabs.map(tab => (
                    <NavLink
                        key={tab.id}
                        to={tab.to}
                        className={({ isActive }) => `btn ${isActive ? 'btn--secondary' : 'btn--ghost'}`}
                        style={{ 
                            fontSize: '0.9rem',
                            padding: 'var(--space-2) var(--space-4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            textDecoration: 'none'
                        }}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </NavLink>
                ))}
            </div>

            {/* Content area */}
            <div className="tab-content">
                <Outlet />
            </div>
        </div>
    )
}
