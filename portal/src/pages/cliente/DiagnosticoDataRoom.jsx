import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { FiFolder, FiFile, FiUpload, FiTrash2, FiDownload, FiAlertTriangle, FiX, FiCheck, FiExternalLink } from 'react-icons/fi'

const INITIAL_FOLDERS = [
    {
        name: 'Finanzas', files: [
            { name: 'Balance_Q4_2023.xlsx', size: '15 KB', date: 'Ayer', uploaded_by: 'Consultor' },
            { name: 'PyG_2023.pdf', size: '2.1 MB', date: '10 Ene', uploaded_by: 'Consultor' },
            { name: 'Presupuesto_2024.xlsx', size: '45 KB', date: '08 Ene', uploaded_by: 'Consultor' }
        ]
    },
    { name: 'CRM', files: [], required: true },
    {
        name: 'ERP', files: [
            { name: 'Export_Clientes.csv', size: '1.2 MB', date: '11 Ene', uploaded_by: 'Cliente' },
            { name: 'Maestro_Productos.xlsx', size: '890 KB', date: '11 Ene', uploaded_by: 'Cliente' }
        ]
    },
    {
        name: 'Procesos', files: [
            { name: 'Mapa_Procesos_Actual.pdf', size: '5.2 MB', date: '09 Ene', uploaded_by: 'Consultor' }
        ]
    },
    { name: 'Otros', files: [] }
]

