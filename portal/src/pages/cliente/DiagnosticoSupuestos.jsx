import { useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useProjectData } from '../../context/ProjectContext'
import { 
    FiCheckCircle, FiAlertTriangle, FiClock, FiMessageSquare, 
    FiExternalLink, FiPlus, FiEdit2, FiTrash2, FiSave, FiX,
    FiInfo, FiPaperclip, FiShield, FiTarget, FiCalendar, FiUser,
    FiSend, FiLink
} from 'react-icons/fi'
import CommentsSection from '../../components/common/CommentsSection'

// --- CONSTANTES ---
const ESTADOS_SUPUESTO = {
    VALIDADO: { label: 'Validado', color: 'success', icon: <FiCheckCircle /> },
    ESTIMADO: { label: 'Estimado', color: 'warning', icon: <FiAlertTriangle /> },
    REVISION: { label: 'En revisión', color: 'orange', icon: <FiClock /> }
}

const IMPACTOS = {
    ALTO: { label: 'Alto', color: 'danger' },
    MEDIO: { label: 'Medio', color: 'warning' },
    BAJO: { label: 'Bajo', color: 'info' }
}

const FUENTES = ['ERP', 'Entrevistas', 'RRHH', 'IT', 'Otro']

const RESPONSABLES = {
    CONSULTOR: { label: 'Consultor', color: 'primary' },
    CLIENTE: { label: 'Cliente', color: 'info' },
    AMBOS: { label: 'Ambos', color: 'warning' }
}

