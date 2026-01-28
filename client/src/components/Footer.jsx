import './Footer.css'

function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="footer-title">Metro CDMX Master</h3>
                        <p className="footer-description">
                            Aprende las 12 líneas y 195 estaciones del Sistema de Transporte Colectivo Metro
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">Enlaces Rápidos</h4>
                        <ul className="footer-links">
                            <li><a href="/">Inicio</a></li>
                            <li><a href="/study">Modo Estudio</a></li>
                            <li><a href="/game">Modo Trivia</a></li>
                            <li><a href="/map">Mapa Interactivo</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">Información</h4>
                        <p className="footer-info">
                            Herramienta educativa no oficial
                        </p>
                        <p className="footer-info">
                            12 Líneas • 195 Estaciones • 226 km
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
