
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    FiSearch, FiFilter, FiGrid, FiList, FiImage, FiCpu, 
    FiChevronRight, FiCopy, FiCheck, FiX, FiStar, FiAlertCircle, FiFile, FiLink, FiArrowRight,
    FiPlus, FiUpload, FiDownload, FiTrash2, FiSave
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SOLUTIONS_CATALOG_DATA from '../../data/catalogo_soluciones_v1.json';
import { getAssetLinks, getAssetsForSolution, updateSolutionLinks } from '../../utils/assetLinksHelper';
import { ASSETS_CATALOG } from '../../data/assetsCatalog';
import './ConsultorCatalogo.css';

const ConsultorCatalogo = ({ isAdminView }) => {
    const navigate = useNavigate();
    // Local state for catalog to support additions
    const [catalog, setCatalog] = useState(() => {
        const saved = localStorage.getItem('solutions_catalog_v1_custom');
        const custom = saved ? JSON.parse(saved) : [];
        const customIds = new Set(custom.map(s => s.id));
        return [...custom, ...SOLUTIONS_CATALOG_DATA.filter(s => !customIds.has(s.id))];
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [selectedSolution, setSelectedSolution] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const [assetLinks, setAssetLinks] = useState(() => getAssetLinks().links);
    
    // Admin States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingSolution, setEditingSolution] = useState(null);
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
    
    const handleAddSolution = (newSol, linkedAssetIds) => {
        // En una app real, esto iría al backend. Aquí guardamos en localStorage.
        const customSolutions = JSON.parse(localStorage.getItem('solutions_catalog_v1_custom') || '[]');
        const solutionWithId = { ...newSol, id: `custom-${Date.now()}`, estado: 'Activo' };
        
        customSolutions.push(solutionWithId);
        localStorage.setItem('solutions_catalog_v1_custom', JSON.stringify(customSolutions));
        
        setCatalog(prev => [solutionWithId, ...prev]);

        // Asset Links
        if (linkedAssetIds && linkedAssetIds.length > 0) {
            const newLinks = updateSolutionLinks(solutionWithId.id, linkedAssetIds);
            setAssetLinks(newLinks);
        }

        setShowCreateModal(false);
    };

    const handleEditSolution = (sol) => {
        setEditingSolution(sol);
        setShowEditModal(true);
    };

    const handleUpdateSolution = (updatedSol, linkedAssetIds) => {
        // 1. Update Catalog
        const customSolutions = JSON.parse(localStorage.getItem('solutions_catalog_v1_custom') || '[]');
        const existingIdx = customSolutions.findIndex(s => s.id === updatedSol.id);
        
        let newCustom;
        if (existingIdx >= 0) {
            newCustom = customSolutions.map((s, i) => i === existingIdx ? updatedSol : s);
        } else {
            newCustom = [...customSolutions, updatedSol];
        }
        
        localStorage.setItem('solutions_catalog_v1_custom', JSON.stringify(newCustom));
        
        // Update state
        setCatalog(prev => prev.map(s => s.id === updatedSol.id ? updatedSol : s));
        setSelectedSolution(updatedSol);

        // 2. Update Asset Links
        if (linkedAssetIds) {
            const newLinks = updateSolutionLinks(updatedSol.id, linkedAssetIds);
            setAssetLinks(newLinks);
        }
        
        setShowEditModal(false);
        setEditingSolution(null);
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

    const handleGenerateImage = (id) => {
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
                                onGenerateImage={() => handleGenerateImage(sol.id)}
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className="id-tag">{selectedSolution.id}</span>
                                    {isAdminView && (
                                        <button 
                                            className="btn btn--xs btn--secondary" 
                                            onClick={() => handleEditSolution(selectedSolution)}
                                            style={{ padding: '2px 8px', fontSize: '11px' }}
                                        >
                                            Editar Ficha
                                        </button>
                                    )}
                                </div>
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

            {/* Create/Edit Modal */}
            {(showCreateModal || showEditModal) && (
                <SolutionFormModal 
                    onSave={showCreateModal ? handleAddSolution : handleUpdateSolution} 
                    onClose={() => {
                        setShowCreateModal(false);
                        setShowEditModal(false);
                        setEditingSolution(null);
                    }}
                    sectors={sectors}
                    departments={departments}
                    types={solutionTypes}
                    initialData={editingSolution}
                    allAssets={ASSETS_CATALOG}
                    currentAssetIds={editingSolution ? getAssetsForSolution(editingSolution.id, assetLinks, ASSETS_CATALOG) : []}
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

function SolutionFormModal({ onSave, onClose, sectors, departments, types, initialData, allAssets, currentAssetIds }) {
    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || '',
        problema: initialData?.problema || '',
        outcome: initialData?.outcome || '',
        descripcion: initialData?.descripcion || '',
        tipoSolucion: initialData?.tipoSolucion?.[0] || '',
        sector: initialData?.sector?.[0] || '',
        departamento: initialData?.departamento?.[0] || '',
        complejidad: initialData?.complejidad || 3,
        ttv: initialData?.ttv || '2 semanas',
        precio_setup: initialData?.precio_setup || 0,
        id: initialData?.id || null,
        estado: initialData?.estado || 'Activo'
    });

    const [selectedAssets, setSelectedAssets] = useState(currentAssetIds.map(id => id.toString()));
    const [assetSearch, setAssetSearch] = useState('');

    const filteredAssets = allAssets.filter(asset => 
        asset.nombre.toLowerCase().includes(assetSearch.toLowerCase()) ||
        asset.tipo.toLowerCase().includes(assetSearch.toLowerCase()) ||
        (asset.fase && asset.fase.toLowerCase().includes(assetSearch.toLowerCase()))
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...initialData,
            ...formData,
            tipoSolucion: [formData.tipoSolucion], 
            sector: [formData.sector],
            departamento: [formData.departamento],
        }, selectedAssets);
    };

    const toggleAsset = (assetId) => {
        const idStr = assetId.toString();
        setSelectedAssets(prev => 
            prev.includes(idStr) 
                ? prev.filter(id => id !== idStr)
                : [...prev, idStr]
        );
    };

    const inputGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        marginBottom: '16px'
    };

    const labelStyle = {
        fontSize: '13px',
        fontWeight: '600',
        color: 'var(--text-secondary)',
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        fontSize: '14px',
        background: 'white',
        outline: 'none',
        transition: 'border-color 0.2s',
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', zIndex: 1000, 
            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }}>
            <div className="card" style={{ 
                width: '900px', 
                maxWidth: '95vw', 
                maxHeight: '90vh', 
                overflow: 'hidden', 
                display: 'flex', 
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: 'none'
            }}>
                <div className="card-header" style={{ 
                    padding: '20px 24px', 
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h3 className="card-title" style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
                            {initialData ? 'Editar Solución' : 'Nueva Solución del Catálogo'}
                        </h3>
                        {initialData && <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>ID: {initialData.id}</span>}
                    </div>
                    <button className="btn btn--ghost btn--icon" onClick={onClose} style={{ borderRadius: '50%' }}><FiX /></button>
                </div>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <div className="card-body" style={{ 
                        overflowY: 'auto', 
                        padding: '24px',
                        background: '#f8fafc' // Subtle gray background for body
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
                            
                            {/* Columna Izquierda: Información de la Solución */}
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ background: 'white', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                                    <h4 style={{ marginTop: 0, marginBottom: '20px', fontSize: '14px', color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Información Principal</h4>
                                    
                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>Nombre de la solución *</label>
                                        <input type="text" style={inputStyle} required 
                                            value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} 
                                            placeholder="Ej. Automatización de Facturación"
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div style={inputGroupStyle}>
                                            <label style={labelStyle}>Categoría / Tipo</label>
                                            <input type="text" list="types-list" style={inputStyle} required
                                                value={formData.tipoSolucion} onChange={e => setFormData({...formData, tipoSolucion: e.target.value})}
                                                placeholder="Ej. SaaS"
                                            />
                                            <datalist id="types-list">{types.map(t => <option key={t} value={t} />)}</datalist>
                                        </div>
                                        <div style={inputGroupStyle}>
                                            <label style={labelStyle}>Estado en Catálogo</label>
                                            <select style={inputStyle} value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})}>
                                                <option value="Activo">🟢 Activo</option>
                                                <option value="Borrador">🟡 Borrador</option>
                                                <option value="Deprecado">🔴 Deprecado</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>Descripción Corta</label>
                                        <textarea style={{...inputStyle, minHeight: '80px', resize: 'vertical'}} 
                                            value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})}
                                            placeholder="Explica brevemente qué hace la solución..."
                                        />
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>Problema que resuelve *</label>
                                        <textarea style={{...inputStyle, minHeight: '60px', resize: 'vertical'}} required
                                            value={formData.problema} onChange={e => setFormData({...formData, problema: e.target.value})}
                                            placeholder="¿Qué dolor alivia al cliente?"
                                        />
                                    </div>

                                    <div style={inputGroupStyle}>
                                        <label style={labelStyle}>Outcome / Promesa *</label>
                                        <textarea style={{...inputStyle, minHeight: '60px', resize: 'vertical'}} required
                                            value={formData.outcome} onChange={e => setFormData({...formData, outcome: e.target.value})}
                                            placeholder="¿Qué resultado tangible obtendrá el cliente?"
                                        />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div style={inputGroupStyle}>
                                            <label style={labelStyle}>Sector Recomendado</label>
                                            <input type="text" list="sector-list" style={inputStyle} required
                                                value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})}
                                            />
                                            <datalist id="sector-list">{sectors.map(s => <option key={s} value={s} />)}</datalist>
                                        </div>
                                        <div style={inputGroupStyle}>
                                            <label style={labelStyle}>Departamento</label>
                                            <input type="text" list="dept-list" style={inputStyle} required
                                                value={formData.departamento} onChange={e => setFormData({...formData, departamento: e.target.value})}
                                            />
                                            <datalist id="dept-list">{departments.map(d => <option key={d} value={d} />)}</datalist>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div style={inputGroupStyle}>
                                            <label style={labelStyle}>Complejidad de Impl. (1-5)</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 0' }}>
                                                <input type="range" min="1" max="5" style={{ flex: 1, accentColor: 'var(--primary-500)' }}
                                                    value={formData.complejidad} onChange={e => setFormData({...formData, complejidad: Number(e.target.value)})}
                                                />
                                                <span style={{ fontWeight: '700', color: 'var(--primary-600)', minWidth: '20px' }}>{formData.complejidad}</span>
                                            </div>
                                        </div>
                                        <div style={inputGroupStyle}>
                                            <label style={labelStyle}>TTV (Tiempo hasta valor)</label>
                                            <input type="text" style={inputStyle} placeholder="ej. 2-4 semanas"
                                                value={formData.ttv} onChange={e => setFormData({...formData, ttv: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha: Selección de Activos */}
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ 
                                    background: 'white', 
                                    padding: '20px', 
                                    borderRadius: 'var(--radius-lg)', 
                                    border: '1px solid var(--border-color)', 
                                    boxShadow: 'var(--shadow-sm)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%'
                                }}>
                                    <h4 style={{ marginTop: 0, marginBottom: '8px', fontSize: '14px', color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Activos Vinculados
                                    </h4>
                                    <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '16px' }}>
                                        Selecciona los documentos, plantillas y herramientas necesarios para esta solución.
                                    </p>
                                    
                                    {/* Buscador de Activos */}
                                    <div style={{ position: 'relative', marginBottom: '12px' }}>
                                        <FiSearch style={{ 
                                            position: 'absolute', 
                                            left: '12px', 
                                            top: '50%', 
                                            transform: 'translateY(-50%)', 
                                            color: 'var(--text-tertiary)',
                                            pointerEvents: 'none'
                                        }} size={14} />
                                        <input 
                                            type="text" 
                                            placeholder="Buscar por nombre, tipo o fase..." 
                                            value={assetSearch}
                                            onChange={e => setAssetSearch(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px 12px 8px 34px',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--border-color)',
                                                fontSize: '13px',
                                                outline: 'none',
                                                background: '#f8fafc',
                                                transition: 'all 0.2s'
                                            }}
                                            onFocus={e => {
                                                e.target.style.borderColor = 'var(--primary-500)';
                                                e.target.style.background = 'white';
                                                e.target.style.boxShadow = '0 0 0 3px var(--primary-50)';
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = 'var(--border-color)';
                                                e.target.style.background = '#f8fafc';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                        {assetSearch && (
                                            <button 
                                                type="button"
                                                onClick={() => setAssetSearch('')}
                                                style={{
                                                    position: 'absolute',
                                                    right: '8px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    border: 'none',
                                                    background: 'transparent',
                                                    color: 'var(--text-tertiary)',
                                                    cursor: 'pointer',
                                                    padding: '4px'
                                                }}
                                            >
                                                <FiX size={14} />
                                            </button>
                                        )}
                                    </div>
                                    
                                    <div style={{ 
                                        flex: 1,
                                        overflowY: 'auto', 
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid #e2e8f0',
                                        background: '#f1f5f9'
                                    }}>
                                        {filteredAssets.length > 0 ? (
                                            filteredAssets.map(asset => {
                                                const isSelected = selectedAssets.includes(asset.id.toString());
                                                return (
                                                    <div 
                                                        key={asset.id} 
                                                        onClick={() => toggleAsset(asset.id)}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '12px',
                                                            padding: '12px',
                                                            borderBottom: '1px solid #e2e8f0',
                                                            cursor: 'pointer',
                                                            background: isSelected ? 'white' : 'transparent',
                                                            transition: 'all 0.1s ease',
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        {isSelected && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--primary-500)' }} />}
                                                        <div style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            borderRadius: '4px',
                                                            border: isSelected ? '2px solid var(--primary-500)' : '2px solid #cbd5e1',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            background: isSelected ? 'var(--primary-500)' : 'white'
                                                        }}>
                                                            {isSelected && <FiCheck size={14} color="white" />}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontSize: '13px', fontWeight: isSelected ? '700' : '500', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                                                {asset.nombre}
                                                            </div>
                                                            <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                                                                {asset.tipo} • {asset.fase}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                                <div style={{ marginBottom: '8px' }}><FiSearch size={24} style={{ opacity: 0.5 }} /></div>
                                                <p style={{ fontSize: '13px' }}>No se encontraron activos que coincidan con tu búsqueda.</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div style={{ 
                                        marginTop: '16px', 
                                        padding: '12px', 
                                        background: 'var(--primary-50)', 
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--primary-100)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        <FiLink size={14} className="text-primary" />
                                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--primary-700)' }}>
                                            {selectedAssets.length} activos seleccionados
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="card-footer" style={{ 
                        padding: '16px 24px', 
                        borderTop: '1px solid var(--border-color)', 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        gap: '12px',
                        background: 'white'
                    }}>
                        <button type="button" className="btn btn--ghost" onClick={onClose} style={{ fontWeight: '600' }}>Cancelar</button>
                        <button type="submit" className="btn btn--primary" style={{ padding: '10px 24px', fontWeight: '700' }}>
                            <FiSave style={{ marginRight: '8px' }} /> 
                            {initialData ? 'Guardar Cambios' : 'Publicar en Catálogo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
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
                    {sol.sector?.slice(0, 1).map(s => <span key={s} className="tag tag-sector">{s}</span>)}
                    {sol.departamento?.slice(0, 1).map(d => <span key={d} className="tag tag-dept">{d}</span>)}
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
