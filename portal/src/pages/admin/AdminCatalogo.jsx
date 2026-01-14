// Reutilizamos componentes existentes de consultor pero con permisos de edición
import ConsultorCatalogo from '../consultor/ConsultorCatalogo'

export default function AdminCatalogo() {
    return (
        <div>
           {/* El componente ConsultorCatalogo ya tiene lógica de edición, 
               que habilitaremos al estar logueado como Admin */}
           <ConsultorCatalogo isAdminView={true} /> 
        </div>
    )
}
