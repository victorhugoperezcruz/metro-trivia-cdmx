import React, { useState, useEffect } from 'react';
import './PracticeMode.css';

function PracticeMode({ allStations }) {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [stats, setStats] = useState({ correct: 0, incorrect: 0, streak: 0 });
    const [questionsAsked, setQuestionsAsked] = useState(0);

    // Normalize station name for logo path
    const normalizeForFilename = (name) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '')
            .replace(/ñ/g, 'n')
            .replace(/[^a-z0-9]/g, '');
    };

    const generateQuestion = () => {
        if (allStations.length < 4) return;

        // Pick a random station as correct answer
        const correctStation = allStations[Math.floor(Math.random() * allStations.length)];

        // Pick 3 other random stations as wrong answers
        const wrongStations = allStations
            .filter(s => s.name !== correctStation.name)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        // Combine and shuffle
        const allOptions = [correctStation, ...wrongStations]
            .sort(() => 0.5 - Math.random());

        setCurrentQuestion(correctStation);
        setOptions(allOptions);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    useEffect(() => {
        generateQuestion();
    }, [allStations]);

    const handleAnswer = (selectedStation) => {
        if (selectedAnswer !== null) return; // Already answered

        setSelectedAnswer(selectedStation.name);
        const correct = selectedStation.name === currentQuestion.name;
        setIsCorrect(correct);

        // Update stats
        setStats(prev => ({
            correct: prev.correct + (correct ? 1 : 0),
            incorrect: prev.incorrect + (correct ? 0 : 1),
            streak: correct ? prev.streak + 1 : 0
        }));

        setQuestionsAsked(prev => prev + 1);

        // Auto next question after 2 seconds
        setTimeout(() => {
            generateQuestion();
        }, 2000);
    };

    const getAccuracy = () => {
        const total = stats.correct + stats.incorrect;
        if (total === 0) return 0;
        return Math.round((stats.correct / total) * 100);
    };

    if (!currentQuestion) {
        return <div className="practice-loading">Cargando práctica...</div>;
    }

    const logoPath = `/logos/${normalizeForFilename(currentQuestion.name)}.png`;

    return (
        <div className="practice-mode">
            {/* Stats Header */}
            <div className="practice-stats-bar">
                <div className="practice-stat">
                    <span className="stat-icon">✅</span>
                    <span className="stat-value">{stats.correct}</span>
                    <span className="stat-label">Correctas</span>
                </div>
                <div className="practice-stat">
                    <span className="stat-icon">❌</span>
                    <span className="stat-value">{stats.incorrect}</span>
                    <span className="stat-label">Incorrectas</span>
                </div>
                <div className="practice-stat">
                    <span className="stat-icon">🔥</span>
                    <span className="stat-value">{stats.streak}</span>
                    <span className="stat-label">Racha</span>
                </div>
                <div className="practice-stat">
                    <span className="stat-icon">📊</span>
                    <span className="stat-value">{getAccuracy()}%</span>
                    <span className="stat-label">Precisión</span>
                </div>
            </div>

            {/* Question */}
            <div className="practice-question-card">
                <h3 className="practice-question-title">¿Qué estación es esta?</h3>
                <div className="practice-question-number">Pregunta #{questionsAsked + 1}</div>

                <div className="practice-logo-display">
                    <img
                        src={logoPath}
                        alt="Logo de estación"
                        className="practice-logo-img"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>

                {/* Options */}
                <div className="practice-options-grid">
                    {options.map((station, idx) => {
                        let buttonClass = 'practice-option-btn';

                        if (selectedAnswer !== null) {
                            if (station.name === currentQuestion.name) {
                                buttonClass += ' correct';
                            } else if (station.name === selectedAnswer) {
                                buttonClass += ' incorrect';
                            } else {
                                buttonClass += ' disabled';
                            }
                        }

                        return (
                            <button
                                key={idx}
                                className={buttonClass}
                                onClick={() => handleAnswer(station)}
                                disabled={selectedAnswer !== null}
                            >
                                {station.name}
                            </button>
                        );
                    })}
                </div>

                {/* Feedback Message */}
                {isCorrect !== null && (
                    <div className={`practice-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? (
                            <>
                                <span className="feedback-icon">🎉</span>
                                <span>¡Correcto! Es {currentQuestion.name}</span>
                            </>
                        ) : (
                            <>
                                <span className="feedback-icon">😔</span>
                                <span>Incorrecto. Era {currentQuestion.name}</span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PracticeMode;
