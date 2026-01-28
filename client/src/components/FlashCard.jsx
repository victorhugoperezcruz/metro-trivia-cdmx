import React, { useState } from 'react';

function FlashCard({ station, onMarkLearned, isLearned }) {
    const [isFlipped, setIsFlipped] = useState(false);

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

    const logoPath = `/logos/${normalizeForFilename(station.name)}.png`;

    // Line labels mapping
    const lineLabels = {
        'L1': '1', 'L2': '2', 'L3': '3', 'L4': '4', 'L5': '5', 'L6': '6',
        'L7': '7', 'L8': '8', 'L9': '9', 'LA': 'A', 'LB': 'B', 'L12': '12'
    };

    return (
        <div className="flashcard-container">
            <div
                className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                onClick={() => setIsFlipped(!isFlipped)}
            >
                {/* Front side - Logo */}
                <div className="flashcard-face flashcard-front">
                    <div className="flashcard-logo-wrapper">
                        <img
                            src={logoPath}
                            alt={station.name}
                            className="flashcard-logo"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%23E9ECEF"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236C757D" font-family="Arial" font-size="12">No logo</text></svg>';
                            }}
                        />
                    </div>
                    <p className="flashcard-hint">Click para ver información</p>
                </div>

                {/* Back side - Information */}
                <div className="flashcard-face flashcard-back">
                    <div className="flashcard-content">
                        <h3 className="flashcard-station-name">{station.name}</h3>

                        {station.lines && station.lines.length > 0 && (
                            <div className="flashcard-lines">
                                {station.lines.map((line, idx) => (
                                    <span
                                        key={idx}
                                        className="flashcard-line-badge"
                                        style={{ backgroundColor: line.color }}
                                    >
                                        {lineLabels[line.id] || line.id}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flashcard-meaning">
                            <strong>Significado:</strong>
                            <p>{station.meaning || 'No disponible'}</p>
                        </div>

                        {station.year && (
                            <div className="flashcard-year">
                                📅 Inaugurada en {station.year}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flashcard-actions">
                <button
                    className={`btn-learned ${isLearned ? 'active' : ''}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onMarkLearned(!isLearned);
                    }}
                >
                    {isLearned ? '✓ Aprendida' : 'Marcar como aprendida'}
                </button>
            </div>
        </div>
    );
}

export default FlashCard;
