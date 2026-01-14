import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { 
    FiArrowRight, FiFilter, FiSearch, FiCheckCircle, FiXCircle, 
    FiMessageSquare, FiPaperclip, FiMoreVertical, FiPlus, 
    FiEye, FiEyeOff, FiEdit2, FiRepeat, FiTrendingUp, FiClock, FiActivity, FiTrash2, FiX, FiArchive, FiMaximize2, FiChevronDown, FiChevronUp, FiBox, FiLayers, FiZap, FiTarget
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useProjectData } from '../../context/ProjectContext'
import CommentsSection from '../../components/common/CommentsSection'

const PHASES = ['Quick Wins', 'Automatización', 'Optimización', 'Estrategia']

const STATUS_COLORS = {
    APROBADA: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    PENDIENTE: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    POSPUESTA: 'bg-amber-50 text-amber-600 border border-amber-100',
    DESCARTADA: 'bg-slate-100 text-slate-500 border border-slate-200'
}

export default function DiagnosticoIniciativas() {
    const { isConsultor, isCliente } = useAuth()
    const { projectData, updateIniciativas, addIniciativa } = useProjectData()
    const initiatives = useMemo(() => projectData.iniciativas || [], [projectData.iniciativas])

    const [editMode, setEditMode] = useState(false)
    const [filter, setFilter] = useState('Todas')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedId, setSelectedId] = useState(null)
    const [notification, setNotification] = useState(null)
    const [showGlobalComments, setShowGlobalComments] = useState(false)

    // Auto-select first initiative if none selected
    useEffect(() => {
        if (!selectedId && initiatives.length > 0) {
            setSelectedId(initiatives[0].id)
        }
    }, [initiatives, selectedId])

    const showNotify = (message) => {
        setNotification(message)
        setTimeout(() => setNotification(null), 3000)
    }

    const stats = useMemo(() => {
        const top3 = initiatives.filter(ini => !ini.archivada).sort((a,b) => b.roi_eur_anual - a.roi_eur_anual).slice(0, 3)
        const activeInis = initiatives.filter(ini => !ini.archivada)
        const aprobadas = initiatives.filter(ini => ini.estado_cliente === 'APROBADA' && !ini.archivada)
        const lowConfidence = initiatives.filter(ini => (ini.confianza === 'BAJA' || ini.confianza === 'MEDIA') && !ini.archivada)

        return {
            roiTop3: top3.reduce((acc, ini) => acc + (ini.roi_eur_anual || 0), 0),
            roiAprobadas: aprobadas.reduce((acc, ini) => acc + (ini.roi_eur_anual || 0), 0),
            payback: activeInis.length ? (activeInis.reduce((acc, ini) => acc + (ini.payback_meses || 0), 0) / activeInis.length).toFixed(1) : 0,
            inValidation: lowConfidence.length
        }
    }, [initiatives])

    const filteredIniciativas = useMemo(() => {
        return initiatives
            .filter(ini => {
                // Visibility check for client
                if (isCliente && ini.estado_visibilidad !== 'PUBLICADA') return false
                
                // Search check
                if (searchQuery && !ini.titulo.toLowerCase().includes(searchQuery.toLowerCase()) && !ini.area.toLowerCase().includes(searchQuery.toLowerCase())) return false

                // Filter check
                if (filter === 'Archivadas') return ini.archivada
                if (ini.archivada && filter !== 'Archivadas') return false
                
                if (filter === 'Aprobadas') return ini.estado_cliente === 'APROBADA'
                if (filter === 'Propuestas') return ini.estado_cliente === 'PENDIENTE'
                if (filter === 'Pospuestas') return ini.estado_cliente === 'POSPUESTA'
                if (filter === 'Descartadas') return ini.estado_cliente === 'DESCARTADA'
                
                return true
            })
            .sort((a, b) => (b.roi_eur_anual || 0) - (a.roi_eur_anual || 0))
    }, [initiatives, isCliente, filter, searchQuery])

    const selectedIniciativa = useMemo(() => 
        initiatives.find(i => i.id === selectedId),
        [initiatives, selectedId]
    )

    const handleUpdateIniciativa = (id, updates) => {
        updateIniciativas(initiatives.map(ini => 
            ini.id === id ? { ...ini, ...updates } : ini
        ))
        if (updates.estado_cliente) showNotify(`Estado actualizado`)
        if (updates.archivada !== undefined) showNotify(updates.archivada ? 'Iniciativa archivada' : 'Iniciativa restaurada')
    }

    const handleAddNew = () => {
        const newIni = {
            id: Date.now(),
            titulo: 'Nueva Iniciativa',
            area: 'General',
            descripcion: '',
            roi_eur_anual: 0,
            payback_meses: 0,
            esfuerzo_horas: 0,
            confianza: 'MEDIA',
            prioridad: 'MEDIA',
            estado_cliente: 'PENDIENTE',
            estado_visibilidad: 'BORRADOR',
            fase: 'Quick Wins',
            archivada: false,
            comentarios: []
        }
        addIniciativa(newIni)
        setSelectedId(newIni.id)
        setEditMode(true)
        showNotify('Iniciativa creada')
    }

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] -mt-4">
            <style>
                {`
                .iniciativas-grid {
                    display: grid;
                    grid-template-columns: 420px 1fr;
                    gap: 1.5rem;
                    flex: 1;
                    min-height: 0;
                }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                
                .list-item-active {
                    background: white;
                    border-left: 4px solid var(--primary-600) !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                `}
            </style>

            {notification && (
                <div className="fixed top-24 right-10 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-2xl z-[1000] animate-slideUp font-bold text-sm">
                    {notification}
                </div>
            )}

            {/* HEADER COMPACTO - MÉTRICAS GLOBALES */}
            <div className="flex items-center gap-4 mb-4 overflow-x-auto pb-1 no-scrollbar">
                <MetricCard label="ROI TOP 3" value={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(stats.roiTop3)} color="var(--secondary-600)" />
                <MetricCard label="ROI APROBADAS" value={new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(stats.roiAprobadas)} color="var(--success-600)" />
                <MetricCard label="PAYBACK MEDIO" value={`${stats.payback} meses`} color="var(--primary-600)" />
                <MetricCard label="EN VALIDACIÓN" value={stats.inValidation} color="var(--warning-600)" suffix="inis" />
            </div>

            <div className="iniciativas-grid">
                {/* COLUMNA IZQUIERDA: LISTA */}
                <div className="flex flex-col min-h-0 bg-slate-50/50 rounded-3xl border border-slate-200">
                    <div className="p-5 border-b border-slate-200 bg-white/50 rounded-t-3xl sticky top-0 z-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-800">Cartera</h2>
                            <div className="flex gap-2">
                                {isConsultor && (
                                    <button 
                                        onClick={() => setEditMode(!editMode)}
                                        className={`p-2 rounded-xl border transition-all ${editMode ? 'bg-primary-50 border-primary-200 text-primary-600 shadow-inner' : 'bg-white border-slate-200 text-slate-400'}`}
                                        title="Modo edición"
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                )}
                                {isConsultor && (
                                    <button onClick={handleAddNew} className="btn btn--primary btn--sm !p-2 !rounded-xl">
                                        <FiPlus size={20} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="relative mb-4">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Buscar iniciativa..." 
                                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500/10 outline-none"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                            {['Todas', 'Aprobadas', 'Propuestas', 'Pospuestas', 'Descartadas', 'Archivadas'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                        {filteredIniciativas.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                                <FiBox size={40} className="mb-2" />
                                <p className="text-xs font-bold uppercase tracking-widest">No hay resultados</p>
                            </div>
                        ) : (
                            filteredIniciativas.map(ini => (
                                <button
                                    key={ini.id}
                                    onClick={() => setSelectedId(ini.id)}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-2 ${selectedId === ini.id ? 'list-item-active border-transparent' : 'bg-transparent border-transparent hover:bg-white/50'}`}
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <h3 className={`text-sm font-bold leading-tight line-clamp-2 ${selectedId === ini.id ? 'text-slate-900' : 'text-slate-600'}`}>{ini.titulo}</h3>
                                        <span className="text-xs font-mono font-black text-secondary-600 whitespace-nowrap">
                                            {new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(ini.roi_eur_anual)}€
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap text-[10px]">
                                        <span className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter ${STATUS_COLORS[ini.estado_cliente] || 'bg-slate-100 text-slate-500'}`}>
                                            {ini.estado_cliente}
                                        </span>
                                        <span className="text-slate-400 font-bold uppercase">{ini.area}</span>
                                        <div className="flex-1"></div>
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <span className="flex items-center gap-1 font-mono"><FiClock size={12} /> {ini.esfuerzo_horas || 0}h</span>
                                            {ini.comentarios_count > 0 && (
                                                <span className="flex items-center gap-1 text-primary-500"><FiMessageSquare size={12} /> {ini.comentarios_count}</span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* COLUMNA DERECHA: DETALLE / EDICIÓN */}
                <div className="flex flex-col min-h-0 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    {selectedIniciativa ? (
                        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
                            {/* HEADER PANEL DETALLE */}
                            <div className="p-8 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-20">
                                <div className="flex-1 mr-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${STATUS_COLORS[selectedIniciativa.estado_cliente]}`}>
                                            {selectedIniciativa.estado_cliente}
                                        </span>
                                        {selectedIniciativa.archivada && (
                                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700">Archivada</span>
                                        )}
                                        {selectedIniciativa.estado_visibilidad === 'BORRADOR' && (
                                             <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-800 text-white">Borrador</span>
                                        )}
                                    </div>
                                    {isConsultor && editMode ? (
                                        <input 
                                            className="text-3xl font-black text-slate-800 w-full bg-transparent border-none p-0 focus:ring-0 placeholder:opacity-20"
                                            value={selectedIniciativa.titulo}
                                            onChange={e => handleUpdateIniciativa(selectedIniciativa.id, { titulo: e.target.value })}
                                            placeholder="Título de la iniciativa..."
                                        />
                                    ) : (
                                        <h2 className="text-3xl font-black text-slate-800 leading-tight">{selectedIniciativa.titulo}</h2>
                                    )}
                                </div>

                                {isConsultor && (
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => handleUpdateIniciativa(selectedIniciativa.id, { estado_visibilidad: selectedIniciativa.estado_visibilidad === 'PUBLICADA' ? 'BORRADOR' : 'PUBLICADA' })}
                                            className={`btn btn--sm flex items-center gap-2 ${selectedIniciativa.estado_visibilidad === 'PUBLICADA' ? 'btn--success' : 'btn--secondary'}`}
                                        >
                                            {selectedIniciativa.estado_visibilidad === 'PUBLICADA' ? <><FiCheckCircle /> Publicada</> : <><FiEye /> Publicar</>}
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateIniciativa(selectedIniciativa.id, { archivada: !selectedIniciativa.archivada })}
                                            className={`p-2 rounded-xl transition-all ${selectedIniciativa.archivada ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                            title={selectedIniciativa.archivada ? 'Restaurar' : 'Archivar'}
                                        >
                                            <FiArchive size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 space-y-10">
                                {/* KPIs DETALLE */}
                                <div className="grid grid-cols-4 gap-6">
                                    <KPICard label="ROI ANUAL" value={`${new Intl.NumberFormat('es-ES').format(selectedIniciativa.roi_eur_anual)}€`} editable={isConsultor && editMode} type="number" onChange={val => handleUpdateIniciativa(selectedIniciativa.id, { roi_eur_anual: val })} />
                                    <KPICard label="PAYBACK" value={`${selectedIniciativa.payback_meses} m`} suffix="meses" editable={isConsultor && editMode} type="number" onChange={val => handleUpdateIniciativa(selectedIniciativa.id, { payback_meses: val })} />
                                    <KPICard label="ESFUERZO" value={`${selectedIniciativa.esfuerzo_horas} h`} suffix="horas" editable={isConsultor && editMode} type="number" onChange={val => handleUpdateIniciativa(selectedIniciativa.id, { esfuerzo_horas: val })} />
                                    <KPICard label="CONFIANZA" value={selectedIniciativa.confianza} editable={isConsultor && editMode} type="select" options={['ALTA', 'MEDIA', 'BAJA']} onChange={val => handleUpdateIniciativa(selectedIniciativa.id, { confianza: val })} />
                                </div>

                                {/* CAMPOS DE EDICIÓN */}
                                <div className="grid grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <section>
                                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">ÁREA / DEPARTAMENTO</label>
                                            {isConsultor && editMode ? (
                                                <input 
                                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none" 
                                                    value={selectedIniciativa.area}
                                                    onChange={e => handleUpdateIniciativa(selectedIniciativa.id, { area: e.target.value })}
                                                />
                                            ) : (
                                                <p className="text-lg font-bold text-slate-700">{selectedIniciativa.area}</p>
                                            )}
                                        </section>

                                        <section>
                                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">ESTADO ESTRATÉGICO</label>
                                            {isConsultor && editMode ? (
                                                <select 
                                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white outline-none" 
                                                    value={selectedIniciativa.estado_cliente}
                                                    onChange={e => handleUpdateIniciativa(selectedIniciativa.id, { estado_cliente: e.target.value })}
                                                >
                                                    <option value="PENDIENTE">Propuesta</option>
                                                    <option value="APROBADA">Aprobada</option>
                                                    <option value="POSPUESTA">Pospuesta</option>
                                                    <option value="DESCARTADA">Descartada</option>
                                                </select>
                                            ) : (
                                                <p className="text-lg font-bold text-slate-700">{selectedIniciativa.estado_cliente}</p>
                                            )}
                                        </section>

                                        <section>
                                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">FASE / CATEGORÍA</label>
                                            {isConsultor && editMode ? (
                                                <select 
                                                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white outline-none" 
                                                    value={selectedIniciativa.fase || 'Quick Wins'}
                                                    onChange={e => handleUpdateIniciativa(selectedIniciativa.id, { fase: e.target.value })}
                                                >
                                                    {PHASES.map(p => <option key={p} value={p}>{p}</option>)}
                                                </select>
                                            ) : (
                                                <p className="text-lg font-bold text-slate-700">{selectedIniciativa.fase || 'Quick Wins'}</p>
                                            )}
                                        </section>
                                    </div>

                                    <div className="space-y-6">
                                        <section>
                                            <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">DESCRIPCIÓN OPERATIVA</label>
                                            {isConsultor && editMode ? (
                                                <textarea 
                                                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-3xl font-semibold text-slate-600 h-48 resize-none focus:bg-white focus:ring-4 focus:ring-primary-500/5 transition-all outline-none" 
                                                    value={selectedIniciativa.descripcion}
                                                    onChange={e => handleUpdateIniciativa(selectedIniciativa.id, { descripcion: e.target.value })}
                                                    placeholder="Detalla el alcance y beneficios..."
                                                />
                                            ) : (
                                                <p className="text-lg font-semibold text-slate-600 leading-relaxed italic">
                                                    “{selectedIniciativa.descripcion || 'Sin descripción detallada.'}”
                                                </p>
                                            )}
                                        </section>
                                    </div>
                                </div>

                                {/* COMENTARIOS ESPECÍFICOS */}
                                <div className="pt-10 border-t border-slate-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                                            <FiMessageSquare size={20} />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Debate y Feedback</h3>
                                    </div>
                                    <CommentsSection comments={selectedIniciativa.comentarios || []} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full p-20 text-center text-slate-300">
                            <FiTarget size={80} className="mb-4 opacity-10" />
                            <h2 className="text-xl font-bold uppercase tracking-widest opacity-30">Selecciona una iniciativa</h2>
                            <p className="text-sm mt-1">Para revisar sus métricas y gestionar su evolución</p>
                        </div>
                    )}
                </div>
            </div>

            {/* BARRA INFERIOR COLAPSABLE: COMENTARIOS GENERALES */}
            <div className="mt-4">
                <button 
                    onClick={() => setShowGlobalComments(!showGlobalComments)}
                    className="flex items-center justify-between w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl hover:bg-slate-200 transition-colors"
                >
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Comentarios Generales del Proyecto</span>
                    {showGlobalComments ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {showGlobalComments && (
                    <div className="p-6 bg-white border border-slate-200 border-t-0 rounded-b-2xl animate-slideDown">
                        <CommentsSection comments={[]} />
                    </div>
                )}
            </div>
        </div>
    )
}

function MetricCard({ label, value, color, suffix }) {
    return (
        <div className="bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center min-w-[160px] flex-shrink-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</span>
            <div className="flex items-baseline gap-1">
                <span className="text-lg font-mono font-black" style={{ color: color }}>{value}</span>
                {suffix && <span className="text-[10px] font-bold text-slate-400">{suffix}</span>}
            </div>
        </div>
    )
}

function KPICard({ label, value, suffix, editable, type, options, onChange }) {
    return (
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center group transition-all hover:bg-white hover:border-slate-200 hover:shadow-sm">
            <span className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-widest">{label}</span>
            {editable ? (
                type === 'select' ? (
                    <select 
                        className="w-full bg-transparent text-center font-mono font-black text-slate-800 outline-none cursor-pointer"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                    >
                        {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                ) : (
                    <input 
                        type={type}
                        className="w-full bg-transparent text-center font-mono font-black text-slate-800 outline-none"
                        value={value.replace(/[^0-9.]/g, '')}
                        onChange={e => onChange(Number(e.target.value))}
                    />
                )
            ) : (
                <span className="text-lg font-mono font-black text-slate-800 tracking-tight">{value}</span>
            )}
        </div>
    )
}
