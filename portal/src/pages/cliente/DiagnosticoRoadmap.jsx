import { useState, useEffect, useRef, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useProjectData } from '../../context/ProjectContext'
import Gantt from 'frappe-gantt'
import '../../assets/frappe-gantt.css'
import {
    FiList, FiGrid, FiFilter, FiSearch, FiPlus, FiMoreVertical,
    FiCheckCircle, FiAlertCircle, FiClock, FiDollarSign, FiTrendingUp,
    FiMessageSquare, FiPaperclip, FiX, FiEdit2, FiSave, FiEye, FiEyeOff,
    FiChevronUp, FiChevronDown, FiCalendar, FiMap, FiTrash2
} from 'react-icons/fi'
import CommentsSection from '../../components/common/CommentsSection'

// --- HELPERS ---
const formatCurrency = (val) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val)
const formatNumber = (val) => new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }).format(val)

const CONFIDENCE_COLORS = { 'ALTA': 'badge--success', 'MEDIA': 'badge--warning', 'BAJA': 'badge--danger' }
const STATUS_COLORS = { 'APROBADA': 'badge--success', 'PENDIENTE': 'badge--neutral', 'EN_REVISION': 'badge--warning', 'POSPUESTA': 'badge--neutral', 'DESCARTADA': 'badge--danger' }

