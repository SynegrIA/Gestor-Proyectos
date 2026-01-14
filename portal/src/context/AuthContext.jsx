import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// Roles del sistema
export const ROLES = {
    OWNER: 'owner',
    ADMIN: 'admin',
    CONSULTOR: 'consultor',
    CLIENTE: 'cliente'
}

// Mock user data for development
const MOCK_USERS = {
    'cliente@acme.com': {
        id: 1,
        email: 'cliente@acme.com',
        name: 'Juan García',
        role: ROLES.CLIENTE,
        company: 'ACME Corporation',
        avatar: 'JG'
    },
    'consultor@synergia.com': {
        id: 2,
        email: 'consultor@synergia.com',
        name: 'María López',
        role: ROLES.CONSULTOR,
        company: 'Synergia',
        avatar: 'ML'
    },
    'admin@synergia.com': {
        id: 3,
        email: 'admin@synergia.com',
        name: 'Carlos Admin',
        role: ROLES.ADMIN,
        company: 'Synergia',
        avatar: 'CA'
    },
    'owner@synergia.com': {
        id: 4,
        email: 'owner@synergia.com',
        name: 'Ana Owner',
        role: ROLES.OWNER,
        company: 'Synergia',
        avatar: 'AO'
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
        } else {
            localStorage.removeItem('user')
        }
    }, [user])

    const login = async (email, password) => {
        setLoading(true)
        setError(null)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))

        const mockUser = MOCK_USERS[email.toLowerCase()]

        if (mockUser && password === '123456') {
            setUser(mockUser)
            setLoading(false)
            return { success: true, user: mockUser }
        } else {
            setError('Email o contraseña incorrectos')
            setLoading(false)
            return { success: false, error: 'Email o contraseña incorrectos' }
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
    }

    const isAuthenticated = !!user
    const isCliente = user?.role === ROLES.CLIENTE
    const isConsultor = user?.role === ROLES.CONSULTOR
    const isAdmin = user?.role === ROLES.ADMIN || user?.role === ROLES.OWNER
    const isOwner = user?.role === ROLES.OWNER
    
    // Helper para verificar si puede acceder a módulos de administración
    const canAccessAdmin = isAdmin || isOwner

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            logout,
            isAuthenticated,
            isCliente,
            isConsultor,
            isAdmin,
            isOwner,
            canAccessAdmin,
            ROLES
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
