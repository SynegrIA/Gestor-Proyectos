
import { DELIVERABLE_TYPES } from './deliverables';

export const MOCK_PROJECT_DATA = {
    dashboard: {
        summary: 'Tras un análisis exhaustivo de 6 departamentos clave y más de 30 procesos operativos, hemos identificado oportunidades críticas de automatización. El plan propuesto se centra en 3 ejes principales: mejora de la conversión comercial, eficiencia financiera y optimización logística. Estas iniciativas proyectan un ahorro combinado de €117.9K anuales con un ROI promedio del 240% en el primer año.',
        kpis: [
            { label: 'Ahorro anual estimado', value: '€45.2K' },
            { label: 'Mejora eficiencia', value: '23%' },
            { label: 'Tiempo por proceso', value: '12.5h' }
        ]
    },
    matriz: {
        processes: [
            { id: 1, name: 'Elaboración de Presupuestos', dep: 'Ventas', pain: 8, time_min: 45, freq_raw: '50/mes' },
            { id: 2, name: 'Gestión de Pedidos Manual', dep: 'Ventas', pain: 6, time_min: 20, freq_raw: '120/mes' },
            { id: 3, name: 'Facturación Recurrente', dep: 'Finanzas', pain: 9, time_min: 30, freq_raw: '85/mes' },
            { id: 4, name: 'Conciliación Bancaria', dep: 'Finanzas', pain: 7, time_min: 60, freq_raw: 'Diario' },
            { id: 5, name: 'Control de Inventario', dep: 'Operaciones', pain: 5, time_min: 120, freq_raw: 'Semanal' },
            { id: 6, name: 'Reporting Comercial Q1', dep: 'Marketing', pain: 4, time_min: 180, freq_raw: 'Mensual' },
            { id: 7, name: 'Gestión de Incidencias Soporte', dep: 'Sistemas', pain: 8, time_min: 45, freq_raw: '200/mes' },
            { id: 8, name: 'Cierre Contable Mensual', dep: 'Finanzas', pain: 8, time_min: 480, freq_raw: '1/mes' }
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
            resumen: 'Sistema de seguimiento automático para alertas y recordatorios de presupuestos enviados que no han recibido respuesta, mejorando la conversión de ventas.',
            estado_visibilidad: 'PUBLICADA',
            estado_cliente: 'APROBADA',
            roi_eur_anual: 28500, 
            esfuerzo_horas: 35, 
            payback_meses: 1.5, 
            confianza: 'ALTA',
            area: 'Ventas',
            comentarios_count: 5,
            adjuntos_count: 2,
            supuestos_clave: 'Asume integración con CRM vía API estable y tasa de apertura de emails del 40%.',
            isTop: true,
            start_date: '2026-02-01',
            end_date: '2026-03-15'
        },
        { 
            id: 2, 
            orden: 2,
            titulo: 'Dashboard de Control de Fugas', 
            resumen: 'Panel de control inteligente para identificar y reducir pérdidas financieras por discrepancias entre albaranes y facturas de proveedores.',
            estado_visibilidad: 'PUBLICADA',
            estado_cliente: 'POSPUESTA',
            roi_eur_anual: 18200, 
            esfuerzo_horas: 25, 
            payback_meses: 2.1, 
            confianza: 'MEDIA',
            area: 'Finanzas',
            comentarios_count: 2,
            adjuntos_count: 1,
            supuestos_clave: 'Requiere acceso a logs de transacciones históricas detalladas del ERP.',
            isTop: true,
            start_date: '2026-03-20',
            end_date: '2026-05-10'
        },
        { 
            id: 3, 
            orden: 3,
            titulo: 'Limpieza de Datos CRM', 
            resumen: 'Depuración y normalización de la base de datos de clientes para eliminar duplicados y corregir errores de segmentación.',
            estado_visibilidad: 'PUBLICADA',
            estado_cliente: 'DESCARTADA',
            roi_eur_anual: 9100, 
            esfuerzo_horas: 60, 
            payback_meses: 8, 
            confianza: 'MEDIA',
            area: 'Sistemas',
            comentarios_count: 8,
            adjuntos_count: 3,
            supuestos_clave: 'Reducción de duplicados estimada en un 20% tras análisis inicial.',
            isTop: false,
            start_date: '2026-01-15',
            end_date: '2026-04-30'
        },
        { 
            id: 4, 
            orden: 4,
            titulo: 'Optimización de Ruta Logística con IA', 
            resumen: 'Implementación de algoritmos de optimización de rutas para reducir el gasto de combustible y mejorar los tiempos de entrega de última milla.',
            estado_visibilidad: 'PUBLICADA',
            estado_cliente: 'PENDIENTE',
            roi_eur_anual: 35400, 
            esfuerzo_horas: 85, 
            payback_meses: 4.2, 
            confianza: 'ALTA',
            area: 'Operaciones',
            comentarios_count: 4,
            adjuntos_count: 5,
            supuestos_clave: 'Basado en ahorro de combustible del 8% y reducción de kilómetros del 12%.',
            isTop: true,
            start_date: '2026-04-01',
            end_date: '2026-06-30'
        },
        { 
            id: 5, 
            orden: 5,
            titulo: 'Asistente de Consultas FAQ para Clientes', 
            resumen: 'Agente de IA generativa para resolver dudas comunes de clientes en tiempo real dentro del portal web.',
            estado_visibilidad: 'PUBLICADA',
            estado_cliente: 'PENDIENTE',
            roi_eur_anual: 12500, 
            esfuerzo_horas: 40, 
            payback_meses: 3.8, 
            confianza: 'MEDIA',
            area: 'Ventas',
            comentarios_count: 1,
            adjuntos_count: 0,
            supuestos_clave: 'Reducción del 30% en tickets de soporte simples.',
            isTop: false,
            start_date: '2026-05-15',
            end_date: '2026-07-20'
        },
        { 
            id: 6, 
            orden: 6,
            titulo: 'Automatización de Facturación Mensual', 
            resumen: 'Robotización del proceso de emisión y envío de facturas recurrentes a clientes.',
            estado_visibilidad: 'PUBLICADA',
            estado_cliente: 'APROBADA',
            roi_eur_anual: 14200, 
            esfuerzo_horas: 30, 
            payback_meses: 1.2, 
            confianza: 'ALTA',
            area: 'Finanzas',
            comentarios_count: 7,
            adjuntos_count: 2,
            supuestos_clave: 'Eliminación completa del error humano en cargos recurrentes.',
            isTop: true,
            start_date: '2026-03-01',
            end_date: '2026-04-15'
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
            texto: 'Volumen de facturación mensual: 185 facturas/mes promedio', 
            estado: 'VALIDADO', 
            impacto: 'ALTO', 
            fuente: 'ERP - Exportación Ventas 2023', 
            evidencia: { type: 'file', name: 'analisis_volumen_v1.pdf', fileId: 'f1' },
            afectaIniciativas: [1, 2, 6],
            comentarios: [
                { id: 1, author: 'Consultor', text: 'Confirmado con los reportes del ERP de los últimos 6 meses.', date: '2026-01-10T10:00:00Z', avatar: '👨‍💼' }
            ]
        },
        { 
            id: 2, 
            texto: 'Tiempo promedio por conciliación manual: 12 min/factura', 
            estado: 'VALIDADO', 
            impacto: 'ALTO', 
            fuente: 'Observación Directa y Toma de Tiempos', 
            evidencia: { type: 'text', name: 'Muestreo realizado el 12/01/2026' },
            afectaIniciativas: [6],
            comentarios: []
        },
        { 
            id: 3, 
            texto: 'Coste hora laboral bruta (promedio): €28/h', 
            estado: 'VALIDADO', 
            impacto: 'ALTO', 
            fuente: 'Departamento de RRHH', 
            evidencia: null,
            afectaIniciativas: [1, 2, 3, 4, 5, 6],
            comentarios: [
                { id: 2, author: 'Cliente', text: 'Validado con el departamento financiero.', date: '2026-01-12T14:30:00Z', avatar: '👤' }
            ]
        },
        { 
            id: 4, 
            texto: 'Disponibilidad de API REST en sistema central', 
            estado: 'VALIDADO', 
            impacto: 'ALTO', 
            fuente: 'Documentación Técnica Proveedor IT', 
            evidencia: null,
            afectaIniciativas: [1, 2],
            comentarios: [
                { id: 3, author: 'Consultor', text: 'API accesible y documentada. Permite operaciones CRUD.', date: '2026-01-13T09:00:00Z', avatar: '👨‍💼' }
            ]
        },
        { 
            id: 5, 
            texto: 'Reducción estimada de incidencias post-automatización: 35%', 
            estado: 'ESTIMADO', 
            impacto: 'MEDIO', 
            fuente: 'Benchmarks del Sector', 
            evidencia: null,
            afectaIniciativas: [2, 6],
            comentarios: []
        },
        { 
            id: 6, 
            texto: 'Tasa de conversión actual de presupuestos: 18%', 
            estado: 'REVISION', 
            impacto: 'ALTO', 
            fuente: 'CRM Ventas', 
            evidencia: null,
            afectaIniciativas: [1],
            comentarios: [
                { id: 4, author: 'Consultor', text: 'Pendiente de cruzar con datos de facturación real.', date: '2026-01-14T11:00:00Z', avatar: '👨‍💼' }
            ]
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
