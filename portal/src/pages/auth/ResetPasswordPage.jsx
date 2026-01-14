import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiCheck } from 'react-icons/fi'
import './Auth.css'

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        setSubmitted(true)
        setLoading(false)
    }

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
                    {!submitted ? (
                        <>
                            <h2 className="auth-form__title">Recuperar acceso</h2>
                            <p className="auth-form__subtitle">
                                Ingresa tu email y te enviaremos un enlace para crear una nueva contraseña.
                            </p>

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
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={loading}>
                                    {loading ? 'Enviando...' : 'Enviar enlace'}
                                </button>
                            </form>

                            <Link to="/login" className="auth-form__back">
                                ← Volver al login
                            </Link>
                        </>
                    ) : (
                        <div className="auth-success">
                            <div className="auth-success__icon">
                                <FiCheck />
                            </div>
                            <h2 className="auth-form__title">Revisa tu correo</h2>
                            <p className="auth-form__subtitle">
                                Hemos enviado un enlace a:<br />
                                <strong>{email}</strong>
                            </p>
                            <p className="auth-form__hint">
                                El enlace expira en 24 horas.
                            </p>
                            <Link to="/login" className="btn btn--secondary btn--lg">
                                Volver al login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
