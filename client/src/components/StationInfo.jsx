import React from 'react';

const styles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        padding: '20px'
    },
    card: {
        background: 'white',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '600px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif",
        animation: 'modalSlideIn 0.3s ease-out'
    },
    header: {
        background: 'linear-gradient(135deg, #003D7A 0%, #0066CC 100%)',
        padding: '2rem',
        textAlign: 'center',
        position: 'relative'
    },
    closeBtn: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        background: 'rgba(255, 255, 255, 0.2)',
        border: 'none',
        color: 'white',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        cursor: 'pointer',
        fontSize: '20px',
        fontWeight: '300',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        margin: 0,
        color: 'white',
        fontSize: '1.75rem',
        fontWeight: '800',
        letterSpacing: '-0.5px'
    },
    content: {
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    section: {
        width: '100%'
    },
    sectionTitle: {
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        color: '#6C757D',
        margin: '0 0 1rem 0',
        fontWeight: '700'
    },
    stationLogoWrapper: {
        display: 'flex',
        justifyContent: 'center',
        padding: '1rem'
    },
    stationLogo: {
        maxWidth: '200px',
        maxHeight: '200px',
        width: 'auto',
        height: 'auto',
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
    },
    lineIconsWrapper: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '1rem'
    },
    lineIconBadge: {
        width: '60px',
        height: '60px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '900',
        fontSize: '1.5rem',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        border: '2px solid white',
        fontFamily: "'Helvetica Neue', Arial, sans-serif"
    },
    description: {
        fontSize: '1rem',
        lineHeight: '1.7',
        color: '#495057',
        margin: '0',
        textAlign: 'left'
    },
    divider: {
        width: '100%',
        height: '1px',
        background: '#E9ECEF',
        margin: '0.5rem 0'
    },
    badge: {
        background: '#F8F9FA',
        padding: '0.75rem 1.25rem',
        borderRadius: '10px',
        fontSize: '0.95rem',
        color: '#495057',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: '1px solid #E9ECEF'
    }
};

// Add keyframe animation via style tag
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;
if (!document.head.querySelector('style[data-modal-animation]')) {
    styleSheet.setAttribute('data-modal-animation', 'true');
    document.head.appendChild(styleSheet);
}

function StationInfo({ stationData, linesData = [], onClose }) {
    if (!stationData) return null;

    // Find all lines this station belongs to
    const stationLines = linesData.filter(line =>
        line.stations.some(s => s.name === stationData.name)
    );

    // Generate station logo path (normalize station name for filename)
    const normalizeForFilename = (name) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Remove accents
            .replace(/\s+/g, '')  // Remove spaces
            .replace(/ñ/g, 'n')
            .replace(/[^a-z0-9]/g, ''); // Remove special characters
    };

    const stationLogoPath = `/logos/${normalizeForFilename(stationData.name)}.png`;

    // Line number/letter mapping
    const lineLabels = {
        'L1': '1', 'L2': '2', 'L3': '3', 'L4': '4', 'L5': '5', 'L6': '6',
        'L7': '7', 'L8': '8', 'L9': '9', 'LA': 'A', 'LB': 'B', 'L12': '12'
    };

    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.card} onClick={(e) => e.stopPropagation()}>
                <div style={styles.header}>
                    <h2 style={styles.title}>{stationData.name}</h2>
                    <button
                        style={styles.closeBtn}
                        onClick={onClose}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                            e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        ✕
                    </button>
                </div>

                <div style={styles.content}>
                    {/* Station Logo Image */}
                    <div style={styles.section}>
                        <p style={styles.sectionTitle}>LOGO DE LA ESTACIÓN</p>
                        <div style={styles.stationLogoWrapper}>
                            <img
                                src={stationLogoPath}
                                alt={`Logo de ${stationData.name}`}
                                style={styles.stationLogo}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <div style={{ display: 'none', textAlign: 'center', color: '#6C757D', fontSize: '0.9rem' }}>
                                Logo no disponible
                            </div>
                        </div>
                    </div>

                    {/* Metro Line Badges */}
                    {stationLines.length > 0 && (
                        <div style={styles.section}>
                            <p style={styles.sectionTitle}>
                                {stationLines.length > 1 ? 'CORRESPONDENCIAS' : 'LÍNEA'}
                            </p>
                            <div style={styles.lineIconsWrapper}>
                                {stationLines.map((line, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            ...styles.lineIconBadge,
                                            backgroundColor: line.color
                                        }}
                                        title={line.name}
                                    >
                                        {lineLabels[line.id] || line.id}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={styles.divider}></div>

                    {/* Station Meaning */}
                    <div style={styles.section}>
                        <p style={styles.sectionTitle}>SIGNIFICADO</p>
                        <p style={styles.description}>
                            {stationData.meaning || 'Información no disponible'}
                        </p>
                    </div>

                    <div style={styles.divider}></div>

                    {/* Inauguration Year */}
                    <div style={styles.section}>
                        <span style={styles.badge}>
                            📅 Inaugurada en {stationData.year || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StationInfo;