import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StationInfo from './StationInfo'; // Asegúrate de que StationInfo también sea .jsx

const MetroMap = () => {
  const [selectedStationName, setSelectedStationName] = useState(null);
  const [linesData, setLinesData] = useState([]);

  // Cargar datos de la BD al iniciar
  useEffect(() => {
    axios.get('http://localhost:3000/api/lines')
      .then(res => setLinesData(res.data))
      .catch(err => console.error("Error cargando líneas:", err));
  }, []);

  // Función para buscar datos de la estación seleccionada
  const getStationData = (name) => {
    if (!linesData.length) return null;
    for (let line of linesData) {
      const station = line.stations.find(s => s.name === name);
      if (station) return station;
    }
    return { name, meaning: "Datos no encontrados en BD", year: "-" };
  };

  // --- DATOS DE LAS LÍNEAS (COORDENADAS FIJAS) ---
  const mapLines = [
    {
      id: 'L1', color: '#E83F8D',
      stations: [
        { name: "Observatorio", x: 110, y: 680, label: 'bottom' },
        { name: "Tacubaya", x: 150, y: 640, label: 'top-right' },
        { name: "Juanacatlán", x: 185, y: 605, label: 'bottom' },
        { name: "Chapultepec", x: 215, y: 570, label: 'bottom' },
        { name: "Sevilla", x: 250, y: 540, label: 'bottom' },
        { name: "Insurgentes", x: 290, y: 510, label: 'bottom' },
        { name: "Cuauhtémoc", x: 330, y: 510, label: 'bottom' },
        { name: "Balderas", x: 370, y: 510, label: 'top-right' },
        { name: "Salto del Agua", x: 450, y: 510, label: 'top-right' },
        { name: "Isabel la Católica", x: 500, y: 510, label: 'bottom' },
        { name: "Pino Suárez", x: 550, y: 510, label: 'top-right' },
        { name: "Merced", x: 590, y: 495, label: 'bottom' },
        { name: "Candelaria", x: 660, y: 420, label: 'top-right' },
        { name: "San Lázaro", x: 700, y: 420, label: 'top-right' },
        { name: "Moctezuma", x: 740, y: 460, label: 'bottom' },
        { name: "Balbuena", x: 765, y: 490, label: 'bottom' },
        { name: "Bulevar Puerto Aéreo", x: 780, y: 530, label: 'bottom' },
        { name: "Gómez Farías", x: 785, y: 570, label: 'bottom' },
        { name: "Zaragoza", x: 810, y: 590, label: 'bottom' },
        { name: "Pantitlán", x: 860, y: 600, label: 'right' }
      ]
    },
    {
      id: 'L2', color: '#005EB8',
      stations: [
        { name: "Cuatro Caminos", x: 45, y: 320, label: 'left' },
        { name: "Panteones", x: 100, y: 320, label: 'top' },
        { name: "Tacuba", x: 150, y: 320, label: 'top-right' },
        { name: "Cuitláhuac", x: 170, y: 340, label: 'top' },
        { name: "Popotla", x: 195, y: 365, label: 'top' },
        { name: "Colegio Militar", x: 220, y: 390, label: 'top' },
        { name: "Normal", x: 250, y: 390, label: 'top' },
        { name: "San Cosme", x: 290, y: 390, label: 'top' },
        { name: "Revolución", x: 340, y: 390, label: 'left' },
        { name: "Hidalgo", x: 370, y: 390, label: 'top-left' },
        { name: "Bellas Artes", x: 450, y: 390, label: 'top-right' },
        { name: "Allende", x: 520, y: 400, label: 'top' },
        { name: "Zócalo", x: 550, y: 445, label: 'top' },
        { name: "Pino Suárez", x: 550, y: 510, label: 'top-right' },
        { name: "San Antonio Abad", x: 550, y: 590, label: 'right' },
        { name: "Chabacano", x: 550, y: 640, label: 'right' },
        { name: "Viaducto", x: 550, y: 685, label: 'right' },
        { name: "Xola", x: 550, y: 720, label: 'right' },
        { name: "Villa de Cortés", x: 550, y: 755, label: 'right' },
        { name: "Nativitas", x: 550, y: 790, label: 'right' },
        { name: "Portales", x: 550, y: 820, label: 'right' },
        { name: "Ermita", x: 550, y: 855, label: 'right' },
        { name: "General Anaya", x: 550, y: 890, label: 'right' },
        { name: "Tasqueña", x: 550, y: 925, label: 'right' }
      ]
    },
    {
      id: 'L3', color: '#AF9800',
      stations: [
        { name: "Indios Verdes", x: 475, y: 110, label: 'right' },
        { name: "Deportivo 18 de Marzo", x: 470, y: 185, label: 'right' },
        { name: "Potrero", x: 460, y: 220, label: 'right' },
        { name: "La Raza", x: 430, y: 250, label: 'top-right' },
        { name: "Tlatelolco", x: 405, y: 275, label: 'right' },
        { name: "Guerrero", x: 370, y: 350, label: 'top-right' },
        { name: "Hidalgo", x: 370, y: 390, label: 'top-left' },
        { name: "Juárez", x: 370, y: 445, label: 'right' },
        { name: "Balderas", x: 370, y: 510, label: 'top-left' },
        { name: "Niños Héroes", x: 370, y: 540, label: 'left' },
        { name: "Hospital General", x: 370, y: 575, label: 'left' },
        { name: "Centro Médico", x: 370, y: 640, label: 'left' },
        { name: "Etiopía", x: 370, y: 675, label: 'left' },
        { name: "Eugenia", x: 370, y: 710, label: 'left' },
        { name: "División del Norte", x: 370, y: 745, label: 'left' },
        { name: "Zapata", x: 370, y: 775, label: 'left' },
        { name: "Coyoacán", x: 370, y: 810, label: 'left' },
        { name: "Viveros", x: 370, y: 840, label: 'left' },
        { name: "Miguel Ángel de Quevedo", x: 370, y: 875, label: 'left' },
        { name: "Copilco", x: 370, y: 910, label: 'left' },
        { name: "Universidad", x: 370, y: 945, label: 'left' }
      ]
    },
    {
      id: 'L4', color: '#6BC1B6',
      stations: [
        { name: "Martín Carrera", x: 660, y: 185, label: 'right' },
        { name: "Talismán", x: 660, y: 215, label: 'right' },
        { name: "Bondojito", x: 660, y: 245, label: 'right' },
        { name: "Consulado", x: 660, y: 295, label: 'top-right' },
        { name: "Canal del Norte", x: 660, y: 340, label: 'right' },
        { name: "Morelos", x: 660, y: 380, label: 'top-right' },
        { name: "Candelaria", x: 660, y: 420, label: 'top-right' },
        { name: "Fray Servando", x: 660, y: 550, label: 'right' },
        { name: "Jamaica", x: 660, y: 640, label: 'right' },
        { name: "Santa Anita", x: 660, y: 695, label: 'right' }
      ]
    },
    {
      id: 'L5', color: '#FFD600',
      stations: [
        { name: "Politécnico", x: 330, y: 125, label: 'top' },
        { name: "Instituto del Petróleo", x: 370, y: 185, label: 'top-left' },
        { name: "Autobuses del Norte", x: 400, y: 215, label: 'top-right' },
        { name: "La Raza", x: 430, y: 250, label: 'top-right' },
        { name: "Misterios", x: 455, y: 275, label: 'top' },
        { name: "Valle Gómez", x: 565, y: 295, label: 'top' },
        { name: "Consulado", x: 660, y: 295, label: 'top-right' },
        { name: "Eduardo Molina", x: 730, y: 300, label: 'top' },
        { name: "Aragón", x: 755, y: 330, label: 'top' },
        { name: "Oceanía", x: 800, y: 375, label: 'top-right' },
        { name: "Terminal Aérea", x: 860, y: 465, label: 'right' },
        { name: "Hangares", x: 860, y: 525, label: 'right' },
        { name: "Pantitlán", x: 860, y: 600, label: 'right' }
      ]
    },
    {
      id: 'L6', color: '#DA291C',
      stations: [
        { name: "El Rosario", x: 150, y: 150, label: 'top-left' },
        { name: "Tezozómoc", x: 170, y: 170, label: 'top' },
        { name: "UAM-Azcapotzalco", x: 205, y: 185, label: 'top' },
        { name: "Ferrería", x: 245, y: 185, label: 'top' },
        { name: "Norte 45", x: 290, y: 185, label: 'top' },
        { name: "Vallejo", x: 325, y: 185, label: 'top' },
        { name: "Instituto del Petróleo", x: 370, y: 185, label: 'top-left' },
        { name: "Lindavista", x: 435, y: 185, label: 'top' },
        { name: "Deportivo 18 de Marzo", x: 470, y: 185, label: 'right' },
        { name: "La Villa-Basílica", x: 560, y: 185, label: 'top' },
        { name: "Martín Carrera", x: 660, y: 185, label: 'right' }
      ]
    },
    {
      id: 'L7', color: '#E37C00',
      stations: [
        { name: "El Rosario", x: 150, y: 150, label: 'top-left' },
        { name: "Aquiles Serdán", x: 150, y: 190, label: 'left' },
        { name: "Camarones", x: 150, y: 225, label: 'left' },
        { name: "Refinería", x: 150, y: 280, label: 'left' },
        { name: "Tacuba", x: 150, y: 320, label: 'top-left' },
        { name: "San Joaquín", x: 150, y: 395, label: 'left' },
        { name: "Polanco", x: 150, y: 455, label: 'left' },
        { name: "Auditorio", x: 150, y: 520, label: 'left' },
        { name: "Constituyentes", x: 150, y: 580, label: 'left' },
        { name: "Tacubaya", x: 150, y: 640, label: 'top-left' },
        { name: "San Pedro de los Pinos", x: 150, y: 700, label: 'left' },
        { name: "San Antonio", x: 150, y: 730, label: 'left' },
        { name: "Mixcoac", x: 150, y: 775, label: 'left' },
        { name: "Barranca del Muerto", x: 150, y: 830, label: 'left' }
      ]
    },
    {
      id: 'L8', color: '#009A44',
      stations: [
        { name: "Garibaldi", x: 450, y: 350, label: 'top-right' },
        { name: "Bellas Artes", x: 450, y: 390, label: 'top-right' },
        { name: "San Juan de Letrán", x: 450, y: 445, label: 'left' },
        { name: "Salto del Agua", x: 450, y: 510, label: 'top-right' },
        { name: "Doctores", x: 460, y: 550, label: 'left' },
        { name: "Obrera", x: 490, y: 585, label: 'top-left' },
        { name: "Chabacano", x: 550, y: 640, label: 'right' },
        { name: "La Viga", x: 585, y: 675, label: 'top' },
        { name: "Santa Anita", x: 660, y: 695, label: 'right' },
        { name: "Coyuya", x: 710, y: 730, label: 'right' },
        { name: "Iztacalco", x: 710, y: 765, label: 'right' },
        { name: "Apatlaco", x: 710, y: 800, label: 'right' },
        { name: "Aculco", x: 710, y: 835, label: 'right' },
        { name: "Escuadrón 201", x: 710, y: 865, label: 'right' },
        { name: "Atlalilco", x: 725, y: 895, label: 'top' },
        { name: "Iztapalapa", x: 750, y: 910, label: 'top' },
        { name: "Cerro de la Estrella", x: 785, y: 910, label: 'top' },
        { name: "UAM-I", x: 820, y: 910, label: 'top' },
        { name: "Constitución de 1917", x: 850, y: 910, label: 'right' }
      ]
    },
    {
      id: 'L9', color: '#5C352D',
      stations: [
        { name: "Tacubaya", x: 150, y: 640, label: 'top-left' },
        { name: "Patriotismo", x: 230, y: 640, label: 'bottom' },
        { name: "Chilpancingo", x: 315, y: 640, label: 'bottom' },
        { name: "Centro Médico", x: 370, y: 640, label: 'left' },
        { name: "Lázaro Cárdenas", x: 460, y: 640, label: 'bottom' },
        { name: "Chabacano", x: 550, y: 640, label: 'right' },
        { name: "Jamaica", x: 660, y: 640, label: 'right' },
        { name: "Mixiuhca", x: 720, y: 640, label: 'bottom' },
        { name: "Velódromo", x: 760, y: 640, label: 'bottom' },
        { name: "Ciudad Deportiva", x: 810, y: 640, label: 'bottom' },
        { name: "Puebla", x: 840, y: 625, label: 'right' },
        { name: "Pantitlán", x: 860, y: 600, label: 'right' }
      ]
    },
    {
      id: 'LA', color: '#9E2064',
      stations: [
        { name: "Pantitlán", x: 860, y: 600, label: 'right' },
        { name: "Agrícola Oriental", x: 895, y: 640, label: 'right' },
        { name: "Canal de San Juan", x: 895, y: 675, label: 'right' },
        { name: "Tepalcates", x: 895, y: 710, label: 'right' },
        { name: "Guelatao", x: 895, y: 745, label: 'right' },
        { name: "Peñón Viejo", x: 895, y: 780, label: 'right' },
        { name: "Acatitla", x: 895, y: 810, label: 'right' },
        { name: "Santa Marta", x: 895, y: 845, label: 'right' },
        { name: "Los Reyes", x: 910, y: 880, label: 'right' },
        { name: "La Paz", x: 940, y: 910, label: 'right' }
      ]
    },
    {
      id: 'LB', color: '#B0B3B2',
      stations: [
        { name: "Ciudad Azteca", x: 840, y: 40, label: 'right' },
        { name: "Plaza Aragón", x: 840, y: 75, label: 'right' },
        { name: "Olímpica", x: 840, y: 105, label: 'right' },
        { name: "Ecatepec", x: 840, y: 140, label: 'right' },
        { name: "Múzquiz", x: 840, y: 170, label: 'right' },
        { name: "Río de los Remedios", x: 840, y: 195, label: 'top-left' },
        { name: "Impulsora", x: 840, y: 225, label: 'top-left' },
        { name: "Nezahualcóyotl", x: 840, y: 255, label: 'top-left' },
        { name: "Villa de Aragón", x: 840, y: 290, label: 'top-left' },
        { name: "Bosque de Aragón", x: 840, y: 315, label: 'top-left' },
        { name: "Deportivo Oceanía", x: 830, y: 345, label: 'top-left' },
        { name: "Oceanía", x: 800, y: 375, label: 'top-right' },
        { name: "Romero Rubio", x: 775, y: 400, label: 'right' },
        { name: "Ricardo Flores Magón", x: 735, y: 420, label: 'right' },
        { name: "San Lázaro", x: 700, y: 420, label: 'top-right' },
        { name: "Morelos", x: 660, y: 380, label: 'top-right' },
        { name: "Tepito", x: 600, y: 350, label: 'top' },
        { name: "Lagunilla", x: 540, y: 350, label: 'top' },
        { name: "Garibaldi", x: 450, y: 350, label: 'top-left' },
        { name: "Guerrero", x: 370, y: 350, label: 'top-right' },
        { name: "Buenavista", x: 325, y: 350, label: 'top' }
      ]
    },
    {
      id: 'L12', color: '#C0992F',
      stations: [
        { name: "Mixcoac", x: 150, y: 775, label: 'left' },
        { name: "Insurgentes Sur", x: 210, y: 775, label: 'bottom' },
        { name: "Hospital 20 de Noviembre", x: 285, y: 775, label: 'bottom' },
        { name: "Zapata", x: 370, y: 775, label: 'left' },
        { name: "Parque de los Venados", x: 455, y: 775, label: 'bottom' },
        { name: "Eje Central", x: 510, y: 855, label: 'bottom' },
        { name: "Ermita", x: 550, y: 855, label: 'right' },
        { name: "Mexicaltzingo", x: 650, y: 895, label: 'bottom' },
        { name: "Atlalilco", x: 725, y: 895, label: 'top' },
        { name: "Culhuacán", x: 725, y: 935, label: 'right' },
        { name: "San Andrés Tomatlán", x: 725, y: 970, label: 'right' },
        { name: "Lomas Estrella", x: 725, y: 1000, label: 'right' },
        { name: "Calle 11", x: 725, y: 1035, label: 'right' },
        { name: "Periférico Oriente", x: 740, y: 1070, label: 'right' },
        { name: "Tezonco", x: 765, y: 1095, label: 'right' },
        { name: "Olivos", x: 790, y: 1115, label: 'right' },
        { name: "Nopalera", x: 810, y: 1140, label: 'right' },
        { name: "Zapotitlán", x: 835, y: 1165, label: 'right' },
        { name: "Tlaltenco", x: 855, y: 1190, label: 'right' },
        { name: "Tláhuac", x: 880, y: 1210, label: 'right' }
      ]
    }
  ];

  const activeStationData = selectedStationName ? getStationData(selectedStationName) : null;

  // Calcular posición de textos
  const getTextPosition = (station) => {
    const offset = 15;
    let x = station.x;
    let y = station.y;
    let anchor = 'start';

    switch (station.label) {
      case 'top': x += 5; y -= offset; break;
      case 'bottom': x += 5; y += offset; break;
      case 'left': x -= offset; y += 5; anchor = 'end'; break;
      case 'right': x += offset; y += 5; break;
      case 'top-left': x -= offset; y -= offset; anchor = 'end'; break;
      case 'top-right': x += offset; y -= offset; break;
      default: x += offset; y -= 5;
    }
    return { x, y, anchor };
  };

  return (
    <div style={{
      textAlign: 'center',
      color: '#e5e5e5',
      position: 'relative',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '30px',
      boxSizing: 'border-box'
    }}>

      {activeStationData && (
        <StationInfo
          stationData={activeStationData}
          linesData={linesData}
          onClose={() => setSelectedStationName(null)}
        />
      )}

      <h2 style={{ margin: '0 0 20px 0', fontSize: '1.8rem', color: '#fff', fontWeight: '700', textShadow: '0 2px 10px rgba(232, 63, 141, 0.5)' }}>Red del Metro CDMX</h2>

      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        width: '100%',
        maxWidth: '1400px',
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1050 1300"
          preserveAspectRatio="xMidYMid meet"
          style={{ display: 'block' }}
        >

          {mapLines.map((line) => (
            <polyline
              key={line.id}
              points={line.stations.map(st => `${st.x},${st.y}`).join(' ')}
              fill="none"
              stroke={line.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.9, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
            />
          ))}

          {mapLines.map((line) => (
            line.stations.map((station, index) => {
              const textPos = getTextPosition(station);
              const isTransfer = mapLines.filter(l => l.stations.some(s => s.name === station.name)).length > 1;
              const radius = isTransfer ? 8 : 5;
              const strokeWidth = isTransfer ? 2 : 1.5;

              return (
                <g
                  key={`${line.id}-${station.name}-${index}`}
                  onClick={() => setSelectedStationName(station.name)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {/* Hover effect circle */}
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r="15"
                    fill="transparent"
                    className="station-hover-area"
                    onMouseEnter={(e) => {
                      e.target.setAttribute('fill', 'rgba(232, 63, 141, 0.2)');
                      e.target.style.filter = 'drop-shadow(0 0 8px rgba(232, 63, 141, 0.6))';
                    }}
                    onMouseLeave={(e) => {
                      e.target.setAttribute('fill', 'transparent');
                      e.target.style.filter = 'none';
                    }}
                  />

                  {/* Station dot */}
                  <circle
                    cx={station.x}
                    cy={station.y}
                    r={radius}
                    fill="white"
                    stroke="#1a1a1a"
                    strokeWidth={strokeWidth}
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))', pointerEvents: 'none' }}
                  />

                  <text
                    x={textPos.x}
                    y={textPos.y}
                    transform={`rotate(-45, ${textPos.x}, ${textPos.y})`}
                    fontSize="10"
                    textAnchor={textPos.anchor}
                    fill="#e5e5e5"
                    fontWeight={isTransfer ? "700" : "500"}
                    style={{ userSelect: 'none', pointerEvents: 'none', textShadow: '1px 1px 2px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9), 1px -1px 2px rgba(0,0,0,0.9), -1px 1px 2px rgba(0,0,0,0.9)', fontFamily: "'Inter', sans-serif" }}
                  >
                    {station.name}
                  </text>
                </g>
              )
            })
          ))}

        </svg>
      </div>
    </div>
  );
};

export default MetroMap;