export default function DiagnosticoSupuestos() {
    const { user } = useAuth()
    const isConsultant = user?.role === 'consultor'
    
    const { 
        projectData, 
        addSupuesto, 
        updateSupuesto, 
        deleteSupuesto,
        addCommentToSupuesto,
        addHitoMedicion,
        updateHitoMedicion,
        deleteHitoMedicion,
        toggleHitoEstado
    } = useProjectData()

    const supuestos = useMemo(() => projectData.supuestos || [], [projectData.supuestos])
    const planMedicion = useMemo(() => projectData.planMedicion || [], [projectData.planMedicion])
    const iniciativas = useMemo(() => projectData.iniciativas || [], [projectData.iniciativas])

    // --- STATE ---
    const [selectedSupuesto, setSelectedSupuesto] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isEditingSupuesto, setIsEditingSupuesto] = useState(false)
    const [editForm, setEditForm] = useState(null)
    
    const [isAddingHito, setIsAddingHito] = useState(false)
    const [editingHitoId, setEditingHitoId] = useState(null)
    const [hitoForm, setHitoForm] = useState({
        item: '',
        fechaObjetivo: '',
        responsable: 'CONSULTOR',
        kpi: '',
        evidenciaEsperada: ''
    })

    // --- CÁLCULO CONFIANZA ROI ---
    const confianzaROI = useMemo(() => {
        if (supuestos.length === 0) return { level: 'N/A', percent: 0, color: 'neutral' }
        
        const validados = supuestos.filter(s => s.estado === 'VALIDADO').length
        const percent = Math.round((validados / supuestos.length) * 100)
        
        if (percent >= 70) return { level: 'Alta', percent, color: 'success' }
        if (percent >= 40) return { level: 'Media', percent, color: 'warning' }
        return { level: 'Baja', percent, color: 'danger' }
    }, [supuestos])

    const contadores = useMemo(() => ({
        validados: supuestos.filter(s => s.estado === 'VALIDADO').length,
        estimados: supuestos.filter(s => s.estado === 'ESTIMADO').length,
        revision: supuestos.filter(s => s.estado === 'REVISION').length
    }), [supuestos])

    // --- HANDLERS SUPUESTOS ---
    const handleAddSupuesto = () => {
        const newSupuesto = {
            texto: '',
            estado: 'ESTIMADO',
            impacto: 'MEDIO',
            fuente: 'Otro',
            evidencia: null,
            afectaIniciativas: []
        }
        setEditForm(newSupuesto)
        setSelectedSupuesto(null)
        setIsEditingSupuesto(true)
        setIsDrawerOpen(true)
    }

    const openSupuesto = (supuesto) => {
        setSelectedSupuesto(supuesto)
        setEditForm({ ...supuesto })
        setIsDrawerOpen(true)
        setIsEditingSupuesto(false)
    }

    const saveSupuesto = () => {
        if (!editForm.texto.trim()) {
            alert('El texto del supuesto es obligatorio')
            return
        }

        if (selectedSupuesto) {
            // Editar existente
            updateSupuesto(selectedSupuesto.id, editForm)
            setSelectedSupuesto(editForm)
        } else {
            // Crear nuevo
            const newId = addSupuesto(editForm)
            setSelectedSupuesto({ ...editForm, id: newId })
        }
        setIsEditingSupuesto(false)
    }

    const handleDeleteSupuesto = (supuestoId) => {
        if (confirm('¿Eliminar este supuesto?')) {
            deleteSupuesto(supuestoId)
            setIsDrawerOpen(false)
            setSelectedSupuesto(null)
        }
    }

    const handleAddComment = (comment) => {
        if (selectedSupuesto) {
            addCommentToSupuesto(selectedSupuesto.id, {
                author: user?.name || 'Usuario',
                text: comment.text,
                avatar: isConsultant ? '👨‍💼' : '👤'
            })
            // Refresh selected
            const updated = supuestos.find(s => s.id === selectedSupuesto.id)
            if (updated) setSelectedSupuesto({ ...updated })
        }
    }

    // --- HANDLERS PLAN MEDICIÓN ---
    const handleAddHito = () => {
        setHitoForm({
            item: '',
            fechaObjetivo: '',
            responsable: 'CONSULTOR',
            kpi: '',
            evidenciaEsperada: ''
        })
        setIsAddingHito(true)
        setEditingHitoId(null)
    }

    const handleEditHito = (hito) => {
        setHitoForm({
            item: hito.item,
            fechaObjetivo: hito.fechaObjetivo,
            responsable: hito.responsable,
            kpi: hito.kpi,
            evidenciaEsperada: hito.evidenciaEsperada
        })
        setEditingHitoId(hito.id)
        setIsAddingHito(true)
    }

    const saveHito = () => {
        if (!hitoForm.item.trim()) {
            alert('El item de medición es obligatorio')
            return
        }

        if (editingHitoId) {
            updateHitoMedicion(editingHitoId, hitoForm)
        } else {
            addHitoMedicion(hitoForm)
        }
        setIsAddingHito(false)
        setEditingHitoId(null)
    }

    const handleDeleteHito = (hitoId) => {
        if (confirm('¿Eliminar este hito?')) {
            deleteHitoMedicion(hitoId)
        }
    }

    const handleToggleHito = (hito) => {
        // Cliente solo puede marcar como hecho si es responsable CLIENTE o AMBOS
        if (!isConsultant && hito.responsable === 'CONSULTOR') return
        toggleHitoEstado(hito.id)
    }

    // --- HELPERS ---
    const getIniciativasNames = (ids) => {
        if (!ids || ids.length === 0) return []
        return iniciativas.filter(i => ids.includes(i.id)).map(i => ({ id: i.id, titulo: i.titulo }))
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return '-'
        const date = new Date(dateStr)
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="page-header flex justify-between items-end mb-8">
                <div>
                    <h1 className="page-title">Supuestos y Medición</h1>
                    <p className="page-subtitle">Transparencia en el cálculo de ROI y plan de validación de resultados</p>
                </div>
            </div>

            {/* RESUMEN SUPERIOR */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {/* Contadores */}
                <div className="card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
                        <FiCheckCircle className="text-success-600" size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-success-600">{contadores.validados}</div>
                        <div className="text-xs text-gray-500">Validados</div>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center">
                        <FiAlertTriangle className="text-warning-600" size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-warning-600">{contadores.estimados}</div>
                        <div className="text-xs text-gray-500">Estimados</div>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <FiClock className="text-orange-600" size={20} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-orange-600">{contadores.revision}</div>
                        <div className="text-xs text-gray-500">En revisión</div>
                    </div>
                </div>
                {/* Badge Confianza ROI */}
                <div className={`card p-4 border-2 border-${confianzaROI.color}-200 bg-${confianzaROI.color}-50`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-${confianzaROI.color}-200 flex items-center justify-center`}>
                            <FiShield className={`text-${confianzaROI.color}-600`} size={20} />
                        </div>
                        <div>
                            <div className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Confianza ROI</div>
                            <div className={`text-xl font-bold text-${confianzaROI.color}-700`}>
                                {confianzaROI.level}
                                {confianzaROI.level !== 'N/A' && (
                                    <span className="text-sm font-normal ml-2">({confianzaROI.percent}%)</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Banner Informativo */}
            <div className="card mb-8" style={{ borderLeft: '4px solid var(--primary-500)', background: 'var(--primary-50)' }}>
                <div className="card-body p-4 flex gap-4 items-center">
                    <div className="bg-white p-2 rounded-lg text-primary-600 shadow-sm">
                        <FiInfo size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-primary-900 font-medium mb-1">
                            Acerca de las estimaciones de ROI
                        </p>
                        <p className="text-xs text-primary-700 leading-relaxed">
                            Los importes de ROI se calculan a partir de los supuestos listados. 
                            La <strong>Confianza ROI</strong> refleja qué porcentaje de supuestos están validados con evidencia.
                            El plan de medición permite verificar resultados reales post-implantación.
                        </p>
                    </div>
                </div>
            </div>

            {/* SECCIÓN 1: TABLA DE SUPUESTOS */}
            <div className="card mb-10">
                <div className="card-header flex justify-between items-center">
                    <h3 className="card-title flex items-center gap-2">
                        <FiTarget className="text-primary-500" />
                        Supuestos del Diagnóstico
                    </h3>
                    {isConsultant && (
                        <button className="btn btn--primary btn--sm" onClick={handleAddSupuesto}>
                            <FiPlus /> Añadir supuesto
                        </button>
                    )}
                </div>
                <div className="card-body p-0 overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Supuesto</th>
                                <th style={{ width: '120px' }}>Estado</th>
                                <th style={{ width: '100px' }}>Impacto ROI</th>
                                <th style={{ width: '100px' }}>Fuente</th>
                                <th style={{ width: '150px' }}>Evidencia</th>
                                <th style={{ width: '150px' }}>Afecta a</th>
                                <th style={{ width: '80px' }} className="text-center">
                                    <FiMessageSquare size={14} />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {supuestos.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center p-10 text-muted">
                                        {isConsultant ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <FiTarget size={40} className="text-gray-300" />
                                                <p>No hay supuestos definidos aún.</p>
                                                <button className="btn btn--secondary btn--sm" onClick={handleAddSupuesto}>
                                                    <FiPlus /> Crear primer supuesto
                                                </button>
                                            </div>
                                        ) : "Pendiente de publicación por parte del equipo consultor."}
                                    </td>
                                </tr>
                            ) : (
                                supuestos.map((s) => {
                                    const afectaList = getIniciativasNames(s.afectaIniciativas)
                                    return (
                                        <tr 
                                            key={s.id} 
                                            onClick={() => openSupuesto(s)}
                                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="font-medium text-gray-900">{s.texto}</td>
                                            <td>
                                                <span className={`badge badge--${ESTADOS_SUPUESTO[s.estado]?.color || 'neutral'} flex items-center gap-1 w-fit`}>
                                                    {ESTADOS_SUPUESTO[s.estado]?.icon}
                                                    {ESTADOS_SUPUESTO[s.estado]?.label || s.estado}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge badge--${IMPACTOS[s.impacto]?.color || 'neutral'} w-fit`}>
                                                    {IMPACTOS[s.impacto]?.label || s.impacto}
                                                </span>
                                            </td>
                                            <td className="text-sm text-gray-600">{s.fuente}</td>
                                            <td>
                                                {s.evidencia ? (
                                                    <div className="flex items-center gap-1 text-xs text-primary-600 font-medium">
                                                        <FiPaperclip size={12} />
                                                        <span className="truncate max-w-[120px]">{s.evidencia.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Sin evidencia</span>
                                                )}
                                            </td>
                                            <td>
                                                {afectaList.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {afectaList.slice(0, 2).map(ini => (
                                                            <span key={ini.id} className="badge badge--neutral text-xs truncate max-w-[60px]" title={ini.titulo}>
                                                                {ini.titulo.substring(0, 10)}...
                                                            </span>
                                                        ))}
                                                        {afectaList.length > 2 && (
                                                            <span className="badge badge--neutral text-xs">+{afectaList.length - 2}</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-gray-500">
                                                    <span className="text-xs font-bold">{(s.comentarios || []).length}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SECCIÓN 2: PLAN DE MEDICIÓN */}
            <div className="card">
                <div className="card-header flex justify-between items-center">
                    <h3 className="card-title flex items-center gap-2">
                        <FiCalendar className="text-primary-500" />
                        Plan de Medición de Resultados
                    </h3>
                    {isConsultant && (
                        <button className="btn btn--primary btn--sm" onClick={handleAddHito}>
                            <FiPlus /> Añadir hito
                        </button>
                    )}
                </div>
                <div className="card-body p-0 overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}></th>
                                <th>Item de Medición</th>
                                <th style={{ width: '120px' }}>Fecha Objetivo</th>
                                <th style={{ width: '100px' }}>Responsable</th>
                                <th style={{ width: '150px' }}>KPI Asociado</th>
                                <th>Evidencia Esperada</th>
                                <th style={{ width: '100px' }}>Estado</th>
                                {isConsultant && <th style={{ width: '80px' }}></th>}
                            </tr>
                        </thead>
                        <tbody>
                            {planMedicion.length === 0 ? (
                                <tr>
                                    <td colSpan={isConsultant ? 8 : 7} className="text-center p-10 text-muted">
                                        {isConsultant ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <FiCalendar size={40} className="text-gray-300" />
                                                <p>No hay hitos de medición definidos.</p>
                                                <button className="btn btn--secondary btn--sm" onClick={handleAddHito}>
                                                    <FiPlus /> Crear primer hito
                                                </button>
                                            </div>
                                        ) : "Pendiente de definición por parte del equipo consultor."}
                                    </td>
                                </tr>
                            ) : (
                                planMedicion.map((hito) => {
                                    const canToggle = isConsultant || ['CLIENTE', 'AMBOS'].includes(hito.responsable)
                                    return (
                                        <tr key={hito.id} className={hito.estado === 'HECHO' ? 'bg-success-50' : ''}>
                                            <td className="text-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={hito.estado === 'HECHO'} 
                                                    onChange={() => handleToggleHito(hito)}
                                                    disabled={!canToggle}
                                                    className="checkbox-custom"
                                                    style={{ cursor: canToggle ? 'pointer' : 'not-allowed' }}
                                                />
                                            </td>
                                            <td>
                                                <span className={hito.estado === 'HECHO' ? 'text-gray-400 line-through' : 'font-medium'}>
                                                    {hito.item}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                                                    {formatDate(hito.fechaObjetivo)}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`badge badge--${RESPONSABLES[hito.responsable]?.color || 'neutral'} text-xs`}>
                                                    {RESPONSABLES[hito.responsable]?.label || hito.responsable}
                                                </span>
                                            </td>
                                            <td className="text-sm text-gray-600">{hito.kpi || '-'}</td>
                                            <td className="text-xs text-gray-500 italic">{hito.evidenciaEsperada || '-'}</td>
                                            <td>
                                                <span className={`badge badge--${hito.estado === 'HECHO' ? 'success' : 'neutral'}`}>
                                                    {hito.estado === 'HECHO' ? 'Hecho' : 'Pendiente'}
                                                </span>
                                            </td>
                                            {isConsultant && (
                                                <td>
                                                    <div className="flex gap-1">
                                                        <button 
                                                            className="btn btn--ghost btn--sm p-1"
                                                            onClick={(e) => { e.stopPropagation(); handleEditHito(hito); }}
                                                            title="Editar"
                                                        >
                                                            <FiEdit2 size={14} />
                                                        </button>
                                                        <button 
                                                            className="btn btn--ghost btn--sm p-1 text-danger-500"
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteHito(hito.id); }}
                                                            title="Eliminar"
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL AÑADIR/EDITAR HITO */}
            {isAddingHito && (
                <>
                    <div className="modal-overlay show" onClick={() => setIsAddingHito(false)} />
                    <div className="modal show" style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editingHitoId ? 'Editar Hito' : 'Nuevo Hito de Medición'}</h3>
                            <button className="btn-close" onClick={() => setIsAddingHito(false)}>
                                <FiX size={18} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="space-y-4">
                                <div className="form-group">
                                    <label>Item de Medición *</label>
                                    <input 
                                        type="text"
                                        value={hitoForm.item}
                                        onChange={(e) => setHitoForm({ ...hitoForm, item: e.target.value })}
                                        placeholder="Ej: Baseline de tiempos actuales"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label>Fecha Objetivo</label>
                                        <input 
                                            type="date"
                                            value={hitoForm.fechaObjetivo}
                                            onChange={(e) => setHitoForm({ ...hitoForm, fechaObjetivo: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Responsable</label>
                                        <select 
                                            value={hitoForm.responsable}
                                            onChange={(e) => setHitoForm({ ...hitoForm, responsable: e.target.value })}
                                        >
                                            {Object.entries(RESPONSABLES).map(([key, val]) => (
                                                <option key={key} value={key}>{val.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>KPI Asociado</label>
                                    <input 
                                        type="text"
                                        value={hitoForm.kpi}
                                        onChange={(e) => setHitoForm({ ...hitoForm, kpi: e.target.value })}
                                        placeholder="Ej: Tiempo ciclo factura (min)"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Evidencia Esperada</label>
                                    <input 
                                        type="text"
                                        value={hitoForm.evidenciaEsperada}
                                        onChange={(e) => setHitoForm({ ...hitoForm, evidenciaEsperada: e.target.value })}
                                        placeholder="Ej: Captura de pantalla del sistema"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn--ghost" onClick={() => setIsAddingHito(false)}>Cancelar</button>
                            <button className="btn btn--primary" onClick={saveHito}>
                                <FiSave /> {editingHitoId ? 'Guardar cambios' : 'Crear hito'}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* DRAWER DETALLE SUPUESTO */}
            <div className={`drawer-overlay ${isDrawerOpen ? 'show' : ''}`} onClick={() => setIsDrawerOpen(false)} />
            <div className={`drawer ${isDrawerOpen ? 'open' : ''}`}>
                {(selectedSupuesto || isEditingSupuesto) && (
                    <>
                        <div className="drawer-header">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs font-bold text-primary-600 tracking-wider uppercase mb-1 block">
                                        {selectedSupuesto ? 'Detalle Supuesto' : 'Nuevo Supuesto'}
                                    </span>
                                    <h2 className="drawer-title">
                                        {isEditingSupuesto ? (selectedSupuesto ? 'Editando Supuesto' : 'Crear Supuesto') : editForm?.texto}
                                    </h2>
                                </div>
                                <button className="btn-close" onClick={() => setIsDrawerOpen(false)}>
                                    <FiX size={20} />
                                </button>
                            </div>
                            {selectedSupuesto && !isEditingSupuesto && (
                                <div className="flex gap-2">
                                    <span className={`badge badge--${ESTADOS_SUPUESTO[selectedSupuesto.estado]?.color || 'neutral'}`}>
                                        {ESTADOS_SUPUESTO[selectedSupuesto.estado]?.label || selectedSupuesto.estado}
                                    </span>
                                    <span className={`badge badge--${IMPACTOS[selectedSupuesto.impacto]?.color || 'neutral'}`}>
                                        Impacto {IMPACTOS[selectedSupuesto.impacto]?.label || selectedSupuesto.impacto}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="drawer-body custom-scrollbar">
                            {isEditingSupuesto ? (
                                <div className="space-y-6">
                                    <div className="form-group">
                                        <label>Descripción del Supuesto *</label>
                                        <textarea 
                                            rows="3" 
                                            value={editForm?.texto || ''}
                                            onChange={(e) => setEditForm({ ...editForm, texto: e.target.value })}
                                            placeholder="Describe el supuesto que afecta al cálculo del ROI..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="form-group">
                                            <label>Estado</label>
                                            <select 
                                                value={editForm?.estado || 'ESTIMADO'}
                                                onChange={(e) => setEditForm({ ...editForm, estado: e.target.value })}
                                            >
                                                {Object.entries(ESTADOS_SUPUESTO).map(([k, v]) => (
                                                    <option key={k} value={k}>{v.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Impacto ROI</label>
                                            <select 
                                                value={editForm?.impacto || 'MEDIO'}
                                                onChange={(e) => setEditForm({ ...editForm, impacto: e.target.value })}
                                            >
                                                {Object.entries(IMPACTOS).map(([k, v]) => (
                                                    <option key={k} value={k}>{v.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Fuente de Información</label>
                                        <select 
                                            value={editForm?.fuente || 'Otro'}
                                            onChange={(e) => setEditForm({ ...editForm, fuente: e.target.value })}
                                        >
                                            {FUENTES.map(f => (
                                                <option key={f} value={f}>{f}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {/* Vincular a Iniciativas */}
                                    <div className="form-group">
                                        <label className="flex items-center gap-2">
                                            <FiLink size={14} /> Afecta a Iniciativas
                                        </label>
                                        <div className="space-y-2 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                                            {iniciativas.length === 0 ? (
                                                <p className="text-xs text-gray-500">No hay iniciativas definidas</p>
                                            ) : (
                                                iniciativas.map(ini => (
                                                    <label key={ini.id} className="flex items-center gap-2 cursor-pointer text-sm">
                                                        <input 
                                                            type="checkbox"
                                                            checked={(editForm?.afectaIniciativas || []).includes(ini.id)}
                                                            onChange={(e) => {
                                                                const current = editForm?.afectaIniciativas || []
                                                                if (e.target.checked) {
                                                                    setEditForm({ ...editForm, afectaIniciativas: [...current, ini.id] })
                                                                } else {
                                                                    setEditForm({ ...editForm, afectaIniciativas: current.filter(id => id !== ini.id) })
                                                                }
                                                            }}
                                                        />
                                                        <span className="truncate">{ini.titulo}</span>
                                                    </label>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t">
                                        <button className="btn btn--primary flex-1" onClick={saveSupuesto}>
                                            <FiSave /> Guardar
                                        </button>
                                        <button className="btn btn--ghost" onClick={() => {
                                            setIsEditingSupuesto(false)
                                            if (!selectedSupuesto) setIsDrawerOpen(false)
                                        }}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Info Grid */}
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <span className="label">Fuente</span>
                                            <span className="value">{selectedSupuesto?.fuente || '-'}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Evidencia vinculada</span>
                                            <div className="value">
                                                {selectedSupuesto?.evidencia ? (
                                                    <a href="#" className="flex items-center gap-2 text-primary-600 font-medium">
                                                        <FiPaperclip />
                                                        {selectedSupuesto.evidencia.name}
                                                        <FiExternalLink size={12} />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400 italic">Sin evidencia</span>
                                                )}
                                            </div>
                                        </div>
                                        {selectedSupuesto?.afectaIniciativas?.length > 0 && (
                                            <div className="info-item">
                                                <span className="label">Afecta a Iniciativas</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {getIniciativasNames(selectedSupuesto.afectaIniciativas).map(ini => (
                                                        <span key={ini.id} className="badge badge--neutral text-xs">
                                                            {ini.titulo}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Acciones por ROL */}
                                    <div className="flex gap-2 flex-wrap">
                                        {isConsultant ? (
                                            <>
                                                <button className="btn btn--secondary btn--sm" onClick={() => setIsEditingSupuesto(true)}>
                                                    <FiEdit2 /> Editar
                                                </button>
                                                {selectedSupuesto?.estado !== 'VALIDADO' && (
                                                    <button 
                                                        className="btn btn--success btn--sm"
                                                        onClick={() => {
                                                            updateSupuesto(selectedSupuesto.id, { estado: 'VALIDADO' })
                                                            setSelectedSupuesto({ ...selectedSupuesto, estado: 'VALIDADO' })
                                                        }}
                                                    >
                                                        <FiCheckCircle /> Marcar Validado
                                                    </button>
                                                )}
                                                <button 
                                                    className="btn btn--ghost btn--sm text-danger-500"
                                                    onClick={() => handleDeleteSupuesto(selectedSupuesto.id)}
                                                >
                                                    <FiTrash2 /> Eliminar
                                                </button>
                                            </>
                                        ) : (
                                            <p className="text-xs text-gray-500 italic">
                                                Vista de solo lectura. Puedes añadir comentarios abajo.
                                            </p>
                                        )}
                                    </div>

                                    {/* Comentarios */}
                                    <div className="comments-section-wrapper pt-6 border-t">
                                        <h4 className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
                                            <FiMessageSquare /> Comentarios ({(selectedSupuesto?.comentarios || []).length})
                                        </h4>
                                        <CommentsSection 
                                            comments={(selectedSupuesto?.comentarios || []).map(c => ({
                                                ...c,
                                                date: formatDate(c.date)
                                            }))} 
                                            onAddComment={handleAddComment}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <style>{`
                .drawer {
                    position: fixed;
                    right: -500px;
                    top: 0;
                    width: 500px;
                    height: 100vh;
                    background: white;
                    box-shadow: -4px 0 20px rgba(0,0,0,0.1);
                    z-index: 1050;
                    transition: right 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }
                .drawer.open {
                    right: 0;
                }
                .drawer-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.4);
                    z-index: 1040;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                .drawer-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }
                .drawer-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--gray-100);
                }
                .drawer-title {
                    margin: 0;
                    font-size: 1.125rem;
                    color: var(--gray-900);
                }
                .drawer-body {
                    flex: 1;
                    padding: 1.5rem;
                    overflow-y: auto;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem;
                    background: var(--gray-50);
                    padding: 1rem;
                    border-radius: 0.5rem;
                }
                .info-item .label {
                    display: block;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    color: var(--gray-500);
                    font-weight: 700;
                    margin-bottom: 0.25rem;
                }
                .info-item .value {
                    font-size: 0.875rem;
                    color: var(--gray-900);
                    font-weight: 500;
                }
                .btn-close {
                    background: var(--gray-100);
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: var(--gray-600);
                    transition: all 0.2s;
                }
                .btn-close:hover {
                    background: var(--gray-200);
                    color: var(--gray-900);
                }
                .checkbox-custom {
                    width: 18px;
                    height: 18px;
                    accent-color: var(--primary-600);
                }
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0,0,0,0.5);
                    z-index: 1060;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s ease;
                }
                .modal-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }
                .modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.95);
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                    z-index: 1070;
                    width: 90%;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s ease;
                }
                .modal.show {
                    opacity: 1;
                    visibility: visible;
                    transform: translate(-50%, -50%) scale(1);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid var(--gray-100);
                }
                .modal-title {
                    margin: 0;
                    font-size: 1.125rem;
                    font-weight: 600;
                }
                .modal-body {
                    padding: 1.5rem;
                }
                .modal-footer {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.75rem;
                    padding: 1rem 1.5rem;
                    border-top: 1px solid var(--gray-100);
                    background: var(--gray-50);
                    border-radius: 0 0 12px 12px;
                }
                .bg-success-50 { background-color: var(--success-50); }
                .bg-warning-50 { background-color: var(--warning-50); }
                .bg-danger-50 { background-color: var(--danger-50); }
                .bg-orange-100 { background-color: #ffedd5; }
                .text-orange-600 { color: #ea580c; }
                .border-success-200 { border-color: var(--success-200); }
                .border-warning-200 { border-color: var(--warning-200); }
                .border-danger-200 { border-color: var(--danger-200); }
            `}</style>
        </div>
    )
}
