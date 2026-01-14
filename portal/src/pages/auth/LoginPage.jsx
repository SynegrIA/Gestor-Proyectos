import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from 'react-icons/fi'
import './Auth.css'

export default function LoginPage() {
    const { login, loading, error } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [localError, setLocalError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLocalError('')

        if (!email || !password) {
            setLocalError('Por favor, completa todos los campos')
            return
        }

        const result = await login(email, password)

        if (result.success) {
            if (result.user.role === 'admin' || result.user.role === 'owner') {
                navigate('/admin')
            } else if (result.user.role === 'consultor') {
                navigate('/consultor')
            } else {
                navigate('/cliente')
            }
        }
    }

    const displayError = localError || error

    return (
        <div className="auth-page">
            <div className="auth-page__left">
                <div className="auth-branding">
                    <div className="auth-branding__logo">
                        <div className="auth-branding__icon">S</div>
                        <span className="auth-branding__name">Synergia</span>
                    </div>
                    <h1 className="auth-branding__title">
                        Diagnóstico de<br />Eficiencia en 7 Días
                    </h1>
                    <p className="auth-branding__subtitle">
                        Identifica oportunidades de mejora y genera ahorros con un diagnóstico estructurado.
                    </p>
                </div>
                <div className="auth-illustration">
                    <div className="auth-illustration__circles">
                        <div className="auth-illustration__circle auth-illustration__circle--1"></div>
                        <div className="auth-illustration__circle auth-illustration__circle--2"></div>
                        <div className="auth-illustration__circle auth-illustration__circle--3"></div>
                    </div>
                </div>
            </div>

            <div className="auth-page__right">
                <div className="auth-form-container">
                    <h2 className="auth-form__title">Bienvenido de nuevo</h2>
                    <p className="auth-form__subtitle">Introduce tus credenciales para acceder</p>

                    {displayError && (
                        <div className="auth-form__error">
                            {displayError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <div className="input-with-icon">
                                <FiMail className="input-icon" />
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Contraseña</label>
                            <div className="input-with-icon">
                                <FiLock className="input-icon" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="input-icon-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <div className="auth-form__options">
                            <label className="checkbox-label">
                                <input type="checkbox" />
                                <span>Recordarme</span>
                            </label>
                            <Link to="/reset-password" className="auth-form__link">
                                ¿Olvidaste tu acceso?
                            </Link>
                        </div>

                        <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={loading}>
                            {loading ? (
                                <>
                                    <FiLoader className="spinner-inline" />
                                    Entrando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>

                    <div className="auth-form__demo" style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <p style={{ fontWeight: 600, color: '#475569', marginBottom: '0.75rem', fontSize: '0.875rem' }}>Usuarios de prueba (Pass: 123456)</p>
                        <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.8125rem', fontFamily: 'monospace' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: 'white', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>ADMIN</span>
                                <span>admin@synergia.com</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: 'white', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>CONSULTOR</span>
                                <span>consultor@synergia.com</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: 'white', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                <span style={{ color: '#10b981', fontWeight: 'bold' }}>CLIENTE</span>
                                <span>cliente@acme.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
