
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import DiagnosticoDashboard from '../cliente/DiagnosticoDashboard';
import DiagnosticoMatriz from '../cliente/DiagnosticoMatriz';
import DiagnosticoRoadmap from '../cliente/DiagnosticoRoadmap';
import DiagnosticoFichaIniciativa from '../cliente/DiagnosticoFichaIniciativa';
import { MOCK_PROJECT_DATA } from '../../data/mockProjectData';

// Componente para editar Dashboard
function DashboardEditor() {
    const [isEditing, setIsEditing] = useState(false);
    const [dashboardData, setDashboardData] = useState(MOCK_PROJECT_DATA.dashboard);

    const handleSave = () => {
        // Aquí iría la lógica para guardar en backend
        MOCK_PROJECT_DATA.dashboard = dashboardData;
        setIsEditing(false);
        alert('Dashboard guardado correctamente');
    };

    if (!isEditing) {
        return (
            <div>
                <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn btn--primary" onClick={() => setIsEditing(true)}>
                        <FiEdit2 style={{ marginRight: '8px' }} /> Editar Dashboard
                    </button>
                </div>
                <DiagnosticoDashboard />
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-header" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: 'var(--primary-50)',
                borderBottom: '2px solid var(--primary-200)'
            }}>
                <h3 style={{ margin: 0, color: 'var(--primary-700)' }}>
                    <FiEdit2 style={{ marginRight: '8px' }} /> Editando Dashboard Ejecutivo
                </h3>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn--ghost" onClick={() => setIsEditing(false)}>
                        <FiX /> Cancelar
                    </button>
                    <button className="btn btn--success" onClick={handleSave}>
                        <FiSave /> Guardar cambios
                    </button>
                </div>
            </div>
            <div className="card-body">
                <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
                        Resumen Ejecutivo
                    </label>
                    <textarea
                        className="form-input"
                        rows={6}
                        value={dashboardData.summary}
                        onChange={(e) => setDashboardData({ ...dashboardData, summary: e.target.value })}
                        style={{ 
                            fontSize: '14px', 
                            lineHeight: '1.6',
                            fontFamily: 'inherit'
                        }}
                    />
                    <p className="text-sm text-muted" style={{ marginTop: '4px' }}>
                        Este texto aparecerá en la sección "Resumen Ejecutivo" del dashboard.
                    </p>
                </div>

                <hr style={{ margin: 'var(--space-6) 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

                <div>
                    <label className="form-label" style={{ fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}>
                        KPIs Principales
                    </label>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
                        {dashboardData.kpis.map((kpi, index) => (
                            <div key={index} className="card" style={{ background: 'var(--gray-50)' }}>
                                <div className="card-body">
                                    <div className="form-group" style={{ marginBottom: '12px' }}>
                                        <label className="form-label" style={{ fontSize: '12px' }}>Etiqueta</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={kpi.label}
                                            onChange={(e) => {
                                                const newKpis = [...dashboardData.kpis];
                                                newKpis[index] = { ...newKpis[index], label: e.target.value };
                                                setDashboardData({ ...dashboardData, kpis: newKpis });
                                            }}
                                            style={{ fontSize: '13px' }}
                                        />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label" style={{ fontSize: '12px' }}>Valor</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={kpi.value}
                                            onChange={(e) => {
                                                const newKpis = [...dashboardData.kpis];
                                                newKpis[index] = { ...newKpis[index], value: e.target.value };
                                                setDashboardData({ ...dashboardData, kpis: newKpis });
                                            }}
                                            style={{ fontSize: '18px', fontWeight: 700 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-muted" style={{ marginTop: '12px' }}>
                        Estos valores aparecen en las tarjetas superiores del dashboard (con fondo violeta).
                    </p>
                </div>

                <hr style={{ margin: 'var(--space-6) 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />

                <div className="alert alert--info">
                    <strong>💡 Nota:</strong> Los demás datos del dashboard (Top 3 Iniciativas, Distribución del Ahorro, etc.) 
                    se calculan automáticamente a partir de las iniciativas y métricas del proyecto.
                </div>
            </div>
        </div>
    );
}

export default function ConsultorEntregablesPreview() {
    const { id, type, iniciativaId } = useParams();

    const renderContent = () => {
        if (iniciativaId) {
            return <DiagnosticoFichaIniciativa />;
        }

        switch (type) {
            case 'dashboard':
                return <DashboardEditor />;
            case 'matriz':
                return <DiagnosticoMatriz />;
            case 'roadmap':
                return <DiagnosticoRoadmap />;
            default:
                return (
                    <div className="card">
                        <div className="card-body" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
                            <FiAlertCircle size={48} color="var(--warning-500)" />
                            <h3>Tipo de entregable no reconocido</h3>
                            <p>El tipo "{type}" no tiene una vista asociada.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to={`/consultor/proyecto/${id}/cierre/entregables`} className="btn btn--ghost">
                    <FiArrowLeft /> Volver a Entregables
                </Link>
                <div className="badge badge--warning">MODO VISTA PREVIA (CONSULTOR)</div>
            </div>
            
            <div className="preview-container">
                {renderContent()}
            </div>

            <style>{`
                .preview-container {
                    border: 4px solid var(--primary-100);
                    border-radius: var(--radius-lg);
                    padding: var(--space-4);
                    background: var(--bg-secondary);
                }
            `}</style>
        </div>
    );
}
