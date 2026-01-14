import { Link } from 'react-router-dom'
import { FiBell, FiArrowRight, FiAlertTriangle, FiUpload, FiBriefcase, FiCodesandbox, FiMonitor, FiCloud } from 'react-icons/fi'
import './ClienteHome.css'

// Tipos de productos (Categorías principales)
const TIPOS_PRODUCTO = {
  consultoria: { nombre: 'Consultoría', icon: <FiBriefcase />, color: 'var(--primary-500)', descripcion: 'Diagnósticos y asesoría', ruta: 'consultoria' },
  desarrollo: { nombre: 'Desarrollo a Medida', icon: <FiCodesandbox />, color: 'var(--success-500)', descripcion: 'Software y automatización', ruta: 'desarrollo' },
  formacion: { nombre: 'Formación', icon: <FiMonitor />, color: 'var(--warning-500)', descripcion: 'Cursos in-company', ruta: 'formacion' },
  saas: { nombre: 'SaaS', icon: <FiCloud />, color: 'var(--info-500)', descripcion: 'Suscripciones activas', ruta: 'saas' }
}

// Mock data - proyectos del cliente
const MIS_PROYECTOS = [
  {
    id: 1,
    nombre: 'Diagnóstico de Eficiencia',
    tipo: 'consultoria',
    estado: 'en_progreso',
    fase: 'Análisis (Días 3-5)',
    progreso: 60,
    consultor: 'María López',
    inicio: '10 Ene 2024',
    alertas: []
  },
  {
    id: 2,
    nombre: 'Agente Ventas IA - WhatsApp',
    tipo: 'desarrollo',
    estado: 'en_progreso',
    fase: 'Entrenamiento del modelo',
    progreso: 40,
    consultor: 'María López',
    inicio: '05 Ene 2024',
    alertas: []
  },
  {
    id: 3,
    nombre: 'Workshop: IA para Directivos',
    tipo: 'formacion',
    estado: 'pendiente',
    fase: 'Agendado: 20 Feb',
    progreso: 0,
    consultor: 'Carlos Ruiz',
    inicio: '20 Feb 2024',
    alertas: ['Confirmar asistencia']
  },
  {
    id: 4,
    nombre: 'Synergia Flow (Licencia Pro)',
    tipo: 'saas',
    estado: 'activo',
    fase: 'Renovación: Dic 2024',
    progreso: 100,
    consultor: 'Soporte',
    inicio: '01 Ene 2024',
    alertas: []
  },
  {
    id: 5,
    nombre: 'Consultoría Estratégica Q3',
    tipo: 'consultoria',
    estado: 'pausado',
    fase: 'Recopilación data',
    progreso: 15,
    consultor: 'María López',
    inicio: '01 Sep 2023',
    alertas: ['Esperando acceso ERP']
  }
]

const getEstadoInfo = (estado) => {
  const estados = {
    en_progreso: { label: 'En Progreso', class: 'status--in-progress' },
    pausado: { label: 'Pausado', class: 'status--paused' },
    entregado: { label: 'Entregado', class: 'status--delivered' },
    pendiente: { label: 'Pendiente', class: 'status--neutral' },
    activo: { label: 'Activo', class: 'status--success' }
  }
  return estados[estado] || estados.en_progreso
}

export default function ClienteHome() {
  // Agrupar por tipo
  const proyectosPorTipo = MIS_PROYECTOS.reduce((acc, p) => {
    if (!acc[p.tipo]) acc[p.tipo] = []
    acc[p.tipo].push(p)
    return acc
  }, {})

  return (
    <div className="cliente-home">
      <div className="page-header">
        <h1 className="page-title">Mis Servicios</h1>
        <p className="page-subtitle">Panel unificado de productos y servicios contratados</p>
      </div>

      {/* Resumen por tipo de producto */}
      <div className="productos-grid">
        {Object.entries(TIPOS_PRODUCTO).map(([key, info]) => {
          const count = proyectosPorTipo[key]?.length || 0
          if (count === 0) return null
          return (
            <div key={key} className="producto-card" style={{ borderLeftColor: info.color }}>
              <span className="producto-card__icon" style={{ color: info.color }}>{info.icon}</span>
              <div className="producto-card__info">
                <div className="producto-card__count">{count}</div>
                <div className="producto-card__name">{info.nombre}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lista de proyectos */}
      <div className="proyectos-list">
        {MIS_PROYECTOS.map(proyecto => {
          const estadoInfo = getEstadoInfo(proyecto.estado)
          const tipoInfo = TIPOS_PRODUCTO[proyecto.tipo]

          return (
            <div key={proyecto.id} className={`proyecto-card ${proyecto.alertas.length > 0 ? 'proyecto-card--alerta' : ''}`}>
              <div className="proyecto-card__header">
                <div className="proyecto-card__tipo">
                  <span className="proyecto-card__tipo-icon" style={{ background: `${tipoInfo.color}20`, color: tipoInfo.color }}>
                    {tipoInfo.icon}
                  </span>
                  <div>
                    <span className="proyecto-card__tipo-name" style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                      {tipoInfo.nombre}
                    </span>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{tipoInfo.descripcion}</div>
                  </div>
                </div>
                <span className={`proyecto-card__status ${estadoInfo.class}`}>
                  {estadoInfo.label}
                </span>
              </div>

              <h3 className="proyecto-card__title">{proyecto.nombre}</h3>

              <div className="proyecto-card__meta">
                <div className="proyecto-card__meta-item">
                  <span className="label">ESTADO / FASE:</span>
                  <span className="value">{proyecto.fase}</span>
                </div>
                <div className="proyecto-card__meta-item">
                  <span className="label">INICIO:</span>
                  <span className="value">{proyecto.inicio}</span>
                </div>
                <div className="proyecto-card__meta-item">
                  <span className="label">RESPONSABLE:</span>
                  <span className="value">{proyecto.consultor}</span>
                </div>
              </div>

              {/* Barra de progreso solo si aplica */}
              {proyecto.tipo !== 'saas' && proyecto.tipo !== 'formacion' && (
                <div className="proyecto-card__progress">
                  <div className="proyecto-card__progress-bar">
                    <div
                      className="proyecto-card__progress-fill"
                      style={{ width: `${proyecto.progreso}%`, background: tipoInfo.color }}
                    />
                  </div>
                  <span className="proyecto-card__progress-text">{proyecto.progreso}%</span>
                </div>
              )}

              {proyecto.alertas.length > 0 && (
                <div className="proyecto-card__alertas">
                  {proyecto.alertas.map((alerta, i) => (
                    <div key={i} className="proyecto-card__alerta">
                      <FiAlertTriangle /> {alerta}
                    </div>
                  ))}
                </div>
              )}

              <div className="proyecto-card__actions">
                {proyecto.estado === 'pausado' && proyecto.alertas.length > 0 ? (
                  <button className="btn btn--warning">
                    <FiUpload /> Resolver bloqueo
                  </button>
                ) : (
                  <Link
                    // Redirigir a la vista específica o genérica según si está implementada
                    to={proyecto.tipo === 'consultoria' ? `/cliente/diagnostico/${proyecto.id}` : `/cliente/${tipoInfo.ruta}/${proyecto.id}`}
                    className="btn btn--primary"
                    style={{ background: tipoInfo.color, borderColor: tipoInfo.color }}
                  >
                    Acceder <FiArrowRight />
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
