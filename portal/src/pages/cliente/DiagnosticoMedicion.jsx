import { useState, useMemo } from 'react'
import { 
    FiClock, FiCopy, FiPlus, FiTrash2, FiAlertCircle, FiCheck, 
    FiZap, FiActivity, FiDollarSign, FiShield, FiInfo, FiX, FiUpload, FiCheckCircle,
    FiUser, FiCalendar, FiPlusCircle, FiEdit3, FiMessageSquare, FiRefreshCw, FiSend
} from 'react-icons/fi'
import { useProjectData } from '../../context/ProjectContext'
import { useAuth } from '../../context/AuthContext'

export default function DiagnosticoMedicion() {
    const { user } = useAuth()
    const isConsultor = user?.role === 'consultor'
    
    const { 
        projectData, 
        updateMedicion,
        addTimeEntry, 
        updateTimeEntry, 
        deleteTimeEntry,
        addTaskToEntry,
        updateTaskInEntry,
        deleteTaskFromEntry
    } = useProjectData()

    const { medicion } = projectData
    const [selectedEntryId, setSelectedEntryId] = useState(medicion?.timeEntries?.[0]?.id)
    
    // UI States
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false)
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
    const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false)
    const [editingEntry, setEditingEntry] = useState(null)
    const [editingTask, setEditingTask] = useState(null)
    const [disputeTask, setDisputeTask] = useState(null)

    const selectedEntry = useMemo(() => 
        medicion?.timeEntries?.find(e => e.id === selectedEntryId),
        [medicion?.timeEntries, selectedEntryId]
    )

    // ROI CALCULATIONS (Consolidated)
    const metrics = useMemo(() => {
        let projectMinSem = 0
        let projectTasks = 0
        let projectValidated = 0
        let selectedMinSem = 0

        medicion?.timeEntries?.forEach(entry => {
            entry.tasks.forEach(task => {
                const taskMinSem = (task.tiempoVez * task.vecesSemana)
                projectMinSem += taskMinSem
                projectTasks++
                if (task.validacion === 'validado') projectValidated++
                if (entry.id === selectedEntryId) {
                    selectedMinSem += taskMinSem
                }
            })
        })

        const projectHrsSem = (projectMinSem / 60).toFixed(1)
        const selectedHrsSem = (selectedMinSem / 60).toFixed(1)
        const costeHora = medicion?.costeHoraDefault || 25
        const projectCosteMensual = (parseFloat(projectHrsSem) * costeHora * 4).toFixed(0)
        const selectedCosteMensual = (parseFloat(selectedHrsSem) * costeHora * 4).toFixed(0)
        const validacionProgress = projectTasks > 0 ? Math.round((projectValidated / projectTasks) * 100) : 0

        return {
            projectHrsSem,
            selectedHrsSem,
            costeHora,
            projectCosteMensual,
            selectedCosteMensual,
            validacionProgress,
            confidence: validacionProgress > 80 ? 'Alta' : validacionProgress > 40 ? 'Media' : 'Baja'
        }
    }, [medicion, selectedEntryId])

    // HANDLERS
    const handleAddEntry = () => {
        setEditingEntry({ nombre: '', rol: '', departamento: '', fecha: new Date().toISOString().split('T')[0], tasks: [] })
        setIsEntryModalOpen(true)
    }

    const handleEditEntry = (entry) => {
        setEditingEntry(entry)
        setIsEntryModalOpen(true)
    }

    const handleDeleteEntry = (e, entryId) => {
        e.stopPropagation();
        if (window.confirm('¿Eliminar este perfil de entrevistado?')) {
            deleteTimeEntry(entryId);
            if (selectedEntryId === entryId) {
                setSelectedEntryId(medicion?.timeEntries?.find(e => e.id !== entryId)?.id);
            }
        }
    }

    const saveEntry = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const entryData = {
            nombre: formData.get('nombre'),
            rol: formData.get('rol'),
            departamento: formData.get('departamento'),
            fecha: formData.get('fecha'),
            notas: formData.get('notas'),
            magicButton: formData.get('magicButton')
        }

        if (editingEntry?.id) {
            updateTimeEntry(editingEntry.id, entryData)
        } else {
            const newId = addTimeEntry(entryData)
            setSelectedEntryId(newId)
        }
        setIsEntryModalOpen(false)
    }

    const handleAddTask = () => {
        setEditingTask({ tarea: '', herramienta: '', tiempoVez: 0, vecesDia: 0, vecesSemana: 0, dolor: 5, riesgo: '' })
        setIsTaskModalOpen(true)
    }

    const handleDuplicateTask = (task) => {
        const { id: _id, ...taskData } = task;
        addTaskToEntry(selectedEntryId, { ...taskData, tarea: `${taskData.tarea} (copia)` });
    }

    const handleEditTask = (task) => {
        setEditingTask(task)
        setIsTaskModalOpen(true)
    }

    const handleDeleteTask = (taskId) => {
        if (window.confirm('¿Eliminar esta tarea?')) {
            deleteTaskFromEntry(selectedEntryId, taskId);
        }
    }

    const saveTask = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const taskData = {
            tarea: formData.get('tarea'),
            herramienta: formData.get('herramienta'),
            tiempoVez: Number(formData.get('tiempoVez')),
            vecesDia: Number(formData.get('vecesDia')),
            vecesSemana: Number(formData.get('vecesSemana')),
            dolor: Number(formData.get('dolor')),
            riesgo: formData.get('riesgo')
        }

        if (editingTask?.id) {
            updateTaskInEntry(selectedEntryId, editingTask.id, taskData)
        } else {
            addTaskToEntry(selectedEntryId, taskData)
        }
        setIsTaskModalOpen(false)
    }

    const updateEntryStatus = (status) => {
        updateTimeEntry(selectedEntryId, { status })
    }

    const handleValidar = (taskId) => {
        updateTaskInEntry(selectedEntryId, taskId, { validacion: 'validado' })
    }

    const handleDiscrepar = (task) => {
        setDisputeTask(task)
        setIsDisputeModalOpen(true)
    }

    const submitDiscrepancia = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const dispute = {
            field: formData.get('field'),
            proposedValue: formData.get('proposedValue'),
            comment: formData.get('comment'),
            createdAt: new Date().toISOString()
        }
        updateTaskInEntry(selectedEntryId, disputeTask.id, { 
            validacion: 'revision',
            dispute: dispute
        })
        setIsDisputeModalOpen(false)
    }

    return (
        <div className="animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Medición de tiempos (ROI)</h1>
                    <p className="text-sm text-slate-500 font-medium">Herramientas de diagnóstico de eficiencia operativa</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 min-w-[200px]">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
                            <span className="text-slate-400">Validación Global</span>
                            <span className="text-primary-600">{metrics.validacionProgress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-500 transition-all duration-1000" style={{ width: `${metrics.validacionProgress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
                {/* IZQUIERDA: Lista de entrevistados */}
                <aside className="flex flex-col gap-4 sticky top-[calc(var(--topbar-height)+1.5rem)] max-h-[calc(100vh-var(--topbar-height)-4rem)]">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Entrevistados ({medicion?.timeEntries?.length || 0})</h3>
                        {isConsultor && (
                            <button onClick={handleAddEntry} className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20">
                                <FiPlus size={18} />
                            </button>
                        )}
                    </div>
                    <div className="flex flex-col gap-2 overflow-y-auto pr-1">
                        {medicion?.timeEntries?.map(entry => {
                            const entryHrs = (entry.tasks.reduce((acc, t) => acc + (t.tiempoVez * t.vecesSemana), 0) / 60).toFixed(1)
                            const status = entry.status || 'borrador'
                            
                            return (
                                <div key={entry.id} className="relative group">
                                    <button 
                                        onClick={() => setSelectedEntryId(entry.id)}
                                        className={`w-full group text-left p-4 rounded-xl border transition-all duration-200 ${
                                            selectedEntryId === entry.id 
                                            ? 'border-primary-500 bg-white shadow-xl ring-4 ring-primary-500/5 -translate-y-0.5' 
                                            : 'border-slate-100 bg-white hover:border-slate-200 shadow-sm'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="font-bold text-sm text-slate-800 line-clamp-1">{entry.nombre}</div>
                                            <div className={`w-2 h-2 rounded-full ${
                                                status === 'validado' ? 'bg-green-500' : status === 'capturado' ? 'bg-primary-500' : 'bg-slate-300'
                                            }`}></div>
                                        </div>
                                        <div className="text-[11px] text-slate-500 mb-3 font-medium truncate">{entry.rol}</div>
                                        <div className="flex justify-between items-end border-t border-slate-50 pt-3">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Estado</span>
                                                <span className={`text-[10px] font-black uppercase ${
                                                    status === 'validado' ? 'text-green-600' : status === 'capturado' ? 'text-primary-600' : 'text-slate-400'
                                                }`}>
                                                    {status}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-bold text-slate-700">{entry.tasks.length} t / {entryHrs}h</div>
                                            </div>
                                        </div>
                                    </button>
                                    {isConsultor && (
                                        <button 
                                            onClick={(e) => handleDeleteEntry(e, entry.id)}
                                            className="absolute -top-1 -right-1 w-6 h-6 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
                                            title="Eliminar Perfil"
                                        >
                                            <FiTrash2 size={12} />
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </aside>

                {/* DERECHA: Zona de trabajo */}
                <main className="flex flex-col gap-6">
                    {/* ROI Consolidado Compacto (Horizontal & Sticky) */}
                    <div className="sticky top-[calc(var(--topbar-height)+1rem)] z-[99] mb-2">
                        <div className="card bg-white shadow-xl shadow-slate-200/40 border border-slate-100 rounded-2xl overflow-hidden p-5 flex flex-col gap-4">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                    <FiActivity className="text-primary-500" /> ROI Consolidado
                                </h3>
                                {selectedEntry && isConsultor && (
                                    <div className="flex gap-2">
                                        {selectedEntry.status !== 'capturado' && (
                                            <button onClick={() => updateEntryStatus('capturado')} className="text-[9px] font-black px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors uppercase tracking-widest">
                                                Marcar Capturado
                                            </button>
                                        )}
                                        {selectedEntry.status !== 'validado' && (
                                            <button onClick={() => updateEntryStatus('validado')} className="text-[9px] font-black px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/20 uppercase tracking-widest">
                                                Marcar Validado
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                                {/* KPI 1: Horas Semanales */}
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fuga Semanal</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-3xl font-black text-slate-900 leading-none">{metrics.projectHrsSem}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">h / sem</span>
                                    </div>
                                    {selectedEntry && (
                                        <div className="text-[10px] font-bold text-primary-600 mt-1 flex items-center gap-1">
                                            <FiUser size={10} /> Impacto {selectedEntry.nombre.split(' ')[0]}: {metrics.selectedHrsSem}h
                                        </div>
                                    )}
                                </div>

                                {/* KPI 2: Coste Hora */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none whitespace-nowrap">Coste Hora (Avg)</span>
                                        {isConsultor ? (
                                            <div className="flex items-center gap-1.5 min-w-[100px] max-w-[120px] bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-sm">
                                                <span className="text-primary-500 font-black text-xs">€</span>
                                                <input 
                                                    type="number" 
                                                    value={metrics.costeHora}
                                                    onChange={(e) => updateMedicion({ ...medicion, costeHoraDefault: Number(e.target.value) })}
                                                    className="w-full bg-transparent text-right text-slate-900 font-mono font-bold outline-none text-sm"
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-sm font-bold text-slate-700">€{metrics.costeHora}</span>
                                        )}
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-medium italic">Base de cálculo mensual (x4.3 sem)</p>
                                </div>

                                {/* KPI 3: Fuga Mensual */}
                                <div className="flex flex-col md:text-right">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fuga Mensual Proyecto</span>
                                    <div className="text-3xl font-black text-primary-600 tracking-tight">€{Number(metrics.projectCosteMensual).toLocaleString()}</div>
                                    <div className="flex md:justify-end mt-1">
                                        <div className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                                            metrics.confidence === 'Alta' ? 'bg-green-100 text-green-700' : 
                                            metrics.confidence === 'Media' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            Confianza: {metrics.confidence} ({metrics.validacionProgress}%)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!selectedEntry ? (
                        <div className="card p-20 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl mt-2">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <FiUser size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Selecciona un perfil</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">Elige un entrevistado de la lista izquierda para gestionar sus tareas y tiempos.</p>
                        </div>
                    ) : (
                        <>
                            {/* Card Perfil */}
                            <div className="card bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                                <div className="p-6 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-white">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                                            {selectedEntry.nombre.split(' ').map(n=>n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">{selectedEntry.nombre}</h2>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase tracking-widest">{selectedEntry.departamento}</span>
                                            </div>
                                            <p className="text-sm text-slate-500 font-bold mb-2">{selectedEntry.rol}</p>
                                            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                                                <span className="flex items-center gap-1.5"><FiCalendar className="text-primary-500" /> {selectedEntry.fecha}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                <span className="flex items-center gap-1.5 uppercase tracking-tighter">Estado: <span className="text-slate-800">{selectedEntry.status || 'borrador'}</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    {isConsultor && (
                                        <button onClick={() => handleEditEntry(selectedEntry)} className="btn btn--secondary btn--sm flex items-center gap-2 rounded-xl px-4 py-2 border-slate-200">
                                            <FiEdit3 /> Editar Perfil
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Card Tareas */}
                            <div className="card bg-white border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                                <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                        <FiActivity className="text-primary-500" /> Tareas y tiempos
                                    </h3>
                                    {isConsultor && (
                                        <button onClick={handleAddTask} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-lg shadow-primary-500/20">
                                            <FiPlus /> Nueva Tarea
                                        </button>
                                    )}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 py-3 border-b border-slate-100">
                                                <th className="px-6 py-4">Tarea</th>
                                                <th className="px-6 py-4 text-center">T(min)</th>
                                                <th className="px-6 py-4 text-center">x Sem</th>
                                                <th className="px-6 py-4 text-center">Total h</th>
                                                <th className="px-6 py-4 text-center">Dolor</th>
                                                <th className="px-6 py-4 text-right">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {selectedEntry.tasks.map(t => {
                                                const totalH = ((t.tiempoVez * t.vecesSemana) / 60).toFixed(1)
                                                return (
                                                    <tr key={t.id} className="group hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-bold text-slate-800 mb-0.5">{t.tarea}</div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-tighter leading-none">{t.herramienta}</span>
                                                                {t.riesgo && <span className="text-[10px] font-bold text-red-400 italic">! {t.riesgo}</span>}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center font-mono text-sm font-bold text-slate-600">{t.tiempoVez}'</td>
                                                        <td className="px-6 py-4 text-center font-mono text-sm font-bold text-slate-600 text-primary-600">{t.vecesSemana}</td>
                                                        <td className="px-6 py-4 text-center font-mono text-sm font-black text-slate-800">{totalH}h</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <div className={`pain-dot pain-${t.dolor} w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black mx-auto shadow-sm`}>
                                                                {t.dolor}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {isConsultor ? (
                                                                    <>
                                                                        <button onClick={() => handleDuplicateTask(t)} className="p-2 text-slate-400 hover:text-primary-600" title="Duplicar"><FiCopy size={14} /></button>
                                                                        <button onClick={() => handleEditTask(t)} className="p-2 text-slate-400 hover:text-slate-900" title="Editar"><FiEdit3 size={14} /></button>
                                                                        <button onClick={() => handleDeleteTask(t.id)} className="p-2 text-slate-400 hover:text-red-500" title="Borrar"><FiTrash2 size={14} /></button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <button onClick={() => handleValidar(t.id)} className="text-[10px] font-bold text-white bg-primary-600 px-3 py-1.5 rounded-lg hover:bg-primary-700 shadow-sm shadow-primary-500/10">Validar</button>
                                                                        <button onClick={() => handleDiscrepar(t)} className="text-[10px] font-bold text-slate-400 hover:text-amber-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-amber-200 bg-white">Discrepar</button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Card Notas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="card bg-white border-slate-100 shadow-sm rounded-2xl p-6">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                        <FiInfo className="text-slate-300" /> Notas de contexto
                                    </h4>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl italic">
                                        {selectedEntry.notas || 'Sin notas registradas.'}
                                    </p>
                                </div>
                                <div className="card bg-white border-slate-100 shadow-sm rounded-2xl p-6 border-b-4 border-b-amber-400">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
                                        <FiZap /> El "Botón Mágico"
                                    </h4>
                                    <p className="text-sm text-slate-800 leading-relaxed font-bold p-4 bg-amber-50 rounded-xl">
                                        {selectedEntry.magicButton || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>

            {isEntryModalOpen && (
                <div className="drawer-overlay show fixed inset-0 flex justify-end" style={{ zIndex: 10000 }} onClick={() => setIsEntryModalOpen(false)}>
                    <div className="drawer open bg-white w-full max-w-md h-full flex flex-col shadow-2xl" style={{ zIndex: 10001 }} onClick={e => e.stopPropagation()}>
                        <div className="drawer__header p-6 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{editingEntry.id ? 'Editar Persona' : 'Registrar Entrevistado'}</h2>
                                <p className="text-xs text-muted font-medium mt-1">Datos para el análisis de tiempos</p>
                            </div>
                            <button onClick={() => setIsEntryModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                                <FiX size={24} />
                            </button>
                        </div>
                        <form className="flex-1 overflow-y-auto p-6" onSubmit={saveEntry}>
                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Datos del Entrevistado</label>
                                    <div className="flex flex-col gap-3">
                                        <input name="nombre" defaultValue={editingEntry.nombre} className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-semibold focus:border-primary-500 transition-colors" required placeholder="Nombre Completo" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input name="rol" defaultValue={editingEntry.rol} className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-primary-500 transition-colors" required placeholder="Rol / Cargo" />
                                            <input name="departamento" defaultValue={editingEntry.departamento} className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-primary-500 transition-colors" required placeholder="Departamento" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Fecha Captura</label>
                                    <input type="date" name="fecha" defaultValue={editingEntry.fecha} className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm focus:border-primary-500 transition-colors" required />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Insights y Observaciones</label>
                                    <textarea name="notas" defaultValue={editingEntry.notas} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm min-h-[120px] focus:border-primary-500 transition-colors" placeholder="Notas adicionales sobre la entrevista..." />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest mb-2 block" style={{ color: 'var(--warning-500)' }}>El "Botón Mágico"</label>
                                    <div className="relative">
                                        <FiZap className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--warning-500)' }} />
                                        <input name="magicButton" defaultValue={editingEntry.magicButton} className="w-full h-12 pl-11 pr-4 border rounded-xl outline-none text-sm font-bold placeholder:text-amber-300 focus:border-amber-500 transition-colors" style={{ backgroundColor: 'var(--warning-50)', borderColor: 'var(--warning-100)', color: 'var(--warning-900)' }} placeholder="¿Qué automatización tendría mayor impacto?" />
                                    </div>
                                    <p className="text-[9px] mt-2 italic px-1 text-center" style={{ color: 'var(--warning-600)' }}>Identificamos la tarea con mayor potencial de automatización o 'Quick Win'.</p>
                                </div>
                            </div>
                            <button type="submit" className="btn btn--primary w-full h-14 rounded-2xl mt-8 shadow-lg transition-all flex items-center justify-center gap-2">
                                <FiCheckCircle /> Guardar Cambios
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isTaskModalOpen && (
                <div className="drawer-overlay show fixed inset-0 flex justify-end" style={{ zIndex: 10000 }} onClick={() => setIsTaskModalOpen(false)}>
                    <div className="drawer open bg-white w-full max-w-md h-full flex flex-col shadow-2xl" style={{ zIndex: 10001 }} onClick={e => e.stopPropagation()}>
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{editingTask.id ? 'Editar Tarea' : 'Nueva Actividad'}</h2>
                                <p className="text-xs text-slate-500 font-medium mt-1">Detalles de la operación y carga</p>
                            </div>
                            <button onClick={() => setIsTaskModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                                <FiX size={24} />
                            </button>
                        </div>
                        <form className="flex-1 overflow-y-auto p-8" onSubmit={saveTask}>
                            <div className="flex flex-col gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 block">Identificación</label>
                                    <div className="flex flex-col gap-3">
                                        <input name="tarea" defaultValue={editingTask.tarea} className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-primary-500 transition-all" required placeholder="Nombre de la tarea" />
                                        <input name="herramienta" defaultValue={editingTask.herramienta} className="w-full h-12 px-5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-[10px] uppercase font-black tracking-widest focus:border-primary-500 transition-all" placeholder="Herramienta (Excel, ERP, etc)" />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4 block">Carga de trabajo</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter block mb-2 text-center">T (min) / VEZ</span>
                                            <input type="number" name="tiempoVez" defaultValue={editingTask.tiempoVez} className="w-full bg-transparent text-center text-xl font-black text-slate-800 outline-none" required placeholder="0" />
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-primary-600">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter block mb-2 text-center">VECES / SEMANA</span>
                                            <input type="number" name="vecesSemana" defaultValue={editingTask.vecesSemana} className="w-full bg-transparent text-center text-xl font-black text-primary-600 outline-none" required placeholder="0" />
                                        </div>
                                    </div>
                                    {/* Ocultamos vecesDia pero lo mantenemos por compatibilidad de datos si es necesario */}
                                    <input type="hidden" name="vecesDia" defaultValue={editingTask.vecesDia || 1} />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4 block">Riesgo / Error Humano</label>
                                    <div className="relative">
                                        <FiAlertTriangle className="absolute left-4 top-4 text-slate-300" />
                                        <textarea 
                                            name="riesgo" 
                                            defaultValue={editingTask.riesgo} 
                                            className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium focus:border-red-400 transition-all min-h-[80px]" 
                                            placeholder="Describa riesgos de error o puntos críticos..." 
                                        />
                                    </div>
                                </div>

                                <div className="bg-slate-900 p-6 rounded-[2rem] text-white">
                                    <div className="flex justify-between items-center mb-6">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Nivel de Tediosidad</label>
                                        <span className={`text-xs font-black px-3 py-1 rounded-full pain-${editingTask.dolor || 5}`}>
                                            Nivel {editingTask.dolor || 5}
                                        </span>
                                    </div>
                                    <input type="range" name="dolor" min="1" max="10" defaultValue={editingTask.dolor || 5} className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500" />
                                    <div className="flex justify-between mt-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.1em]">
                                        <span>Operativo</span>
                                        <span>Alto Sacrificio</span>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full h-16 bg-primary-600 hover:bg-primary-700 text-white rounded-[1.5rem] mt-8 font-black text-sm uppercase tracking-widest shadow-xl shadow-primary-500/20 transition-all flex items-center justify-center gap-2">
                                <FiCheckCircle /> Confirmar Tarea
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isDisputeModalOpen && (
                <div className="drawer-overlay show fixed inset-0 flex justify-end" style={{ zIndex: 10000 }} onClick={() => setIsDisputeModalOpen(false)}>
                    <div className="drawer open bg-white w-full max-w-md h-full flex flex-col shadow-2xl" style={{ zIndex: 10001 }} onClick={e => e.stopPropagation()}>
                        <div className="p-8 border-b border-amber-100 flex justify-between items-center bg-amber-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 tracking-tight italic">Discrepancia</h2>
                                <p className="text-xs text-amber-600 font-bold mt-1">Sugerir corrección al consultor</p>
                            </div>
                            <button onClick={() => setIsDisputeModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-amber-100/50 rounded-xl text-amber-500 transition-colors">
                                <FiX size={24} />
                            </button>
                        </div>
                        <form className="flex-1 overflow-y-auto p-8" onSubmit={submitDiscrepancia}>
                            <div className="flex flex-col gap-8">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Tipo de observación</label>
                                    <select name="field" className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-amber-500 transition-all appearance-none" required>
                                        <option value="tiempo">Tiempo por vez incorrecto</option>
                                        <option value="frecuencia">Frecuencia semanal incorrecta</option>
                                        <option value="otros">La tarea no existe o es distinta</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Tu valor sugerido</label>
                                    <input name="proposedValue" className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-amber-500 transition-all" placeholder="Ej: 5 min, 3 veces..." required />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Comentario aclaratorio</label>
                                    <textarea name="comment" className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] outline-none text-sm min-h-[140px] focus:border-amber-500 transition-all leading-relaxed font-medium" placeholder="Explica brevemente tu punto de vista..." required />
                                </div>
                            </div>
                            <button type="submit" className="w-full h-16 bg-amber-500 hover:bg-amber-600 text-white rounded-[1.5rem] mt-12 font-black text-sm uppercase tracking-widest shadow-xl shadow-amber-500/10 transition-all flex items-center justify-center gap-3">
                                <FiSend /> Enviar Corrección
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .pain-dot.pain-1, .pain-dot.pain-2 { background: #ecfdf5; color: #059669; }
                .pain-dot.pain-3, .pain-dot.pain-4 { background: #f0fdf4; color: #16a34a; }
                .pain-dot.pain-5, .pain-dot.pain-6 { background: #fefce8; color: #ca8a04; }
                .pain-dot.pain-7, .pain-dot.pain-8 { background: #fff7ed; color: #ea580c; }
                .pain-dot.pain-9, .pain-dot.pain-10 { background: #fef2f2; color: #dc2626; }
                
                span.pain-1, span.pain-2 { background: #059669; color: white; }
                span.pain-3, span.pain-4 { background: #16a34a; color: white; }
                span.pain-5, span.pain-6 { background: #ca8a04; color: white; }
                span.pain-7, span.pain-8 { background: #ea580c; color: white; }
                span.pain-9, span.pain-10 { background: #dc2626; color: white; }
            `}</style>
        </div>
    )
}
