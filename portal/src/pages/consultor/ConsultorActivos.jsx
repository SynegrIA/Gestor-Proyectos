import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiSearch, FiPlus, FiFile, FiEye, FiDownload, FiCopy, FiClock, FiArrowLeft, FiChevronDown, FiChevronRight, FiEdit2, FiLink, FiX, FiCheck, FiSave, FiLayers, FiExternalLink, FiTrash2, FiUpload, FiMoreHorizontal } from 'react-icons/fi'
import { ASSETS_CATALOG, ASSET_TYPES, ASSET_FASES } from '../../data/assetsCatalog'
import SOLUTIONS_CATALOG from '../../data/catalogo_soluciones_v1.json'
import { getAssetLinks, updateAssetLinks } from '../../utils/assetLinksHelper'

export default function ConsultorActivos({ isAdminView = false }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const [selectedActivo, setSelectedActivo] = useState(null)
    const [activeTab, setActiveTab] = useState('contenido')
    const [editData, setEditData] = useState(null)
    const [previewMode, setPreviewMode] = useState(false)
    const [filterTipo, setFilterTipo] = useState('Todos')
    const [filterFase, setFilterFase] = useState('Todas')
    const [filterSolution, setFilterSolution] = useState('Todas')
    const [search, setSearch] = useState('')
    const [assetLinks, setAssetLinks] = useState(() => getAssetLinks().links)
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
    const [linkingAsset, setLinkingAsset] = useState(null)
    const [tempSelectedSolutions, setTempSelectedSolutions] = useState([])

    // Cargar activo desde URL
    useEffect(() => {
        if (id) {
            const storageKey = `asset_detail_v1:${id}`
            const saved = localStorage.getItem(storageKey)
            
            if (saved) {
                const data = JSON.parse(saved)
                setSelectedActivo(data)
                setEditData(data)
            } else {
                const catalogAsset = ASSETS_CATALOG.find(a => a.id === id)
                if (catalogAsset) {
                    // Convertir formato viejo a nuevo
                    const newData = {
                        ...catalogAsset,
                        objetivo: '',
                        tags: [],
                        estado: 'Listo',
                        contenido: catalogAsset.secciones.map(s => `## ${s.titulo}\n${s.contenido}`).join('\n\n'),
                        links: [],
                        attachments: []
                    }
                    setSelectedActivo(newData)
                    setEditData(newData)
                }
            }
        } else {
            setSelectedActivo(null)
            setEditData(null)
        }
    }, [id])

    const handleSaveAsset = () => {
        if (!id) return
        const storageKey = `asset_detail_v1:${id}`
        localStorage.setItem(storageKey, JSON.stringify(editData))
        setSelectedActivo(editData)
        alert('Activo guardado correctamente')
    }

    const handleCopyContent = () => {
        if (!editData?.contenido) return
        navigator.clipboard.writeText(editData.contenido)
        alert('Contenido copiado al portapapeles')
    }

    const handleDuplicate = () => {
        const newId = Date.now().toString()
        const duplicatedData = {
            ...editData,
            id: newId,
            nombre: `${editData.nombre} (Copia)`
        }
        localStorage.setItem(`asset_detail_v1:${newId}`, JSON.stringify(duplicatedData))
        navigate(isAdminView ? `/admin/activos/${newId}` : `/consultor/activos/${newId}`)
    }

    const handleNewAsset = () => {
        const newId = Date.now().toString()
        const newData = {
            id: newId,
            nombre: 'Nuevo Activo',
            tipo: 'Otros',
            fase: 'Día 0-1',
            version: 'V1',
            desc: '',
            objetivo: '',
            tags: [],
            estado: 'Borrador',
            contenido: '# Nuevo Activo\nEmpieza a escribir aquí...',
            links: [],
            attachments: []
        }
        localStorage.setItem(`asset_detail_v1:${newId}`, JSON.stringify(newData))
        navigate(isAdminView ? `/admin/activos/${newId}` : `/consultor/activos/${newId}`)
    }

    const filtered = useMemo(() => {
        return ASSETS_CATALOG.filter(a => {
            if (filterTipo !== 'Todos' && a.tipo !== filterTipo) return false
            if (filterFase !== 'Todas' && a.fase !== filterFase) return false
            if (search && !a.nombre.toLowerCase().includes(search.toLowerCase())) return false
            
            if (filterSolution !== 'Todas') {
                const isLinked = assetLinks.some(l => l.asset_id === a.id.toString() && l.solution_id === filterSolution)
                if (!isLinked) return false
            }
            
            return true
        })
    }, [filterTipo, filterFase, filterSolution, search, assetLinks])

    const openLinkModal = (e, asset) => {
        e.stopPropagation()
        setLinkingAsset(asset)
        const currentSolutions = assetLinks
            .filter(l => l.asset_id === asset.id.toString())
            .map(l => l.solution_id)
        setTempSelectedSolutions(currentSolutions)
        setIsLinkModalOpen(true)
    }

    const handleSaveLinks = () => {
        const newLinks = updateAssetLinks(linkingAsset.id, tempSelectedSolutions)
        setAssetLinks(newLinks)
        setIsLinkModalOpen(false)
        setLinkingAsset(null)
    }

    const getSolutionName = (id) => {
        const sol = SOLUTIONS_CATALOG.find(s => s.id === id)
        return sol ? sol.nombre : id
    }

    // Vista de detalle con secciones desplegables (Convertida a Ficha de Activo Editable)
    if (selectedActivo && editData) {
        return (
            <div className="asset-detail-container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <button
                    className="btn btn--ghost"
                    onClick={() => navigate(isAdminView ? '/admin/activos' : '/consultor/activos')}
                    style={{ marginBottom: 'var(--space-4)' }}
                >
                    <FiArrowLeft /> Volver a la biblioteca
                </button>

                {/* Header Editable */}
                <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)', borderTop: '4px solid var(--primary-500)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                        <div style={{ flex: 1, marginRight: 'var(--space-6)' }}>
                            <input 
                                className="input" 
                                value={editData.nombre} 
                                onChange={e => setEditData({...editData, nombre: e.target.value})}
                                placeholder="Título del activo"
                                style={{ 
                                    width: '100%', 
                                    border: 'none', 
                                    background: 'transparent', 
                                    fontSize: 'var(--text-3xl)', 
                                    fontWeight: 'var(--font-bold)',
                                    color: 'var(--text-primary)',
                                    marginBottom: 'var(--space-2)',
                                    padding: '0',
                                    outline: 'none'
                                }}
                            />
                            
                            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
                                <select 
                                    className="badge badge--neutral" 
                                    value={editData.tipo} 
                                    onChange={e => setEditData({...editData, tipo: e.target.value})}
                                    style={{ border: 'none', cursor: 'pointer', padding: 'var(--space-1) var(--space-2)' }}
                                >
                                    {ASSET_TYPES.filter(t => t !== 'Todos').map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <select 
                                    className="badge badge--info" 
                                    value={editData.fase} 
                                    onChange={e => setEditData({...editData, fase: e.target.value})}
                                    style={{ border: 'none', cursor: 'pointer', padding: 'var(--space-1) var(--space-2)' }}
                                >
                                    {ASSET_FASES.filter(f => f !== 'Todas').map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span className="text-xs text-muted">V:</span>
                                    <input 
                                        className="badge badge--neutral" 
                                        value={editData.version} 
                                        onChange={e => setEditData({...editData, version: e.target.value})}
                                        style={{ border: 'none', width: '80px', textAlign: 'center', padding: 'var(--space-1)' }}
                                    />
                                </div>
                                <select 
                                    className={`badge ${editData.estado === 'Listo' ? 'badge--success' : editData.estado === 'Borrador' ? 'badge--warning' : 'badge--danger'}`}
                                    value={editData.estado} 
                                    onChange={e => setEditData({...editData, estado: e.target.value})}
                                    style={{ border: 'none', cursor: 'pointer', padding: 'var(--space-1) var(--space-2)' }}
                                >
                                    <option value="Borrador">Borrador</option>
                                    <option value="Listo">Listo</option>
                                    <option value="Deprecado">Deprecado</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>DESCRIPCIÓN CORTA</label>
                                <textarea 
                                    className="input" 
                                    rows="1" 
                                    value={editData.desc} 
                                    onChange={e => setEditData({...editData, desc: e.target.value})}
                                    style={{ width: '100%', resize: 'none', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: '4px 0' }}
                                />
                            </div>

                            <div style={{ marginBottom: 'var(--space-4)' }}>
                                <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>OBJETIVO ESTRATÉGICO</label>
                                <textarea 
                                    className="input" 
                                    rows="1" 
                                    value={editData.objetivo} 
                                    onChange={e => setEditData({...editData, objetivo: e.target.value})}
                                    style={{ width: '100%', resize: 'none', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, padding: '4px 0' }}
                                    placeholder="¿Para qué sirve este activo? (ej. Validar el ROI en 20min)"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>TAGS</label>
                                <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                    {editData.tags?.map((tag, idx) => (
                                        <span key={idx} className="badge badge--ghost" style={{ display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '4px' }}>
                                            {tag} <FiX size={12} style={{ cursor: 'pointer' }} onClick={() => setEditData({...editData, tags: editData.tags.filter((_, i) => i !== idx)})} />
                                        </span>
                                    ))}
                                    <input 
                                        className="input" 
                                        style={{ width: '120px', padding: '2px 8px', height: '24px', fontSize: '12px', border: '1px dashed var(--border-color)' }} 
                                        placeholder="+ añadir tag"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && e.target.value) {
                                                setEditData({...editData, tags: [...(editData.tags || []), e.target.value]})
                                                e.target.value = ''
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: '180px' }}>
                            <button className="btn btn--primary" onClick={handleSaveAsset} style={{ width: '100%' }}><FiSave /> Guardar cambios</button>
                            <button className="btn btn--secondary" onClick={handleDuplicate} style={{ width: '100%' }}><FiCopy /> Duplicar activo</button>
                            <button className="btn btn--ghost" onClick={handleCopyContent} style={{ width: '100%' }}><FiLayers /> Copiar contenido</button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 'var(--space-1)', marginBottom: 'var(--space-4)', background: 'var(--bg-secondary)', padding: '4px', borderRadius: 'var(--radius-lg)' }}>
                    {['contenido', 'links', 'archivos', 'asociaciones'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{ 
                                flex: 1,
                                padding: 'var(--space-2) var(--space-4)', 
                                border: 'none', 
                                borderRadius: 'var(--radius-md)',
                                background: activeTab === tab ? 'white' : 'transparent', 
                                cursor: 'pointer',
                                fontSize: 'var(--text-sm)',
                                fontWeight: activeTab === tab ? 'var(--font-semibold)' : 'var(--font-regular)',
                                boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
                                color: activeTab === tab ? 'var(--primary-600)' : 'var(--text-muted)',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'contenido' && (
                        <div className="card" style={{ padding: 'var(--space-4)', minHeight: '500px' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-2)', gap: 'var(--space-2)' }}>
                                <button className="btn btn--ghost btn--sm" onClick={() => setPreviewMode(!previewMode)}>
                                    {previewMode ? <FiEdit2 /> : <FiEye />} {previewMode ? 'Editar Markdown' : 'Vista Previa'}
                                </button>
                                <button className="btn btn--ghost btn--sm" onClick={handleCopyContent}>
                                    <FiCopy /> Copiar
                                </button>
                            </div>
                            {previewMode ? (
                                <div 
                                    className="markdown-content" 
                                    style={{ padding: 'var(--space-6)', background: 'white', borderRadius: 'var(--radius-md)' }}
                                    dangerouslySetInnerHTML={{ __html: renderMarkdown(editData.contenido) }}
                                />
                            ) : (
                                <textarea 
                                    className="input" 
                                    style={{ 
                                        width: '100%', 
                                        minHeight: '450px', 
                                        fontFamily: 'monospace', 
                                        fontSize: 'var(--text-sm)',
                                        border: '1px solid var(--primary-100)',
                                        padding: 'var(--space-4)',
                                        lineHeight: '1.6'
                                    }}
                                    value={editData.contenido}
                                    onChange={e => setEditData({...editData, contenido: e.target.value})}
                                    placeholder="Escribe el contenido en Markdown..."
                                />
                            )}
                        </div>
                    )}

                    {activeTab === 'links' && (
                        <div className="card" style={{ padding: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                                <h3 style={{ margin: 0 }}>Links y Recursos Online</h3>
                                <button className="btn btn--secondary btn--sm" onClick={() => setEditData({...editData, links: [...(editData.links || []), {title: '', url: '', note: ''}]})}>
                                    <FiPlus /> Añadir Recurso
                                </button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                {editData.links?.map((link, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', background: 'var(--bg-secondary)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                                                <div>
                                                    <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Título</label>
                                                    <input 
                                                        className="input text-sm" 
                                                        style={{ width: '100%' }} 
                                                        placeholder="Ej: Tool de cálculo ROI" 
                                                        value={link.title}
                                                        onChange={e => {
                                                            const newLinks = [...editData.links]
                                                            newLinks[idx].title = e.target.value
                                                            setEditData({...editData, links: newLinks})
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>URL</label>
                                                    <input 
                                                        className="input text-sm" 
                                                        style={{ width: '100%' }} 
                                                        placeholder="https://..." 
                                                        value={link.url}
                                                        onChange={e => {
                                                            const newLinks = [...editData.links]
                                                            newLinks[idx].url = e.target.value
                                                            setEditData({...editData, links: newLinks})
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Nota u observación (ej. contraseña de acceso)</label>
                                            <input 
                                                className="input text-sm" 
                                                style={{ width: '100%' }} 
                                                placeholder="Añadir nota pública..." 
                                                value={link.note}
                                                onChange={e => {
                                                    const newLinks = [...editData.links]
                                                    newLinks[idx].note = e.target.value
                                                    setEditData({...editData, links: newLinks})
                                                }}
                                            />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm" title="Abrir link">
                                                <FiExternalLink />
                                            </a>
                                            <button 
                                                className="btn btn--ghost btn--sm text-danger" 
                                                onClick={() => setEditData({...editData, links: editData.links.filter((_, i) => i !== idx)})}
                                                title="Eliminar"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!editData.links || editData.links.length === 0) && (
                                    <div style={{ textAlign: 'center', padding: 'var(--space-10)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                                        <FiLink size={40} style={{ color: 'var(--primary-200)', marginBottom: 'var(--space-3)' }} />
                                        <p className="text-muted">No hay links vinculados a este activo.</p>
                                        <button className="btn btn--ghost btn--sm" onClick={() => setEditData({...editData, links: [{title: '', url: '', note: ''}]})}>Añadir el primero</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'archivos' && (
                        <div className="card" style={{ padding: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                                <h3 style={{ margin: 0 }}>Archivos Adjuntos (V1)</h3>
                                <label className="btn btn--secondary btn--sm" style={{ cursor: 'pointer' }}>
                                    <FiUpload /> Subir Archivo
                                    <input type="file" style={{ display: 'none' }} onChange={e => {
                                        const file = e.target.files[0]
                                        if (file) {
                                            const newFile = {
                                                name: file.name,
                                                size: (file.size / 1024).toFixed(1) + ' KB',
                                                type: file.type,
                                                date: new Date().toISOString()
                                            }
                                            setEditData({...editData, attachments: [...(editData.attachments || []), newFile]})
                                        }
                                    }} />
                                </label>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {editData.attachments?.map((file, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--primary-50)', color: 'var(--primary-600)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FiFile size={20} />
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 'var(--font-semibold)', color: 'var(--text-primary)' }}>{file.name}</p>
                                                <p className="text-xs text-muted" style={{ margin: 0 }}>{file.size} • {new Date(file.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                            <button className="btn btn--ghost btn--sm" title="Descargar"><FiDownload /></button>
                                            <button 
                                                className="btn btn--ghost btn--sm text-danger" 
                                                title="Eliminar"
                                                onClick={() => setEditData({...editData, attachments: editData.attachments.filter((_, i) => i !== idx)})}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {(!editData.attachments || editData.attachments.length === 0) && (
                                    <div style={{ textAlign: 'center', padding: 'var(--space-10)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                                        <FiUpload size={40} style={{ color: 'var(--primary-200)', marginBottom: 'var(--space-3)' }} />
                                        <p className="text-muted">No hay archivos adjuntos.</p>
                                        <p className="text-xs text-muted">Soporta PDF, DOCX, XLSX, PNG...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'asociaciones' && (
                        <div className="card" style={{ padding: 'var(--space-6)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                                <h3 style={{ margin: 0 }}>Vinculación con Soluciones</h3>
                                <button className="btn btn--secondary btn--sm" onClick={(e) => openLinkModal(e, editData)}>
                                    <FiPlus /> Vincular Solución
                                </button>
                            </div>
                            <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-4)' }}>Estas soluciones mostrarán este activo en su sección de recursos.</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                                {assetLinks.filter(l => l.asset_id === editData.id.toString()).map(l => (
                                    <div key={l.solution_id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', background: 'var(--primary-50)', color: 'var(--primary-800)', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-full)', border: '1px solid var(--primary-200)' }}>
                                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>{getSolutionName(l.solution_id)}</span>
                                        <FiX 
                                            size={14} 
                                            style={{ cursor: 'pointer' }} 
                                            onClick={() => {
                                                const currentLinks = assetLinks.filter(link => link.asset_id === editData.id.toString())
                                                const newSolutionIds = currentLinks
                                                    .filter(link => link.solution_id !== l.solution_id)
                                                    .map(link => link.solution_id)
                                                const newLinks = updateAssetLinks(editData.id, newSolutionIds)
                                                setAssetLinks(newLinks)
                                            }}
                                        />
                                    </div>
                                ))}
                                {assetLinks.filter(l => l.asset_id === editData.id.toString()).length === 0 && (
                                    <div style={{ width: '100%', textAlign: 'center', padding: 'var(--space-10)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                                        <FiLayers size={40} style={{ color: 'var(--primary-200)', marginBottom: 'var(--space-3)' }} />
                                        <p className="text-muted">Este activo no está vinculado a ninguna solución aún.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="activos-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <div>
                    <h2 style={{ margin: 0 }}>Activos Reutilizables</h2>
                    <p className="text-muted" style={{ margin: 0 }}>Biblioteca de herramientas, scripts y plantillas para consultoría.</p>
                </div>
                <button className="btn btn--primary" onClick={handleNewAsset}>
                    <FiPlus /> Nuevo Activo
                </button>
            </div>

            {/* Filtros */}
            <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                    <div style={{ flex: '1 1 300px', position: 'relative' }}>
                        <FiSearch style={{ position: 'absolute', left: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Buscar activos..."
                            className="input"
                            style={{ paddingLeft: 'var(--space-10)', width: '100%' }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <div>
                            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Tipo</label>
                            <select className="input" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
                                {ASSET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Fase</label>
                            <select className="input" value={filterFase} onChange={(e) => setFilterFase(e.target.value)}>
                                {ASSET_FASES.map(f => <option key={f} value={f}>{f}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-muted" style={{ display: 'block', marginBottom: '4px' }}>Solución</label>
                            <select 
                                className="input" 
                                style={{ minWidth: '180px' }}
                                value={filterSolution} 
                                onChange={(e) => setFilterSolution(e.target.value)}
                            >
                                <option value="Todas">Todas las soluciones</option>
                                {SOLUTIONS_CATALOG.map(s => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid de Activos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-4)' }}>
                {filtered.map(activo => {
                    const linkedSols = assetLinks.filter(l => l.asset_id === activo.id.toString())
                    
                    return (
                        <div
                            key={activo.id}
                            className="card card--interactive"
                            style={{ transition: 'all 0.2s ease', position: 'relative' }}
                            onClick={() => navigate(isAdminView ? `/admin/activos/${activo.id}` : `/consultor/activos/${activo.id}`)}
                            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
                            onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
                        >
                            <div className="card-body">
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        background: 'var(--primary-100)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--primary-600)'
                                    }}>
                                        <FiFile size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h4 style={{ margin: '0 0 var(--space-1)' }}>{activo.nombre}</h4>
                                            <button 
                                                className="btn btn--ghost btn--sm" 
                                                onClick={(e) => openLinkModal(e, activo)}
                                                title="Vincular a solución"
                                            >
                                                <FiLink size={14} />
                                            </button>
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                            <span className="badge badge--neutral">{activo.tipo}</span>
                                            <span className="badge badge--info">{activo.fase}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-muted" style={{ margin: '0 0 var(--space-3)', height: '40px', overflow: 'hidden' }}>
                                    {activo.desc}
                                </p>

                                {/* "Usado en" chips */}
                                {linkedSols.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: 'var(--space-4)' }}>
                                        <span className="text-xs text-muted" style={{ width: '100%' }}>Usado en:</span>
                                        {linkedSols.slice(0, 2).map((link, idx) => (
                                            <span key={idx} className="badge badge--primary" style={{ fontSize: '10px', padding: '1px 6px', background: 'var(--primary-50)', color: 'var(--primary-700)', border: '1px solid var(--primary-100)' }}>
                                                {getSolutionName(link.solution_id)}
                                            </span>
                                        ))}
                                        {linkedSols.length > 2 && (
                                            <span className="text-xs text-muted">+{linkedSols.length - 2}</span>
                                        )}
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="text-xs text-muted">
                                        <FiClock style={{ marginRight: 4 }} />
                                        {activo.version} · {activo.updated_at}
                                    </div>
                                    <span className="text-xs text-primary">{activo.sections_count} secciones →</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {filtered.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state__icon">📁</div>
                    <h4 className="empty-state__title">No se encontraron activos</h4>
                    <p className="empty-state__description">Prueba con otros filtros o términos de búsqueda</p>
                </div>
            )}

            {/* Modal de Vinculación */}
            {isLinkModalOpen && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000, padding: 'var(--space-4)'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                        <div className="card-header" style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>Vincular a Solución</h3>
                            <button className="btn btn--ghost" onClick={() => setIsLinkModalOpen(false)}><FiX /></button>
                        </div>
                        <div className="card-body" style={{ padding: 'var(--space-4)', overflowY: 'auto' }}>
                            <p className="text-sm text-muted mb-4">Selecciona las soluciones que utilizan el activo: <strong>{linkingAsset?.nombre}</strong></p>
                            <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                                {SOLUTIONS_CATALOG.map(sol => {
                                    const isSelected = tempSelectedSolutions.includes(sol.id.toString())
                                    return (
                                        <div 
                                            key={sol.id} 
                                            onClick={() => {
                                                setTempSelectedSolutions(prev => 
                                                    isSelected ? prev.filter(id => id !== sol.id.toString()) : [...prev, sol.id.toString()]
                                                )
                                            }}
                                            style={{
                                                padding: 'var(--space-3)',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid',
                                                borderColor: isSelected ? 'var(--primary-300)' : 'var(--border-color)',
                                                background: isSelected ? 'var(--primary-50)' : 'transparent',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <span className="text-sm" style={{ fontWeight: isSelected ? 'var(--font-semibold)' : 'normal' }}>{sol.nombre}</span>
                                            {isSelected && <FiCheck className="text-primary" />}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="card-footer" style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                            <button className="btn btn--ghost" onClick={() => setIsLinkModalOpen(false)}>Cancelar</button>
                            <button className="btn btn--primary" onClick={handleSaveLinks}>Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Simple markdown renderer
function renderMarkdown(text) {
    if (!text) return ''
    let html = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^> (.*$)/gim, '<blockquote><p>$1</p></blockquote>')
        .replace(/<\/blockquote>\n<blockquote>/g, '\n')
        .replace(/- \[ \]/g, '☐')
        .replace(/- \[x\]/g, '☑️')
        .replace(/^- (.*$)/gim, '<li>$1</li>')
        .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
        .replace(/\|(.+)\|/g, (match) => {
            const cells = match.split('|').filter(c => c.trim())
            if (cells.every(c => c.trim().match(/^-+$/))) return ''
            const tag = 'td'
            const row = cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('')
            return `<tr>${row}</tr>`
        })
        .replace(/(<tr>.*<\/tr>[\n\r]*)+/g, '<table>$&</table>')
        .replace(/^(?!<[a-z]|☐|☑️)(.*[^\n])$/gim, '<p>$1</p>')
        .replace(/\n\n+/g, '\n')

    return html
}
