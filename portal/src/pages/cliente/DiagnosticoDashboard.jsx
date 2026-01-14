import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiInfo, FiArrowRight, FiMessageSquare, FiCalendar, FiUpload, FiCheckCircle } from 'react-icons/fi'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { useProjectData } from '../../context/ProjectContext'

// ═══════════════════════════════════════════════════════════════════════════════
// DATOS MOCK - Exactos de la imagen de referencia
// ═══════════════════════════════════════════════════════════════════════════════
const MOCK_DATA = {
    kpis: {
        ahorroAnual: { value: '€45.2K', trend: '+15%', detail: 'vs muestra inicial (€39.1K)' },
        mejoraEficiencia: { value: '23%', trend: '+8%', detail: 'vs estimación inicial (15%)' },
        tiempoProceso: { value: '12.5h', trend: '-3.2h', detail: 'vs mes anterior (15.7h)' }
    },
    distribucion: [
        { name: 'Presupuestos', value: 25000, percent: '55.3%', display: '€25K' },
        { name: 'Fugas', value: 15000, percent: '33.2%', display: '€15K' },
        { name: 'CRM', value: 8200, percent: '11.5%', display: '€8.2K' }
    ],
    top3: [
        { id: 1, titulo: 'Seguimiento automático de presupuestos', ahorro: '€25.0K/año', esfuerzo: '35h', payback: '2 meses' },
        { id: 2, titulo: 'Dashboard de Control de Fugas', ahorro: '€15.0K/año', esfuerzo: '25h', payback: '1.8 meses' },
        { id: 3, titulo: 'Limpieza de Datos CRM', ahorro: '€8.2K/año', esfuerzo: '60h', payback: '8 meses' }
    ],
    siguientePaso: { titulo: 'Revisión final', fecha: '15 Enero 2024, 10:00 - 11:00' },
    acciones: [
        { text: 'Sube ERP 12 meses', icon: FiUpload, link: 'data-room' },
        { text: 'Confirma el tiempo del proceso X', icon: FiCheckCircle, link: 'supuestos-medicion' },
        { text: 'Responde a comentario en iniciativa #2', icon: FiMessageSquare, link: 'iniciativas/2' }
    ]
}

