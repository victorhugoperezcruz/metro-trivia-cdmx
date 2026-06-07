import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import FlashCard from '../components/FlashCard'
import PracticeMode from '../components/PracticeMode'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

function StudyMode() {
    const { user, token, learnProgress, refreshUser } = useAuth()

    const [lines, setLines] = useState([])
    const [allStations, setAllStations] = useState([])
    const [activeTab, setActiveTab] = useState('explore')
    const [expandedLine, setExpandedLine] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedLine, setSelectedLine] = useState('all')

    // Flashcards state
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0)
    const [shuffleMode, setShuffleMode] = useState(false)
    const [showOnlyUnlearned, setShowOnlyUnlearned] = useState(false)

    // Extrae names de las estaciones aprendidas (desde el servidor si está autenticado, sino desde localStorage)
    const learnedStations = user?.learnedStations?.map(s => s.stationName) || 
                            JSON.parse(localStorage.getItem('metroLearnedStations') || '[]')

    const extractCleanId = (lineName) => {
        if (!lineName) return '?'
        return lineName.replace(/línea\s*/i, '').trim().toUpperCase()
    }

    useEffect(() => {
        const fetchLines = async () => {
            try {
                const response = await api.get('/api/lines')
                const rawData = Array.isArray(response.data) ? response.data : []

                const processedLines = rawData.map(line => {
                    const cleanId = extractCleanId(line.name)
                    return {
                        ...line,
                        _mongoId: line.id || line._id,
                        id: cleanId,
                        stations: Array.isArray(line.stations) ? line.stations : [],
                    }
                })

                setLines(processedLines)

                const stations = []
                processedLines.forEach(line => {
                    line.stations.forEach(station => {
                        const existing = stations.find(s => s.name === station.name)
                        if (existing) {
                            existing.lines.push({ id: line.id, name: line.name, color: line.color })
                        } else {
                            stations.push({
                                ...station,
                                lines: [{ id: line.id, name: line.name, color: line.color }],
                            })
                        }
                    })
                })
                setAllStations(stations)

                const saved = localStorage.getItem('metroLearnedStations')
                if (saved) {
                    localStorage.setItem('metroLearnedStations', saved)
                }
            } catch (error) {
                console.error('Error:', error)
            }
        }
        fetchLines()
    }, [])

    const toggleLine = (lineId) => {
        setExpandedLine(expandedLine === lineId ? null : lineId)
    }

    /**
     * Marca/desmarca una estación como aprendida.
     * Si el usuario está autenticado, persiste en el servidor.
     */
    const toggleLearned = async (stationName, lineName) => {
        const isAlreadyLearned = learnedStations.includes(stationName)
        
        if (!isAlreadyLearned && user && lineName) {
            // Si está autenticado, guardar en servidor
            await learnProgress(lineName, stationName)
        } else if (!user) {
            // Si NO está autenticado, guardar en localStorage
            const updated = isAlreadyLearned
                ? learnedStations.filter(s => s !== stationName)
                : [...learnedStations, stationName]
            localStorage.setItem('metroLearnedStations', JSON.stringify(updated))
            window.location.reload() // Recargar para actualizar
        }
    }

    const filteredLines = lines.filter(line => {
        if (selectedLine !== 'all' && line.id !== selectedLine) return false
        return (
            line.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            line.stations.some(s => (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
        )
    })

    const getFilteredStations = () => {
        let stations = [...allStations]
        if (selectedLine !== 'all') {
            stations = stations.filter(s => s.lines && s.lines.some(l => l.id === selectedLine))
        }
        // FIX: En modo aleatorio, excluir las ya aprendidas para enfocarse en las pendientes
        if (shuffleMode) {
            stations = stations
                .filter(s => !learnedStations.includes(s.name))
                .sort(() => 0.5 - Math.random())
        }
        if (showOnlyUnlearned) {
            stations = stations.filter(s => !learnedStations.includes(s.name))
        }
        return stations
    }

    const flashcardStations = allStations.length > 0 ? getFilteredStations() : []
    const currentFlashcard = flashcardStations.length > 0 ? flashcardStations[currentFlashcardIndex] : null

    const nextFlashcard = () => {
        if (flashcardStations.length > 0) {
            setCurrentFlashcardIndex(prev => (prev + 1) % flashcardStations.length)
        }
    }

    const prevFlashcard = () => {
        if (flashcardStations.length > 0) {
            setCurrentFlashcardIndex(prev => (prev === 0 ? flashcardStations.length - 1 : prev - 1))
        }
    }

    const resetProgress = async () => {
        const confirmed = confirm(
            user
                ? '¿Reiniciar tu progreso? Esto borrará las estaciones aprendidas de tu cuenta.'
                : '¿Reiniciar tu progreso local?'
        )
        if (!confirmed) return

        // Limpiar localStorage
        localStorage.removeItem('metroLearnedStations')

        // Limpiar en la BD si el usuario está autenticado
        if (user && token) {
            try {
                await api.delete('/api/users/progress', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                await refreshUser()  // actualiza AuthContext.user.learnedStations = []
            } catch (err) {
                console.error('Error reiniciando progreso en servidor:', err)
            }
        }
    }

    const progressPercentage = allStations.length > 0
        ? Math.round((learnedStations.length / allStations.length) * 100)
        : 0

    // Función para obtener la primera línea de una estación (para la API de progreso)
    const getFirstLineName = (station) => {
        return station.lines?.[0]?.name || ''
    }

    return (
        <div className="study-page-corporate">
            <style>{`
				.flashcards-view {
					max-width: 420px;
					width: 100%;
					margin: 0 auto;
					text-align: center;
				}
				.flashcards-view img {
					max-width: 100% !important;
					max-height: 200px !important;
					width: auto !important;
					height: auto !important;
					object-fit: contain !important;
					display: block !important;
					margin: 0 auto 1rem auto !important;
					border-radius: 8px;
				}
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
                <Link to="/" className="back-btn-corporate">← Volver al inicio</Link>
            </div>

            {/* Progress Bar */}
            <div className="study-progress-bar">
                <div className="progress-info">
                    <span className="progress-label">Tu progreso:</span>
                    <span className="progress-count">{learnedStations.length} / {allStations.length} estaciones</span>
                    <span className="progress-percent">{progressPercentage}%</span>
                </div>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
                </div>
            </div>

            {/* Tabs */}
            <div className="study-tabs">
                <button className={`study-tab ${activeTab === 'explore' ? 'active' : ''}`} onClick={() => setActiveTab('explore')}>
                    <span className="tab-icon">📚</span>
                    <span className="tab-label">Explorar</span>
                </button>
                <button className={`study-tab ${activeTab === 'flashcards' ? 'active' : ''}`} onClick={() => setActiveTab('flashcards')}>
                    <span className="tab-icon">🎴</span>
                    <span className="tab-label">Flashcards</span>
                    <span className="tab-badge">{flashcardStations.length}</span>
                </button>
                <button className={`study-tab ${activeTab === 'practice' ? 'active' : ''}`} onClick={() => setActiveTab('practice')}>
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
                            onChange={(e) => { setSelectedLine(e.target.value); setCurrentFlashcardIndex(0) }}
                        >
                            <option value="all">Todas las líneas</option>
                            {lines.map(line => (
                                <option key={line.id} value={line.id}>{line.name}</option>
                            ))}
                        </select>

                        {activeTab === 'flashcards' && (
                            <>
                                <button
                                    className={`shuffle-btn ${shuffleMode ? 'active' : ''}`}
                                    onClick={() => { setShuffleMode(!shuffleMode); setCurrentFlashcardIndex(0) }}
                                >
                                    🔀 {shuffleMode ? 'Orden normal' : 'Solo pendientes'}
                                </button>
                                <button
                                    className={`shuffle-btn ${showOnlyUnlearned ? 'active' : ''}`}
                                    style={{ marginLeft: 0 }}
                                    onClick={() => { setShowOnlyUnlearned(!showOnlyUnlearned); setCurrentFlashcardIndex(0) }}
                                >
                                    {showOnlyUnlearned ? '📋 Todas' : '📌 Pendientes'}
                                </button>
                            </>
                        )}

                        <button className="reset-btn" onClick={resetProgress}>🔄 Reiniciar</button>
                    </>
                )}
            </div>

            {/* Content */}
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
                                    <div className="line-icon-simple" style={{ backgroundColor: line.color }}>
                                        {line.id}
                                    </div>
                                    <div className="line-info-corporate">
                                        <h3 className="line-name" style={{ color: line.color }}>{line.name}</h3>
                                        <p className="station-count-corporate">{line.stations.length} estaciones</p>
                                    </div>
                                    <div style={{ fontSize: '1.5rem', color: '#ADB5BD' }}>
                                        {expandedLine === line.id ? '▼' : '▶'}
                                    </div>
                                </div>

                                {expandedLine === line.id && (
                                    <div className="stations-expanded" onClick={e => e.stopPropagation()}>
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
                                                        {/* FIX: e.stopPropagation() evita que se cierre el modal */}
                                                        <button
                                                            className={`station-learn-btn ${isLearned ? 'learned' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                toggleLearned(station.name, line.name)
                                                            }}
                                                            title={isLearned ? 'Quitar de aprendidas' : 'Marcar como aprendida'}
                                                        >
                                                            {isLearned ? '✓' : '+'}
                                                        </button>
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
                {activeTab === 'flashcards' && (
                    <>
                        {flashcardStations.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#7080a0' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                                <p>¡Has aprendido todas las estaciones{selectedLine !== 'all' ? ' de esta línea' : ''}!</p>
                                <button
                                    className="reset-btn"
                                    style={{ marginTop: '1rem' }}
                                    onClick={() => { setShuffleMode(false); setShowOnlyUnlearned(false) }}
                                >
                                    Ver todas las tarjetas
                                </button>
                            </div>
                        ) : (
                            <div className="flashcards-view">
                                <div className="flashcard-header">
                                    <h3>Flashcards de estudio</h3>
                                    <div className="flashcard-counter">
                                        {currentFlashcardIndex + 1} / {flashcardStations.length}
                                        {shuffleMode && <span style={{ marginLeft: '0.5rem', color: '#E83F8D', fontSize: '0.8rem' }}>• Solo pendientes</span>}
                                    </div>
                                </div>

                                {currentFlashcard && (
                                    <FlashCard
                                        station={currentFlashcard}
                                        isLearned={learnedStations.includes(currentFlashcard.name)}
                                        onMarkLearned={() => toggleLearned(currentFlashcard.name, getFirstLineName(currentFlashcard))}
                                    />
                                )}

                                <div className="flashcard-navigation">
                                    <button className="nav-btn prev" onClick={prevFlashcard} disabled={flashcardStations.length <= 1}>
                                        ← Anterior
                                    </button>
                                    <button className="nav-btn next" onClick={nextFlashcard} disabled={flashcardStations.length <= 1}>
                                        Siguiente →
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
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