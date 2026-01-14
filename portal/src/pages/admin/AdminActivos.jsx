// Reutilizamos existentes pero wrappeamos para contexto admin
import ConsultorActivos from '../consultor/ConsultorActivos'

export default function AdminActivos() {
    return <ConsultorActivos isAdminView={true} />
}
