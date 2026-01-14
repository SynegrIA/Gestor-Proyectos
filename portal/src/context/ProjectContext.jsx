import React, { createContext, useContext, useState, useEffect } from 'react';
import { DELIVERABLE_TYPES, INITIAL_PUBLICATIONS } from '../data/deliverables';
import { MOCK_PROJECT_DATA } from '../data/mockProjectData';

const ProjectDataContext = createContext();

export function ProjectDataProvider({ children }) {
    // Intentar cargar de localStorage o usar mock
    const [projectData, setProjectData] = useState(() => {
        const saved = localStorage.getItem('synergia_project_data');
        if (!saved) return MOCK_PROJECT_DATA;
        try {
            const parsed = JSON.parse(saved);
            // Asegurar que las nuevas secciones existan si no están en localStorage
            return {
                ...MOCK_PROJECT_DATA,
                ...parsed,
                medicion: parsed.medicion || MOCK_PROJECT_DATA.medicion,
                supuestos: parsed.supuestos || MOCK_PROJECT_DATA.supuestos,
                planMedicion: parsed.planMedicion || MOCK_PROJECT_DATA.planMedicion,
                iniciativas: parsed.iniciativas || MOCK_PROJECT_DATA.iniciativas
            };
        } catch (e) {
            console.error("Error parsing project data", e);
            return MOCK_PROJECT_DATA;
        }
    });

    const [publications, setPublications] = useState(() => {
        const saved = localStorage.getItem('synergia_publications');
        if (saved) return JSON.parse(saved);
        
        // Inicializar con base + iniciativas
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
    });

    useEffect(() => {
        localStorage.setItem('synergia_project_data', JSON.stringify(projectData));
    }, [projectData]);

    useEffect(() => {
        localStorage.setItem('synergia_publications', JSON.stringify(publications));
    }, [publications]);

    // --- ACCIONES MATRIZ ---
    const updateProcesses = (newProcesses) => {
        setProjectData(prev => ({
            ...prev,
            matriz: { ...prev.matriz, processes: newProcesses }
        }));
    };

    const addProcess = (process) => {
        const newProcess = { ...process, id: Date.now() };
        updateProcesses([...projectData.matriz.processes, newProcess]);
    };

    const deleteProcess = (id) => {
        updateProcesses(projectData.matriz.processes.filter(p => p.id !== id));
    };

    // --- ACCIONES INICIATIVAS ---
    const updateIniciativas = (newIniciativas) => {
        setProjectData(prev => ({
            ...prev,
            iniciativas: newIniciativas,
            // También actualizar el roadmap si depende de esto
            roadmap: {
                ...prev.roadmap,
                initiatives: newIniciativas.map(ni => ({
                    id: ni.id,
                    titulo: ni.titulo,
                    roi_eur_anual: ni.roi_eur_anual,
                    esfuerzo_horas: ni.esfuerzo_horas,
                    prioridad: ni.prioridad || 'Media'
                }))
            }
        }));

        // Sincronizar publicaciones de iniciativas
        setPublications(prev => {
            const nonIniciativas = prev.filter(p => p.deliverable_type !== DELIVERABLE_TYPES.INICIATIVA);
            const iniciativasDocs = newIniciativas.map(ini => {
                const existing = prev.find(p => p.deliverable_ref_id === ini.id);
                return existing ? { ...existing, nombre_detalle: ini.titulo } : {
                    id: `ini-${ini.id}`,
                    deliverable_type: DELIVERABLE_TYPES.INICIATIVA,
                    deliverable_ref_id: ini.id,
                    is_published: false,
                    status_auto: 'BORRADOR',
                    nombre_detalle: ini.titulo
                };
            });
            return [...nonIniciativas, ...iniciativasDocs];
        });
    };

    const addIniciativa = (ini) => {
        const newIni = { ...ini, id: Date.now() };
        updateIniciativas([...projectData.iniciativas, newIni]);
    };

    const deleteIniciativa = (id) => {
        updateIniciativas(projectData.iniciativas.filter(i => i.id !== id));
    };

    // --- ACCIONES MEDICION ---
    const updateMedicion = (newMedicion) => {
        setProjectData(prev => ({
            ...prev,
            medicion: { ...(prev.medicion || {}), ...newMedicion }
        }));
    };

    const addTimeEntry = (entry) => {
        const newId = Date.now();
        const newEntry = { 
            ...entry, 
            id: newId, 
            tasks: entry.tasks || [] 
        };
        
        setProjectData(prev => ({
            ...prev,
            medicion: {
                ...(prev.medicion || {}),
                timeEntries: [...(prev.medicion?.timeEntries || []), newEntry]
            }
        }));
        return newId;
    };

    const updateTimeEntry = (entryId, updatedEntry) => {
        setProjectData(prev => ({
            ...prev,
            medicion: {
                ...(prev.medicion || {}),
                timeEntries: (prev.medicion?.timeEntries || []).map(e => 
                    e.id === entryId ? { ...e, ...updatedEntry } : e
                )
            }
        }));
    };

    const deleteTimeEntry = (entryId) => {
        setProjectData(prev => ({
            ...prev,
            medicion: {
                ...(prev.medicion || {}),
                timeEntries: (prev.medicion?.timeEntries || []).filter(e => e.id !== entryId)
            }
        }));
    };

    const addTaskToEntry = (entryId, task) => {
        const newTask = { ...task, id: Date.now(), validacion: 'pendiente' };
        setProjectData(prev => ({
            ...prev,
            medicion: {
                ...(prev.medicion || {}),
                timeEntries: (prev.medicion?.timeEntries || []).map(e => 
                    e.id === entryId ? { ...e, tasks: [...(e.tasks || []), newTask] } : e
                )
            }
        }));
    };

    const updateTaskInEntry = (entryId, taskId, updatedTask) => {
        setProjectData(prev => ({
            ...prev,
            medicion: {
                ...(prev.medicion || {}),
                timeEntries: (prev.medicion?.timeEntries || []).map(e => 
                    e.id === entryId ? { 
                        ...e, 
                        tasks: (e.tasks || []).map(t => t.id === taskId ? { ...t, ...updatedTask } : t) 
                    } : e
                )
            }
        }));
    };

    const deleteTaskFromEntry = (entryId, taskId) => {
        setProjectData(prev => ({
            ...prev,
            medicion: {
                ...(prev.medicion || {}),
                timeEntries: (prev.medicion?.timeEntries || []).map(e => 
                    e.id === entryId ? { ...e, tasks: (e.tasks || []).filter(t => t.id !== taskId) } : e
                )
            }
        }));
    };

    // --- ACCIONES DASHBOARD ---
    const updateDashboard = (newData) => {
        setProjectData(prev => ({
            ...prev,
            dashboard: { ...prev.dashboard, ...newData }
        }));
    };

    // --- ACCIONES SUPUESTOS ---
    const updateSupuestos = (newSupuestos) => {
        setProjectData(prev => ({
            ...prev,
            supuestos: newSupuestos
        }));
    };

    const addSupuesto = (supuesto) => {
        const newId = Date.now();
        setProjectData(prev => ({
            ...prev,
            supuestos: [...(prev.supuestos || []), { 
                ...supuesto, 
                id: newId, 
                comentarios: [],
                afectaIniciativas: supuesto.afectaIniciativas || []
            }]
        }));
        return newId;
    };

    const updateSupuesto = (supuestoId, updatedSupuesto) => {
        setProjectData(prev => ({
            ...prev,
            supuestos: (prev.supuestos || []).map(s => 
                s.id === supuestoId ? { ...s, ...updatedSupuesto } : s
            )
        }));
    };

    const deleteSupuesto = (supuestoId) => {
        setProjectData(prev => ({
            ...prev,
            supuestos: (prev.supuestos || []).filter(s => s.id !== supuestoId)
        }));
    };

    const addCommentToSupuesto = (supuestoId, comment) => {
        setProjectData(prev => ({
            ...prev,
            supuestos: (prev.supuestos || []).map(s => 
                s.id === supuestoId ? { 
                    ...s, 
                    comentarios: [...(s.comentarios || []), { ...comment, id: Date.now(), date: new Date().toISOString() }] 
                } : s
            )
        }));
    };

    // --- ACCIONES PLAN DE MEDICIÓN ---
    const updatePlanMedicion = (newPlan) => {
        setProjectData(prev => ({
            ...prev,
            planMedicion: newPlan
        }));
    };

    const addHitoMedicion = (hito) => {
        const newId = Date.now();
        setProjectData(prev => ({
            ...prev,
            planMedicion: [...(prev.planMedicion || []), { 
                ...hito, 
                id: newId,
                estado: 'PENDIENTE'
            }]
        }));
        return newId;
    };

    const updateHitoMedicion = (hitoId, updatedHito) => {
        setProjectData(prev => ({
            ...prev,
            planMedicion: (prev.planMedicion || []).map(h => 
                h.id === hitoId ? { ...h, ...updatedHito } : h
            )
        }));
    };

    const deleteHitoMedicion = (hitoId) => {
        setProjectData(prev => ({
            ...prev,
            planMedicion: (prev.planMedicion || []).filter(h => h.id !== hitoId)
        }));
    };

    const toggleHitoEstado = (hitoId) => {
        setProjectData(prev => ({
            ...prev,
            planMedicion: (prev.planMedicion || []).map(h => 
                h.id === hitoId ? { ...h, estado: h.estado === 'HECHO' ? 'PENDIENTE' : 'HECHO' } : h
            )
        }));
    };

    // --- ACCIONES PUBLICACIONES ---
    const togglePublication = (pubId) => {
        setPublications(prev => prev.map(p => 
            p.id === pubId ? { ...p, is_published: !p.is_published, last_published_at: !p.is_published ? new Date().toISOString() : p.last_published_at } : p
        ));
    };

    const addCommentToPublication = (pubId, comment) => {
        setPublications(prev => prev.map(p => 
            p.id === pubId ? { ...p, comentarios: [...(p.comentarios || []), comment] } : p
        ));
    };

    return (
        <ProjectDataContext.Provider value={{
            projectData,
            publications,
            updateProcesses,
            addProcess,
            deleteProcess,
            updateIniciativas,
            addIniciativa,
            deleteIniciativa,
            updateMedicion,
            addTimeEntry,
            updateTimeEntry,
            deleteTimeEntry,
            addTaskToEntry,
            updateTaskInEntry,
            deleteTaskFromEntry,
            updateDashboard,
            // Supuestos
            updateSupuestos,
            addSupuesto,
            updateSupuesto,
            deleteSupuesto,
            addCommentToSupuesto,
            // Plan de Medición
            updatePlanMedicion,
            addHitoMedicion,
            updateHitoMedicion,
            deleteHitoMedicion,
            toggleHitoEstado,
            // Publicaciones
            togglePublication,
            addCommentToPublication
        }}>
            {children}
        </ProjectDataContext.Provider>
    );
}

export const useProjectData = () => {
    const context = useContext(ProjectDataContext);
    if (!context) {
        throw new Error('useProjectData must be used within a ProjectDataProvider');
    }
    return context;
};
