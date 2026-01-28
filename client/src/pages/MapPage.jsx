import MetroMap from '../components/MetroMap'
import { Link } from 'react-router-dom'

function MapPage() {
    return (
        <div className="map-page-corporate">
            {/* Page Header */}
            <div className="page-header">
                <div className="breadcrumb">
                    <Link to="/">Inicio</Link>
                    <span> /</span>
                    <span> Mapa Interactivo</span>
                </div>
            </div>

            <div className="page-header" style={{ marginTop: 0 }}>
                <div className="page-title-section">
                    <h1 className="page-title">🗺️ Mapa Interactivo del Metro</h1>
                    <p className="page-subtitle">
                        Explora las 12 líneas y 195 estaciones de forma visual. Haz clic en cualquier estación para ver su información.
                    </p>
                </div>
                <Link to="/" className="back-btn-corporate">
                    ← Volver al inicio
                </Link>
            </div>

            {/* Map Container */}
            <div className="map-container-corporate">
                <MetroMap />
            </div>
        </div>
    )
}

export default MapPage