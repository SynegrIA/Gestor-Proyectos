
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import DiagnosticoDashboard from '../cliente/DiagnosticoDashboard';
import DiagnosticoMatriz from '../cliente/DiagnosticoMatriz';
import DiagnosticoRoadmap from '../cliente/DiagnosticoRoadmap';
import DiagnosticoFichaIniciativa from '../cliente/DiagnosticoFichaIniciativa';

export default function ConsultorEntregablesPreview() {
    const { id, type, iniciativaId } = useParams();

    const renderContent = () => {
        if (iniciativaId) {
            return <DiagnosticoFichaIniciativa />;
        }

        switch (type) {
            case 'dashboard':
                return <DiagnosticoDashboard />;
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
