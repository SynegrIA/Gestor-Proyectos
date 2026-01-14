
// Catálogo de Activos Reutilizables (Biblioteca)
export const ASSETS_CATALOG = [
    {
        id: "1",
        nombre: 'Plantilla Medición de Tiempo',
        version: 'V1 FINAL',
        fase: 'Día 0-1',
        tipo: 'Medición',
        desc: 'En 20 min por persona sacar un mapa fiable de horas perdidas y errores/costes ocultos para alimentar el ROI.',
        updated_at: '2024-01-10',
        sections_count: 8,
        secciones: [
            {
                titulo: 'A quién se lo pedimos (por defecto)',
                contenido: `- **Owner interno** + **hasta 5 personas** (1 por departamento).\n- **Roles obligatorios**: **Admin/Finanzas + Ventas + Operaciones** (sí o sí).`
            },
            {
                titulo: '0) Mensaje para el equipo (copiable)',
                contenido: `> Vamos a medir un día típico (no toda la semana).\n> Solo apuntamos tareas **repetitivas/manuales** (copiar/pegar, perseguir info, mover datos entre sistemas, reportes, WhatsApp/email).\n> Esto no es para vigilar a nadie: es para **quitar trabajo absurdo** y reducir errores.\n> Si dudas, **estima** y redondea (mejor aproximado que perfecto).`
            },
            {
                titulo: '1) Tabla individual (una por persona) — 1 día típico',
                contenido: `**Persona:** _______________\n**Rol:** _______________\n**Departamento:** (Ventas / Operaciones / Admin-Finanzas / Soporte / Marketing / Otro)\n**Fecha del "día típico":** _______________\n\n> **Regla:** apunta solo las 10–15 tareas más repetidas. Si salen 40… es que estás viviendo en modo "multiverso" y hay que automatizar YA.\n\n| Tarea | Área | Herramienta | Tiempo/vez (min) | Veces/día | Total día (min) | Veces/semana | Total semana (min) | Dolor (1-5) | Automatizable | Riesgo/errores | Notas |\n|-------|------|-------------|------------------|-----------|-----------------|--------------|--------------------| -----------|---------------|----------------|-------|\n| | | | | | | | | | | | |\n\n**Cómo calcular:**\n- **Total día típico (min)** = Tiempo por vez × Veces al día\n- **Total semana (min)** = Tiempo por vez × Veces por semana\n\n> Si la persona no sabe "veces por semana": usa Veces al día × 5 como estimación.`
            },
            {
                titulo: '2) Mini-resumen por persona (obligatorio, 2 minutos)',
                contenido: `1. **Top 3 tareas que más tiempo te comen (semanal)**\n   - 1. _______________\n   - 2. _______________\n   - 3. _______________\n\n2. **Top 3 tareas con más riesgo/errores**\n   - 1. ¿Qué error pasa? ¿Cada cuánto? ¿Qué coste tiene?\n   - 2. _______________\n   - 3. _______________\n\n3. **Botón mágico:** si eliminamos 1 cosa mañana, ¿cuál eliges?\n   - _______________`
            },
            {
                titulo: '3) Consolidado empresa — "Top 10 fugas" (lo rellena el owner)',
                contenido: `| Ranking | Tarea/Proceso | Área | Quién | Horas/semana | Coste/hora (€) | Coste semanal (€) | Coste mensual (€) | Automatizable | Dolor | Riesgo/Errores | Comentarios |\n|---------|---------------|------|-------|--------------|----------------|-------------------|-------------------|---------------|-------|----------------|-------------|\n| 1 | | | | | | | | | | | |\n| 2 | | | | | | | | | | | |\n| 3 | | | | | | | | | | | |\n\n**Fórmulas rápidas:**\n- Horas/semana = Total semana (min) ÷ 60\n- Coste semanal (€) = Horas/semana × Coste/hora\n- Coste mensual (€) ≈ Coste semanal × 4`
            },
            {
                titulo: '4) Campos obligatorios',
                contenido: `Por tarea:\n- ☑️ Tarea clara (verbo + objeto + sistema)\n- ☑️ Tiempo por vez\n- ☑️ Frecuencia semanal\n- ☑️ Herramienta\n- ☑️ Dolor (1–5)\n- ☑️ Automatizable (sí/no)\n- ☑️ **Riesgo/errores** (sí o sí)`
            },
            {
                titulo: '5) Cómo escribir "Riesgo/errores"',
                contenido: `Usa esta plantilla en la celda:\n- **Error típico:** (ej. "se emite factura duplicada")\n- **Frecuencia:** (ej. "1 vez/semana")\n- **Impacto:** (ej. "2h arreglar + cliente enfadado + retraso cobro")\n- **Coste estimado:** (si lo saben, € o horas)`
            },
            {
                titulo: '6) Errores típicos (y antídoto)',
                contenido: `| Error | Antídoto |\n|-------|----------|\n| Se ponen filosóficos ("gestionar cosas") | "verbo + objeto + sistema" |\n| No ponen frecuencia | Sin "veces/semana" no entra en ranking |\n| Se olvidan de WhatsApp/Email | Columna herramienta obligatoria |\n| Riesgos no se cuantifican | Forzar formato "error + frecuencia + impacto" |`
            }
        ]
    },
    {
        id: "2",
        nombre: 'Script Entrevista CEO',
        version: 'V2.0',
        fase: 'Día 1-2',
        tipo: 'Entrevista',
        desc: 'Guía de preguntas para la entrevista inicial con el CEO/Gerente General.',
        updated_at: '2023-12-01',
        sections_count: 7,
        secciones: [
            {
                titulo: 'Apertura (5 min)',
                contenido: `- Agradecer el tiempo\n- Explicar objetivo del diagnóstico\n- Confirmar confidencialidad\n- Pedir permiso para tomar notas`
            },
            {
                titulo: 'Contexto del negocio (10 min)',
                contenido: `1. **¿Cuál es el modelo de negocio en una frase?**\n2. **¿Cuántas personas hay en el equipo?** (por área si es posible)\n3. **¿Cuál fue la facturación del último año?** (rango si no quiere dar cifra exacta)\n4. **¿Qué % de crecimiento esperáis este año?**`
            },
            {
                titulo: 'Prioridades y dolor (15 min)',
                contenido: `5. **Si pudieras resolver UN problema mañana, ¿cuál sería?**\n6. **¿Qué tarea/proceso te quita más tiempo a ti personalmente?**\n7. **¿Qué información te gustaría tener y no tienes hoy?**\n8. **¿Dónde crees que estáis perdiendo dinero sin daros cuenta?**\n9. **¿Qué error recurrente os da más dolores de cabeza?**`
            },
            {
                titulo: 'Tecnología actual (10 min)',
                contenido: `10. **¿Qué herramientas usáis hoy?** (CRM, ERP, facturación, email, WhatsApp...)\n11. **¿Hay alguna que no estéis aprovechando al 100%?**\n12. **¿Tenéis Excel/Sheets críticos que todo el mundo usa?**\n13. **¿Habéis intentado automatizar algo antes? ¿Qué pasó?**`
            },
            {
                titulo: 'Equipo y cultura (10 min)',
                contenido: `14. **¿Quién es la persona que más sabe de los procesos del día a día?**\n15. **¿El equipo está abierto a cambiar formas de trabajar?**\n16. **¿Hay resistencia a la tecnología en algún área?**\n17. **¿Qué pasaría si X persona clave se va mañana?** (dependencias)`
            },
            {
                titulo: 'Expectativas y cierre (5 min)',
                contenido: `18. **¿Qué esperáis conseguir con este diagnóstico?**\n19. **¿Hay algún proyecto/iniciativa que ya tengáis en mente?**\n20. **¿Algo que no te haya preguntado y crees importante?**`
            },
            {
                titulo: 'Notas del consultor (rellenar después)',
                contenido: `- **Prioridad #1 percibida:** _______________\n- **Dolor principal:** _______________\n- **Quick wins detectados:** _______________\n- **Riesgos/resistencias:** _______________\n- **Siguiente paso:** _______________`
            }
        ]
    },
    {
        id: "3",
        nombre: 'Script Entrevista Director de Área',
        version: 'V1.8',
        fase: 'Día 1-2',
        tipo: 'Entrevista',
        desc: 'Guía para entrevistas con directores funcionales (Ventas, Finanzas, Operaciones).',
        updated_at: '2023-11-28',
        sections_count: 5,
        secciones: [
            {
                titulo: 'Contexto del área (5 min)',
                contenido: `1. **¿Cuántas personas hay en tu equipo?**\n2. **¿Cuáles son tus 3 responsabilidades principales?**\n3. **¿Cómo mides el éxito de tu área?** (KPIs si los tiene)`
            },
            {
                titulo: 'Día a día (10 min)',
                contenido: `4. **Describe un día típico tuyo:**\n   - ¿Qué haces de 9 a 10? ¿Y de 10 a 12? etc.\n5. **¿Qué % de tu tiempo es "apagar fuegos" vs trabajo planificado?**\n6. **¿Cuántas reuniones tienes a la semana?** (y cuántas son útiles)`
            },
            {
                titulo: 'Procesos y herramientas (10 min)',
                contenido: `7. **¿Cuáles son los 3 procesos más importantes de tu área?**\n8. **¿Qué herramientas usas día a día?**\n9. **¿Hay algún Excel/Sheet que todo el mundo necesita?**\n10. **¿Qué información tienes que pedir a otras áreas?**`
            },
            {
                titulo: 'Dolores (10 min)',
                contenido: `11. **¿Qué tarea te gustaría que desapareciera mañana?**\n12. **¿Dónde pierdes más tiempo buscando información?**\n13. **¿Qué errores se repiten una y otra vez?**\n14. **¿Qué te frustra de [herramienta X]?**`
            },
            {
                titulo: 'Deseos (5 min)',
                contenido: `15. **Si tuvieras un asistente 24/7, ¿qué le pondrías a hacer?**\n16. **¿Qué hace [tu competidor/otra empresa] que envidies?**\n17. **¿Qué proyecto llevas queriendo hacer y nunca hay tiempo?**`
            }
        ]
    },
    {
        id: "4",
        nombre: 'Checklist Datos Mínimos',
        version: 'V3.0',
        fase: 'Día 0',
        tipo: 'Checklist',
        desc: 'Lista de documentos y accesos requeridos para iniciar el diagnóstico.',
        updated_at: '2024-01-10',
        sections_count: 8,
        secciones: [
            {
                titulo: 'Datos obligatorios — Finanzas',
                contenido: `- [ ] Balance del último año cerrado\n- [ ] Cuenta de resultados (P&L) últimos 12 meses\n- [ ] Presupuesto año actual (si existe)`
            },
            {
                titulo: 'Datos obligatorios — CRM / Clientes',
                contenido: `- [ ] Export de clientes activos (CSV/Excel)\n- [ ] Histórico de ventas últimos 12 meses\n- [ ] Pipeline actual (si aplica)`
            },
            {
                titulo: 'Datos obligatorios — ERP / Operaciones',
                contenido: `- [ ] Maestro de productos/servicios\n- [ ] Credenciales de lectura al ERP (usuario viewer)\n- [ ] Export de pedidos/órdenes últimos 6 meses`
            },
            {
                titulo: 'Datos obligatorios — Procesos',
                contenido: `- [ ] Organigrama actual\n- [ ] Mapa de procesos (si existe, aunque sea en servilleta)\n- [ ] Lista de herramientas/sistemas usados`
            },
            {
                titulo: 'Datos opcionales (mejoran el análisis)',
                contenido: `- [ ] Encuesta de clima laboral reciente\n- [ ] Dashboards/reportes que usen hoy\n- [ ] Contratos con proveedores clave de software\n- [ ] Histórico de incidencias/errores (si lo tienen)`
            },
            {
                titulo: 'Accesos requeridos',
                contenido: `| Sistema | Tipo de acceso | Usuario/Contraseña | Recibido |\n|---------|----------------|--------------------| ---------|\n| ERP | Solo lectura | | ☐ |\n| CRM | Solo lectura | | ☐ |\n| Facturación | Solo lectura | | ☐ |\n| Analytics | Viewer | | ☐ |`
            },
            {
                titulo: 'Regla de los 48h',
                contenido: `⚠️ **Si en 48h no tenemos los datos OBLIGATORIOS:**\n1. Se notifica al cliente\n2. El diagnóstico pasa a estado **PAUSADO**\n3. El reloj de 7 días se detiene\n4. Se reanuda cuando lleguen los datos`
            },
            {
                titulo: 'Email recordatorio (copiable)',
                contenido: `> Hola [Nombre],\n>\n> Para arrancar el diagnóstico necesitamos los siguientes documentos:\n> - [lista de pendientes]\n>\n> Te queda [X] horas para el cierre del plazo.\n> Si tienes cualquier duda, llámame.\n>\n> Saludos,\n> [Tu nombre]`
            }
        ]
    },
    {
        id: "5",
        nombre: 'Ficha de Iniciativa',
        version: 'V1.3',
        fase: 'Día 3-5',
        tipo: 'Template',
        desc: 'Estructura base para documentar cada iniciativa de mejora identificada.',
        updated_at: '2023-12-12',
        sections_count: 9,
        secciones: [
            {
                titulo: 'Información básica',
                contenido: `| Campo | Valor |\n|-------|-------|\n| **Nombre** | [Nombre descriptivo de la iniciativa] |\n| **ID** | INI-[XXX] |\n| **Prioridad** | 🔥 Top 3 / ○ Backlog |\n| **Estado** | Propuesta / Aprobada / En implementación / Completada |\n| **Responsable** | [Nombre] |`
            },
            {
                titulo: 'Descripción del problema',
                contenido: `**Situación actual:**\n[Describir el problema o ineficiencia que se quiere resolver]\n\n**Impacto del problema:**\n- Tiempo perdido: _____ h/semana\n- Errores frecuencia: _____ /mes\n- Coste estimado: €_____ /mes`
            },
            {
                titulo: 'Objetivo de la iniciativa',
                contenido: `[Una frase clara de qué se quiere conseguir]\n\n**KPI de éxito:**\n- [ ] [KPI 1 medible]\n- [ ] [KPI 2 medible]`
            },
            {
                titulo: 'Solución propuesta',
                contenido: `**Descripción:**\n[Qué se va a hacer exactamente]\n\n**Pasos de implementación:**\n1. [Paso 1]\n2. [Paso 2]\n3. [Paso 3]\n4. [Paso 4]\n5. [Paso 5]`
            },
            {
                titulo: 'Métricas',
                contenido: `| Métrica | Antes | Después (esperado) |\n|---------|-------|-------------------|\n| Tiempo por proceso | | |\n| Errores/mes | | |\n| Coste mensual | | |`
            },
            {
                titulo: 'Inversión y ROI',
                contenido: `| Concepto | Valor |\n|----------|-------|\n| **Esfuerzo estimado** | _____ horas |\n| **Coste implementación** | €_____ |\n| **Ahorro mensual** | €_____ |\n| **Ahorro anual** | €_____ |\n| **Payback** | _____ meses |\n| **ROI** | _____% |`
            },
            {
                titulo: 'Riesgos y dependencias',
                contenido: `**Riesgos:**\n- [Riesgo 1] → Mitigación: [...]\n- [Riesgo 2] → Mitigación: [...]\n\n**Dependencias:**\n- [ ] [Dependencia 1]\n- [ ] [Dependencia 2]`
            },
            {
                titulo: 'Supuestos',
                contenido: `| Supuesto | Fuente | Validado |\n|----------|--------|----------|\n| [Supuesto 1] | [De dónde sale] | ☐ Sí / ☐ No |\n| [Supuesto 2] | | |`
            },
            {
                titulo: 'Aprobación cliente',
                contenido: `- [ ] Cliente ha revisado la ficha\n- [ ] Cliente aprueba la iniciativa\n- [ ] Fecha aprobación: _____`
            }
        ]
    },
    {
        id: "6",
        nombre: 'Calculadora de Impacto ROI',
        version: 'V2.1',
        fase: 'Día 3-5',
        tipo: 'Cálculo',
        desc: 'Fórmulas y metodología para calcular el ROI de cada iniciativa.',
        updated_at: '2024-01-05',
        sections_count: 5,
        secciones: [
            {
                titulo: 'Fórmulas base',
                contenido: `**Ahorro de tiempo:**\n\`Ahorro mensual (h) = (Tiempo actual - Tiempo nuevo) × Frecuencia mensual\`\n\`Ahorro anual (h) = Ahorro mensual × 12\`\n\n**Conversión a euros:**\n\`Coste hora = Salario bruto anual ÷ 1.760 horas\`\n\`Ahorro € = Ahorro (h) × Coste hora\`\n\n**ROI:**\n\`ROI = (Ahorro anual - Inversión) ÷ Inversión × 100\`\n\`Payback (meses) = Inversión ÷ Ahorro mensual\``
            },
            {
                titulo: 'Tabla de costes hora por rol',
                contenido: `| Rol | Salario bruto anual (€) | Coste hora (€) |\n|-----|------------------------|----------------|\n| Junior / Administrativo | 22.000 - 28.000 | 12 - 16 |\n| Senior / Especialista | 30.000 - 45.000 | 17 - 25 |\n| Manager / Director | 50.000 - 80.000 | 28 - 45 |\n| C-Level | 80.000+ | 45+ |`
            },
            {
                titulo: 'Ejemplo práctico',
                contenido: `**Situación:** Facturación manual\n- Tiempo actual: 30 min/factura\n- Tiempo automatizado: 5 min/factura\n- Facturas/mes: 150\n- Rol: Administrativo (€15/h)\n\n**Cálculo:**\n- Ahorro por factura: 25 min\n- Ahorro mensual: 25 × 150 = 3.750 min = **62,5 h**\n- Ahorro € mensual: 62,5 × 15 = **€937,50**\n- Ahorro € anual: **€11.250**\n\n**Inversión:** €2.000 (configuración + formación)\n\n**ROI:** (11.250 - 2.000) ÷ 2.000 × 100 = **462%**\n**Payback:** 2.000 ÷ 937,50 = **2,1 meses**`
            },
            {
                titulo: 'Impacto cualitativo (no olvidar)',
                contenido: `Además del ahorro €, documentar:\n- ✅ Reducción de errores\n- ✅ Mejora en tiempos de respuesta al cliente\n- ✅ Reducción de estrés del equipo\n- ✅ Mejor visibilidad/reporting\n- ✅ Escalabilidad (crecer sin añadir personas)`
            }
        ]
    },
    {
        id: "7",
        nombre: 'Formulario Inicial Pre-KickOff',
        version: 'V1.0',
        fase: 'Día 0',
        tipo: 'Checklist',
        desc: 'Cuestionario para preparar la reunión de inicio y recopilar datos básicos del cliente.',
        updated_at: '2024-01-14',
        sections_count: 3,
        secciones: [
            {
                titulo: 'Datos de la empresa',
                contenido: `- Nombre comercial:\n- Sector principal:\n- Número de empleados:\n- Persona de contacto (Project Owner):`
            },
            {
                titulo: 'Sistemas actuales',
                contenido: `- ¿Qué ERP/CRM utilizáis?\n- ¿Usáis herramientas de IA actualmente? (ChatGPT, Midjourney, etc.)\n- ¿Tenéis cuenta de Microsoft 365 o Google Workspace?`
            },
            {
                titulo: 'Expectativas',
                contenido: `- ¿Cuál es el principal motivo del diagnóstico?\n- ¿Qué áreas creéis que tienen más margen de mejora?`
            }
        ]
    },
    {
        id: "8",
        nombre: 'Guion Entrevista Universal',
        version: 'V1.2',
        fase: 'Día 1-2',
        tipo: 'Entrevista',
        desc: 'Preguntas estándar que aplican a cualquier rol de la organización.',
        updated_at: '2024-01-14',
        sections_count: 4,
        secciones: [
            {
                titulo: 'Tu rol (5 min)',
                contenido: `1. ¿Cuál es tu función principal?\n2. ¿Qué sistemas abres nada más empezar el día?`
            },
            {
                titulo: 'Tareas repetitivas (15 min)',
                contenido: `3. ¿Qué tarea haces todos los días que te parece aburrida?\n4. ¿Cuánto tiempo le dedicas?\n5. Si esa tarea se hiciera sola, ¿en qué usarías ese tiempo?`
            },
            {
                titulo: 'Información y bloqueos (10 min)',
                contenido: `6. ¿Qué información te falta a veces para hacer tu trabajo?\n7. ¿A quién tienes que pedírsela?`
            }
        ]
    },
    {
        id: "9",
        nombre: 'Tabla Inventario / Matriz de Procesos',
        version: 'V1.5',
        fase: 'Día 3-5',
        tipo: 'Template',
        desc: 'Matriz para mapear todos los procesos detectados y priorizarlos.',
        updated_at: '2024-01-14',
        sections_count: 2,
        secciones: [
            {
                titulo: 'Columnas de la matriz',
                contenido: `| Proceso | Área | Frecuencia | Dolor | Complejidad IA | Prioridad |\n|---------|------|------------|-------|----------------|-----------|\n| | | | | | |`
            },
            {
                titulo: 'Criterios de priorización',
                contenido: `- **Dolor > 4** + **Frecuencia alta** = Prioridad ALTA\n- **Impacto directo en cliente** = Prioridad ALTA\n- **Complejidad técnica baja** = Quick Win`
            }
        ]
    }
];

export const ASSET_TYPES = ['Todos', 'Medición', 'Entrevista', 'Checklist', 'Template', 'Cálculo'];
export const ASSET_FASES = ['Todas', 'Día 0', 'Día 0-1', 'Día 1-2', 'Día 3-5', 'Día 6-7'];
