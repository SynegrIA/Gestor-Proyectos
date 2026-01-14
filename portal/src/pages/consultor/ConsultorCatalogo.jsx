
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    FiSearch, FiFilter, FiGrid, FiList, FiImage, FiCpu, 
    FiChevronRight, FiCopy, FiCheck, FiX, FiStar, FiAlertCircle, FiFile, FiLink, FiArrowRight,
    FiPlus, FiUpload, FiDownload, FiTrash2, FiSave
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SOLUTIONS_CATALOG_DATA from '../../data/catalogo_soluciones_v1.json';
import { getAssetLinks, getAssetsForSolution } from '../../utils/assetLinksHelper';
import { ASSETS_CATALOG } from '../../data/assetsCatalog';
import './ConsultorCatalogo.css';

const ConsultorCatalogo = ({ isAdminView }) => {
    const navigate = useNavigate();
    // Local state for catalog to support additions
    const [catalog, setCatalog] = useState(() => {
        const saved = localStorage.getItem('solutions_catalog_v1_custom');
        return saved ? [...JSON.parse(saved), ...SOLUTIONS_CATALOG_DATA] : SOLUTIONS_CATALOG_DATA;
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [assetLinks, setAssetLinks] = useState(() => getAssetLinks().links);
    
    // Admin States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importStep, setImportStep] = useState('upload'); // upload, preview, processing, done
    const [importedData, setImportedData] = useState([]);
    const fileInputRef = useRef(null);
    
    // Refresh links when drawer opens
    useEffect(() => {
        if (selectedSolution) {
            const { links } = getAssetLinks();
            setAssetLinks(links);
        }
    }, [selectedSolution]);
    
    // Filters State
    const [filters, setFilters] = useState({
        sector: [],
        departamento: [],
        tipoSolucion: [],
        complejidad: [],
        ttv: [],
        precioMax: 10000,
        estado: ['Activo']
    });

    // Images Persistence State
    const [solutionImages, setSolutionImages] = useState(() => {
        const saved = localStorage.getItem('solutions_images');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('solutions_images', JSON.stringify(solutionImages));
    }, [solutionImages]);

    // Data Normalization & Filtering (Use 'catalog' instead of static import)
    const sectors = useMemo(() => [...new Set(catalog.flatMap(s => s.sector || []))], [catalog]);
    const departments = useMemo(() => [...new Set(catalog.flatMap(s => s.departamento || []))], [catalog]);
    const solutionTypes = useMemo(() => [...new Set(catalog.flatMap(s => s.tipoSolucion || []))], [catalog]);
    const ttvOptions = useMemo(() => [...new Set(catalog.map(s => s.ttv).filter(Boolean))], [catalog]);

    const filteredSolutions = useMemo(() => {
        return catalog.filter(sol => {
            const matchesSearch = sol.nombre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 (sol.descripcion || '').toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesSector = filters.sector.length === 0 || filters.sector.some(s => sol.sector && sol.sector.includes(s));
            const matchesDept = filters.departamento.length === 0 || filters.departamento.some(d => sol.departamento && sol.departamento.includes(d));
            const matchesType = filters.tipoSolucion.length === 0 || filters.tipoSolucion.some(t => sol.tipoSolucion && sol.tipoSolucion.includes(t));
            const matchesComplexity = filters.complejidad.length === 0 || filters.complejidad.includes(sol.complejidad);
            const matchesTTV = filters.ttv.length === 0 || filters.ttv.includes(sol.ttv);
            const matchesPrice = !sol.precio_setup || sol.precio_setup <= filters.precioMax;
            const matchesStatus = filters.estado.length === 0 || filters.estado.includes(sol.estado);

            return matchesSearch && matchesSector && matchesDept && matchesType && matchesComplexity && matchesTTV && matchesPrice && matchesStatus;
        });
    }, [searchQuery, filters, catalog]);
    
    const handleAddSolution = (newSol) => {
        // En una app real, esto iría al backend. Aquí guardamos en localStorage.
        const customSolutions = JSON.parse(localStorage.getItem('solutions_catalog_v1_custom') || '[]');
        const solutionWithId = { ...newSol, id: `custom-${Date.now()}`, estado: 'Activo' };
        
        customSolutions.push(solutionWithId);
        localStorage.setItem('solutions_catalog_v1_custom', JSON.stringify(customSolutions));
        
        setCatalog(prev => [...prev, solutionWithId]);
        setShowCreateModal(false);
    };

    const handleImportFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImportStep('processing');
        
        // Simular procesamiento del Excel/CSV
        setTimeout(() => {
            // Mock data extraída de "Excel"
            const mockImported = [
                {
                    nombre: "Audit de Ciberseguridad Express",
                    descripcion: "Análisis rápido de vulnerabilidades críticas.",
                    problema: "Riesgos de seguridad no identificados",
                    outcome: "Informe de vulnerabilidades y plan de mitigación",
                    tipoSolucion: ["Auditoría"],
                    sector: ["Todos"],
                    departamento: ["IT"],
                    complejidad: 3,
                    ttv: "1 semana",
                    precio_setup: 2500,
                    riesgos: [],
                    entregables: [],
                    requisitos: []
                },
                {
                    nombre: "Automatización de Facturas",
                    descripcion: "OCR + IA para procesar facturas entrantes.",
                    problema: "Procesamiento manual lento y con errores",
                    outcome: "Reducción del 80% en tiempo de gestión",
                    tipoSolucion: ["Automatización", "IA"],
                    sector: ["Finanzas", "Retail"],
                    departamento: ["Finanzas"],
                    complejidad: 4,
                    ttv: "3 semanas",
                    precio_setup: 5000,
                    riesgos: [],
                    entregables: [],
                    requisitos: []
                }
            ];
            setImportedData(mockImported);
            setImportStep('preview');
        }, 1500);
    };

    const confirmImport = () => {
        const customSolutions = JSON.parse(localStorage.getItem('solutions_catalog_v1_custom') || '[]');
        const newSolutions = importedData.map((d, i) => ({ ...d, id: `import-${Date.now()}-${i}`, estado: 'Activo' }));
        
        const updatedCustom = [...customSolutions, ...newSolutions];
        localStorage.setItem('solutions_catalog_v1_custom', JSON.stringify(updatedCustom));
        
        setCatalog(prev => [...prev, ...newSolutions]);
        setShowImportModal(false);
        setImportedData([]);
        setImportStep('upload');
    };

    // Handlers
    const toggleFilter = (key, value) => {
        setFilters(prev => {
            const current = prev[key];
            if (current.includes(value)) {
                return { ...prev, [key]: current.filter(v => v !== value) };
            } else {
                return { ...prev, [key]: [...current, value] };
            }
        });
    };

    const handleGenerateImage = (id, sol) => {
        setSolutionImages(prev => ({
            ...prev,
            [id]: { status: 'generating' }
        }));

        // Simulate AI generation
        setTimeout(() => {
            const mockUrl = `https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop`; // Abstract tech image
            setSolutionImages(prev => ({
                ...prev,
                [id]: { status: 'ready', url: mockUrl }
            }));
        }, 2000);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const getSolutionSummary = (sol) => {
        return `Solución: ${sol.nombre}
Outcome: ${sol.outcome}
Problema: ${sol.problema}
Sector/Área: ${sol.sector.join(', ')} / ${sol.departamento.join(', ')}
Precio: ${sol.precio_aprox} | TTV: ${sol.ttv} | Complejidad: ${sol.complejidad}/5
Requisitos: ${sol.requisitos.slice(0, 3).join(', ')}`;
    };

    return (
        <div className="catalogo-page">
            <header className="catalogo-header">
                <div className="header-top">
                    <div>
                        <h1>Catálogo de Soluciones</h1>
                        <p className="subtitle">{filteredSolutions.length} soluciones encontradas</p>
                    </div>
                    <div className="header-actions">
                        <div className="search-box">
                            <FiSearch />
                            <input 
                                type="text" 
                                placeholder="Buscar soluciones..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        {isAdminView && (
                            <>
                                <button className="btn btn--primary" onClick={() => setShowCreateModal(true)}>
                                    <FiPlus /> Nueva
                                </button>
                                <button className="btn btn--secondary" onClick={() => setShowImportModal(true)}>
                                    <FiUpload /> Importar
                                </button>
                            </>
                        )}

                        <button 
                            className={`btn-filter ${isFilterOpen ? 'active' : ''}`}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <FiFilter /> Filtros
                        </button>
                        <div className="view-selector">
                            <button 
                                className={viewMode === 'cards' ? 'active' : ''} 
                                onClick={() => setViewMode('cards')}
                                title="Vista Cards"
                            >
                                <FiGrid />
                            </button>
                            <button 
                                className={viewMode === 'table' ? 'active' : ''} 
                                onClick={() => setViewMode('table')}
                                title="Vista Tabla"
                            >
                                <FiList />
                            </button>
                        </div>
                    </div>
                </div>

                {isFilterOpen && (
                    <div className="filters-panel">
                        <div className="filter-group">
                            <label>Sector</label>
                            <div className="filter-chips">
                                {sectors.map(s => (
                                    <button 
                                        key={s} 
                                        className={filters.sector.includes(s) ? 'active' : ''}
                                        onClick={() => toggleFilter('sector', s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Área / Departamento</label>
                            <div className="filter-chips">
                                {departments.map(d => (
                                    <button 
                                        key={d} 
                                        className={filters.departamento.includes(d) ? 'active' : ''}
                                        onClick={() => toggleFilter('departamento', d)}
                                    >
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Tipo Solución</label>
                            <div className="filter-chips">
                                {solutionTypes.map(t => (
                                    <button 
                                        key={t} 
                                        className={filters.tipoSolucion.includes(t) ? 'active' : ''}
                                        onClick={() => toggleFilter('tipoSolucion', t)}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Complejidad</label>
                            <div className="filter-chips">
                                {[1, 2, 3, 4, 5].map(c => (
                                    <button 
                                        key={c} 
                                        className={filters.complejidad.includes(c) ? 'active' : ''}
                                        onClick={() => toggleFilter('complejidad', c)}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Estado</label>
                            <div className="filter-chips">
                                {['Activo', 'Borrador', 'Deprecado'].map(st => (
                                    <button 
                                        key={st} 
                                        className={filters.estado.includes(st) ? 'active' : ''}
                                        onClick={() => toggleFilter('estado', st)}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>TTV (Tiempo hasta valor)</label>
                            <div className="filter-chips">
                                {ttvOptions.map(t => (
                                    <button 
                                        key={t} 
                                        className={filters.ttv.includes(t) ? 'active' : ''}
                                        onClick={() => toggleFilter('ttv', t)}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="filter-group">
                            <label>Precio Setup Máximo ({filters.precioMax}€)</label>
                            <input 
                                type="range" 
                                min="0" 
                                max="15000" 
                                step="500"
                                value={filters.precioMax}
                                onChange={(e) => setFilters(prev => ({ ...prev, precioMax: parseInt(e.target.value) }))}
                                className="filter-range"
                            />
                        </div>
                        <div className="filters-footer">
                            <button className="btn-clear" onClick={() => setFilters({
                                sector: [], departamento: [], tipoSolucion: [], complejidad: [], ttv: [], precioMax: 10000, estado: ['Activo']
                            })}>Limpiar filtros</button>
                        </div>
                    </div>
                )}
            </header>

            <main className="catalogo-content">
                {viewMode === 'cards' ? (
                    <div className="solutions-grid">
                        {filteredSolutions.map(sol => (
                            <SolutionCard 
                                key={sol.id} 
                                sol={sol} 
                                imageData={solutionImages[sol.id]}
                                onGenerateImage={() => handleGenerateImage(sol.id, sol)}
                                onClick={() => setSelectedSolution(sol)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="solutions-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Tipo</th>
                                    <th>Sector</th>
                                    <th>Área</th>
                                    <th>Precio</th>
                                    <th>TTV</th>
                                    <th>Cplx</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSolutions.map(sol => (
                                    <tr key={sol.id} onClick={() => setSelectedSolution(sol)}>
                                        <td className="col-name">
                                            <div className="name-wrapper">
                                                <strong>{sol.nombre}</strong>
                                                <span className={`status-badge status-${sol.estado.toLowerCase()}`}>{sol.estado}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="chip-group">
                                                {sol.tipoSolucion.slice(0, 1).map(t => <span key={t} className="chip">{t}</span>)}
                                                {sol.tipoSolucion.length > 1 && <span className="chip-more">+{sol.tipoSolucion.length - 1}</span>}
                                            </div>
                                        </td>
                                        <td>{sol.sector[0]}</td>
                                        <td>{sol.departamento[0]}</td>
                                        <td>{sol.precio_setup ? `${sol.precio_setup}€` : 'N/A'}</td>
                                        <td><span className="badge-ttv">{sol.ttv}</span></td>
                                        <td>
                                            <div className="complexity-dots">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} className={`dot ${i < sol.complejidad ? 'active' : ''}`} />
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* Drawer */}
            {selectedSolution && (
                <div className={`solution-drawer-overlay ${selectedSolution ? 'open' : ''}`} onClick={() => setSelectedSolution(null)}>
                    {/* ... (existing drawer content) ... */}
                    <div className="solution-drawer" onClick={e => e.stopPropagation()}>
                        <header className="drawer-header">
                            <div className="title-group">
                                <span className="id-tag">{selectedSolution.id}</span>
                                <h2>{selectedSolution.nombre}</h2>
                            </div>
                            <button className="btn-close" onClick={() => setSelectedSolution(null)}><FiX /></button>
                        </header>
                        
                        <div className="drawer-body">
                            <section className="drawer-section highlight">
                                <h3>Outcome / Promesa</h3>
                                <p className="outcome-text">"{selectedSolution.outcome}"</p>
                            </section>

                            <section className="drawer-section">
                                <h3>Problema que resuelve</h3>
                                <p>{selectedSolution.problema}</p>
                            </section>

                            <section className="drawer-section">
                                <h3>Descripción</h3>
                                <p>{selectedSolution.descripcion}</p>
                            </section>

                            <div className="drawer-grid">
                                <section className="drawer-section">
                                    <h3>Aplica a</h3>
                                    <div className="info-row">
                                        <label>Sectores:</label>
                                        <div className="chip-group">
                                            {selectedSolution.sector.map(s => <span key={s} className="chip">{s}</span>)}
                                        </div>
                                    </div>
                                    <div className="info-row">
                                        <label>Áreas:</label>
                                        <div className="chip-group">
                                            {selectedSolution.departamento.map(d => <span key={d} className="chip">{d}</span>)}
                                        </div>
                                    </div>
                                </section>

                                <section className="drawer-section">
                                    <h3>Métricas</h3>
                                    <div className="metric-item">
                                        <label>TTV:</label>
                                        <span>{selectedSolution.ttv}</span>
                                    </div>
                                    <div className="metric-item">
                                        <label>Duración:</label>
                                        <span>{selectedSolution.duracion_estandar} días</span>
                                    </div>
                                    <div className="metric-item">
                                        <label>Complejidad:</label>
                                        <span>{selectedSolution.complejidad}/5</span>
                                    </div>
                                </section>
                            </div>

                            <section className="drawer-section">
                                <h3>Precio</h3>
                                <p className="price-tag">{selectedSolution.precio_aprox}</p>
                            </section>
                            
                            {/* ... (rest of drawer) ... */}

                            <div className="drawer-grid">
                                <section className="drawer-section">
                                    <h3>Entregables</h3>
                                    <ul className="bullet-list">
                                        {(selectedSolution.entregables || []).map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </section>
                                <section className="drawer-section">
                                    <h3>Requisitos Cliente</h3>
                                    <ul className="bullet-list">
                                        {(selectedSolution.requisitos || []).map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </section>
                            </div>

                            <section className="drawer-section">
                                <h3>Activos Reutilizables</h3>
                                {getAssetsForSolution(selectedSolution.id, assetLinks, ASSETS_CATALOG).length > 0 ? (
                                    <div className="linked-assets-grid" style={{ display: 'grid', gap: '8px', marginTop: '12px' }}>
                                        {getAssetsForSolution(selectedSolution.id, assetLinks, ASSETS_CATALOG).map(assetId => {
                                            const asset = ASSETS_CATALOG.find(a => a.id === assetId.toString());
                                            if (!asset) return null;
                                            return (
                                                <div 
                                                    key={asset.id} 
                                                    className="linked-asset-item" 
                                                    onClick={() => navigate(`/consultor/activos/${asset.id}`)}
                                                    style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: '10px', 
                                                        padding: '10px', 
                                                        background: 'var(--bg-secondary)', 
                                                        borderRadius: 'var(--radius-md)',
                                                        border: '1px solid var(--border-color)',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-300)'}
                                                    onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                                >
                                                    <FiFile className="text-primary" />
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 'var(--font-semibold)', fontSize: '13px' }}>{asset.nombre}</div>
                                                        <div className="text-xs text-muted">{asset.tipo} · {asset.fase}</div>
                                                    </div>
                                                    <FiArrowRight size={14} className="text-muted" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted">No hay activos vinculados a esta solución.</p>
                                )}
                            </section>

                            <section className="drawer-section">
                                <h3>Riesgos y Dependencias</h3>
                                <ul className="bullet-list warning">
                                    {(selectedSolution.riesgos || []).map((item, i) => <li key={i}><FiAlertCircle /> {item}</li>)}
                                </ul>
                            </section>
                        </div>

                        <footer className="drawer-footer">
                            <button 
                                className={`btn-copy ${copySuccess ? 'success' : ''}`}
                                onClick={() => copyToClipboard(getSolutionSummary(selectedSolution))}
                            >
                                {copySuccess ? <><FiCheck /> Copiado</> : <><FiCopy /> Copiar Resumen</>}
                            </button>
                        </footer>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <CreateSolutionModal 
                    onSave={handleAddSolution} 
                    onClose={() => setShowCreateModal(false)}
                    sectors={sectors}
                    departments={departments}
                    types={solutionTypes}
                />
            )}

            {/* Import Modal */}
            {showImportModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '500px', maxWidth: '90vw' }}>
                        <div className="card-header">
                            <h3 className="card-title">Importar Soluciones</h3>
                            <button className="btn btn--ghost btn--icon" onClick={() => setShowImportModal(false)}><FiX /></button>
                        </div>
                        <div className="card-body" style={{ padding: 'var(--space-6)' }}>
                            {importStep === 'upload' && (
                                <div 
                                    className="upload-zone"
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: '2px dashed var(--border-color)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: 'var(--space-8)',
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        background: 'var(--bg-secondary)'
                                    }}
                                >
                                    <FiUpload size={48} className="text-muted" style={{ marginBottom: 'var(--space-4)' }} />
                                    <p className="text-muted">Haz clic o arrastra un archivo Excel (.xlsx, .csv)</p>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        style={{ display: 'none' }} 
                                        accept=".xlsx,.xls,.csv" 
                                        onChange={handleImportFile}
                                    />
                                    <div style={{ marginTop: 'var(--space-4)' }}>
                                        <button className="btn btn--secondary btn--sm">Seleccionar Archivo</button>
                                    </div>
                                    <p className="text-xs text-muted mt-2">Plantilla descargable disponible</p>
                                </div>
                            )}

                            {importStep === 'processing' && (
                                <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                                    <FiCpu className="spin" size={48} style={{ color: 'var(--primary-500)', marginBottom: 'var(--space-4)' }} />
                                    <p>Analizando archivo y extrayendo datos...</p>
                                </div>
                            )}

                            {importStep === 'preview' && (
                                <div>
                                    <div className="alert alert--success" style={{ marginBottom: 'var(--space-4)' }}>
                                        <FiCheck /> Se han detectado <strong>{importedData.length}</strong> soluciones válidas.
                                    </div>
                                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                                        <table className="table header-sticky">
                                            <thead>
                                                <tr>
                                                    <th>Nombre</th>
                                                    <th>Sector</th>
                                                    <th>Complejidad</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {importedData.map((d, i) => (
                                                    <tr key={i}>
                                                        <td>{d.nombre}</td>
                                                        <td>{d.sector[0]}</td>
                                                        <td>{d.complejidad}/5</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                            <button className="btn btn--ghost" onClick={() => setShowImportModal(false)}>Cancelar</button>
                            {importStep === 'preview' && (
                                <button className="btn btn--primary" onClick={confirmImport}>
                                    <FiDownload style={{ marginRight: 8 }} /> Importar {importedData.length} Soluciones
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ... (SolutionCard existing component) ...

function CreateSolutionModal({ onSave, onClose, sectors, departments, types }) {
    const [formData, setFormData] = useState({
        nombre: '',
        problema: '',
        outcome: '',
        tipoSolucion: '',
        sector: '',
        departamento: '',
        complejidad: 3,
        ttv: '2 semanas',
        precio_setup: 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            tipoSolucion: [formData.tipoSolucion], // Adapt format
            sector: [formData.sector],
            departamento: [formData.departamento],
            entregables: [],
            requisitos: [],
            riesgos: []
        });
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, 
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="card" style={{ width: '600px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="card-header">
                    <h3 className="card-title">Nueva Solución</h3>
                    <button className="btn btn--ghost btn--icon" onClick={onClose}><FiX /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="card-body" style={{ display: 'grid', gap: 'var(--space-4)' }}>
                        <div>
                            <label className="label">Nombre de la solución *</label>
                            <input type="text" className="input" required 
                                value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} 
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div>
                                <label className="label">Tipo</label>
                                <input type="text" list="types-list" className="input" required
                                    value={formData.tipoSolucion} onChange={e => setFormData({...formData, tipoSolucion: e.target.value})}
                                />
                                <datalist id="types-list">{types.map(t => <option key={t} value={t} />)}</datalist>
                            </div>
                            <div>
                                <label className="label">Precio Setup Est.</label>
                                <input type="number" className="input" 
                                    value={formData.precio_setup} onChange={e => setFormData({...formData, precio_setup: Number(e.target.value)})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="label">Problema que resuelve</label>
                            <textarea className="input" rows="2" required
                                value={formData.problema} onChange={e => setFormData({...formData, problema: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="label">Outcome (Promesa de valor)</label>
                            <textarea className="input" rows="2" required
                                value={formData.outcome} onChange={e => setFormData({...formData, outcome: e.target.value})}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div>
                                <label className="label">Sector</label>
                                <input type="text" list="sector-list" className="input" required
                                    value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})}
                                />
                                <datalist id="sector-list">{sectors.map(s => <option key={s} value={s} />)}</datalist>
                            </div>
                            <div>
                                <label className="label">Departamento</label>
                                <input type="text" list="dept-list" className="input" required
                                    value={formData.departamento} onChange={e => setFormData({...formData, departamento: e.target.value})}
                                />
                                <datalist id="dept-list">{departments.map(d => <option key={d} value={d} />)}</datalist>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div>
                                <label className="label">Complejidad (1-5)</label>
                                <input type="range" min="1" max="5" className="input" 
                                    value={formData.complejidad} onChange={e => setFormData({...formData, complejidad: Number(e.target.value)})}
                                />
                                <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{formData.complejidad}</div>
                            </div>
                            <div>
                                <label className="label">TTV (Tiempo hasta valor)</label>
                                <input type="text" className="input" placeholder="ej. 2 semanas"
                                    value={formData.ttv} onChange={e => setFormData({...formData, ttv: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                        <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn btn--primary"><FiSave /> Guardar Solución</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
        </div>
    );
};

const SolutionCard = ({ sol, imageData, onGenerateImage, onClick }) => {
    const status = imageData?.status || 'none';
    const imageUrl = imageData?.url;

    return (
        <div className="solution-card" onClick={onClick}>
            <div className="card-image">
                {status === 'ready' ? (
                    <img src={imageUrl} alt={sol.nombre} />
                ) : (
                    <div className={`placeholder ${status}`}>
                        {status === 'generating' ? (
                            <div className="generating-overlay">
                                <FiCpu className="spin" />
                                <span>Generando...</span>
                            </div>
                        ) : (
                            <div className="no-image">
                                <FiImage />
                                <button 
                                    className="btn-generate"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onGenerateImage();
                                    }}
                                >
                                    Generar imagen
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="card-content">
                <div className="card-header">
                    <span className="card-type">{sol.tipoSolucion[0]}</span>
                    <FiStar className="btn-fav" />
                </div>
                <h3>{sol.nombre}</h3>
                <div className="card-tags">
                    {sol.sector.slice(0, 1).map(s => <span key={s} className="tag tag-sector">{s}</span>)}
                    {sol.departamento.slice(0, 1).map(d => <span key={d} className="tag tag-dept">{d}</span>)}
                </div>
                <div className="card-metrics">
                    <div className="metric">
                        <span className="label">Setup:</span>
                        <span className="value">{sol.precio_setup ? `${sol.precio_setup}€` : 'N/A'}</span>
                    </div>
                    {sol.precio_mrr && (
                        <div className="metric">
                            <span className="label">MRR:</span>
                            <span className="value">{sol.precio_mrr}€</span>
                        </div>
                    )}
                </div>
                <div className="card-footer">
                    <span className="badge-ttv">{sol.ttv}</span>
                    <div className="complexity-dots">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={`dot ${i < sol.complejidad ? 'active' : ''}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultorCatalogo;
