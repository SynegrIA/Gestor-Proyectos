import { useMemo } from 'react'
import { 
    FiTarget, FiPieChart, FiBarChart2, FiTrendingUp, FiActivity,
    FiCheckCircle, FiAlertCircle, FiClock, FiDollarSign, FiInfo,
    FiLayout, FiDownload, FiShare2
} from 'react-icons/fi'
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, ReferenceLine, LabelList
} from 'recharts'
import { useProjectData } from '../../context/ProjectContext'

// COMPONENTES HELPER
const KPI = ({ label, value, icon: IconComponent, trend, suffix = "" }) => (
    <div className="bg-white p-6 rounded-3xl border border-[var(--border-color)] shadow-sm hover:shadow-xl transition-all group">
        <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-50)] flex items-center justify-center text-[var(--primary-600)] group-hover:bg-[var(--primary-500)] group-hover:text-white transition-colors">
                {IconComponent && <IconComponent size={20} />}
            </div>
            {trend && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">{label}</div>
        <div className="text-2xl font-black text-[var(--text-normal)] font-mono">
            {value}{suffix}
        </div>
    </div>
)

export default function DiagnosticoDashboard() {
    const { projectData } = useProjectData()
    const { matriz, iniciativas } = projectData

    // PREPARACIÓN DE DATOS PARA CHARTS
    const dashboardData = useMemo(() => {
        const activeInis = iniciativas.filter(i => !i.archivada)
        const top3 = activeInis.filter(i => i.isTop)
        const published = activeInis.filter(i => i.estado_visibilidad === 'PUBLICADA')
        
        // CÁLCULOS KPI
        const totalROI = activeInis.reduce((acc, curr) => acc + (curr.roi_eur_anual || 0), 0)
        const avgEfficiency = activeInis.length ? activeInis.reduce((acc, curr) => acc + (curr.roi_eur_anual / (curr.esfuerzo_horas || 1)), 0) / activeInis.length : 0
        const totalEffort = activeInis.reduce((acc, curr) => acc + (curr.esfuerzo_horas || 0), 0)
        const approvalRate = published.length ? Math.round((published.filter(i => i.estado_cliente === 'APROBADA').length / published.length) * 100) : 0

        // DATOS CHART: IMPACTO VS ESFUERZO (Solo publicadas)
        const matrixPoints = published.map(i => ({
            name: i.titulo,
            impact: i.roi_eur_anual,
            effort: i.esfuerzo_horas,
            payback: i.payback_meses,
            id: i.id
        }))

        // DATOS CHART: ROI POR ÁREA
        const areaDataRaw = published.reduce((acc, curr) => {
            acc[curr.area] = (acc[curr.area] || 0) + curr.roi_eur_anual
            return acc
        }, {})
        const areaData = Object.entries(areaDataRaw).map(([name, value]) => ({ name, value }))

        return { totalROI, avgEfficiency, totalEffort, approvalRate, matrixPoints, areaData, totalCount: activeInis.length, top3Count: top3.length }
    }, [iniciativas])

    // CÁLCULO CONFIANZA ROI
    const confianzaROI = useMemo(() => {
        const supuestos = projectData.supuestos || []
        if (supuestos.length === 0) return { level: 'N/A', percent: 0, color: 'gray' }
        
        const validados = supuestos.filter(s => s.estado === 'VALIDADO').length
        const percent = Math.round((validados / supuestos.length) * 100)
        
        if (percent >= 70) return { level: 'Alta', percent, color: 'emerald' }
        if (percent >= 40) return { level: 'Media', percent, color: 'amber' }
        return { level: 'Baja', percent, color: 'rose' }
    }, [projectData.supuestos])

    const COLORS = ['#2563eb', '#0891b2', '#7c3aed', '#db2777', '#f59e0b', '#10b981']

    return (
        <div className="fade-in pb-20 space-y-8">
            {/* HEADER ACCIONES */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black bg-[var(--primary-500)] text-white px-2 py-0.5 rounded uppercase tracking-widest">Diagnóstico</span>
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider italic">VISTA RESUMEN EJECUTIVO</span>
                   </div>
                   <h1 className="text-3xl font-black text-[var(--text-normal)] tracking-tight">Panel de Resultados</h1>
                </div>
                <div className="flex gap-3">
                    <button className="btn bg-white hover:bg-[var(--surface-50)] border-[var(--border-color)] text-[var(--text-normal)] rounded-xl flex items-center gap-2 px-6 py-2.5 font-bold shadow-sm">
                        <FiDownload /> Exportar PDF
                    </button>
                    <button className="btn btn--primary rounded-xl flex items-center gap-2 px-6 py-2.5 shadow-lg shadow-[var(--primary-500)]/20 animate-pulse-slow">
                        <FiShare2 /> Presentar
                    </button>
                </div>
            </div>

            {/* GRID DE KPIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPI label="Impacto Total Anual" value={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(dashboardData.totalROI)} icon={FiTrendingUp} trend={12} />
                <div className="bg-white p-6 rounded-3xl border border-[var(--border-color)] shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-${confianzaROI.color}-50 flex items-center justify-center text-${confianzaROI.color}-600 group-hover:bg-${confianzaROI.color}-500 group-hover:text-white transition-colors`}>
                            <FiShield size={20} />
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-${confianzaROI.color}-100 text-${confianzaROI.color}-700`}>
                            {confianzaROI.percent}% prec.
                        </span>
                    </div>
                    <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Confianza ROI</div>
                    <div className={`text-2xl font-black text-${confianzaROI.color}-600 font-mono text-shadow-sm`}>
                        {confianzaROI.level}
                    </div>
                </div>
                <KPI label="Esfuerzo Estimado" value={Math.round(dashboardData.totalEffort)} icon={FiActivity} suffix=" horas" />
                <KPI label="Tasa de Aceptación" value={dashboardData.approvalRate} icon={FiBarChart2} suffix="%" />
            </div>

            {/* FILA DE GRÁFICOS PRINCIPALES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Cuadrante de Iniciativas (Scatter) */}
                <div className="card p-8 bg-white border border-[var(--border-color)] shadow-sm rounded-[2rem]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-[var(--text-normal)] leading-none mb-2">Portfolio de Iniciativas</h3>
                            <p className="text-xs text-[var(--text-muted)] font-medium">Relación Impacto Económico vs Esfuerzo de Implementación</p>
                        </div>
                        <FiInfo className="text-[var(--text-muted)] cursor-help" />
                    </div>

                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.5} />
                                <XAxis 
                                    type="number" 
                                    dataKey="effort" 
                                    name="Esfuerzo" 
                                    unit="h" 
                                    label={{ value: 'Esfuerzo (Horas)', position: 'insideBottom', offset: -10, fontSize: 10, fontWeight: 900 }} 
                                />
                                <YAxis 
                                    type="number" 
                                    dataKey="impact" 
                                    name="ROI" 
                                    unit="€" 
                                    label={{ value: 'Impacto (€)', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 900 }} 
                                />
                                <ZAxis type="number" dataKey="payback" range={[50, 400]} name="Payback" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter data={dashboardData.matrixPoints} fill="var(--primary-500)">
                                    {dashboardData.matrixPoints.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                    <LabelList dataKey="name" position="top" style={{ fontSize: '9px', fontWeight: 'bold', fill: 'var(--text-muted)' }} offset={10} />
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Distribución por Áreas (Donut) */}
                <div className="card p-8 bg-white border border-[var(--border-color)] shadow-sm rounded-[2rem]">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-[var(--text-normal)] leading-none mb-2">Impacto por Área</h3>
                            <p className="text-xs text-[var(--text-muted)] font-medium">Distribución del ROI proyectado según departamento/proceso</p>
                        </div>
                    </div>

                    <div className="h-[400px] flex items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dashboardData.areaData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {dashboardData.areaData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="pr-4 border-l border-[var(--border-color)] pl-8 space-y-4">
                            {dashboardData.areaData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <div>
                                        <div className="text-[10px] font-bold text-[var(--text-normal)] leading-none mb-1">{entry.name}</div>
                                        <div className="text-xs font-black text-[var(--text-muted)] font-mono">
                                            {Math.round((entry.value / dashboardData.totalROI) * 100)}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN INFERIOR: MATRIX STATUS + NEXT STEPS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Scoreboard Procesos */}
                <div className="lg:col-span-2 card p-8 bg-white border border-[var(--border-color)] shadow-sm rounded-[2rem]">
                    <h3 className="text-lg font-black text-[var(--text-normal)] mb-6">Eficiencia de Procesos Críticos</h3>
                    <div className="space-y-6">
                        {matriz.slice(0, 5).map(area => (
                            <div key={area.id} className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-[var(--text-normal)] uppercase tracking-wider">{area.area_proceso}</span>
                                    <span className="text-[10px] font-black text-[var(--primary-600)] font-mono">{area.puntos.length} Iniciativas</span>
                                </div>
                                <div className="h-2 w-full bg-[var(--surface-100)] rounded-full overflow-hidden flex">
                                    <div 
                                        className="h-full bg-[var(--primary-500)]" 
                                        style={{ width: `${Math.min(100, (area.roi_potencial / dashboardData.totalROI) * 400)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Next Steps / Highlights */}
                <div className="bg-[var(--primary-700)] p-8 rounded-[2rem] text-white shadow-xl shadow-[var(--primary-700)]/20 relative overflow-hidden flex flex-col justify-between">
                    <FiTarget size={120} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
                    
                    <div>
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-4 block">Siguiente Hito</span>
                        <h3 className="text-2xl font-black mb-4 leading-tight">Implementación de Quick Wins (Fase 1)</h3>
                        <p className="text-sm text-white/80 leading-relaxed mb-8">
                            Hemos identificado <strong>{dashboardData.top3Count} iniciativas de alto impacto</strong> que pueden ejecutarse en menos de 90 días con un ROI combinado de {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(dashboardData.totalROI * 0.4)}.
                        </p>
                    </div>

                    <button className="w-full py-4 bg-white text-[var(--primary-700)] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[var(--surface-50)] transition-all shadow-xl">
                        Ver Plan Detallado
                    </button>
                </div>
            </div>
        </div>
    )
}
