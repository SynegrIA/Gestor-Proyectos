import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, ROLES } from './context/AuthContext'

// Layouts
import ClienteLayout from './layouts/ClienteLayout'
import ConsultorLayout from './layouts/ConsultorLayout'
import AdminLayout from './layouts/AdminLayout'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Cliente Pages
import ClienteHome from './pages/cliente/ClienteHome'
import DiagnosticoDashboard from './pages/cliente/DiagnosticoDashboard'
import DiagnosticoMatriz from './pages/cliente/DiagnosticoMatriz'
import DiagnosticoRoadmap from './pages/cliente/DiagnosticoRoadmap'
import DiagnosticoIniciativas from './pages/cliente/DiagnosticoIniciativas'
import DiagnosticoFichaIniciativa from './pages/cliente/DiagnosticoFichaIniciativa'
import DiagnosticoSupuestos from './pages/cliente/DiagnosticoSupuestos'
import DiagnosticoSiguientesPasos from './pages/cliente/DiagnosticoSiguientesPasos'
import DiagnosticoRevision from './pages/cliente/DiagnosticoRevision'
import DiagnosticoDataRoom from './pages/cliente/DiagnosticoDataRoom'
import ClienteTareas from './pages/cliente/ClienteTareas'
import DiagnosticoMedicion from './pages/cliente/DiagnosticoMedicion'
import DiagnosticoResultados from './pages/cliente/DiagnosticoResultados'
import DiagnosticoCierre from './pages/cliente/DiagnosticoCierre'

// Consultor Pages
import ConsultorPortfolio from './pages/consultor/ConsultorPortfolio'
import ConsultorVistaCliente from './pages/consultor/ConsultorVistaCliente'
import ConsultorOperacion from './pages/consultor/ConsultorOperacion'
import ConsultorTareas from './pages/consultor/ConsultorTareas'
import ConsultorInputs from './pages/consultor/ConsultorInputs'
import ConsultorEntregables from './pages/consultor/ConsultorEntregables'
import ConsultorEntregablesPreview from './pages/consultor/ConsultorEntregablesPreview'
import ConsultorNotas from './pages/consultor/ConsultorNotas'
import ConsultorActivos from './pages/consultor/ConsultorActivos'
import ConsultorPlantillaTareas from './pages/consultor/ConsultorPlantillaTareas'
import ConsultorAdmin from './pages/consultor/ConsultorAdmin'
import ConsultorCierre from './pages/consultor/DiagnosticoCierre'
import ConsultorCatalogo from './pages/consultor/ConsultorCatalogo'

// Admin Pages
import AdminPanel from './pages/admin/AdminPanel'
import AdminClientes from './pages/admin/AdminClientes'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import AdminCatalogo from './pages/admin/AdminCatalogo'
import AdminActivos from './pages/admin/AdminActivos'
import AdminPlantillas from './pages/admin/AdminPlantillas'
import AdminAjustes from './pages/admin/AdminAjustes'

// Settings
import SettingsPage from './pages/settings/SettingsPage'
import { FiBriefcase, FiCodesandbox, FiMonitor, FiCloud } from 'react-icons/fi'

// Protected Route wrapper
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate home based on role
    if (user.role === ROLES.ADMIN || user.role === ROLES.OWNER) return <Navigate to="/admin" replace />
    if (user.role === ROLES.CONSULTOR) return <Navigate to="/consultor" replace />
    return <Navigate to="/cliente" replace />
  }

  return children
}

