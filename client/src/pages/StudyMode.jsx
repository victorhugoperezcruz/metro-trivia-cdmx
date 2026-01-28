import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import FlashCard from '../components/FlashCard'
import PracticeMode from '../components/PracticeMode'

function StudyMode() {
    const [lines, setLines] = useState([])
    const [allStations, setAllStations] = useState([])
    const [activeTab, setActiveTab] = useState('explore')
    const [expandedLine, setExpandedLine] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedLine, setSelectedLine] = useState('all')

    // Flashcards state
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
    const [learnedStations, setLearnedStations] = useState([])
    const [shuffleMode, setShuffleMode] = useState(false)

    // HELPER: Extraer nombre corto (ej: "Línea 1" -> "1")
    // Lo definimos fuera o dentro, pero lo usaremos para limpiar los datos al inicio
    const extractCleanId = (lineName) => {
        if (!lineName) return '?';
        // Elimina "Línea" (case insensitive) y espacios, toma lo que queda (letras o números)
        return lineName.replace(/línea\s*/i, '').trim().toUpperCase();
    }

    useEffect(() => {
        const fetchLines = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/lines')
                const rawData = Array.isArray(response.data) ? response.data : []

                // 1. PROCESAMIENTO PREVIO: Limpiamos los IDs para toda la app
                // Creamos una versión de los datos donde el 'id' es legible (ej: "1" en vez de "659a...")
                const processedLines = rawData.map(line => {
                    const cleanId = extractCleanId(line.name);
                    return {
                        ...line,
                        // Sobreescribimos el ID de mongo con el nombre corto para visualización
                        // Guardamos el original en _mongoId por si acaso se necesita
                        _mongoId: line.id || line._id,
                        id: cleanId,
                        // Aseguramos que stations exista
                        stations: Array.isArray(line.stations) ? line.stations : []
                    };
                });

                setLines(processedLines)

                // 2. Extraer estaciones usando los IDs limpios
                const stations = []
                processedLines.forEach(line => {
                    line.stations.forEach(station => {
                        const existing = stations.find(s => s.name === station.name)

                        if (existing) {
                            existing.lines.push({ id: line.id, name: line.name, color: line.color })
                        } else {
                            stations.push({
                                ...station,
                                lines: [{ id: line.id, name: line.name, color: line.color }]
                            })
                        }
                    })
                })
                setAllStations(stations)

                const saved = localStorage.getItem('metroLearnedStations')
                if (saved) {
                    setLearnedStations(JSON.parse(saved))
                }
            } catch (error) {
                console.error("Error:", error)
            }
        }
        fetchLines()
    }, [])

    useEffect(() => {
        localStorage.setItem('metroLearnedStations', JSON.stringify(learnedStations))
    }, [learnedStations])

    const toggleLine = (lineId) => {
        setExpandedLine(expandedLine === lineId ? null : lineId)
    }

    const toggleLearned = (stationName) => {
        setLearnedStations(prev => {
            if (prev.includes(stationName)) {
                return prev.filter(s => s !== stationName)
            } else {
                return [...prev, stationName]
            }
        })
    }

    const filteredLines = lines.filter(line => {
        if (selectedLine !== 'all' && line.id !== selectedLine) return false

        return line.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            line.stations.some(station =>
                (station.name || '').toLowerCase().includes(searchTerm.toLowerCase())
            )
    })

    const getFilteredStations = () => {
        let stations = [...allStations]
        if (selectedLine !== 'all') {
            stations = stations.filter(s => s.lines && s.lines.some(l => l.id === selectedLine))
        }
        if (shuffleMode) {
            stations = stations.sort(() => 0.5 - Math.random())
        }
        return stations
    }

    const flashcardStations = allStations.length > 0 ? getFilteredStations() : []
    const currentFlashcard = flashcardStations.length > 0 ? flashcardStations[currentFlashcardIndex] : null

    const nextFlashcard = () => {
        if (flashcardStations.length > 0) {
            setCurrentFlashcardIndex((prev) =>
                (prev + 1) % flashcardStations.length
            )
        }
    }

    const prevFlashcard = () => {
        if (flashcardStations.length > 0) {
            setCurrentFlashcardIndex((prev) =>
                prev === 0 ? flashcardStations.length - 1 : prev - 1
            )
        }
    }

    const resetProgress = () => {
        if (confirm('¿Estás seguro de que quieres reiniciar tu progreso?')) {
            setLearnedStations([])
            localStorage.removeItem('metroLearnedStations')
        }
    }

    const progressPercentage = allStations.length > 0
        ? Math.round((learnedStations.length / allStations.length) * 100)
        : 0

    return (
        <div className="study-page-corporate">
            {/* ESTILOS DE EMERGENCIA */}
            {/* Usamos !important para asegurar que sobrescriban cualquier estilo del componente hijo */}
            <style>{`
                .flashcards-view {
                    max-width: 400px; /* Tarjeta más angosta para que se vea elegante */
                    width: 100%;
                    margin: 0 auto;
                    text-align: center;
                }
                
                /* Forzamos a TODAS las imágenes dentro de flashcards-view a comportarse */
                .flashcards-view img {
                    max-width: 100% !important;
                    max-height: 200px !important; /* Altura máxima fija */
                    width: auto !important;
                    height: auto !important;
                    object-fit: contain !important; /* Mantiene proporción sin estirar */
                    display: block !important;
                    margin: 0 auto 1rem auto !important;
                    border-radius: 8px;
                }

                /* Ajuste para las imágenes en la lista de explorar también */
                .line-card-corporate img, .station-card-explore img {
                     max-height: 50px;
                     width: auto;
                }
            `}</style>

            {/* Header */}
            <div className="page-header">
                <div className="page-title-section">
                    <h1 className="page-title">📖 Modo Estudio Interactivo</h1>
                    <p className="page-subtitle">Aprende de manera divertida con 3 modos diferentes</p>
                </div>
                <Link to="/" className="back-btn-corporate">
                    ← Volver al inicio
                </Link>
            </div>

            {/* Progress Bar */}
            <div className="study-progress-bar">
                <div className="progress-info">
                    <span className="progress-label">Tu progreso:</span>
                    <span className="progress-count">{learnedStations.length} / {allStations.length} estaciones</span>
                    <span className="progress-percent">{progressPercentage}%</span>
                </div>
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="study-tabs">
                <button
                    className={`study-tab ${activeTab === 'explore' ? 'active' : ''}`}
                    onClick={() => setActiveTab('explore')}
                >
                    <span className="tab-icon">📚</span>
                    <span className="tab-label">Explorar</span>
                </button>

                <button
                    className={`study-tab ${activeTab === 'flashcards' ? 'active' : ''}`}
                    onClick={() => setActiveTab('flashcards')}
                >
                    <span className="tab-icon">🎴</span>
                    <span className="tab-label">Flashcards</span>
                    <span className="tab-badge">{flashcardStations.length}</span>
                </button>

                <button
                    className={`study-tab ${activeTab === 'practice' ? 'active' : ''}`}
                    onClick={() => setActiveTab('practice')}
                >
                    <span className="tab-icon">✅</span>
                    <span className="tab-label">Práctica</span>
                </button>
            </div>

            {/* Controls */}
            <div className="study-controls">
                {activeTab !== 'practice' && (
                    <>
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Buscar línea o estación..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            className="line-filter"
                            value={selectedLine}
                            onChange={(e) => setSelectedLine(e.target.value)}
                        >
                            <option value="all">Todas las líneas</option>
                            {lines.map(line => (
                                <option key={line.id} value={line.id}>{line.name}</option>
                            ))}
                        </select>

                        {activeTab === 'flashcards' && (
                            <button
                                className={`shuffle-btn ${shuffleMode ? 'active' : ''}`}
                                onClick={() => {
                                    setShuffleMode(!shuffleMode)
                                    setCurrentFlashcardIndex(0)
                                }}
                            >
                                🔀 {shuffleMode ? 'Orden normal' : 'Aleatorio'}
                            </button>
                        )}

                        <button className="reset-btn" onClick={resetProgress}>
                            🔄 Reiniciar progreso
                        </button>
                    </>
                )}
            </div>

            {/* Content based on active tab */}
            <div className="study-content">
                {/* EXPLORE MODE */}
                {activeTab === 'explore' && (
                    <div className="lines-grid-corporate">
                        {filteredLines.map((line) => (
                            <div
                                key={line.id}
                                className={`line-card-corporate ${expandedLine === line.id ? 'expanded' : ''}`}
                                onClick={() => toggleLine(line.id)}
                            >
                                <div className="line-card-header-corporate">
                                    <div
                                        className="line-icon-simple"
                                        style={{ backgroundColor: line.color }}
                                    >
                                        {line.id}
                                    </div>
                                    <div className="line-info-corporate">
                                        <h3 className="line-name" style={{ color: line.color }}>
                                            {line.name}
                                        </h3>
                                        <p className="station-count-corporate">
                                            {line.stations.length} estaciones
                                        </p>
                                    </div>
                                    <div style={{ fontSize: '1.5rem', color: '#ADB5BD' }}>
                                        {expandedLine === line.id ? '▼' : '▶'}
                                    </div>
                                </div>

                                {expandedLine === line.id && (
                                    <div className="stations-expanded">
                                        <div className="stations-grid-explore">
                                            {line.stations.map((station, index) => {
                                                const isLearned = learnedStations.includes(station.name)
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`station-card-explore ${isLearned ? 'learned' : ''}`}
                                                    >
                                                        <div className="station-index">{index + 1}</div>
                                                        <div className="station-name-explore">{station.name}</div>
                                                        {isLearned && <div className="learned-badge">✓</div>}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* FLASHCARDS MODE */}
                {activeTab === 'flashcards' && currentFlashcard && (
                    <div className="flashcards-view">
                        <div className="flashcard-header">
                            <h3>Flashcards de estudio</h3>
                            <div className="flashcard-counter">
                                {currentFlashcardIndex + 1} / {flashcardStations.length}
                            </div>
                        </div>

                        {/* El componente FlashCard renderiza el ID que le pasamos.
                            Como ya limpiamos el ID en el useEffect, ahora mostrará "1" o "B" 
                            en lugar del hash largo. */}
                        <FlashCard
                            station={currentFlashcard}
                            isLearned={learnedStations.includes(currentFlashcard.name)}
                            onMarkLearned={() => toggleLearned(currentFlashcard.name)}
                        />

                        <div className="flashcard-navigation">
                            <button
                                className="nav-btn prev"
                                onClick={prevFlashcard}
                                disabled={flashcardStations.length <= 1}
                            >
                                ← Anterior
                            </button>
                            <button
                                className="nav-btn next"
                                onClick={nextFlashcard}
                                disabled={flashcardStations.length <= 1}
                            >
                                Siguiente →
                            </button>
                        </div>
                    </div>
                )}

                {/* PRACTICE MODE */}
                {activeTab === 'practice' && allStations.length > 0 && (
                    <PracticeMode allStations={allStations} />
                )}
            </div>
        </div>
    )
}

export default StudyMode