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
    ];

    // Añadir supuestos siempre (o según lógica)
    tabs.push({ id: 'supuestos', label: 'Supuestos', icon: FiActivity, to: 'supuestos' });

    return (
        <div className="resultados-container fade-in pb-20 space-y-10">
            {/* HEADER DE DIAGNÓSTICO (Compartido para todos los resultados) */}
            <div className="relative overflow-hidden bg-white p-8 md:p-10 rounded-[3rem] border border-[var(--border-color)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] group">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[var(--primary-50)] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex gap-6 items-center">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center text-white shadow-xl shadow-[var(--primary-500)]/20 transform hover:scale-110 transition-transform cursor-default">
                            <FiActivity size={36} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="flex items-center gap-1.5 text-[10px] font-black bg-emerald-500 text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                    En Curso
                                </span>
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] border-l border-[var(--border-color)] pl-3">
                                    Fase: Diagnóstico
                                </span>
                            </div>
                            <h1 className="text-4xl font-black text-[var(--text-normal)] tracking-tight">Análisis de Eficiencia</h1>
                            <p className="text-sm font-medium text-[var(--text-muted)] mt-1 italic">Evaluando oportunidades de automatización e impacto en ROI</p>
                        </div>
                    </div>
                    
                    <div className="bg-[var(--surface-50)] p-6 rounded-[2rem] border border-[var(--border-color)] flex flex-col items-center min-w-[160px]">
                        <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Día del Proyecto</div>
                        <div className="text-4xl font-black text-[var(--primary-600)] font-mono leading-none flex items-baseline gap-1">
                            4 <span className="text-sm opacity-30 font-bold italic">/ 7</span>
                        </div>
                        <div className="w-full h-2 bg-[var(--surface-200)] rounded-full mt-4 overflow-hidden shadow-inner">
                            <div className="h-full bg-gradient-to-r from-[var(--primary-400)] to-[var(--primary-600)] w-[57%] rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav Tabs */}
            <div className="tabs-container sticky top-0 z-20 bg-[var(--bg-primary)]/80 backdrop-blur-md py-4 border-b border-[var(--border-color)]">
                <div className="flex gap-2 p-1 bg-[var(--surface-50)] rounded-2xl w-fit">
                    {tabs.map(tab => (
                        <NavLink
                            key={tab.id}
                            to={tab.to}
                            className={({ isActive }) => `
                                flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all
                                ${isActive 
                                    ? 'bg-white text-[var(--primary-600)] shadow-sm scale-105' 
                                    : 'text-[var(--text-muted)] hover:bg-white/50 hover:text-[var(--text-normal)]'}
                            `}
                        >
                            <tab.icon size={18} />
                            <span className="text-sm uppercase tracking-wider">{tab.label}</span>
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* Content area */}
            <div className="tab-content min-h-[600px]">
                <Outlet />
            </div>
        </div>
    )
}