export default function DiagnosticoRoadmap() {
    const { isConsultor, isCliente } = useAuth()
    const { projectData, updateIniciativas, addIniciativa, deleteIniciativa } = useProjectData()
    const initiatives = projectData.iniciativas

    const [viewMode, setViewMode] = useState('table') // 'table' | 'timeline'
    const [search, setSearch] = useState('')
    const [filterTop3, setFilterTop3] = useState(false)
    const [filterDeps] = useState(false)

    const [selectedInitiativeId, setSelectedInitiativeId] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    // -- DERIVED DATA --
    const filteredInitiatives = useMemo(() => {
        let data = [...initiatives]

        // Client Visibility Check
        if (isCliente) {
            data = data.filter(i => i.estado_visibilidad === 'PUBLICADA')
        }

        // Search
        if (search) {
            const lowSearch = search.toLowerCase()
            data = data.filter(i => i.titulo.toLowerCase().includes(lowSearch))
        }

        // Filters
        if (filterTop3) {
            data = data.filter(i => i.isTop)
        }
        if (filterDeps) {
            data = data.filter(i => i.dependencies && i.dependencies.length > 0)
        }

        // Sort by 'orden' field
        data.sort((a, b) => (a.orden || 99) - (b.orden || 99))

        return data
    }, [initiatives, search, filterTop3, filterDeps, isCliente])

    const kpis = useMemo(() => {
        const top3 = initiatives.filter(i => i.isTop)
        const totalRoi = top3.reduce((acc, curr) => acc + (curr.roi_eur_anual || 0), 0)
        const totalEffort = top3.reduce((acc, curr) => acc + (curr.esfuerzo_horas || 0), 0)
        const avgPayback = top3.length ? top3.reduce((acc, curr) => acc + (curr.payback_meses || 0), 0) / top3.length : 0
        return { totalRoi, totalEffort, avgPayback }
    }, [initiatives])

    // -- HANDLERS --
    const handleReorder = (id, direction) => {
        if (!isConsultor) return
        
        const sorted = [...initiatives].sort((a, b) => (a.orden || 0) - (b.orden || 0))
        const index = sorted.findIndex(i => i.id === id)
        if (index < 0) return
        
        const newIndex = direction === 'up' ? index - 1 : index + 1
        if (newIndex < 0 || newIndex >= sorted.length) return

        // Swap orden
        const temp = sorted[index].orden
        sorted[index].orden = sorted[newIndex].orden
        sorted[newIndex].orden = temp

        updateIniciativas(sorted)
    }

    const handleUpdateInitiative = (updated) => {
        updateIniciativas(initiatives.map(i => i.id === updated.id ? updated : i))
    }

    const handleAddInitiative = () => {
        const newInit = {
            titulo: 'Nueva Iniciativa',
            resumen: 'Descripción de la iniciativa...',
            estado_visibilidad: 'BORRADOR',
            estado_cliente: 'PENDIENTE',
            roi_eur_anual: 0,
            esfuerzo_horas: 0,
            payback_meses: 0,
            confianza: 'MEDIA',
            area: 'General',
            comentarios_count: 0,
            adjuntos_count: 0,
            isTop: false,
            start_date: new Date().toISOString().split('T')[0],
            end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dependencies: [],
            orden: initiatives.length + 1
        }
        addIniciativa(newInit)
    }

    const handleDelete = (id, e) => {
        e.stopPropagation()
        if (window.confirm('¿Eliminar esta iniciativa?')) {
            deleteIniciativa(id)
            if (selectedInitiativeId === id) setIsDrawerOpen(false)
        }
    }

    return (
        <div className="fade-in pb-20 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                         <span className="text-[10px] font-black bg-[var(--primary-500)] text-white px-2 py-0.5 rounded uppercase tracking-widest">Diagnóstico</span>
                         <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                            {isConsultor ? 'MODO EDICIÓN' : 'VISTA CLIENTE'}
                         </span>
                    </div>
                </div>
            </div>

            {/* TOP ACTIONS & KPIS */}
            <section className="flex flex-wrap items-center justify-between gap-6">
                {/* Module Title & Context */}
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--primary-700)] flex items-center justify-center shadow-lg shadow-[var(--primary-500)]/20">
                        <FiMap className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--text-normal)] tracking-tight">Roadmap Estratégico</h1>
                        <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-widest">Hoja de ruta validada</p>
                    </div>
                </div>

                {/* KPI Cards Strip */}
                <div className="flex items-center gap-2">
                    <div className="px-5 py-3 rounded-2xl bg-white border border-[var(--border-color)] shadow-sm flex flex-col items-end">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">ROI Proyectado</span>
                        <span className="text-lg font-bold text-[var(--secondary-600)] font-mono">{formatCurrency(kpis.totalRoi)}</span>
                    </div>
                    <div className="px-5 py-3 rounded-2xl bg-white border border-[var(--border-color)] shadow-sm flex flex-col items-end">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">Esfuerzo Total</span>
                        <span className="text-lg font-bold text-[var(--primary-600)] font-mono">{Math.round(kpis.totalEffort)}h</span>
                    </div>
                    <div className="px-5 py-3 rounded-2xl bg-[var(--surface-50)] border border-[var(--border-color)] shadow-sm flex flex-col items-end">
                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">Payback Medio</span>
                        <span className="text-lg font-bold text-[var(--text-normal)] font-mono">{formatNumber(kpis.avgPayback)}m</span>
                    </div>
                </div>
            </section>

            {/* TOOLBAR */}
            <section className="glass-panel p-2 rounded-2xl border border-[var(--border-color)] flex items-center justify-between shadow-xl shadow-black/5">
                <div className="flex items-center gap-4">
                    {/* View Switcher */}
                    <div className="flex bg-[var(--surface-100)] rounded-xl p-1 border border-[var(--border-color)]">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-white shadow-md text-[var(--primary-600)]' : 'text-[var(--text-muted)] hover:text-[var(--text-normal)]'}`}
                        >
                            <FiList /> Tabla
                        </button>
                        <button
                            onClick={() => setViewMode('timeline')}
                            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'timeline' ? 'bg-white shadow-md text-[var(--primary-600)]' : 'text-[var(--text-muted)] hover:text-[var(--text-normal)]'}`}
                        >
                            <FiCalendar /> Timeline
                        </button>
                    </div>

                    <div className="h-8 w-px bg-[var(--border-color)]"></div>

                    {/* Quick Filters */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFilterTop3(!filterTop3)}
                            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${filterTop3 ? 'bg-[var(--primary-500)] text-white border-[var(--primary-500)] shadow-lg shadow-[var(--primary-500)]/20' : 'bg-transparent border-[var(--border-color)] text-[var(--text-muted)] hover:border-[var(--primary-500)]'}`}
                        >
                            Ver TOP 3
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative group">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-hover:text-[var(--primary-500)] transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar iniciativa..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface-ground)] hover:bg-white focus:bg-white text-xs font-medium focus:ring-1 focus:ring-[var(--primary-500)] outline-none w-48 focus:w-64 transition-all"
                        />
                    </div>
                </div>

                {isConsultor && (
                    <button 
                        onClick={handleAddInitiative}
                        className="btn btn--primary py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-[var(--primary-500)]/20 active:scale-95 transition-all"
                    >
                        <FiPlus /> Nueva Iniciativa
                    </button>
                )}
            </section>

            {/* CONTENT */}
            <main className="min-h-[500px] animate-fadeIn">
                {viewMode === 'table' ? (
                    <TableView
                        data={filteredInitiatives}
                        isConsultant={isConsultor}
                        onRowClick={(id) => { setSelectedInitiativeId(id); setIsDrawerOpen(true) }}
                        onReorder={handleReorder}
                        onDelete={handleDelete}
                    />
                ) : (
                    <GanttView
                        data={filteredInitiatives}
                        onTaskClick={(id) => { setSelectedInitiativeId(id); setIsDrawerOpen(true) }}
                    />
                )}
            </main>

            {/* DRAWER */}
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                initiative={initiatives.find(i => i.id === selectedInitiativeId)}
                isConsultant={isConsultor}
                onUpdate={handleUpdateInitiative}
                allInitiatives={initiatives}
                onDelete={handleDelete}
            />
        </div>
    )
}

