import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Game() {
  const [lines, setLines] = useState([])
  const [question, setQuestion] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:3000/api/lines')
      .then(res => {
        setLines(res.data)
        setLoading(false)
        generateQuestion(res.data)
      })
      .catch(err => console.error(err))
  }, [])

  const generateQuestion = (data) => {
    setMessage("")
    setShowFeedback(false)

    const questionType = Math.floor(Math.random() * 3);
    const randomLine = data[Math.floor(Math.random() * data.length)];

    let newQuestion = {};

    switch (questionType) {
      case 0:
        const randomStation = randomLine.stations[Math.floor(Math.random() * randomLine.stations.length)];
        const otherLines = data.filter(l => l._id !== randomLine._id).sort(() => 0.5 - Math.random()).slice(0, 3);

        newQuestion = {
          type: "text",
          title: `¿A qué línea pertenece la estación "${randomStation.name}"?`,
          correctAnswer: randomLine.name,
          color: randomLine.color,
          options: [randomLine.name, ...otherLines.map(l => l.name)].sort(() => 0.5 - Math.random())
        };
        break;

      case 1:
        if (randomLine.stations.length < 2) return generateQuestion(data);
        const index = Math.floor(Math.random() * (randomLine.stations.length - 1));
        const currentStation = randomLine.stations[index];
        const nextStation = randomLine.stations[index + 1];

        const distractorsSeq = randomLine.stations
          .filter(s => s.name !== nextStation.name && s.name !== currentStation.name)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(s => s.name);

        newQuestion = {
          type: "text",
          title: `En la ${randomLine.name}: ¿Qué sigue después de "${currentStation.name}"?`,
          correctAnswer: nextStation.name,
          color: randomLine.color,
          options: [nextStation.name, ...distractorsSeq].sort(() => 0.5 - Math.random())
        };
        break;

      case 2:
        const validStations = randomLine.stations.filter(s => s.meaning && s.meaning.length > 20);
        if (validStations.length === 0) {
          return generateQuestion(data);
        }
        const culturalStation = validStations[Math.floor(Math.random() * validStations.length)];

        const distractorsCult = data
          .flatMap(l => l.stations)
          .filter(s => s.name !== culturalStation.name)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map(s => s.name);

        newQuestion = {
          type: "text",
          title: `¿Qué estación tiene este significado?\n"${culturalStation.meaning.substring(0, 80)}..."`,
          correctAnswer: culturalStation.name,
          color: "#333",
          options: [culturalStation.name, ...distractorsCult].sort(() => 0.5 - Math.random())
        };
        break;

      default:
        break;
    }

    setQuestion(newQuestion);
  }

  const handleAnswer = (selectedOption) => {
    setShowFeedback(true);
    setQuestionsAnswered(questionsAnswered + 1);

    if (selectedOption === question.correctAnswer) {
      setScore(score + 10);
      setStreak(streak + 1);
      setMessage("✅ ¡Correcto!");
      setTimeout(() => generateQuestion(lines), 1500);
    } else {
      setMessage(`❌ Incorrecto. Era: ${question.correctAnswer}`);
      setStreak(0);
      setScore(Math.max(0, score - 5));
      setTimeout(() => generateQuestion(lines), 2500);
    }
  }

  if (loading) return (
    <div className="game-page-corporate">
      <div className="loading">
        <div className="spinner"></div>
        <p style={{ marginTop: '1rem' }}>Cargando trivia...</p>
      </div>
    </div>
  );

  return (
    <div className="game-page-corporate">
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
        </div>
      </div>

      {/* Game Content */}
      <div className="game-content">
        {question && (
          <div className="question-card-corporate" style={{ borderTopColor: question.color || '#0066CC' }}>
            <div className="question-text">{question.title}</div>

            <div className="options-grid-corporate">
              {question.options.map((opt, index) => (
                <button
                  key={index}
                  onClick={() => !showFeedback && handleAnswer(opt)}
                  className={`option-btn-corporate ${showFeedback && opt === question.correctAnswer ? 'correct' : ''}`}
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
      </div>
    </div>
  )
}

export default Game