function App() {
  const { isAuthenticated, user, ROLES } = useAuth()

  // Helper para redirección inicial
  const getHomeRoute = () => {
    if (!isAuthenticated) return '/login'
    if (user.role === ROLES.ADMIN || user.role === ROLES.OWNER) return '/admin'
    if (user.role === ROLES.CONSULTOR) return '/consultor'
    return '/cliente'
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={
        isAuthenticated ? (
          <Navigate to={getHomeRoute()} replace />
        ) : (
          <LoginPage />
        )
      } />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Admin Routes (NUEVO) */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.OWNER]}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminPanel />} />
        <Route path="clientes" element={<AdminClientes />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="catalogo" element={<AdminCatalogo />} />
        <Route path="activos" element={<AdminActivos />} />
        <Route path="activos/:id" element={<AdminActivos />} />
        <Route path="plantillas" element={<AdminPlantillas />} />
        <Route path="ajustes" element={<AdminAjustes />} />
      </Route>

      {/* Cliente Routes */}
      <Route path="/cliente" element={
        <ProtectedRoute allowedRoles={[ROLES.CLIENTE]}>
          <ClienteLayout />
        </ProtectedRoute>
      }>
        <Route index element={<ClienteHome />} />

        {/* Consultoría (antes Diagnóstico) */}
        <Route path="diagnostico/:id">
          <Route index element={<DiagnosticoDashboard />} />
          <Route path="dashboard" element={<DiagnosticoDashboard />} />
          <Route path="pendientes" element={<ClienteTareas />} />
          <Route path="tareas" element={<Navigate to="../pendientes" replace />} />
          <Route path="medicion-tiempos" element={<DiagnosticoMedicion />} />
          <Route path="matriz" element={<DiagnosticoMatriz />} />
          <Route path="roadmap" element={<DiagnosticoRoadmap />} />
          <Route path="iniciativas" element={<DiagnosticoIniciativas />} />
          <Route path="iniciativas/:iniciativaId" element={<DiagnosticoFichaIniciativa />} />
          <Route path="supuestos-medicion" element={<DiagnosticoSupuestos />} />
          <Route path="siguientes-pasos" element={<DiagnosticoSiguientesPasos />} />
          <Route path="revision" element={<DiagnosticoRevision />} />
          <Route path="data-room" element={<DiagnosticoDataRoom />} />
          
          <Route path="resultados" element={<DiagnosticoResultados />}>
            <Route index element={<Navigate to="resumen" replace />} />
            <Route path="resumen" element={<DiagnosticoDashboard />} />
            <Route path="matriz" element={<DiagnosticoMatriz />} />
            <Route path="roadmap" element={<DiagnosticoRoadmap />} />
            <Route path="iniciativas" element={<DiagnosticoIniciativas />} />
            <Route path="iniciativas/:iniciativaId" element={<DiagnosticoFichaIniciativa />} />
            <Route path="supuestos" element={<DiagnosticoSupuestos />} />
          </Route>

          <Route path="cierre" element={<DiagnosticoCierre />}>
            <Route index element={<Navigate to="acta" replace />} />
            <Route path="acta" element={<DiagnosticoRevision />} />
            <Route path="siguientes-pasos" element={<DiagnosticoSiguientesPasos />} />
          </Route>
        </Route>

        {/* Alias para consultoría */}
        <Route path="consultoria/:id/*" element={<Navigate to="../diagnostico/:id/dashboard" replace />} />

        {/* Nuevas categorías */}
        <Route path="desarrollo/:id/*" element={<ProductoPlaceholder tipo="desarrollo" />} />
        <Route path="formacion/:id/*" element={<ProductoPlaceholder tipo="formacion" />} />
        <Route path="saas/:id/*" element={<ProductoPlaceholder tipo="saas" />} />

        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Consultor Routes */}
      <Route path="/consultor" element={
        <ProtectedRoute allowedRoles={[ROLES.CONSULTOR]}>
          <ConsultorLayout />
        </ProtectedRoute>
      }>
        {/* Global */}
        <Route index element={<ConsultorPortfolio />} />
        <Route path="portfolio" element={<ConsultorPortfolio />} />
        <Route path="clientes" element={<ConsultorAdmin />} />
        <Route path="cliente/:clienteId" element={<ConsultorVistaCliente />} />
        <Route path="catalogo" element={<ConsultorCatalogo />} />

        {/* Biblioteca */}
        <Route path="activos" element={<ConsultorActivos />} />
        <Route path="activos/:id" element={<ConsultorActivos />} />
        <Route path="plantilla-tareas" element={<ConsultorPlantillaTareas />} />

        {/* Proyecto específico (genérico para todos los tipos) */}
        <Route path="proyecto/:id">
          <Route path="operacion" element={<ConsultorOperacion />} />
          <Route path="control" element={<Navigate to="../operacion" replace />} />
          <Route path="tareas" element={<ConsultorTareas />} />
          <Route path="medicion-tiempos" element={<DiagnosticoMedicion />} />
          <Route path="dashboard" element={<DiagnosticoDashboard />} />
          <Route path="matriz" element={<DiagnosticoMatriz />} />
          <Route path="roadmap" element={<DiagnosticoRoadmap />} />
          <Route path="iniciativas" element={<DiagnosticoIniciativas />} />
          <Route path="iniciativas/:iniciativaId" element={<DiagnosticoFichaIniciativa />} />
          <Route path="supuestos-medicion" element={<DiagnosticoSupuestos />} />
          <Route path="inputs" element={<Navigate to="../inputs-cliente" replace />} />
          <Route path="inputs-cliente" element={<ConsultorInputs />} />
          <Route path="entregables" element={<ConsultorEntregables />} />
          <Route path="entregables/:type" element={<ConsultorEntregablesPreview />} />
          <Route path="entregables/iniciativas/:iniciativaId" element={<ConsultorEntregablesPreview />} />
          <Route path="notas" element={<ConsultorNotas />} />
          <Route path="notas-internas" element={<Navigate to="../notas" replace />} />
          <Route path="data-room" element={<DiagnosticoDataRoom />} />
          <Route path="archivos" element={<Navigate to="../data-room" replace />} />
          
          <Route path="cierre" element={<ConsultorCierre />}>
            <Route index element={<Navigate to="entregables" replace />} />
            <Route path="entregables" element={<ConsultorEntregables />} />
            <Route path="entregables/:type" element={<ConsultorEntregablesPreview />} />
            <Route path="entregables/iniciativas/:iniciativaId" element={<ConsultorEntregablesPreview />} />
            <Route path="acta" element={<DiagnosticoRevision />} />
            <Route path="siguientes-pasos" element={<DiagnosticoSiguientesPasos />} />
          </Route>
        </Route>

        {/* Legacy redirect */}
        <Route path="diagnostico/:id/*" element={<Navigate to="../proyecto/:id/operacion" replace />} />

        {/* Admin (Legacy Redirect) */}
        <Route path="admin" element={<Navigate to="/admin" replace />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={
        isAuthenticated ? (
          <Navigate to={getHomeRoute()} replace />
        ) : (
          <Navigate to="/login" replace />
        )
      } />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// Placeholder component updated for new categories
function ProductoPlaceholder({ tipo }) {
  const TIPOS_INFO = {
    desarrollo: {
      nombre: 'Desarrollo a Medida',
      icon: <FiCodesandbox size={64} />,
      color: 'var(--success-500)',
      features: ['Gestión de sprints', 'Repositorio de código', 'Entorno de testing', 'Documentación técnica']
    },
    formacion: {
      nombre: 'Formación',
      icon: <FiMonitor size={64} />,
      color: 'var(--warning-500)',
      features: ['Calendario de sesiones', 'Material didáctico', 'Grabaciones', 'Certificados']
    },
    saas: {
      nombre: 'SaaS / Suscripción',
      icon: <FiCloud size={64} />,
      color: 'var(--info-500)',
      features: ['Dashboard de uso', 'Gestión de licencia', 'Soporte técnico', 'Facturación']
    }
  }
  const info = TIPOS_INFO[tipo] || { nombre: 'Producto', icon: '📦', color: 'var(--gray-500)', features: [] }

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <div style={{ marginBottom: 'var(--space-4)', color: info.color }}>{info.icon}</div>
        <h1 style={{ margin: '0 0 var(--space-2)' }}>{info.nombre}</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Panel de gestión próximamente disponible.
        </p>
        <div className="card" style={{ maxWidth: '500px', margin: 'var(--space-6) auto', textAlign: 'left', borderTop: `4px solid ${info.color}` }}>
          <div className="card-body">
            <h4>Funcionalidades incluidas:</h4>
            <ul style={{ margin: 0, paddingLeft: 'var(--space-5)' }}>
              {info.features.map((f, i) => <li key={i} style={{ margin: '8px 0' }}>{f}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
