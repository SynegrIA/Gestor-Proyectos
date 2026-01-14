
export const SOLUTIONS_CATALOG = [
    {
        id: 'SOL-001',
        nombre: 'Automatización de Facturación B2B',
        descripcion: 'Implementación de un flujo automatizado que extrae facturas de email, las valida mediante OCR y las carga directamente en el ERP, reduciendo errores manuales.',
        problema: 'Alto tiempo dedicado a la entrada manual de facturas y errores en la conciliación bancaria.',
        outcome: 'Reducción del 80% en tiempo de gestión de facturas y eliminación de errores de entrada.',
        tipoSolucion: ['Automatización', 'Finanzas'],
        sector: ['Servicios', 'Retail', 'Logística'],
        departamento: ['Administración', 'Finanzas'],
        complejidad: 3,
        ttv: '2-4 semanas',
        duracion_estandar: 30,
        precio_setup: 2500,
        precio_mrr: 150,
        precio_aprox: 'Desde 2.500€ setup + 150€/mes',
        entregables: [
            'Conectores de email configurados',
            'Soplón de OCR entrenado para proveedores clave',
            'Integración con ERP (API/Zapier/Make)',
            'Dashboard de control de estados'
        ],
        requisitos: [
            'Acceso a buzón de facturas',
            'Listado de proveedores frecuentes',
            'API de ERP disponible o acceso a importación'
        ],
        riesgos: [
            'Calidad variable de PDFs de proveedores',
            'Limitaciones en la API del ERP receptor'
        ],
        estado: 'Activo'
    },
    {
        id: 'SOL-002',
        nombre: 'Predictor de Fuga de Clientes (Churn)',
        descripcion: 'Modelo de Machine Learning entrenado con datos históricos para identificar patrones de comportamiento que preceden a una baja de servicio.',
        problema: 'Pérdida inesperada de clientes clave sin tiempo de reacción para acciones de retención.',
        outcome: 'Identificación de clientes en riesgo con 1 mes de antelación y 85% de precisión.',
        tipoSolucion: ['IA / ML', 'Analítica'],
        sector: ['SaaS', 'Telecomunicaciones', 'Seguros'],
        departamento: ['Ventas', 'Customer Success'],
        complejidad: 5,
        ttv: '6-8 semanas',
        duracion_estandar: 60,
        precio_setup: 8000,
        precio_mrr: 500,
        precio_aprox: '8.000€ - 12.000€ según volumen de datos',
        entregables: [
            'Modelo entrenado',
            'Pipeline de datos automático',
            'Panel de alertas en tiempo real',
            'Playbook de acciones de retención'
        ],
        requisitos: [
            'Histórico de actividad de clientes (> 12 meses)',
            'Registro de bajas históricas',
            'Acceso a base de datos de transacciones'
        ],
        riesgos: [
            'Falta de datos limpios históricos',
            'Cambios drásticos en el mercado no reflejados en el pasado'
        ],
        estado: 'Activo'
    },
    {
        id: 'SOL-003',
        nombre: 'Optimización de Rutas de Última Milla',
        descripcion: 'Algoritmo de optimización que planifica las rutas de reparto diarias teniendo en cuenta tráfico, ventanas horarias y capacidad de vehículos.',
        problema: 'Costes de combustible elevados y retrasos en entregas por planificación manual ineficiente.',
        outcome: 'Ahorro del 15% en combustible y mejora del 20% en puntualidad de entrega.',
        tipoSolucion: ['Optimización', 'Operaciones'],
        sector: ['Logística', 'E-commerce'],
        departamento: ['Operaciones', 'Logística'],
        complejidad: 4,
        ttv: '4-6 semanas',
        duracion_estandar: 45,
        precio_setup: 5000,
        precio_mrr: 300,
        precio_aprox: '5.000€ setup + cuota por vehículo',
        entregables: [
            'Software de despacho configurado',
            'App para transportistas',
            'Soporte de integración con almacén',
            'Reportes de eficiencia de ruta'
        ],
        requisitos: [
            'Flota de vehículos con GPS o smartphones',
            'Base de datos de direcciones de clientes',
            'Definición de restricciones de carga'
        ],
        riesgos: [
            'Resistencia al cambio por parte de transportistas',
            'Datos de tráfico en tiempo real con latencia'
        ],
        estado: 'Activo'
    },
    {
        id: 'SOL-004',
        nombre: 'Sistema de Gestión de Talento y OKRs',
        descripcion: 'Plataforma centralizada para la definición de objetivos estratégicos (OKRs) y el seguimiento del desempeño de los empleados.',
        problema: 'Desalineación entre los objetivos de la empresa y el trabajo diario de los equipos.',
        outcome: 'Alineación del 100% de la plantilla con los objetivos estratégicos anuales.',
        tipoSolucion: ['RH Tech', 'Gestión'],
        sector: ['Cualquiera', 'Tecnología'],
        departamento: ['Recursos Humanos', 'Dirección'],
        complejidad: 2,
        ttv: '2-3 semanas',
        duracion_estandar: 20,
        precio_setup: 1500,
        precio_mrr: 10,
        precio_aprox: '1.500€ setup + 10€/usuario/mes',
        entregables: [
            'Software configurado con estructura orgánica',
            'Sesiones de formación para managers',
            'Guía de definición de OKRs',
            'Dashboard de progreso organizacional'
        ],
        requisitos: [
            'Estructura organizativa clara',
            'Compromiso de la dirección con el feedback regular'
        ],
        riesgos: [
            'Falta de adopción por parte de los empleados',
            'Objetivos mal definidos al inicio'
        ],
        estado: 'Borrador'
    },
    {
        id: 'SOL-005',
        nombre: 'Auditoría de Ciberseguridad Express',
        descripcion: 'Escaneo integral de vulnerabilidades externas e internas, revisión de políticas de contraseñas y formación de concienciación (phishing simulado).',
        problema: 'Incertidumbre sobre la vulnerabilidad de la empresa ante ataques cibernéticos.',
        outcome: 'Informe de riesgos priorizado y reducción del 90% en éxito de phishing.',
        tipoSolucion: ['Seguridad', 'Consultoría'],
        sector: ['Finanzas', 'Salud', 'Legal'],
        departamento: ['IT', 'Sistemas'],
        complejidad: 3,
        ttv: '1-2 semanas',
        duracion_estandar: 10,
        precio_setup: 3500,
        precio_mrr: null,
        precio_aprox: '3.500€ pago único',
        entregables: [
            'Informe de vulnerabilidades técnicas',
            'Plan de remediación inmediata',
            'Certificado de cumplimiento interno',
            'Acceso a plataforma de formación continua'
        ],
        requisitos: [
            'Listado de activos IP/Dominios',
            'Autorización firmada para tests de intrusión'
        ],
        riesgos: [
            'Falsos positivos en herramientas automáticas',
            'Interrupción momentánea de servicios críticos durante el test'
        ],
        estado: 'Activo'
    }
];
