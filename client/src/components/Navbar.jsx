import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    const location = useLocation()

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
                </div>
            </div>
        </nav>
    )
}

export default Navbar
