import React from 'react';

/**
 * LineIcon - Professional Metro Line Badge Component
 * Rectangular design matching official metro signage style
 */
function LineIcon({ lineId, lineName, lineColor, size = 'md', variant = 'full' }) {
    // Size configurations
    const sizes = {
        sm: { width: 60, height: 60, fontSize: 20, padding: 8 },
        md: { width: 90, height: 90, fontSize: 28, padding: 12 },
        lg: { width: 120, height: 120, fontSize: 36, padding: 16 },
        xl: { width: 150, height: 150, fontSize: 44, padding: 20 }
    };

    const config = sizes[size] || sizes.md;

    // Line number/letter extraction
    const lineLabels = {
        'L1': '1', 'L2': '2', 'L3': '3', 'L4': '4', 'L5': '5', 'L6': '6',
        'L7': '7', 'L8': '8', 'L9': '9', 'LA': 'A', 'LB': 'B', 'L12': '12'
    };

    const label = lineLabels[lineId] || lineId;

    // Compact variant (just the colored square with number)
    if (variant === 'compact') {
        return (
            <div style={{
                width: `${config.width}px`,
                height: `${config.height}px`,
                backgroundColor: lineColor,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: '3px solid white',
                position: 'relative'
            }}>
                {/* Line Number  */}
                <span style={{
                    fontSize: `${config.fontSize}px`,
                    fontWeight: '900',
                    color: 'white',
                    fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    letterSpacing: '-1px'
                }}>
                    {label}
                </span>

                {/* Metro "M" Badge */}
                <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: `${config.width * 0.28}px`,
                    height: `${config.width * 0.28}px`,
                    backgroundColor: '#003D7A',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}>
                    <span style={{
                        color: 'white',
                        fontSize: `${config.fontSize * 0.4}px`,
                        fontWeight: '900',
                        fontFamily: "'Helvetica Neue', 'Arial', sans-serif"
                    }}>
                        M
                    </span>
                </div>
            </div>
        );
    }

    // Full variant (with line name)
    return (
        <div style={{
            width: `${config.width * 1.3}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
        }}>
            {/* Main Badge */}
            <div style={{
                width: `${config.width}px`,
                height: `${config.height}px`,
                backgroundColor: lineColor,
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
                border: '3px solid white',
                position: 'relative',
                padding: `${config.padding}px`
            }}>
                {/* Metro "M" in corner */}
                <div style={{
                    position: 'absolute',
                    top: '6px',
                    left: '6px',
                    fontSize: `${config.fontSize * 0.35}px`,
                    fontWeight: '900',
                    color: 'rgba(255,255,255,0.9)',
                    fontFamily: "'Helvetica Neue', sans-serif",
                    textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                }}>
                    M
                </div>

                {/* Line Number */}
                <span style={{
                    fontSize: `${config.fontSize * 1.2}px`,
                    fontWeight: '900',
                    color: 'white',
                    fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
                    textShadow: '0 3px 6px rgba(0,0,0,0.3)',
                    letterSpacing: '-2px',
                    lineHeight: 1
                }}>
                    {label}
                </span>

                {/* "Línea" text */}
                <span style={{
                    fontSize: `${config.fontSize * 0.28}px`,
                    fontWeight: '700',
                    color: 'rgba(255,255,255,0.95)',
                    fontFamily: "'Helvetica Neue', sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginTop: '2px'
                }}>
                    LÍNEA
                </span>
            </div>

            {/* Line Name Label (optional) */}
            {lineName && variant === 'full' && (
                <div style={{
                    fontSize: `${config.fontSize * 0.32}px`,
                    fontWeight: '600',
                    color: '#495057',
                    textAlign: 'center',
                    maxWidth: `${config.width * 1.5}px`,
                    fontFamily: "'Inter', sans-serif"
                }}>
                    {lineName}
                </div>
            )}
        </div>
    );
}

export default LineIcon;
