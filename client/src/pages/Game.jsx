import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getStationLogoUrl } from '../utils/stationLogo'
import './Game.css'

// --- Definición de logros ---
const ACHIEVEMENTS_DEF = [
  { id: 'first_correct', name: '¡Primera Respuesta!', description: 'Responde tu primera pregunta correctamente.' },
  { id: 'streak_5', name: 'Racha x5', description: 'Consigue una racha de 5 respuestas correctas.' },
  { id: 'streak_10', name: '¡Imparable! x10', description: 'Consigue una racha de 10 respuestas correctas.' },
  { id: 'score_50', name: 'Metro Junior', description: 'Alcanza 50 puntos en una sesión.' },
  { id: 'score_100', name: 'Metro Experto', description: 'Alcanza 100 puntos en una sesión.' },
  { id: 'score_200', name: 'Metro Master', description: '¡Alcanza 200 puntos en una sesión!' },
  { id: 'visual_5', name: 'Ojo de Águila', description: 'Identifica 5 estaciones por su logo.' },
]

function Game() {
  const { user, token, updateHighScore } = useAuth()
  const [lines, setLines] = useState([])
  const [question, setQuestion] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [visualCorrect, setVisualCorrect] = useState(0)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [toast, setToast] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)  // para resaltar botón incorrecto
  // Pre-seeded con los IDs de logros ya ganados: bloquea toasts duplicados al refrescar
  const unlockedRef = useRef(
    new Set((user?.achievements || []).map(a => a.id))
  )

  // Si user carga después del montaje (verificación JWT async), sincronizar el Set
  useEffect(() => {
    if (user?.achievements) {
      user.achievements.forEach(a => unlockedRef.current.add(a.id))
    }
  }, [user])

  useEffect(() => {
    axios.get('http://localhost:3000/api/lines')
      .then(res => {
        setLines(res.data)
        setLoading(false)
        generateQuestion(res.data)
      })
      .catch(err => console.error(err))
  }, [])

  // ---- Lógica de logros ----
  const tryUnlock = (achievementId, score, streak, visualCorrect) => {
    if (unlockedRef.current.has(achievementId)) return
    const def = ACHIEVEMENTS_DEF.find(a => a.id === achievementId)
    if (!def) return

    // Verificar condición
    const conditions = {
      first_correct: questionsAnswered === 0,
      streak_5: streak === 5,
      streak_10: streak === 10,
      score_50: score >= 50,
      score_100: score >= 100,
      score_200: score >= 200,
      visual_5: visualCorrect >= 5,
    }
    if (!conditions[achievementId]) return

    unlockedRef.current.add(achievementId)
    showToast(def)

    // Guardar en servidor si está autenticado
    if (user && token) {
      axios.post(
        'http://localhost:3000/api/users/achievements',
        { id: def.id, name: def.name, description: def.description },
        { headers: { Authorization: `Bearer ${token}` } }
      ).catch(() => { })
    }
  }

  const showToast = (achievement) => {
    setToast(achievement)
    setTimeout(() => setToast(null), 3500)
  }

  // ---- Generador de preguntas (4 tipos) ----
  const generateQuestion = (data) => {
    setMessage('')
    setShowFeedback(false)
    setSelectedAnswer(null)

    const questionType = Math.floor(Math.random() * 4)
    const randomLine = data[Math.floor(Math.random() * data.length)]
    let newQuestion = {}

    switch (questionType) {
      // Tipo 0: ¿A qué línea pertenece la estación X?
      case 0: {
        const randomStation = randomLine.stations[Math.floor(Math.random() * randomLine.stations.length)]
        // Excluir líneas que TAMBIÉN contienen esa estación (correspondencias)
        const otherLines = data
          .filter(l => l._id !== randomLine._id)
          .filter(l => !l.stations.some(s => s.name === randomStation.name)) // sin ambigüedad
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
        if (otherLines.length < 3) return generateQuestion(data) // por si no hay suficientes
        newQuestion = {
          type: 'text',
          title: `¿A qué línea pertenece la estación "${randomStation.name}"?`,
          correctAnswer: randomLine.name,
          color: '#3a3a5a',          // neutral: no revela la respuesta
          correctColor: randomLine.color, // se usa DESPUÉS de responder
          options: [randomLine.name, ...otherLines.map(l => l.name)].sort(() => 0.5 - Math.random()),
        }
        break
      }

      // Tipo 1: ¿Qué sigue después de X en la Línea Y?
      case 1: {
        if (randomLine.stations.length < 2) return generateQuestion(data)
        const idx = Math.floor(Math.random() * (randomLine.stations.length - 1))
        const current = randomLine.stations[idx]
        const next = randomLine.stations[idx + 1]
        // Determinar la dirección (terminal hacia la que va)
        const firstStation = randomLine.stations[0]
        const lastStation = randomLine.stations[randomLine.stations.length - 1]
        const direction = idx < randomLine.stations.length / 2 ? lastStation.name : firstStation.name
        const distractors = randomLine.stations
          .filter(s => s.name !== next.name && s.name !== current.name)
          .sort(() => 0.5 - Math.random()).slice(0, 3).map(s => s.name)
        newQuestion = {
          type: 'text',
          title: `En la ${randomLine.name} hacia ${direction}: ¿Qué sigue después de "${current.name}"?`,
          correctAnswer: next.name,
          color: randomLine.color,
          options: [next.name, ...distractors].sort(() => 0.5 - Math.random()),
        }
        break
      }

      // Tipo 2: ¿Qué estación tiene este significado?
      case 2: {
        const validStations = randomLine.stations.filter(s => s.meaning && s.meaning.length > 20)
        if (validStations.length === 0) return generateQuestion(data)
        const cultural = validStations[Math.floor(Math.random() * validStations.length)]
        const distractors = data.flatMap(l => l.stations)
          .filter(s => s.name !== cultural.name)
          .sort(() => 0.5 - Math.random()).slice(0, 3).map(s => s.name)
        newQuestion = {
          type: 'text',
          title: `¿Qué estación tiene este significado?\n"${cultural.meaning.substring(0, 90)}..."`,
          correctAnswer: cultural.name,
          color: '#3a3a5a',
          options: [cultural.name, ...distractors].sort(() => 0.5 - Math.random()),
        }
        break
      }

      // Tipo 3: ¡VISUAL! — muestra el logo, identifica la estación
      case 3: {
        const allStations = data.flatMap(l => l.stations)
        const randomStation = allStations[Math.floor(Math.random() * allStations.length)]
        const distractors = allStations
          .filter(s => s.name !== randomStation.name)
          .sort(() => 0.5 - Math.random()).slice(0, 3).map(s => s.name)
        newQuestion = {
          type: 'visual',
          title: '¿A qué estación corresponde este logo?',
          logoUrl: getStationLogoUrl(randomStation.name),
          stationName: randomStation.name,
          correctAnswer: randomStation.name,
          color: randomLine.color,
          options: [randomStation.name, ...distractors].sort(() => 0.5 - Math.random()),
        }
        break
      }

      default:
        break
    }

    setQuestion(newQuestion)
  }

  const handleAnswer = (selectedOption) => {
    setShowFeedback(true)
    setSelectedAnswer(selectedOption)
    const newAnswered = questionsAnswered + 1
    setQuestionsAnswered(newAnswered)

    if (selectedOption === question.correctAnswer) {
      const newScore = score + 10
      const newStreak = streak + 1
      const newVisual = question.type === 'visual' ? visualCorrect + 1 : visualCorrect

      setScore(newScore)
      setStreak(newStreak)
      setVisualCorrect(newVisual)
      setMessage('✅ ¡Correcto!')

      if (user) updateHighScore(newScore)

      // Verificar logros
      if (newAnswered === 1) tryUnlock('first_correct', newScore, newStreak, newVisual)
      tryUnlock('streak_5', newScore, newStreak, newVisual)
      tryUnlock('streak_10', newScore, newStreak, newVisual)
      tryUnlock('score_50', newScore, newStreak, newVisual)
      tryUnlock('score_100', newScore, newStreak, newVisual)
      tryUnlock('score_200', newScore, newStreak, newVisual)
      tryUnlock('visual_5', newScore, newStreak, newVisual)

      setTimeout(() => generateQuestion(lines), 1500)
    } else {
      setMessage(`❌ Incorrecto. Era: ${question.correctAnswer}`)
      setStreak(0)
      setScore(Math.max(0, score - 5))
      setTimeout(() => generateQuestion(lines), 2500)
    }
  }

  if (loading) return (
    <div className="game-page-corporate">
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Cargando trivia...</p>
      </div>
    </div>
  )

  return (
    <div className="game-page-corporate">

      {/* Toast de logro desbloqueado */}
      {toast && (
        <div className="achievement-toast">
          <span className="achievement-toast-icon">🏅</span>
          <div>
            <div className="achievement-toast-title">¡Logro desbloqueado!</div>
            <div className="achievement-toast-name">{toast.name}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">🎮 Modo Trivia</h1>
          <p className="page-subtitle">Pon a prueba tus conocimientos del Metro CDMX</p>
        </div>
      </div>

      {/* Dashboard */}
      <div className="game-dashboard">
        <div className="dashboard-stats">
          <div className="dashboard-stat">
            <div className="stat-icon-large">⭐</div>
            <div className="stat-details">
              <div className="stat-label-large">Puntos</div>
              <div className="stat-value-large">{score}</div>
            </div>
          </div>
          <div className="dashboard-stat">
            <div className="stat-icon-large">🔥</div>
            <div className="stat-details">
              <div className="stat-label-large">Racha</div>
              <div className="stat-value-large">{streak}</div>
            </div>
          </div>
          <div className="dashboard-stat">
            <div className="stat-icon-large">📊</div>
            <div className="stat-details">
              <div className="stat-label-large">Preguntas</div>
              <div className="stat-value-large">{questionsAnswered}</div>
            </div>
          </div>
          {user && (
            <div className="dashboard-stat">
              <div className="stat-icon-large">🏆</div>
              <div className="stat-details">
                <div className="stat-label-large">Récord</div>
                <div className="stat-value-large">{user.highScore}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contenido de la pregunta */}
      <div className="game-content">
        {question && (
          <div
            className="question-card-corporate"
            style={{
              borderTopColor: showFeedback
                ? (question.correctColor || question.color || '#0066CC') // reveal color
                : (question.color || '#0066CC'),                          // neutral durante pregunta
            }}
          >

            {/* Pregunta Visual — muestra el logo */}
            {question.type === 'visual' && (
              <div className="visual-question-container">
                <div className="visual-question-badge">👁️ Pregunta Visual</div>
                <img
                  src={question.logoUrl}
                  alt="Logo de estación"
                  className="station-logo-img"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
            )}

            <div className="question-text">{question.title}</div>

            <div className="options-grid-corporate">
              {question.options.map((opt, index) => (
                <button
                  key={index}
                  id={`option-btn-${index}`}
                  onClick={() => !showFeedback && handleAnswer(opt)}
                  className={[
                    'option-btn-corporate',
                    showFeedback && opt === question.correctAnswer ? 'correct' : '',
                    showFeedback && opt !== question.correctAnswer && opt === selectedAnswer ? 'incorrect' : '',
                  ].join(' ').trim()}
                  disabled={showFeedback}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {message && (
          <div className={`feedback-message ${message.includes('Correcto') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {!user && (
          <p className="game-login-hint">
            <Link to="/login">Inicia sesión</Link> para guardar tu puntaje en el ranking 🏆
          </p>
        )}
      </div>
    </div>
  )
}

export default Game