export default function DiagnosticoDataRoom() {
    const { id } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const categoryParam = searchParams.get('category')
    const pendingIdParam = searchParams.get('pendingId')

    const [folders, setFolders] = useState(() => {
        const saved = localStorage.getItem(`dataroom_${id}`)
        return saved ? JSON.parse(saved) : INITIAL_FOLDERS
    })

    const [activeFolder, setActiveFolder] = useState(categoryParam || 'Finanzas')
    
    // Sincronizar con Pendientes para obtener el nombre del pendiente
    const [pendingItem, setPendingItem] = useState(null)

    useEffect(() => {
        if (pendingIdParam) {
            const inputs = JSON.parse(localStorage.getItem(`inputs_${id}`) || '[]')
            const item = inputs.find(i => i.id === parseInt(pendingIdParam))
            if (item) setPendingItem(item)
        }
    }, [pendingIdParam, id])

    useEffect(() => {
        localStorage.setItem(`dataroom_${id}`, JSON.stringify(folders))
    }, [folders, id])

    const currentFolder = folders.find(f => f.name === activeFolder)

    const totalFiles = folders.reduce((acc, f) => acc + f.files.length, 0)
    const requiredComplete = !folders.some(f => f.required && f.files.length === 0)

    const [showUploadModal, setShowUploadModal] = useState(false)
    const [uploadingFile, setUploadingFile] = useState(null)

    const handleFileUpload = (e) => {
        // Simular selección de archivo
        const fileName = e.target.files?.[0]?.name || "Archivo_Subido.pdf"
        setUploadingFile({
            name: fileName,
            size: '1.5 MB',
            date: 'Hoy',
            uploaded_by: 'Cliente',
            category: activeFolder,
            linked_pending_id: pendingIdParam ? parseInt(pendingIdParam) : null
        })
        setShowUploadModal(true)
    }

    const confirmUpload = (linkPending = false) => {
        const newFolders = folders.map(f => {
            if (f.name === activeFolder) {
                return {
                    ...f,
                    files: [...f.files, { 
                        ...uploadingFile, 
                        linked_pending_id: linkPending ? uploadingFile.linked_pending_id : null 
                    }]
                }
            }
            return f
        })
        setFolders(newFolders)
        
        if (linkPending && uploadingFile.linked_pending_id) {
            resolvePending(uploadingFile.linked_pending_id, uploadingFile.name)
        }

        setShowUploadModal(false)
        setUploadingFile(null)
        
        // Limpiar params si se resolvió el que venía por URL
        if (linkPending && uploadingFile.linked_pending_id?.toString() === pendingIdParam) {
            setSearchParams({})
        }
    }

    const resolvePending = (pendingId, fileName) => {
        // 1. Actualizar ClientPending
        const inputs = JSON.parse(localStorage.getItem(`inputs_${id}`) || '[]')
        let taskId = null
        const updatedInputs = inputs.map(i => {
            if (i.id === pendingId) {
                taskId = i.taskId
                return { ...i, estado: 'por-validar', fecha: 'Hoy', archivo: fileName }
            }
            return i
        })
        localStorage.setItem(`inputs_${id}`, JSON.stringify(updatedInputs))

        // 2. Actualizar Task
        if (taskId) {
            const tasks = JSON.parse(localStorage.getItem(`tasks_${id}`) || '[]')
            const updatedTasks = tasks.map(t => 
                t.id === taskId ? { ...t, estado: 'completada' } : t
            )
            localStorage.setItem(`tasks_${id}`, JSON.stringify(updatedTasks))
        }

        // 3. Registrar Actividad
        const activities = JSON.parse(localStorage.getItem(`activities_${id}`) || '[]')
        const newActivity = {
            id: Date.now(),
            type: 'upload',
            text: `Cliente subió y vinculó "${fileName}" al pendiente "${pendingItem?.item || 'Requerido'}"`,
            timestamp: 'Ahora',
            user: 'Cliente'
        }
        localStorage.setItem(`activities_${id}`, JSON.stringify([newActivity, ...activities]))

        // 4. Notificar al consultor (V1)
        const consultorNotifications = JSON.parse(localStorage.getItem(`notifications_consultor_${id}`) || '[]')
        consultorNotifications.push({
            id: Date.now(),
            mensaje: `El cliente ha subido un archivo para: ${pendingItem?.item || 'un pendiente'}`,
            fecha: 'Ahora',
            tipo: 'archivo',
            url: `/consultor/proyecto/${id}/inputs-cliente`
        })
        localStorage.setItem(`notifications_consultor_${id}`, JSON.stringify(consultorNotifications))
        
        // Disparar evento para que otros componentes se enteren
        window.dispatchEvent(new Event('storage'))
        alert('Archivo subido y vinculado. El consultor ha sido notificado.')
    }

    const handleDeleteFile = (folderName, fileName) => {
        const newFolders = folders.map(f => {
            if (f.name === folderName) {
                return {
                    ...f,
                    files: f.files.filter(file => file.name !== fileName)
                }
            }
            return f
        })
        setFolders(newFolders)
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Data Room</h1>
                <p className="page-subtitle">Gestiona los archivos de tu diagnóstico</p>
            </div>

            {/* Status Info & Banner */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                        <span className="text-sm font-medium">Estado de documentación mínima:</span>
                        <span className="font-semibold">{requiredComplete ? '100%' : '80%'} (4 de 5 carpetas con archivos)</span>
                    </div>
                    <div className="progress">
                        <div className="progress__bar" style={{ width: requiredComplete ? '100%' : '80%' }}></div>
                    </div>
                    
                    {!requiredComplete && (
                        <div className="alert alert--warning" style={{ marginTop: 'var(--space-3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="flex items-center gap-2">
                                <FiAlertTriangle /> <span><strong>Falta:</strong> Carpeta CRM está vacía.</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="btn btn--secondary btn--sm" onClick={() => setActiveFolder('CRM')}>
                                    Ir a carpeta CRM
                                </button>
                                {pendingIdParam && (
                                    <Link to="../pendientes" className="btn btn--ghost btn--sm">Ver pendiente</Link>
                                )}
                            </div>
                        </div>
                    )}

                    {pendingIdParam && pendingItem && (
                        <div className="alert alert--info" style={{ marginTop: 'var(--space-3)', border: '2px solid var(--info-500)', background: 'var(--info-50)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>
                                        🎯 Resolviendo pendiente: {pendingItem.item}
                                    </div>
                                    <div className="text-sm">
                                        Sube el archivo requerido en la categoría <strong>{activeFolder}</strong> para completar esta tarea.
                                    </div>
                                </div>
                                <button className="btn btn--ghost btn--sm" onClick={() => setSearchParams({})} title="Cancelar resolución">
                                    <FiX />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 'var(--space-6)' }}>
                {/* Folder List */}
                <div className="card">
                    <div className="card-body" style={{ padding: 'var(--space-2)' }}>
                        {folders.map(folder => (
                            <button
                                key={folder.name}
                                onClick={() => setActiveFolder(folder.name)}
                                className={`folder-item ${activeFolder === folder.name ? 'active' : ''}`}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)',
                                    padding: 'var(--space-3)',
                                    background: activeFolder === folder.name ? 'var(--primary-50)' : 'transparent',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    color: activeFolder === folder.name ? 'var(--primary-700)' : 'var(--text-primary)'
                                }}
                            >
                                <FiFolder />
                                <span style={{ flex: 1 }}>{folder.name}</span>
                                <span className="text-sm text-muted">({folder.files.length})</span>
                                {folder.required && folder.files.length === 0 && (
                                    <span className="badge badge--danger" style={{ padding: '2px 6px' }}>!</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* File List */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">{activeFolder}</h3>
                        <label className="btn btn--primary" style={{ cursor: 'pointer' }}>
                            <FiUpload /> Subir archivo
                            <input type="file" hidden onChange={handleFileUpload} />
                        </label>
                    </div>
                    <div className="card-body">
                        {currentFolder?.files.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state__icon">📁</div>
                                <h4 className="empty-state__title">Sin archivos</h4>
                                <p className="empty-state__description">
                                    {currentFolder?.required
                                        ? 'Esta carpeta requiere archivos. Por favor sube los documentos necesarios.'
                                        : 'Arrastra archivos aquí o usa el botón de subir.'}
                                </p>
                                <label className="btn btn--primary" style={{ cursor: 'pointer' }}>
                                    Subir archivo
                                    <input type="file" hidden onChange={handleFileUpload} />
                                </label>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Vínculo / Info</th>
                                            <th>Subido por</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentFolder?.files.map((file, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                        <FiFile /> 
                                                        <div>
                                                            <div className="font-medium">{file.name}</div>
                                                            <div className="text-xs text-muted">{file.size} • {file.date}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    {file.linked_pending_id ? (
                                                        <span className="badge badge--success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                            <FiCheck size={12} /> Vinculado a pendiente
                                                        </span>
                                                    ) : '-'}
                                                </td>
                                                <td>
                                                    <span className={`badge ${file.uploaded_by === 'Cliente' ? 'badge--info' : 'badge--neutral'}`}>
                                                        {file.uploaded_by}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                        <button className="btn btn--ghost btn--icon btn--sm" title="Descargar"><FiDownload /></button>
                                                        {file.linked_pending_id && (
                                                            <Link to="../pendientes" className="btn btn--ghost btn--icon btn--sm" title="Ver pendiente">
                                                                <FiExternalLink />
                                                            </Link>
                                                        )}
                                                        {(file.uploaded_by === 'Cliente' || !file.uploaded_by) && (
                                                            <button 
                                                                className="btn btn--ghost btn--icon btn--sm text-danger"
                                                                onClick={() => handleDeleteFile(activeFolder, file.name)}
                                                                title="Eliminar"
                                                            >
                                                                <FiTrash2 />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de Vinculación */}
            {showUploadModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div className="card" style={{ width: '450px', maxWidth: '90%' }}>
                        <div className="card-header" style={{ justifyContent: 'space-between' }}>
                            <h3 className="card-title">Vincular archivo</h3>
                            <button className="btn btn--ghost btn--sm" onClick={() => setShowUploadModal(false)}><FiX /></button>
                        </div>
                        <div className="card-body">
                            <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)' }}>📄</div>
                                <div className="font-bold">{uploadingFile?.name}</div>
                                <div className="text-sm text-muted">Categoría: {activeFolder}</div>
                            </div>

                            {uploadingFile?.linked_pending_id ? (
                                <div className="alert alert--info" style={{ marginBottom: 'var(--space-4)' }}>
                                    <div className="font-semibold mb-1">Pendiente detectado:</div>
                                    <div className="text-sm">{pendingItem?.item || 'Carga de archivo solicitada'}</div>
                                </div>
                            ) : (
                                <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-4)' }}>
                                    ¿Deseas intentar vincular este archivo a un pendiente abierto o solo subirlo al Data Room?
                                </p>
                            )}
                            
                            <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                                <button 
                                    className="btn btn--primary" 
                                    onClick={() => confirmUpload(!!uploadingFile?.linked_pending_id)}
                                >
                                    {uploadingFile?.linked_pending_id ? 'Vincular y marcar como recibido' : 'Subir archivo sin vincular'}
                                </button>
                                <button className="btn btn--ghost" onClick={() => setShowUploadModal(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
