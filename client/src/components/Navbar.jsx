import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <div className="navbar-logo-circle">
                        <span>M</span>
                    </div>
                    <span className="navbar-logo-text">Metro CDMX</span>
                </Link>

                <div className="navbar-links">
                    <Link
                        to="/"
                        className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        Inicio
                    </Link>
                    <Link
                        to="/study"
                        className={`navbar-link ${location.pathname === '/study' ? 'active' : ''}`}
                    >
                        Estudio
                    </Link>
                    <Link
                        to="/game"
                        className={`navbar-link ${location.pathname === '/game' ? 'active' : ''}`}
                    >
                        Trivia
                    </Link>
                    <Link
                        to="/map"
                        className={`navbar-link ${location.pathname === '/map' ? 'active' : ''}`}
                    >
                        Mapa
                    </Link>
                    <Link
                        to="/leaderboard"
                        className={`navbar-link ${location.pathname === '/leaderboard' ? 'active' : ''}`}
                    >
                        🏆 Ranking
                    </Link>
                </div>

                <div className="navbar-auth">
                    {user ? (
                        <div className="navbar-user">
                            <Link to="/profile" className="navbar-username">
                                👤 {user.username}
                            </Link>
                            <span className="navbar-highscore">⭐ {user.highScore}</span>
                            <button className="navbar-logout-btn" onClick={handleLogout}>
                                Salir
                            </button>
                        </div>
                    ) : (
                        <div className="navbar-auth-links">
                            <Link
                                to="/login"
                                className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
                            >
                                Iniciar sesión
                            </Link>
                            <Link to="/register" className="navbar-register-btn">
                                Registro
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
