import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Componente de ruta protegida.
 * Si el usuario no está autenticado, redirige a /login.
 * Mientras se verifica la sesión (loading), no renderiza nada.
 */
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) return null  // Evita el flash de "no autenticado" durante verificación

    if (!user) return <Navigate to="/login" replace />

    return children
}

export default ProtectedRoute
