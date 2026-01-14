import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    FiArrowLeft, FiEye, FiCheck,
    FiClock, FiLock, FiShield, FiUsers,
    FiGlobe, FiMessageSquare,
    FiPlus, FiX, FiFileText, FiBookOpen, FiShare2
} from 'react-icons/fi'
import CommentsSection from '../../components/common/CommentsSection'
import { DELIVERABLE_TYPES, checkIsReady, INITIAL_PUBLICATIONS } from '../../data/deliverables'
import { MOCK_PROJECT_DATA } from '../../data/mockProjectData'

// Documentos Internos (Privados) - Se mantienen aparte
const DOCUMENTOS_INTERNOS = [
    { id: 101, nombre: 'Informe Entrevista CEO', tipo: 'entrevista_ceo', estado: 'completado', icon: <FiShield />, fecha: '12 Ene 2024', comentarios: [] },
    { id: 102, nombre: 'Informe Entrevista Ventas', tipo: 'entrevista_ventas', estado: 'borrador', icon: <FiUsers />, fecha: '13 Ene 2024', comentarios: [] },
]

export default function ConsultorEntregables() {
    const { id } = useParams()
    const [viewMode, setViewMode] = useState('cliente') // 'cliente' | 'interno'
    const [publications, setPublications] = useState(() => {
        // Combinar publicaciones base con las iniciativas existentes
        const base = INITIAL_PUBLICATIONS;
        const iniciativasDocs = MOCK_PROJECT_DATA.iniciativas.map(ini => ({
            id: `ini-${ini.id}`,
            deliverable_type: DELIVERABLE_TYPES.INICIATIVA,
            deliverable_ref_id: ini.id,
            is_published: false,
            status_auto: 'BORRADOR',
            nombre_detalle: ini.titulo
        }));
        return [...base, ...iniciativasDocs];
    })

    const handleTogglePublished = (pubId) => {
        setPublications(publications.map(p => 
            p.id === pubId ? { ...p, is_published: !p.is_published, last_published_at: !p.is_published ? new Date().toISOString() : p.last_published_at } : p
        ));
    }

    const deliverableData = useMemo(() => {
        return publications.map(pub => {
            let data = null;
            let nombre = '';
            
            switch (pub.deliverable_type) {
                case DELIVERABLE_TYPES.DASHBOARD:
                    data = MOCK_PROJECT_DATA.dashboard;
                    nombre = 'Dashboard Ejecutivo';
                    break;
                case DELIVERABLE_TYPES.MATRIZ:
                    data = MOCK_PROJECT_DATA.matriz;
                    nombre = 'Matriz de Procesos';
                    break;
                case DELIVERABLE_TYPES.ROADMAP:
                    data = MOCK_PROJECT_DATA.roadmap;
                    nombre = 'Roadmap Priorizado';
                    break;
                case DELIVERABLE_TYPES.INICIATIVA:
                    data = MOCK_PROJECT_DATA.iniciativas.find(i => i.id === pub.deliverable_ref_id);
                    nombre = `Ficha: ${data?.titulo || 'Desconocida'}`;
                    break;
                default: break;
            }

            const isReady = checkIsReady(pub.deliverable_type, data);
            
            return {
                ...pub,
                nombre,
                isReady,
                status: isReady ? 'LISTO_PARA_REVISAR' : 'BORRADOR'
            };
        });
    }, [publications]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Cierre de Diagnóstico</h1>
                    <p className="page-subtitle">Gestión de entregables finales y publicación al cliente</p>
                </div>
            </div>

            {/* Mode Switcher */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-color)' }}>
                <button
                    className={`tab-btn ${viewMode === 'cliente' ? 'active' : ''}`}
                    onClick={() => setViewMode('cliente')}
                >
                    <FiShare2 style={{ marginRight: '8px' }} /> Entregables Publicables
                </button>
                <button
                    className={`tab-btn ${viewMode === 'interno' ? 'active' : ''}`}
                    onClick={() => setViewMode('interno')}
                >
                    <FiLock style={{ marginRight: '8px' }} /> Documentos Internos 🔒
                </button>
            </div>

            {viewMode === 'cliente' ? (
                /* VISTA CLIENTE */
                <div>
                    <div className="card">
                        <div className="card-body" style={{ padding: 0 }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Entregable</th>
                                        <th>Tipo</th>
                                        <th>Estado Prep.</th>
                                        <th>Publicado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deliverableData.map(ent => (
                                        <>
                                            <tr key={ent.id}>
                                                <td>
                                                    <strong>{ent.nombre}</strong>
                                                </td>
                                                <td><span className="badge badge--neutral">{ent.deliverable_type}</span></td>
                                                <td>
                                                    <span className={`badge ${ent.isReady ? 'badge--success' : 'badge--warning'}`}>
                                                        {ent.isReady ? 'LISTO' : 'BORRADOR'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                        <label className="switch">
                                                            <input 
                                                                type="checkbox" 
                                                                checked={ent.is_published} 
                                                                onChange={() => handleTogglePublished(ent.id)}
                                                            />
                                                            <span className="slider round"></span>
                                                        </label>
                                                        <span style={{ fontSize: '0.8rem', color: ent.is_published ? 'var(--success-600)' : 'var(--text-muted)' }}>
                                                            {ent.is_published ? 'Publicado' : 'Oculto'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                                        <button
                                                            className={`btn btn--sm ${ent.showComments ? 'btn--primary' : 'btn--ghost'}`}
                                                            onClick={() => setPublications(publications.map(p => p.id === ent.id ? { ...p, showComments: !p.showComments } : p))}
                                                            title="Comentarios"
                                                        >
                                                            <FiMessageSquare />
                                                        </button>
                                                        <Link 
                                                            to={ent.deliverable_type === 'iniciativa' 
                                                                ? `/consultor/proyecto/${id}/cierre/entregables/iniciativas/${ent.deliverable_ref_id}`
                                                                : `/consultor/proyecto/${id}/cierre/entregables/${ent.deliverable_type}`
                                                            } 
                                                            className="btn btn--ghost btn--sm"
                                                            title="Vista Previa"
                                                        >
                                                            <FiEye />
                                                        </Link>
                                                        {ent.is_published && (
                                                            <Link 
                                                                to={`/cliente/diagnostico/${id}/${ent.deliverable_type === 'iniciativa' ? 'iniciativas' : ent.deliverable_type}${ent.deliverable_type === 'iniciativa' ? '/' + ent.deliverable_ref_id : ''}`}
                                                                className="btn btn--ghost btn--sm"
                                                                title="Ver como cliente"
                                                                style={{ color: 'var(--primary-600)' }}
                                                            >
                                                                <FiGlobe />
                                                            </Link>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {ent.showComments && (
                                                <tr>
                                                    <td colSpan={5} style={{ background: 'var(--gray-50)', padding: 'var(--space-4)' }}>
                                                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                                                            <CommentsSection
                                                                comments={ent.comentarios || []}
                                                                onAddComment={(c) => {
                                                                    setPublications(publications.map(p =>
                                                                        p.id === ent.id ? { ...p, comentarios: [...(p.comentarios || []), c] } : p
                                                                    ))
                                                                }}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                /* VISTA INTERNA */
                <InternalDocumentsView />
            )}

            <style>{`
                .tab-btn {
                    background: none; border: none; border-bottom: 2px solid transparent;
                    padding: var(--space-3) var(--space-4); font-weight: var(--font-medium);
                    color: var(--text-muted); cursor: pointer; display: flex; align-items: center;
                    font-size: var(--text-md); transition: all 0.2s;
                }
                .tab-btn.active { color: var(--primary-600); border-bottom-color: var(--primary-600); }
                
                /* Switch styles */
                .switch { position: relative; display: inline-block; width: 34px; height: 18px; }
                .switch input { opacity: 0; width: 0; height: 0; }
                .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 34px; }
                .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
                input:checked + .slider { background-color: var(--success-500); }
                input:checked + .slider:before { transform: translateX(16px); }
            `}</style>
        </div>
    )
}


function InternalDocumentsView() {
    const [docs, setDocs] = useState(DOCUMENTOS_INTERNOS)
    const [isAdding, setIsAdding] = useState(false)
    const [newName, setNewName] = useState('')

    const handleFileUpload = (docId, file) => {
        if (!file) return
        const fileUrl = URL.createObjectURL(file)
        setDocs(docs.map(d => d.id === docId ? {
            ...d, estado: 'completado', fecha: new Date().toLocaleDateString('es-ES'),
            archivo: { name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + ' MB', url: fileUrl }
        } : d))
    }

    const handleAddCustomDoc = (e) => {
        e.preventDefault()
        if (!newName.trim()) return

        const newDoc = {
            id: Date.now(),
            nombre: newName,
            tipo: 'custom',
            estado: 'pendiente',
            icon: <FiFileText />,
            fecha: '-',
            comentarios: []
        }

        setDocs([...docs, newDoc])
        setNewName('')
        setIsAdding(false)
    }

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <div className="alert alert--warning" style={{ margin: 0, flex: 1, marginRight: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <FiLock size={24} />
                    <div>
                        <strong>Zona Privada del Consultor</strong><br />
                        Documentos confidenciales.
                    </div>
                </div>
                <button
                    className={`btn ${isAdding ? 'btn--ghost' : 'btn--primary'}`}
                    onClick={() => setIsAdding(!isAdding)}
                >
                    {isAdding ? <FiX /> : <FiPlus />} {isAdding ? 'Cancelar' : 'Añadir Documento'}
                </button>
            </div>

            {isAdding && (
                <div className="card" style={{ marginBottom: 'var(--space-6)', border: '2px solid var(--primary-200)' }}>
                    <form className="card-body" onSubmit={handleAddCustomDoc} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label className="form-label">Nombre del documento</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Ej: Contrato Anexo, Acta de reunión adicional..."
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="btn btn--primary" disabled={!newName.trim()}>
                            Crear Espacio de Subida
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
                {docs.map(doc => (
                    <div key={doc.id} className="card">
                        <div className="card-body">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                                <div style={{ color: 'var(--primary-600)', background: 'var(--primary-50)', padding: '8px', borderRadius: '8px' }}>{doc.icon}</div>
                                <span className={`badge ${doc.estado === 'completado' ? 'badge--success' : 'badge--neutral'}`}>{doc.estado}</span>
                            </div>
                            <h3 style={{ fontSize: 'var(--text-lg)' }}>{doc.nombre}</h3>
                            <p className="text-sm text-muted">{doc.archivo ? doc.archivo.name : 'Sin archivo'}</p>

                            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                                {doc.archivo ? (
                                    <a href={doc.archivo.url} target="_blank" rel="noreferrer" className="btn btn--secondary btn--sm" style={{ flex: 1 }}>Ver</a>
                                ) : (
                                    <label className="btn btn--primary btn--sm" style={{ flex: 1, cursor: 'pointer', textAlign: 'center' }}>
                                        Subir <input type="file" hidden onChange={(e) => handleFileUpload(doc.id, e.target.files[0])} />
                                    </label>
                                )}
                                <button
                                    className={`btn btn--sm ${doc.showComments ? 'btn--primary' : 'btn--ghost'}`}
                                    onClick={() => setDocs(docs.map(d => d.id === doc.id ? { ...d, showComments: !d.showComments } : d))}
                                >
                                    <FiMessageSquare />
                                </button>
                            </div>

                            {doc.showComments && (
                                <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--gray-50)', borderRadius: '8px' }}>
                                    <CommentsSection
                                        comments={doc.comentarios}
                                        onAddComment={(c) => setDocs(docs.map(d => d.id === doc.id ? { ...d, comentarios: [...(d.comentarios || []), c] } : d))}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
