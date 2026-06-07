import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'
import './Profile.css'

// --- Sistema de rangos ---
const RANKS = [
    { min: 0, label: 'Pasajero', emoji: '🚇', color: '#9090b0' },
    { min: 5, label: 'Viajero', emoji: '🗺️', color: '#4CAF50' },
    { min: 20, label: 'Explorador', emoji: '🧭', color: '#2196F3' },
    { min: 50, label: 'Conocedor', emoji: '📚', color: '#9C27B0' },
    { min: 100, label: 'Experto', emoji: '⭐', color: '#FF9800' },
    { min: 150, label: 'Maestro', emoji: '🏆', color: '#F44336' },
    { min: 195, label: 'Leyenda', emoji: '🌟', color: '#FFD700' },
]

function getRank(learnedCount) {
    let rank = RANKS[0]
    for (const r of RANKS) {
        if (learnedCount >= r.min) rank = r
    }
    return rank
}

// Paleta de colores de avatar
const AVATAR_COLORS = [
    '#0066CC', '#E83F8D', '#AF9800', '#009A44',
    '#DA291C', '#E37C00', '#9E2064', '#5C352D',
    '#6BC1B6', '#B0B3B2', '#C0992F', '#FFD600',
]

function Profile() {
    const { user, token, logout, refreshUser } = useAuth()
    const navigate = useNavigate()

    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [saving, setSaving] = useState(false)
    const [saveMsg, setSaveMsg] = useState('')

    // Formulario de edición
    const [form, setForm] = useState({ username: '', favoriteLine: '', avatarColor: '#0066CC' })

    useEffect(() => {
        if (!token) { navigate('/login'); return }
        fetchProfile()
    }, [token])

    const fetchProfile = async () => {
        setLoading(true)
        try {
            const res = await api.get('/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` },
            })
            setProfile(res.data)
            setForm({
                username: res.data.user.username,
                favoriteLine: res.data.user.profileConfig?.favoriteLine || '',
                avatarColor: res.data.user.profileConfig?.avatarColor || '#0066CC',
            })
        } catch {
            setError('No se pudieron cargar los datos del perfil.')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setSaveMsg('')
        try {
            await api.put(
                '/api/users/profile',
                { username: form.username, favoriteLine: form.favoriteLine, avatarColor: form.avatarColor },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setSaveMsg('✅ Perfil actualizado correctamente.')
            await refreshUser()
            fetchProfile()
        } catch (err) {
            setSaveMsg(`❌ ${err.response?.data?.error || 'Error al guardar.'}`)
        } finally {
            setSaving(false)
        }
    }

    const handleLogout = () => { logout(); navigate('/') }

    if (loading) return (
        <div className="profile-page">
            <div className="profile-loader">
                <div className="profile-spinner"></div>
                <p>Cargando perfil...</p>
            </div>
        </div>
    )

    if (error) return (
        <div className="profile-page">
            <div className="profile-error">{error}</div>
        </div>
    )

    const rank = getRank(profile.progress.learnedTotal)
    const avatarColor = form.avatarColor
    const initial = (profile.user.username || 'U').charAt(0).toUpperCase()

    return (
        <div className="profile-page">

            {/* ── HERO ── */}
            <div className="profile-hero">
                <Link to="/" className="profile-back">← Inicio</Link>

                <div className="profile-avatar" style={{ background: avatarColor }}>
                    {initial}
                </div>

                <h1 className="profile-username">{profile.user.username}</h1>

                <div className="profile-rank" style={{ color: rank.color }}>
                    <span className="profile-rank-emoji">{rank.emoji}</span>
                    <span className="profile-rank-label">{rank.label}</span>
                </div>

                <div className="profile-meta">
                    <span>🏆 {profile.user.highScore} pts</span>
                    <span>🏅 {profile.user.achievements.length} logros</span>
                    <span>📅 Desde {new Date(profile.user.createdAt).toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}</span>
                </div>
            </div>

            <div className="profile-body">

                {/* ── ESTADÍSTICAS GLOBALES ── */}
                <section className="profile-card">
                    <h2 className="profile-card-title">📊 Progreso General</h2>
                    <div className="profile-global-stats">
                        <div className="profile-stat-big">
                            <span className="psb-value">{profile.progress.learnedTotal}</span>
                            <span className="psb-label">Aprendidas</span>
                        </div>
                        <div className="profile-stat-big">
                            <span className="psb-value">{profile.progress.totalStations}</span>
                            <span className="psb-label">Total</span>
                        </div>
                        <div className="profile-stat-big">
                            <span className="psb-value" style={{ color: rank.color }}>{profile.progress.percent}%</span>
                            <span className="psb-label">Completado</span>
                        </div>
                    </div>
                    {/* Barra de progreso global */}
                    <div className="profile-progress-track">
                        <div
                            className="profile-progress-fill"
                            style={{ width: `${profile.progress.percent}%`, background: rank.color }}
                        ></div>
                    </div>
                    <p className="profile-next-rank">
                        {(() => {
                            const nextRankIdx = RANKS.findIndex(r => r.min > profile.progress.learnedTotal)
                            if (nextRankIdx === -1) return '🌟 ¡Has alcanzado el rango máximo!'
                            const next = RANKS[nextRankIdx]
                            return `Siguiente rango: ${next.emoji} ${next.label} (${next.min - profile.progress.learnedTotal} estaciones más)`
                        })()}
                    </p>
                </section>

                {/* ── PROGRESO POR LÍNEA ── */}
                <section className="profile-card">
                    <h2 className="profile-card-title">🚇 Progreso por Línea</h2>
                    <div className="profile-lines-list">
                        {profile.progress.byLine.map(line => (
                            <div key={line.lineName} className="profile-line-row">
                                <div className="pline-header">
                                    <span className="pline-name">{line.lineName}</span>
                                    <span className="pline-fraction">{line.learned}/{line.total}</span>
                                    <span className="pline-percent">{line.percent}%</span>
                                </div>
                                <div className="pline-track">
                                    <div
                                        className="pline-fill"
                                        style={{ width: `${line.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── LOGROS ── */}
                {profile.user.achievements.length > 0 && (
                    <section className="profile-card">
                        <h2 className="profile-card-title">🏅 Mis Logros</h2>
                        <div className="profile-achievements-grid">
                            {profile.user.achievements.map(ach => (
                                <div key={ach.id} className="profile-achievement-badge">
                                    <span className="pach-icon">🏅</span>
                                    <div>
                                        <div className="pach-name">{ach.name}</div>
                                        {ach.description && <div className="pach-desc">{ach.description}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── EDITAR PERFIL ── */}
                <section className="profile-card">
                    <h2 className="profile-card-title">✏️ Editar Perfil</h2>

                    {saveMsg && (
                        <div className={`profile-save-msg ${saveMsg.includes('✅') ? 'ok' : 'err'}`}>
                            {saveMsg}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="profile-form">
                        <div className="profile-field">
                            <label>Nombre de usuario</label>
                            <input
                                type="text"
                                value={form.username}
                                onChange={e => setForm({ ...form, username: e.target.value })}
                                minLength={3}
                                maxLength={20}
                                required
                            />
                        </div>

                        <div className="profile-field">
                            <label>Línea favorita</label>
                            <select
                                value={form.favoriteLine}
                                onChange={e => setForm({ ...form, favoriteLine: e.target.value })}
                            >
                                <option value="">— Selecciona una línea —</option>
                                {profile.progress.byLine.map(l => (
                                    <option key={l.lineName} value={l.lineName}>{l.lineName}</option>
                                ))}
                            </select>
                        </div>

                        <div className="profile-field">
                            <label>Color de avatar</label>
                            <div className="profile-color-picker">
                                {AVATAR_COLORS.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`profile-color-swatch ${form.avatarColor === color ? 'selected' : ''}`}
                                        style={{ background: color }}
                                        onClick={() => setForm({ ...form, avatarColor: color })}
                                        aria-label={color}
                                    />
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="profile-save-btn" disabled={saving}>
                            {saving ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </form>
                </section>

                {/* ── SESIÓN ── */}
                <div className="profile-session">
                    <button className="profile-logout-btn" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Profile
