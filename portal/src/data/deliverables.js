
// Configuración de tipos de entregables
export const DELIVERABLE_TYPES = {
    DASHBOARD: 'dashboard',
    MATRIZ: 'matriz',
    ROADMAP: 'roadmap',
    INICIATIVA: 'iniciativa'
};

// Reglas de "Listo para revisar"
export const checkIsReady = (type, data) => {
    switch (type) {
        case DELIVERABLE_TYPES.DASHBOARD:
            // Dashboard: existe resumen ejecutivo + 3 KPIs con valores
            return !!data.summary && data.kpis?.length >= 3 && data.kpis.every(k => !!k.value);
        
        case DELIVERABLE_TYPES.MATRIZ:
            // Matriz: >= 5 procesos y todos tienen dolor y tiempo (y eurMonth si aplica)
            return data.processes?.length >= 5 && data.processes.every(p => 
                p.pain !== undefined && 
                p.time_min !== undefined
            );
        
        case DELIVERABLE_TYPES.ROADMAP:
            // Roadmap: >= 3 iniciativas priorizadas con ROI y esfuerzo
            return data.initiatives?.length >= 3 && data.initiatives.every(i => !!i.roi_eur_anual && !!i.esfuerzo_horas);
        
        case DELIVERABLE_TYPES.INICIATIVA:
            // Ficha iniciativa: título + problema + impacto (€) + esfuerzo (h)
            return !!data.titulo && !!data.resumen && !!data.roi_eur_anual && !!data.esfuerzo_horas;
        
        default:
            return false;
    }
};

// Mock de la entidad DeliverablePublication
export const INITIAL_PUBLICATIONS = [
    { id: 1, deliverable_type: 'dashboard', deliverable_ref_id: null, is_published: false, status_auto: 'BORRADOR', last_published_at: null },
    { id: 2, deliverable_type: 'matriz', deliverable_ref_id: null, is_published: true, status_auto: 'LISTO_PARA_REVISAR', last_published_at: '2024-01-10T10:00:00Z' },
    { id: 3, deliverable_type: 'roadmap', deliverable_ref_id: null, is_published: false, status_auto: 'BORRADOR', last_published_at: null },
];
