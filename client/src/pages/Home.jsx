import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className="home-corporate">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    {/* Metro Logo */}
                    <div className="metro-logo">
                        <div className="logo-circle">
                            <span className="logo-m">M</span>
                        </div>
                        <h1 className="logo-text">Metro CDMX</h1>
                    </div>

                    <h2 className="hero-title">
                        Domina el Sistema de Transporte
                    </h2>
                    <p className="hero-subtitle">
                        Aprende las 12 líneas y 195 estaciones del Metro de la Ciudad de México
                    </p>

                    {/* Stats Bar */}
                    <div className="stats-row">
                        <div className="stat-box">
                            <span className="stat-number">12</span>
                            <span className="stat-label">Líneas</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-number">195</span>
                            <span className="stat-label">Estaciones</span>
                        </div>
                        <div className="stat-box">
                            <span className="stat-number">226</span>
                            <span className="stat-label">Kilómetros</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Cards */}
            <div className="action-section">
                <div className="container">
                    <h3 className="section-title">¿Qué deseas hacer?</h3>

                    <div className="action-grid">
                        {/* Study Card */}
                        <Link to="/study" className="action-card">
                            <div className="card-icon study-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                </svg>
                            </div>
                            <h4 className="card-title">Modo Estudio</h4>
                            <p className="card-description">
                                Explora y memoriza todas las líneas y estaciones del sistema
                            </p>
                            <span className="card-action">Comenzar a estudiar →</span>
                        </Link>

                        {/* Game Card */}
                        <Link to="/game" className="action-card">
                            <div className="card-icon game-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                </svg>
                            </div>
                            <h4 className="card-title">Modo Trivia</h4>
                            <p className="card-description">
                                Pon a prueba tus conocimientos con preguntas dinámicas
                            </p>
                            <span className="card-action">Iniciar trivia →</span>
                        </Link>

                        {/* Map Card */}
                        <Link to="/map" className="action-card featured">
                            <div className="card-icon map-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"></path>
                                    <line x1="8" y1="2" x2="8" y2="18"></line>
                                    <line x1="16" y1="6" x2="16" y2="22"></line>
                                </svg>
                            </div>
                            <h4 className="card-title">Mapa Interactivo</h4>
                            <p className="card-description">
                                Navega por la red completa del metro de forma visual e interactiva
                            </p>
                            <span className="card-action">Explorar mapa →</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home