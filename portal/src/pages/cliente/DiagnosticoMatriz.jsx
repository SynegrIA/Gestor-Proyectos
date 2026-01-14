import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useProjectData } from '../../context/ProjectContext'
import {
    ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip,
    ResponsiveContainer, ReferenceLine, LabelList
} from 'recharts'
import {
    FiList, FiGrid, FiFilter, FiDollarSign, FiClock,
    FiX, FiMessageSquare, FiPaperclip,
    FiActivity, FiSearch, FiSettings, FiChevronRight, FiTrendingUp, FiInfo, FiPlus, FiTrash2
} from 'react-icons/fi'
import CommentsSection from '../../components/common/CommentsSection'

// --- CONSTANTS ---
const DEPARTMENTS = ['Ventas', 'Finanzas', 'Operaciones', 'RRHH', 'Marketing', 'Dirección', 'IT']
const COLORS_BY_DEP = {
    'Ventas': '#6366f1',
    'Finanzas': '#10b981',
    'Operaciones': '#f59e0b',
    'RRHH': '#ec4899',
    'Marketing': '#8b5cf6',
    'Dirección': '#ef4444',
    'IT': '#06b6d4'
}

// --- HELPERS ---
const parseFrequency = (freqRaw, dailyBase = 20) => {
    if (!freqRaw) return { val: 0, valid: false }
    const lower = freqRaw.toLowerCase().trim().replace(',', '.')
    if (lower === 'diario') return { val: dailyBase, valid: true }
    if (lower === 'semanal') return { val: 4, valid: true }
    if (lower === 'mensual') return { val: 1, valid: true }
    if (lower === 'quincenal') return { val: 2, valid: true }
    const mesMatch = lower.match(/^([\d.]+)\s*\/?\s*mes$/)
    if (mesMatch) return { val: parseFloat(mesMatch[1]), valid: true }
    const anoMatch = lower.match(/^([\d.]+)\s*\/?\s*añ?o$/)
    if (anoMatch) return { val: parseFloat(anoMatch[1]) / 12, valid: true }
    const num = parseFloat(lower)
    if (!isNaN(num)) return { val: num, valid: true }
    return { val: 0, valid: false }
}

const formatCurrency = (val) => {
    if (val === undefined || val === null) return '--'
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val)
}

const formatNumber = (val) => new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }).format(val)

