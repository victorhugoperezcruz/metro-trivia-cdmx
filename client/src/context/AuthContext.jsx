import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AUTH_URL = 'http://localhost:3000/api/auth'
const USERS_URL = 'http://localhost:3000/api/users'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(() => localStorage.getItem('metro_token'))
    const [loading, setLoading] = useState(true)

    // Cabecera de auth reutilizable
    const authHeader = (tkn = token) => ({ Authorization: `Bearer ${tkn}` })

    // Al montar: verificar sesión con token guardado
    useEffect(() => {
        const verifySession = async () => {
            if (!token) { setLoading(false); return }
            try {
                const res = await axios.get(`${AUTH_URL}/me`, { headers: authHeader() })
                setUser(res.data)
            } catch {
                localStorage.removeItem('metro_token')
                setToken(null)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        verifySession()
    }, [token])

    const register = async (username, email, password) => {
        const res = await axios.post(`${AUTH_URL}/register`, { username, email, password })
        localStorage.setItem('metro_token', res.data.token)
        setToken(res.data.token)
        setUser(res.data.user)
        return res.data
    }

    const login = async (email, password) => {
        const res = await axios.post(`${AUTH_URL}/login`, { email, password })
        localStorage.setItem('metro_token', res.data.token)
        setToken(res.data.token)
        setUser(res.data.user)
        return res.data
    }

    const logout = () => {
        localStorage.removeItem('metro_token')
        setToken(null)
        setUser(null)
    }

    const updateHighScore = async (score) => {
        if (!token) return
        try {
            const res = await axios.put(
                `${AUTH_URL}/highscore`,
                { score },
                { headers: authHeader() }
            )
            setUser(prev => ({ ...prev, highScore: res.data.highScore }))
        } catch (err) {
            console.error('Error actualizando highscore:', err)
        }
    }

    /**
     * Marca una estación como aprendida en el servidor (idempotente).
     * @param {string} lineName    - Ej: "Línea 1"
     * @param {string} stationName - Ej: "Pantitlán"
     * @returns {{ alreadyLearned, total } | null}
     */
    const learnProgress = async (lineName, stationName) => {
        if (!token) return null
        try {
            const res = await axios.patch(
                `${USERS_URL}/progress`,
                { lineName, stationName },
                { headers: authHeader() }
            )
            // Actualizar learnedStations en el estado local sin re-fetch
            if (!res.data.alreadyLearned) {
                setUser(prev => ({
                    ...prev,
                    learnedStations: [
                        ...(prev.learnedStations || []),
                        { lineName, stationName },
                    ],
                }))
            }
            return res.data
        } catch (err) {
            console.error('Error guardando progreso:', err)
            return null
        }
    }

    /**
     * Fuerza re-fetch de /me para sincronizar datos frescos del servidor.
     */
    const refreshUser = async () => {
        if (!token) return
        try {
            const res = await axios.get(`${AUTH_URL}/me`, { headers: authHeader() })
            setUser(res.data)
        } catch {
            logout()
        }
    }

    return (
        <AuthContext.Provider value={{
            user, token, loading,
            register, login, logout,
            updateHighScore, learnProgress, refreshUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