// --- SUB-COMPONENTS ---

function TableView({ data, isConsultant, onRowClick, onReorder, onDelete }) {
    if (data.length === 0) return (
        <div className="card py-20 text-center border-dashed border-2 bg-[var(--surface-ground)]">
            <FiList size={48} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
            <h3 className="text-lg font-bold text-[var(--text-normal)]">No se encontraron iniciativas</h3>
            <p className="text-[var(--text-muted)] max-w-sm mx-auto mt-2">Prueba a limpiar los filtros o la búsqueda.</p>
        </div>
    )

    return (
        <div className="card shadow-xl border-0 overflow-hidden ring-1 ring-[var(--border-color)]">
            <div className="table-container">
                <table className="table w-full border-collapse">
                    <thead>
                        <tr className="bg-[var(--surface-50)] border-b border-[var(--border-color)]">
                            <th className="px-6 py-4 text-center w-16 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">#</th>
                            <th className="px-6 py-4 text-left text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Iniciativa</th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">ROI Anual</th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Esfuerzo</th>
                            <th className="px-6 py-4 text-right text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Payback</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Confianza</th>
                            <th className="px-6 py-4 text-center text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-4 text-center w-20 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Consultas</th>
                            {isConsultant && <th className="px-6 py-4 text-center w-32 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Acciones</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)] bg-white text-sm">
                        {data.map((row, index) => (
                            <tr key={row.id} onClick={() => onRowClick(row.id)} className={`hover:bg-[var(--primary-50)]/30 cursor-pointer transition-all group ${row.estado_visibilidad === 'BORRADOR' ? 'opacity-70' : ''}`}>
                                <td className="px-6 py-5 text-center font-mono text-[var(--text-muted)] font-bold">{index + 1}</td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold text-[var(--text-normal)] group-hover:text-[var(--primary-600)] transition-colors leading-tight">
                                            {row.titulo}
                                            {row.estado_visibilidad === 'BORRADOR' && (
                                                <span className="ml-2 text-[8px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded font-black tracking-widest uppercase">Borrador</span>
                                            )}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            {row.isTop && (
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-black tracking-tighter border bg-amber-100 text-amber-700 border-amber-200`}>
                                                    TOP PRX
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right font-mono font-bold text-[var(--secondary-600)] whitespace-nowrap">
                                    {formatCurrency(row.roi_eur_anual)}
                                </td>
                                <td className="px-6 py-5 text-right font-mono text-[var(--text-muted)]">
                                    {Math.round(row.esfuerzo_horas)}h
                                </td>
                                <td className="px-6 py-5 text-right font-mono font-medium text-[var(--text-normal)]">
                                    {formatNumber(row.payback_meses)}m
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex justify-center">
                                        <span className={`badge badge--sm ${CONFIDENCE_COLORS[row.confianza]} font-bold shadow-sm`}>
                                            {row.confianza}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex justify-center">
                                        <span className={`badge badge--sm ${STATUS_COLORS[row.estado_cliente]} font-bold`}>
                                            {row.estado_cliente.replace('_', ' ')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    {row.comentarios_count > 0 ? (
                                        <div className="flex items-center justify-center gap-1 text-[var(--primary-600)] font-bold">
                                            <FiMessageSquare size={14} />
                                            <span className="text-xs">{row.comentarios_count}</span>
                                        </div>
                                    ) : (
                                        <FiMessageSquare className="mx-auto text-[var(--text-muted)] opacity-20" size={14} />
                                    )}
                                </td>
                                {isConsultant && (
                                    <td className="px-6 py-5" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => onReorder(row.id, 'up')}
                                                disabled={index === 0}
                                                className="p-1.5 hover:bg-[var(--surface-100)] rounded-md disabled:opacity-20 transition-colors"
                                            >
                                                <FiChevronUp />
                                            </button>
                                            <button 
                                                onClick={() => onReorder(row.id, 'down')}
                                                disabled={index === data.length - 1}
                                                className="p-1.5 hover:bg-[var(--surface-100)] rounded-md disabled:opacity-20 transition-colors"
                                            >
                                                <FiChevronDown />
                                            </button>
                                            <button 
                                                onClick={(e) => onDelete(row.id, e)}
                                                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function GanttView({ data, onTaskClick }) {
    const ganttRef = useRef(null)
    const containerRef = useRef(null)

    useEffect(() => {
        if (!containerRef.current || data.length === 0) return

        const tasks = data.map(item => ({
            id: String(item.id),
            name: item.titulo,
            start: item.start_date,
            end: item.end_date,
            progress: 0,
            dependencies: item.dependencies ? item.dependencies.join(', ') : '',
            custom_class: item.isTop ? 'gantt-top' : 'gantt-normal'
        }))

        containerRef.current.innerHTML = ''

        try {
            ganttRef.current = new Gantt(containerRef.current, tasks, {
                header_height: 60,
                column_width: 40,
                step: 24,
                view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
                bar_height: 24,
                bar_corner_radius: 12,
                arrow_curve: 5,
                padding: 18,
                view_mode: 'Week',
                date_format: 'YYYY-MM-DD',
                custom_popup_html: null,
                on_click: (task) => onTaskClick(Number(task.id)),
            })
        } catch (e) {
            console.error("Gantt error:", e)
            containerRef.current.innerHTML = '<div class="p-4 text-red-500">Error cargando Gantt</div>'
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    return (
        <div className="card p-8 overflow-hidden shadow-xl border-0 ring-1 ring-[var(--border-color)] bg-white">
            <style>{`
                .gantt-top .bar { fill: var(--primary-500); }
                .gantt-normal .bar { fill: var(--surface-300); }
                .gantt .grid-header { fill: var(--surface-50); stroke: var(--border-color); }
                .gantt .tick { fill: var(--text-muted); font-size: 10px; font-weight: bold; }
            `}</style>
            <div ref={containerRef} className="w-full"></div>
        </div>
    )
}

function Drawer({ isOpen, onClose, initiative, isConsultant, onUpdate, onDelete }) {
    const [activeTab, setActiveTab] = useState('summary')
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState(initiative ? { ...initiative } : {})

    useEffect(() => {
        if (initiative) {
            setFormData({ ...initiative })
            setIsEditing(false)
        }
    }, [initiative])

    if (!initiative) return null

    const handleSave = () => {
        onUpdate(formData)
        setIsEditing(false)
    }

    return (
        <>
            <div className={`fixed inset-0 bg-black/50 z-[200] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
            <div className={`fixed right-0 top-0 bottom-0 w-[500px] bg-white z-[300] shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
                
                {/* Header */}
                <div className="p-8 border-b border-[var(--border-color)] flex justify-between items-start bg-gradient-to-r from-white to-[var(--surface-50)]">
                    <div className="pr-8">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[var(--primary-100)] text-[var(--primary-700)] uppercase tracking-widest">
                                {initiative.isTop ? 'PRIORITARIA' : 'BACKLOG'}
                            </span>
                            <span className={`badge badge--sm ${STATUS_COLORS[initiative.estado_cliente]}`}>{initiative.estado_cliente}</span>
                        </div>
                        <h2 className="text-2xl font-black text-[var(--text-normal)] leading-tight tracking-tight">{initiative.titulo}</h2>
                    </div>
                    <div className="flex gap-2">
                        {isConsultant && <button onClick={(e) => onDelete(initiative.id, e)} className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-all"><FiTrash2 size={20} /></button>}
                        <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-md rounded-full text-[var(--text-muted)] transition-all">
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex px-8 border-b border-[var(--border-color)] bg-white sticky top-0 z-10">
                    <button 
                        onClick={() => setActiveTab('summary')}
                        className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === 'summary' ? 'border-[var(--primary-500)] text-[var(--primary-600)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-normal)]'}`}
                    >
                        Iniciativa
                    </button>
                    <button 
                        onClick={() => setActiveTab('comments')}
                        className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 flex items-center gap-2 ${activeTab === 'comments' ? 'border-[var(--primary-500)] text-[var(--primary-600)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-normal)]'}`}
                    >
                        Chat {initiative.comentarios_count > 0 && <span className="w-5 h-5 rounded-full bg-[var(--primary-100)] text-[var(--primary-600)] flex items-center justify-center text-[10px]">{initiative.comentarios_count}</span>}
                    </button>
                </div>

                <div className="p-8 space-y-10">
                    {activeTab === 'summary' ? (
                        <>
                            {/* ROI & Key Data */}
                            <section className="grid grid-cols-2 gap-4">
                                <div className="p-5 rounded-2xl bg-white border border-[var(--border-color)] shadow-sm">
                                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">ROI Anual</div>
                                    <div className="text-2xl font-black text-[var(--secondary-600)] font-mono">{formatCurrency(initiative.roi_eur_anual)}</div>
                                </div>
                                <div className="p-5 rounded-2xl bg-white border border-[var(--border-color)] shadow-sm">
                                    <div className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Payback</div>
                                    <div className="text-2xl font-black text-[var(--text-normal)] font-mono">{formatNumber(initiative.payback_meses)} m.</div>
                                </div>
                            </section>

                            {/* Description */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black text-[var(--text-normal)] uppercase tracking-widest">Definición</h3>
                                    {isConsultant && !isEditing && (
                                        <button onClick={() => setIsEditing(true)} className="text-[10px] font-bold text-[var(--primary-600)] bg-[var(--primary-50)] px-3 py-1 rounded-lg">Editar</button>
                                    )}
                                </div>
                                
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <input type="text" className="w-full p-3 border rounded-xl" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} placeholder="Título" />
                                        <textarea 
                                            className="w-full p-4 border rounded-xl min-h-[120px] text-sm" 
                                            value={formData.resumen}
                                            onChange={e => setFormData({ ...formData, resumen: e.target.value })}
                                            placeholder="Resumen"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="number" className="p-3 border rounded-xl" value={formData.roi_eur_anual} onChange={e => setFormData({ ...formData, roi_eur_anual: parseInt(e.target.value) || 0 })} placeholder="ROI" />
                                            <input type="number" className="p-3 border rounded-xl" value={formData.esfuerzo_horas} onChange={e => setFormData({ ...formData, esfuerzo_horas: parseInt(e.target.value) || 0 })} placeholder="Horas" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="date" className="p-3 border rounded-xl" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
                                            <input type="date" className="p-3 border rounded-xl" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 rounded-3xl bg-[var(--surface-50)] border border-[var(--border-color)]/50">
                                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic">"{initiative.resumen}"</p>
                                    </div>
                                )}
                            </section>

                            {/* Consultant Internal Options */}
                            {isConsultant && (
                                <section className="p-6 rounded-2xl bg-[var(--primary-50)]/30 border border-[var(--primary-100)]">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-[10px] font-black text-[var(--primary-700)] uppercase tracking-widest">Control del Consultor</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.estado_visibilidad === 'PUBLICADA'} 
                                                onChange={e => {
                                                    const updated = { ...formData, estado_visibilidad: e.target.checked ? 'PUBLICADA' : 'BORRADOR' }
                                                    setFormData(updated)
                                                    onUpdate(updated)
                                                }}
                                                className="w-4 h-4 rounded text-[var(--primary-600)]"
                                            />
                                            <span className="text-xs font-bold">Visible para el cliente</span>
                                        </label>
                                    </div>
                                </section>
                            )}
                        </>
                    ) : (
                        <CommentsSection comments={[]} />
                    )}
                </div>

                {/* Footer Edit Actions */}
                {isEditing && (
                    <div className="p-8 border-t flex gap-4 bg-white sticky bottom-0 shadow-lg">
                        <button onClick={handleSave} className="bg-blue-600 text-white flex-1 py-3 rounded-xl font-bold">Guardar</button>
                        <button onClick={() => setIsEditing(false)} className="text-slate-400 font-bold px-4">Cancelar</button>
                    </div>
                )}
            </div>
        </>
    )
}