const DONUT_COLORS = ['#6366f1', '#a78bfa', '#c4b5fd']

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE KPI CARD
// ═══════════════════════════════════════════════════════════════════════════════
const KPICard = ({ label, value, trend, detail }) => (
    <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        borderRadius: '16px',
        padding: '24px',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '140px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', opacity: 0.9 }}>
            {label} <FiInfo size={14} style={{ opacity: 0.6 }} />
        </div>
        <div style={{ fontSize: '36px', fontWeight: 700, margin: '8px 0' }}>{value}</div>
        <div style={{ fontSize: '12px', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: trend.startsWith('-') ? '#fbbf24' : '#4ade80' }}>↗ {trend}</span>
            <span style={{ opacity: 0.7 }}>{detail}</span>
        </div>
    </div>
)

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
export default function DiagnosticoDashboard() {
    const { projectData } = useProjectData()
    const { iniciativas } = projectData
    const navigate = useNavigate()
    const { id: projectId } = useParams()

    // Usar datos reales si existen, sino mock
    const topIniciativas = useMemo(() => {
        const real = iniciativas?.filter(i => i.isTop).slice(0, 3)
        if (real && real.length === 3) {
            return real.map((ini) => ({
                id: ini.id,
                titulo: ini.titulo,
                ahorro: `€${(ini.roi_eur_anual / 1000).toFixed(1)}K/año`,
                esfuerzo: `${ini.esfuerzo_horas}h`,
                payback: `${ini.payback_meses} meses`
            }))
        }
        return MOCK_DATA.top3
    }, [iniciativas])

    const distribucionData = useMemo(() => {
        const published = iniciativas?.filter(i => i.estado_visibilidad === 'PUBLICADA') || []
        if (published.length > 0) {
            const byArea = {}
            published.forEach(ini => {
                if (!byArea[ini.area]) byArea[ini.area] = 0
                byArea[ini.area] += ini.roi_eur_anual || 0
            })
            const total = Object.values(byArea).reduce((a, b) => a + b, 0)
            return Object.entries(byArea)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([name, value]) => ({
                    name,
                    value,
                    percent: `${((value / total) * 100).toFixed(1)}%`,
                    display: `€${(value / 1000).toFixed(0)}K`
                }))
        }
        return MOCK_DATA.distribucion
    }, [iniciativas])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '40px' }}>
            
            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* A) HEADER: Título + Subtítulo */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <div>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>
                    Dashboard
                </h1>
                <p style={{ fontSize: '14px', color: '#64748b' }}>
                    Resumen ejecutivo de tu diagnóstico
                </p>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* B) FILA 1: KPI Cards (3 columnas) */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <KPICard 
                    label="Ahorro anual estimado"
                    value={MOCK_DATA.kpis.ahorroAnual.value}
                    trend={MOCK_DATA.kpis.ahorroAnual.trend}
                    detail={MOCK_DATA.kpis.ahorroAnual.detail}
                />
                <KPICard 
                    label="Mejora eficiencia"
                    value={MOCK_DATA.kpis.mejoraEficiencia.value}
                    trend={MOCK_DATA.kpis.mejoraEficiencia.trend}
                    detail={MOCK_DATA.kpis.mejoraEficiencia.detail}
                />
                <KPICard 
                    label="Tiempo por proceso"
                    value={MOCK_DATA.kpis.tiempoProceso.value}
                    trend={MOCK_DATA.kpis.tiempoProceso.trend}
                    detail={MOCK_DATA.kpis.tiempoProceso.detail}
                />
            </div>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* C) FILA 2: Resumen Ejecutivo + Distribución del Ahorro */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
                
                {/* Card Resumen Ejecutivo */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>
                        Resumen Ejecutivo
                    </h3>
                    <div style={{ fontSize: '14px', lineHeight: 1.7, color: '#475569' }}>
                        <p style={{ marginBottom: '16px' }}>
                            Tras analizar <strong>5 departamentos y 23 procesos</strong>, hemos identificado <strong>3 iniciativas prioritarias</strong> que 
                            pueden generar un ahorro de <strong>€45.2K anuales</strong> con una inversión inicial de €12K y payback de 3.2 meses.
                        </p>
                        <p>
                            Las principales áreas de mejora son: <strong>facturación manual, gestión de pedidos y reporting comercial.</strong>
                        </p>
                    </div>
                </div>

                {/* Card Distribución del Ahorro */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>
                        Distribución del Ahorro
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        {/* Donut Chart */}
                        <div style={{ width: '120px', height: '120px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={distribucionData}
                                        innerRadius={35}
                                        outerRadius={55}
                                        paddingAngle={3}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {distribucionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={DONUT_COLORS[index]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Leyenda */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                            {distribucionData.map((item, index) => (
                                <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: DONUT_COLORS[index] }}></div>
                                        <span style={{ fontSize: '13px', color: '#475569' }}>{item.name}</span>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{item.display}</span>
                                        <br />
                                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.percent}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* D) SECCIÓN TOP 3 INICIATIVAS */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <div>
                {/* Header de sección */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                            Top 3 Iniciativas
                        </h2>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>
                            Impacto inmediato y retorno rápido
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate(`/cliente/diagnostico/${projectId}/iniciativas`)}
                        style={{
                            background: '#6366f1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '10px 20px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        Revisar Top 3 ahora <FiArrowRight size={14} />
                    </button>
                </div>

                {/* 3 Cards de iniciativas */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {topIniciativas.map((ini, idx) => (
                        <div key={ini.id} style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            minHeight: '200px'
                        }}>
                            {/* Badge #1, #2, #3 */}
                            <div style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: '#eef2ff',
                                color: '#6366f1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '11px',
                                fontWeight: 800
                            }}>
                                #{idx + 1}
                            </div>

                            {/* Título */}
                            <h4 style={{ 
                                fontSize: '14px', 
                                fontWeight: 600, 
                                color: '#1e293b', 
                                marginBottom: '24px',
                                paddingRight: '40px',
                                lineHeight: 1.4
                            }}>
                                {ini.titulo}
                            </h4>

                            {/* Métricas */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span style={{ color: '#64748b' }}>Ahorro</span>
                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{ini.ahorro}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span style={{ color: '#64748b' }}>Esfuerzo</span>
                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{ini.esfuerzo}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                    <span style={{ color: '#64748b' }}>Payback</span>
                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{ini.payback}</span>
                                </div>
                            </div>

                            {/* Footer con acciones */}
                            <div style={{ 
                                borderTop: '1px solid #e2e8f0', 
                                paddingTop: '16px', 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <button 
                                    onClick={() => navigate(`/cliente/diagnostico/${projectId}/iniciativas/${ini.id}`)}
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        color: '#64748b', 
                                        fontSize: '12px', 
                                        fontWeight: 500,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Ver ficha
                                </button>
                                <button style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: '#64748b', 
                                    fontSize: '12px', 
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    <FiMessageSquare size={14} /> Comentar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════ */}
            {/* E) FILA INFERIOR: Siguiente Paso + Lo que necesitamos */}
            {/* ═══════════════════════════════════════════════════════════════════ */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                
                {/* Card Siguiente Paso */}
                <div style={{
                    background: '#f5f3ff',
                    borderRadius: '16px',
                    padding: '28px 32px',
                    border: '1px solid #e0e7ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'white',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <FiCalendar size={22} color="#475569" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                                Siguiente paso: {MOCK_DATA.siguientePaso.titulo}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#64748b' }}>
                                {MOCK_DATA.siguientePaso.fecha}
                            </p>
                        </div>
                    </div>
                    <button style={{
                        background: 'white',
                        border: '1px solid #c7d2fe',
                        borderRadius: '10px',
                        padding: '10px 20px',
                        color: '#6366f1',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}>
                        Ver agenda
                    </button>
                </div>

                {/* Card Lo que necesitamos de ti */}
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '28px',
                    border: '1px solid #e2e8f0'
                }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '20px', fontStyle: 'italic' }}>
                        Lo que necesitamos de ti
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {MOCK_DATA.acciones.map((accion, i) => (
                            <div 
                                key={i}
                                onClick={() => navigate(`/cliente/diagnostico/${projectId}/${accion.link}`)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: i === 0 ? '#dbeafe' : i === 1 ? '#d1fae5' : '#e0e7ff',
                                        color: i === 0 ? '#2563eb' : i === 1 ? '#059669' : '#6366f1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <accion.icon size={16} />
                                    </div>
                                    <span style={{ fontSize: '13px', color: '#475569' }}>{accion.text}</span>
                                </div>
                                <FiArrowRight size={14} color="#94a3b8" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

