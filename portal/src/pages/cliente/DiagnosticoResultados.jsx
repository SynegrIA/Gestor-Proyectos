import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { FiGrid, FiTarget, FiMap, FiLayers, FiActivity, FiLock } from 'react-icons/fi'
import { INITIAL_PUBLICATIONS } from '../../data/deliverables'

const TYPE_MAP = {
    'resumen': 'dashboard',
    'matriz': 'matriz',
    'roadmap': 'roadmap',
    'iniciativas': 'iniciativa'
};

export default function DiagnosticoResultados() {
    
    // Solo mostramos pestañas si están publicadas
    const tabs = [
        { id: 'resumen', label: 'Resumen', icon: FiGrid, to: 'resumen' },
        { id: 'matriz', label: 'Matriz', icon: FiTarget, to: 'matriz' },
        { id: 'roadmap', label: 'Roadmap', icon: FiMap, to: 'roadmap' },
        { id: 'iniciativas', label: 'Iniciativas', icon: FiLayers, to: 'iniciativas' },
    ].filter(tab => {
        const pubType = TYPE_MAP[tab.id];
        const pub = INITIAL_PUBLICATIONS.find(p => p.deliverable_type === pubType);
        return pub ? pub.is_published : true; // Por defecto true si no está en la lista (e.g. supuestos)
    });

    // Añadir supuestos siempre (o según lógica)
    tabs.push({ id: 'supuestos', label: 'Supuestos', icon: FiActivity, to: 'supuestos' });

    return (
        <div className="resultados-container">
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
