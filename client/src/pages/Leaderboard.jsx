import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './Leaderboard.css'

const MEDALS = ['🥇', '🥈', '🥉']

function Leaderboard() {
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        axios.get('http://localhost:3000/api/users/leaderboard')
            .then(res => {
                setPlayers(res.data)
                setLoading(false)
            })
            .catch(() => {
                setError('No se pudo cargar el ranking. ¿Está el servidor activo?')
                setLoading(false)
            })
    }, [])

    if (loading) return (
        <div className="leaderboard-page">
            <div className="lb-loader">
                <div className="lb-spinner"></div>
                <p>Cargando ranking...</p>
            </div>
        </div>
    )

    return (
        <div className="leaderboard-page">
            {/* Header */}
            <div className="lb-header">
                <Link to="/" className="lb-back">← Inicio</Link>
                <div className="lb-title-block">
                    <h1 className="lb-title">🏆 Ranking Global</h1>
                    <p className="lb-subtitle">Los mejores conocedores del Metro CDMX</p>
                </div>
            </div>

            {error && (
                <div className="lb-error">{error}</div>
            )}

            {!error && players.length === 0 && (
                <div className="lb-empty">
                    <div className="lb-empty-icon">🎮</div>
                    <p>¡Sé el primero en el ranking! Juega la trivia y registra tu puntaje.</p>
                    <Link to="/game" className="lb-play-btn">Jugar ahora</Link>
                </div>
            )}

            {players.length > 0 && (
                <div className="lb-container">
                    {/* Podio — top 3 */}
                    {players.length >= 1 && (
                        <div className="lb-podium">
                            {players.slice(0, Math.min(3, players.length)).map((player, index) => (
                                <div
                                    key={player._id}
                                    className={`lb-podium-slot lb-podium-slot--${index + 1}`}
                                    style={{ order: index === 0 ? 2 : index === 1 ? 1 : 3 }}
                                >
                                    <div className="lb-podium-medal">{MEDALS[index]}</div>
                                    <div
                                        className="lb-podium-avatar"
                                        style={{ background: player.profileConfig?.avatarColor || '#1a3a6a' }}
                                    >
                                        <span>{player.username.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div className="lb-podium-name">{player.username}</div>
                                    <div className="lb-podium-score">{player.highScore} pts</div>
                                    {player.achievements?.length > 0 && (
                                        <div className="lb-podium-badges" title={`${player.achievements.length} logros`}>
                                            {'🏅'.repeat(Math.min(player.achievements.length, 5))}
                                        </div>
                                    )}
                                    <div className={`lb-podium-base lb-podium-base--${index + 1}`}>
                                        #{index + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tabla completa */}
                    <div className="lb-table-wrapper">
                        <table className="lb-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Jugador</th>
                                    <th>Puntaje</th>
                                    <th>Logros</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.map((player, index) => (
                                    <tr
                                        key={player._id}
                                        className={`lb-row ${index < 3 ? 'lb-row--top' : ''}`}
                                    >
                                        <td className="lb-rank">
                                            {MEDALS[index] || <span className="lb-rank-num">#{index + 1}</span>}
                                        </td>
                                        <td className="lb-player">
                                            <div
                                                className="lb-player-avatar"
                                                style={{ background: player.profileConfig?.avatarColor || '#0066CC' }}
                                            >
                                                {player.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="lb-player-name">{player.username}</span>
                                        </td>
                                        <td className="lb-score">{player.highScore.toLocaleString()} pts</td>
                                        <td className="lb-achievements">
                                            <span className="lb-badge-count">
                                                🏅 {player.achievements?.length || 0}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Leaderboard
