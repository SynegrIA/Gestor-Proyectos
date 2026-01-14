import { useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiLink } from 'react-icons/fi'

const TAREAS_MASTER = [
    { id: 1, fase: 'Día 0', dia: 0, tarea: 'Enviar email de bienvenida', quien: 'Consultor', deps: '-', input: '-', output: 'Email enviado', template: 'Email Bienvenida', sla: '-' },
    { id: 2, fase: 'Día 0', dia: 0, tarea: 'Configurar accesos portal', quien: 'Consultor', deps: '-', input: '-', output: 'Credenciales', template: '-', sla: '-' },
    { id: 3, fase: 'Día 0', dia: 0, tarea: 'Enviar checklist datos mínimos', quien: 'Consultor', deps: '#1', input: '-', output: 'Checklist enviado', template: 'Checklist Datos', sla: '-' },
    { id: 4, fase: 'Día 1-2', dia: 1, tarea: 'Recibir datos financieros', quien: 'Cliente', deps: '#3', input: 'Balance, P&L', output: 'Archivos en DR', template: '-', sla: '48h' },
    { id: 5, fase: 'Día 1-2', dia: 1, tarea: 'Recibir export CRM', quien: 'Cliente', deps: '#3', input: 'Export clientes', output: 'Archivos en DR', template: '-', sla: '48h' },
    { id: 6, fase: 'Día 1-2', dia: 1, tarea: 'Entrevista CEO', quien: 'Ambos', deps: '#4', input: '-', output: 'Notas entrevista', template: 'Script CEO', sla: '-' },
    { id: 7, fase: 'Día 1-2', dia: 2, tarea: 'Entrevista Dir. Área', quien: 'Ambos', deps: '#6', input: '-', output: 'Notas entrevista', template: 'Script Dir Área', sla: '-' },
    { id: 8, fase: 'Día 3-5', dia: 3, tarea: 'Análisis matriz de procesos', quien: 'Consultor', deps: '#4,#5,#6,#7', input: 'Datos + notas', output: 'Matriz borrador', template: 'Matriz Template', sla: '-' },
    { id: 9, fase: 'Día 3-5', dia: 4, tarea: 'Definir Top 3 iniciativas', quien: 'Consultor', deps: '#8', input: 'Matriz', output: 'Fichas borrador', template: 'Ficha Iniciativa', sla: '-' },
    { id: 10, fase: 'Día 3-5', dia: 5, tarea: 'Calcular ROI por iniciativa', quien: 'Consultor', deps: '#9', input: 'Fichas', output: 'ROI calculado', template: 'Plantilla ROI', sla: '-' },
    { id: 11, fase: 'Día 6-7', dia: 6, tarea: 'Preparar presentación final', quien: 'Consultor', deps: '#8,#9,#10', input: 'Todo', output: 'PPT final', template: 'Presentación Base', sla: '-' },
    { id: 12, fase: 'Día 6-7', dia: 7, tarea: 'Reunión revisión final', quien: 'Ambos', deps: '#11', input: 'PPT', output: 'Acta reunión', template: 'Acta Template', sla: '-' },
]

export default function ConsultorPlantillaTareas() {
    const [tareas, setTareas] = useState(TAREAS_MASTER)

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="page-title">Plantilla Master de Tareas</h1>
                    <p className="page-subtitle">Configuración del checklist estándar para todos los diagnósticos</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn--ghost"><FiPlus /> Añadir tarea</button>
                    <button className="btn btn--primary"><FiSave /> Guardar cambios</button>
                </div>
            </div>

            <div className="alert alert--info" style={{ marginBottom: 'var(--space-6)' }}>
                <strong>ℹ️ Info:</strong> Esta plantilla se usa como base al crear nuevos diagnósticos. Las tareas se instanciarán automáticamente.
            </div>

            <div className="card">
                <div className="card-body" style={{ padding: 0, overflowX: 'auto' }}>
                    <table className="table" style={{ minWidth: '1200px' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th style={{ width: '100px' }}>Fase</th>
                                <th style={{ width: '60px' }}>Día</th>
                                <th>Tarea</th>
                                <th style={{ width: '100px' }}>Responsable</th>
                                <th style={{ width: '80px' }}>Deps.</th>
                                <th>Input esperado</th>
                                <th>Output</th>
                                <th>Template</th>
                                <th style={{ width: '60px' }}>SLA</th>
                                <th style={{ width: '80px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tareas.map(t => (
                                <tr key={t.id}>
                                    <td className="text-muted">{t.id}</td>
                                    <td><span className="badge badge--neutral">{t.fase}</span></td>
                                    <td className="text-center">{t.dia}</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-input"
                                            defaultValue={t.tarea}
                                            style={{ padding: 'var(--space-1) var(--space-2)', fontSize: 'var(--text-sm)', border: 'none', background: 'transparent' }}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            className="form-input"
                                            defaultValue={t.quien}
                                            style={{ padding: 'var(--space-1)', fontSize: 'var(--text-xs)', width: '100%' }}
                                        >
                                            <option value="Consultor">Consultor</option>
                                            <option value="Cliente">Cliente</option>
                                            <option value="Ambos">Ambos</option>
                                        </select>
                                    </td>
                                    <td className="text-sm text-muted">{t.deps}</td>
                                    <td className="text-sm">{t.input}</td>
                                    <td className="text-sm">{t.output}</td>
                                    <td>
                                        {t.template !== '-' ? (
                                            <a href="#" className="text-primary text-sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <FiLink size={12} /> {t.template}
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        {t.sla !== '-' ? (
                                            <span className="badge badge--warning">{t.sla}</span>
                                        ) : '-'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                                            <button className="btn btn--ghost btn--icon btn--sm"><FiEdit2 /></button>
                                            <button className="btn btn--ghost btn--icon btn--sm"><FiTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
