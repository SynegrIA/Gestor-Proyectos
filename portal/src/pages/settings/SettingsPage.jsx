import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { FiMoon, FiSun, FiLogOut } from 'react-icons/fi'

export default function SettingsPage() {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Ajustes</h1>
                <p className="page-subtitle">Gestiona tu perfil y preferencias</p>
            </div>

            <div style={{ maxWidth: '600px' }}>
                <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                    <div className="card-header">
                        <h3 className="card-title">Perfil</h3>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                            <div className="user-avatar" style={{ width: '64px', height: '64px', fontSize: 'var(--text-xl)' }}>
                                {user?.avatar}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-lg)' }}>{user?.name}</div>
                                <div className="text-sm text-muted">{user?.email}</div>
                                <div className="text-sm text-muted">Rol: {user?.role === 'cliente' ? 'Cliente' : 'Consultor'} · {user?.company}</div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-input" defaultValue={user?.name?.split(' ')[0]} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Apellido</label>
                            <input type="text" className="form-input" defaultValue={user?.name?.split(' ')[1]} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-input" defaultValue={user?.email} disabled />
                            <p className="form-hint">El email no se puede cambiar</p>
                        </div>
                        <button className="btn btn--primary">Guardar cambios</button>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                    <div className="card-header">
                        <h3 className="card-title">Apariencia</h3>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontWeight: 'var(--font-medium)' }}>Modo oscuro</div>
                                <div className="text-sm text-muted">Cambia entre tema claro y oscuro</div>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="btn btn--secondary"
                                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                            >
                                {theme === 'dark' ? <FiSun /> : <FiMoon />}
                                {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Sesión</h3>
                    </div>
                    <div className="card-body">
                        <button onClick={logout} className="btn btn--danger">
                            <FiLogOut /> Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
