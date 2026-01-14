
import { DELIVERABLE_TYPES } from './deliverables';

export const MOCK_PROJECT_DATA = {
    dashboard: {
        summary: 'Tras analizar 5 departamentos y 23 procesos, hemos identificado 3 iniciativas prioritarias que pueden generar un ahorro de €45.2K anuales.',
        kpis: [
            { label: 'Ahorro anual estimado', value: '€45.2K' },
            { label: 'Mejora eficiencia', value: '23%' },
            { label: 'Tiempo por proceso', value: '12.5h' }
        ]
    },
    matriz: {
        processes: [
            { id: 1, name: 'Elaboración de Presupuestos', pain: 8, time_min: 45 },
            { id: 2, name: 'Gestión de Pedidos', pain: 5, time_min: 15 },
            { id: 3, name: 'Facturación Mensual', pain: 9, time_min: 30 },
            { id: 4, name: 'Gestión de Cobros', pain: 3, time_min: 20 },
            { id: 5, name: 'Control de Inventario', pain: 6, time_min: 60 }
        ]
    },
    roadmap: {
        initiatives: [
            { id: 1, titulo: 'Seguimiento automático de presupuestos', roi_eur_anual: 25000, esfuerzo_horas: 35 },
            { id: 2, titulo: 'Dashboard de Control de Fugas', roi_eur_anual: 15000, esfuerzo_horas: 25 },
            { id: 3, titulo: 'Limpieza de Datos CRM', roi_eur_anual: 8200, esfuerzo_horas: 60 }
        ]
    },
    medicion: {
        costeHoraDefault: 25,
        timeEntries: [
            {
                id: 1,
                nombre: 'María López',
                rol: 'Responsable de Facturación',
                departamento: 'Admin-Finanzas',
                fecha: '2024-01-10',
                notas: 'Proceso de facturación muy manual, dependencia de Excel.',
                magicButton: 'Poder automatizar la conciliación bancaria...',
                tasks: [
                    { id: 101, tarea: 'Conciliación bancaria manual', herramienta: 'Excel', tiempoVez: 10, vecesDia: 5, vecesSemana: 25, dolor: 4, validacion: 'validado' },
                    { id: 102, tarea: 'Persecución de facturas pendientes', herramienta: 'WhatsApp', tiempoVez: 15, vecesDia: 8, vecesSemana: 40, dolor: 5, validacion: 'pendiente' },
                ]
            },
            {
                id: 2,
                nombre: 'Juan Pérez',
                rol: 'Administrativo Comercial',
                departamento: 'Ventas',
                fecha: '2024-01-12',
                notas: 'Mucho tiempo perdido en entrar pedidos al sistema.',
                magicButton: 'Que los pedidos entren solos desde el email.',
                tasks: [
                    { id: 201, tarea: 'Entrada de pedidos manual', herramienta: 'ERP', tiempoVez: 20, vecesDia: 10, vecesSemana: 50, dolor: 8, validacion: 'pendiente' },
                    { id: 202, tarea: 'Actualización de stock', herramienta: 'Excel', tiempoVez: 5, vecesDia: 20, vecesSemana: 100, dolor: 3, validacion: 'pendiente' },
                ]
            }
        ]
    },
    iniciativas: [
        { 
            id: 1, 
            orden: 1,
            titulo: 'Seguimiento automático de presupuestos', 
            resumen: 'Sistema de seguimiento automático para mejorar la conversión de ventas.',
            estado_visibilidad: 'PUBLICADA',
            estado_cliente: 'APROBADA',
            roi_eur_anual: 25000, 
            esfuerzo_horas: 35, 
            payback_meses: 2, 
            confianza: 'ALTA',
            area: 'Ventas',
            comentarios_count: 3,
            adjuntos_count: 1,
            supuestos_clave: 'Asume integración con CRM vía API estable.',
            isTop: true,
            start_date: '2026-02-01',
            end_date: '2026-03-15'
        },
        { 
            id: 2, 
            orden: 2,
            titulo: 'Dashboard de Control de Fugas', 
            resumen: 'Panel de control para identificar y reducir pérdidas financieras.',
            estado_visibilidad: 'PUBLICADA',
            estado_cliente: 'POSPUESTA',
            roi_eur_anual: 15000, 
            esfuerzo_horas: 25, 
            payback_meses: 1.8, 
            confianza: 'MEDIA',
            area: 'Finanzas',
            comentarios_count: 0,
            adjuntos_count: 0,
            supuestos_clave: 'Requiere acceso a logs de transacciones históricas.',
            isTop: true,
            start_date: '2026-03-20',
            end_date: '2026-05-10'
        },
        { 
            id: 3, 
            orden: 3,
            titulo: 'Limpieza de Datos CRM', 
            resumen: 'Depuración y normalización de la base de datos de clientes.',
            estado_visibilidad: 'PUBLICADA',
            estado_cliente: 'DESCARTADA',
            roi_eur_anual: 8200, 
            esfuerzo_horas: 60, 
            payback_meses: 8, 
            confianza: 'MEDIA',
            area: 'Sistemas',
            comentarios_count: 5,
            adjuntos_count: 2,
            supuestos_clave: 'Reducción de duplicados estimada en 20%.',
            isTop: true,
            start_date: '2026-01-15',
            end_date: '2026-04-30'
        },
        { 
            id: 4, 
            orden: 4,
            titulo: 'Optimización de Ruta Logística', 
            resumen: 'Mejora de rutas de entrega para reducir costes de combustible.',
            estado_visibilidad: 'BORRADOR',
            estado_cliente: 'PENDIENTE',
            roi_eur_anual: 12000, 
            esfuerzo_horas: 45, 
            payback_meses: 4.5, 
            confianza: 'ALTA',
            area: 'Operaciones',
            comentarios_count: 0,
            adjuntos_count: 0,
            supuestos_clave: 'Ahorro de combustible del 5%.',
            isTop: false,
            start_date: '2026-06-01',
            end_date: '2026-07-15'
        }
    ],
    siguientesPasos: {
        nextStepsConsultantNotes: '',
        lastEditedAt: '2026-01-14T12:00:00Z',
        lastEditedBy: 'Consultor Experto'
    },
    
    // --- SUPUESTOS DEL DIAGNÓSTICO ---
    supuestos: [
        { 
            id: 1, 
            texto: 'Volumen de facturación: 150 facturas/mes', 
            estado: 'VALIDADO', 
            impacto: 'ALTO', 
            fuente: 'ERP', 
            evidencia: { type: 'file', name: 'export_facturacion_2023.csv', fileId: 'f1' },
            afectaIniciativas: [1, 2], // IDs de iniciativas
            comentarios: [
                { id: 1, author: 'Consultor', text: 'Validado con datos del ERP.', date: '2026-01-10T10:00:00Z', avatar: '👨‍💼' }
            ]
        },
        { 
            id: 2, 
            texto: 'Tiempo promedio por factura manual: 30 minutos', 
            estado: 'VALIDADO', 
            impacto: 'ALTO', 
            fuente: 'Entrevistas', 
            evidencia: { type: 'text', name: 'Entrevista: Responsable Facturación' },
            afectaIniciativas: [1],
            comentarios: []
        },
        { 
            id: 3, 
            texto: 'Coste hora empleado base: €25/h', 
            estado: 'ESTIMADO', 
            impacto: 'ALTO', 
            fuente: 'RRHH', 
            evidencia: null,
            afectaIniciativas: [1, 2, 3],
            comentarios: [
                { id: 2, author: 'Cliente', text: 'Revisar con datos actualizados de nóminas.', date: '2026-01-12T14:30:00Z', avatar: '👤' }
            ]
        },
        { 
            id: 4, 
            texto: 'ERP permite integraciones API REST', 
            estado: 'REVISION', 
            impacto: 'ALTO', 
            fuente: 'IT', 
            evidencia: null,
            afectaIniciativas: [1],
            comentarios: [
                { id: 3, author: 'Cliente', text: 'Pendiente confirmar con proveedor del ERP.', date: '2026-01-13T09:00:00Z', avatar: '👤' },
                { id: 4, author: 'Consultor', text: 'Agendada reunión técnica para el 20/01.', date: '2026-01-13T11:00:00Z', avatar: '👨‍💼' }
            ]
        },
        { 
            id: 5, 
            texto: 'Reducción de errores manuales estimada: 40%', 
            estado: 'ESTIMADO', 
            impacto: 'MEDIO', 
            fuente: 'Entrevistas', 
            evidencia: null,
            afectaIniciativas: [2],
            comentarios: []
        }
    ],

    // --- PLAN DE MEDICIÓN DE RESULTADOS ---
    planMedicion: [
        {
            id: 1,
            item: 'Baseline de tiempos antes de implantar',
            fechaObjetivo: '2026-01-20',
            responsable: 'CONSULTOR',
            kpi: 'Tiempo ciclo factura (min)',
            evidenciaEsperada: 'Captura pantalla tiempos actuales del sistema',
            estado: 'HECHO'
        },
        {
            id: 2,
            item: 'Medición post-implantación (Semana 2)',
            fechaObjetivo: '2026-02-15',
            responsable: 'AMBOS',
            kpi: 'Volumen tareas automatizadas',
            evidenciaEsperada: 'Reporte automático del sistema',
            estado: 'PENDIENTE'
        },
        {
            id: 3,
            item: 'Validación de ahorros ROI Q1',
            fechaObjetivo: '2026-03-30',
            responsable: 'CLIENTE',
            kpi: 'Coste operativo mensual (€)',
            evidenciaEsperada: 'Estado financiero Q1 comparativo',
            estado: 'PENDIENTE'
        },
        {
            id: 4,
            item: 'Encuesta satisfacción usuarios',
            fechaObjetivo: '2026-02-28',
            responsable: 'AMBOS',
            kpi: 'NPS interno',
            evidenciaEsperada: 'Resultados encuesta anónima',
            estado: 'PENDIENTE'
        }
    ]
};