export default function DiagnosticoMatriz() {
    const { isConsultor } = useAuth()
    const { projectData, updateProcesses, addProcess, deleteProcess } = useProjectData()
    const processes = projectData.matriz.processes

    const [viewMode, setViewMode] = useState(() => localStorage.getItem('matriz_view_mode') || 'table')
    const [costPerHour, setCostPerHour] = useState(45)
    const [dailyBase] = useState(20)
    const [showSettings, setShowSettings] = useState(false)
    const [metric, setMetric] = useState('eur')
    const [filterDept] = useState([])
    const [search, setSearch] = useState('')
    const [showOnlyTop] = useState(false)
    const [selectedProcessId, setSelectedProcessId] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    useEffect(() => {
        localStorage.setItem('matriz_view_mode', viewMode)
    }, [viewMode])

    const processedData = useMemo(() => {
        return (processes || []).map(p => {
            const { val: freqMonthly, valid: freqValid } = parseFrequency(p.freq_raw, dailyBase)
            const hoursMonth = (freqMonthly * (p.time_min || 0)) / 60
            const eurMonth = hoursMonth * costPerHour
            return {
                ...p,
                freqMonthly,
                freqValid,
                hoursMonth,
                eurMonth,
                impactVal: metric === 'eur' ? eurMonth : hoursMonth
            }
        })
    }, [processes, dailyBase, costPerHour, metric])

    const filteredData = useMemo(() => {
        let data = processedData.filter(p => {
            if (search && !(p.name || '').toLowerCase().includes(search.toLowerCase())) return false
            if (filterDept.length > 0 && !filterDept.includes(p.dep)) return false
            return true
        })
        if (showOnlyTop) {
            data = [...data].sort((a, b) => b.impactVal - a.impactVal).slice(0, 10)
        }
        return data
    }, [processedData, search, filterDept, showOnlyTop])

    const stats = useMemo(() => {
        const totalEur = filteredData.reduce((acc, p) => acc + (p.eurMonth || 0), 0)
        const totalHours = filteredData.reduce((acc, p) => acc + (p.hoursMonth || 0), 0)
        return { totalEur, totalHours }
    }, [filteredData])

    const handleRowClick = (proc) => {
        setSelectedProcessId(proc.id)
        setIsDrawerOpen(true)
    }

    const handleSaveProcess = (updatedProc) => {
        updateProcesses(processes.map(p => p.id === updatedProc.id ? { ...p, ...updatedProc } : p))
    }

    const handleDelete = (id, e) => {
        e.stopPropagation();
        if (window.confirm('¿Eliminar este proceso?')) {
            deleteProcess(id);
        }
    }

    return (
        <div className="fade-in max-w-[1600px] mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 mt-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                         <span className="text-[10px] font-black bg-[var(--primary-500)] text-white px-2 py-0.5 rounded uppercase tracking-widest">Diagnóstico</span>
                         <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                            {isConsultor ? 'MODO EDICIÓN' : 'VISTA LECTURA'}
                         </span>
                    </div>
                    <h1 className="text-4xl font-black text-[var(--text-normal)] tracking-tighter">Matriz de Procesos</h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-4 p-4 bg-white border border-[var(--border-color)] rounded-2xl shadow-sm">
                        <div className="px-4 border-r border-[var(--border-color)]">
                            <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">Impacto Total</span>
                            <span className="text-xl font-mono font-black text-[var(--secondary-600)]">{formatCurrency(stats.totalEur * 12)} <small className="text-[10px] opacity-60">/año</small></span>
                        </div>
                        <div className="px-4">
                             <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">Horas Recuperables</span>
                             <span className="text-xl font-mono font-black text-[var(--primary-600)]">{formatNumber(stats.totalHours)} <small className="text-[10px] opacity-60">h/mes</small></span>
                        </div>
                    </div>
                    
                    {isConsultor && (
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-[var(--primary-600)] text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <FiPlus size={18} /> Añadir
                        </button>
                    )}

                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-3 rounded-2xl border transition-all ${showSettings ? 'bg-[var(--primary-500)] text-white border-[var(--primary-500)]' : 'bg-white border-[var(--border-color)] text-[var(--text-muted)] shadow-sm'}`}
                    >
                        <FiSettings size={20} />
                    </button>
                </div>
            </div>

            {showSettings && (
                <div className="mb-8 p-6 bg-white border border-[var(--border-color)] rounded-3xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
                    <div>
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3 block">Coste por Hora (€)</label>
                        <input 
                            type="number" 
                            value={costPerHour} 
                            onChange={e => setCostPerHour(Number(e.target.value))}
                            className="w-full p-3 rounded-xl border border-slate-200 font-bold"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3 block">Métrica</label>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button onClick={() => setMetric('eur')} className={`flex-1 py-2 rounded-lg text-xs font-black uppercase ${metric === 'eur' ? 'bg-white shadow-sm' : ''}`}>€ Impacto</button>
                            <button onClick={() => setMetric('hours')} className={`flex-1 py-2 rounded-lg text-xs font-black uppercase ${metric === 'hours' ? 'bg-white shadow-sm' : ''}`}>Horas</button>
                        </div>
                    </div>
                    <div className="flex items-end">
                        <button onClick={() => setShowSettings(false)} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold uppercase text-[10px]">Cerrar</button>
                    </div>
                </div>
            )}

            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between p-3 bg-white/50 backdrop-blur-md rounded-2xl border border-[var(--border-color)]">
                <div className="flex items-center gap-4">
                    <div className="flex bg-white p-1 rounded-xl shadow-sm border border-[var(--border-color)]">
                        <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg ${viewMode === 'table' ? 'bg-[var(--primary-600)] text-white' : ''}`}><FiList size={20} /></button>
                        <button onClick={() => setViewMode('chart')} className={`p-2 rounded-lg ${viewMode === 'chart' ? 'bg-[var(--primary-600)] text-white' : ''}`}><FiGrid size={20} /></button>
                    </div>
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none text-sm w-64"
                        />
                    </div>
                </div>
            </div>

                {filteredData.length === 0 ? (
                    <div className="bg-white rounded-3xl p-20 text-center border-dashed border-2 border-slate-200">
                        <p className="text-slate-400">No hay procesos para mostrar.</p>
                    </div>
                ) : viewMode === 'table' ? (
                    <TableView data={filteredData} metric={metric} isConsultor={isConsultor} onRowClick={handleRowClick} onDelete={handleDelete} />
                ) : (
                    <ChartView data={filteredData} metric={metric} onNodeClick={handleRowClick} metricLabel={metric === 'eur' ? '€/Mes' : 'h/Mes'} />
                )}

            {selectedProcessId && (
                <ProcessDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    process={processedData.find(p => p.id === selectedProcessId)}
                    isConsultant={isConsultor}
                    onSave={handleSaveProcess}
                />
            )}

            {isAddModalOpen && (
                <AddProcessModal onClose={() => setIsAddModalOpen(false)} onAdd={(p) => { addProcess(p); setIsAddModalOpen(false); }} />
            )}

            <div className="mt-10 max-w-3xl">
                <CommentsSection comments={[]} />
            </div>
        </div>
    )
}

function TableView({ data, metric, onRowClick, isConsultor, onDelete }) {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase">Depto</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase">Proceso</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase">Frecuencia</th>
                        <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase">Tiempo</th>
                        <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase">Impacto</th>
                        <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase">Dolor</th>
                        {isConsultor && <th className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase">Acciones</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 italic font-medium">
                    {data.map(row => (
                        <tr key={row.id} onClick={() => onRowClick(row)} className="hover:bg-slate-50 cursor-pointer">
                            <td className="px-6 py-5">
                                <span className="text-[10px] font-black text-white px-2 py-1 rounded" style={{ backgroundColor: COLORS_BY_DEP[row.dep] }}>{row.dep}</span>
                            </td>
                            <td className="px-6 py-5 font-bold">{row.name}</td>
                            <td className="px-6 py-5 font-mono text-xs">{row.freq_raw}</td>
                            <td className="px-6 py-5 text-right font-mono text-xs">{row.time_min}m</td>
                            <td className="px-6 py-5 text-right font-mono font-black text-[var(--secondary-600)]">
                                {metric === 'eur' ? formatCurrency(row.eurMonth) : `${formatNumber(row.hoursMonth)}h`}
                            </td>
                            <td className="px-6 py-5 text-center"><BadgePain level={row.pain} /></td>
                            {isConsultor && (
                                <td className="px-6 py-5 text-center">
                                    <button onClick={(e) => { e.stopPropagation(); onDelete(row.id, e); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function ChartView({ data, metric, onNodeClick, metricLabel }) {
    return (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" dataKey="impactVal" name={metricLabel} tickFormatter={v => metric === 'eur' ? v + '€' : v + 'h'} fontSize={10} />
                    <YAxis type="number" dataKey="pain" name="Dolor" domain={[0, 10]} fontSize={10} />
                    <ZAxis type="number" dataKey="impactVal" range={[100, 1000]} />
                    <RechartsTooltip />
                    <Scatter data={data} fill="#6366f1" onClick={n => onNodeClick(n.payload)} className="cursor-pointer" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    )
}

function ProcessDrawer({ isOpen, onClose, process, isConsultant, onSave }) {
    const [isEditing, setIsEditing] = useState(false)
    const [obs, setObs] = useState(process?.observations || '')
    
    useEffect(() => { 
        if (process) {
            setObs(process.observations || ''); 
            setIsEditing(false);
        }
    }, [process])

    if (!process) return null;

    return (
        <>
            <div className={`fixed inset-0 bg-black/20 z-[200] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
            <div className={`fixed right-0 top-0 bottom-0 w-[500px] bg-white z-[300] shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-10 overflow-y-auto`}>
                <div className="flex justify-between items-start mb-8">
                    <h2 className="text-2xl font-black">{process.name}</h2>
                    <button onClick={onClose}><FiX size={24} /></button>
                </div>
                <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                            <span className="text-[10px] font-black opacity-40 uppercase">Impacto Mensual</span>
                            <div className="text-xl font-black">{formatCurrency(process.eurMonth)}</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl">
                            <span className="text-[10px] font-black opacity-40 uppercase">Carga Mensual</span>
                            <div className="text-xl font-black">{formatNumber(process.hoursMonth)}h</div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-black uppercase tracking-widest">Análisis</h3>
                            {isConsultant && !isEditing && <button onClick={() => setIsEditing(true)} className="text-xs text-blue-600 font-bold flex items-center gap-1"><FiSettings /> Editar</button>}
                        </div>
                        {isEditing ? (
                            <div className="space-y-4">
                                <textarea className="w-full p-4 border border-slate-200 rounded-xl h-32 text-sm" value={obs} onChange={e => setObs(e.target.value)} />
                                <div className="flex gap-2">
                                    <button onClick={() => { onSave({...process, observations: obs}); setIsEditing(false); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold">Guardar</button>
                                    <button onClick={() => setIsEditing(false)} className="text-xs font-bold text-slate-400">Cancelar</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-600 leading-relaxed italic">{process.observations || 'Sin observaciones.'}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

function AddProcessModal({ onClose, onAdd }) {
    const [data, setData] = useState({ dep: 'Ventas', name: '', freq_raw: '1/mes', time_min: 30, pain: 5 });
    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[32px] p-8 animate-slideUp">
                <h2 className="text-2xl font-black mb-6">Nuevo Proceso</h2>
                <div className="space-y-4 mb-8">
                    <input className="w-full p-3 border border-slate-200 rounded-xl" placeholder="Nombre" value={data.name} onChange={e => setData({...data, name: e.target.value})} />
                    <select className="w-full p-3 border border-slate-200 rounded-xl" value={data.dep} onChange={e => setData({...data, dep: e.target.value})}>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                        <input className="w-full p-3 border border-slate-200 rounded-xl" placeholder="Frecuencia" value={data.freq_raw} onChange={e => setData({...data, freq_raw: e.target.value})} />
                        <input className="w-full p-3 border border-slate-200 rounded-xl" type="number" placeholder="Minutos" value={data.time_min} onChange={e => setData({...data, time_min: Number(e.target.value)})} />
                    </div>
                    <input className="w-full p-3 border border-slate-200 rounded-xl" type="number" placeholder="Dolor (1-10)" value={data.pain} onChange={e => setData({...data, pain: Number(e.target.value)})} />
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 text-slate-400 font-bold">Cancelar</button>
                    <button onClick={() => onAdd(data)} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold">Crear</button>
                </div>
            </div>
        </div>
    )
}

function BadgePain({ level }) {
    let color = 'bg-slate-400'
    if (level >= 8) color = 'bg-red-500'
    else if (level >= 5) color = 'bg-amber-500'
    else if (level > 0) color = 'bg-emerald-500'
    return <div className={`w-8 h-8 rounded-full ${color} text-white flex items-center justify-center text-[10px] font-black`}>{level}</div>
}
