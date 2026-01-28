// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Line = require('./models/line');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

    mongoose.connect('mongodb://127.0.0.1:27017/metro-trivia')
    .then(() => console.log('✅ Conectado a MongoDB local'))
    .catch(err => console.error('❌ Error conectando a Mongo:', err));

    // --- RUTA SEED (LA QUE ESTAMOS ARREGLANDO) ---
    app.get('/seed', async (req, res) => {
    try {
    await Line.deleteMany({}); // Borrón y cuenta nueva

    // HELPER: Convierte lista de textos ["A", "B"] a objetos [{name:"A"...}, {name:"B"...}]
    // Esto es vital para que Mongo no nos grite con las líneas que aun no detallamos
    const simpleStations = (names) => {
        return names.map(name => ({ 
            name: name, 
            meaning: "Historia pendiente...", 
            year: "-" 
        }));
    };
const linesData = [
    {
        name: "Línea 1",
        color: "#E83F8D",
        stations: [
            { name: "Observatorio", year: "1972", meaning: "Por el antiguo observatorio astronómico ubicado en la zona." },
            { name: "Tacubaya", year: "1970", meaning: "Del náhuatl: 'Lugar donde se junta el agua'." },
            { name: "Juanacatlán", year: "1970", meaning: "Del náhuatl: 'Lugar de mariposas'." },
            { name: "Chapultepec", year: "1969", meaning: "Del náhuatl: 'Cerro del chapulín'." },
            { name: "Sevilla", year: "1969", meaning: "Por la antigua Avenida Sevilla." },
            { name: "Insurgentes", year: "1969", meaning: "En honor al movimiento insurgente de la Independencia." },
            { name: "Cuauhtémoc", year: "1969", meaning: "En honor al último tlatoani mexica." },
            { name: "Balderas", year: "1969", meaning: "Por la calle Balderas." },
            { name: "Salto del Agua", year: "1969", meaning: "Por la histórica fuente colonial." },
            { name: "Isabel la Católica", year: "1969", meaning: "En honor a la reina de Castilla." },
            { name: "Pino Suárez", year: "1969", meaning: "En honor a José María Pino Suárez." },
            { name: "Merced", year: "1969", meaning: "Por el mercado de La Merced." },
            { name: "Candelaria", year: "1969", meaning: "Por el antiguo barrio de La Candelaria." },
            { name: "San Lázaro", year: "1969", meaning: "Por la antigua estación ferroviaria." },
            { name: "Moctezuma", year: "1969", meaning: "En honor a Moctezuma II." },
            { name: "Balbuena", year: "1969", meaning: "Por la colonia Balbuena." },
            { name: "Boulevard Puerto Aéreo", year: "1969", meaning: "Por su cercanía al Aeropuerto Internacional." },
            { name: "Gómez Farías", year: "1969", meaning: "En honor a Valentín Gómez Farías." },
            { name: "Zaragoza", year: "1969", meaning: "En honor al general Ignacio Zaragoza." },
            { name: "Pantitlán", year: "1984", meaning: "Del náhuatl: 'Lugar entre banderas'." }
        ]
    },
    {
        name: "Línea 2",
        color: "#005EB8",
        stations: [
            { name: "Cuatro Caminos", year: "1970", meaning: "Antiguo cruce carretero conocido como Cuatro Caminos." },
            { name: "Panteones", year: "1970", meaning: "Por los panteones civiles cercanos." },
            { name: "Tacuba", year: "1970", meaning: "Del náhuatl: 'Lugar de jarillas'." },
            { name: "Cuitláhuac", year: "1970", meaning: "En honor al tlatoani Cuitláhuac." },
            { name: "Popotla", year: "1970", meaning: "Del náhuatl: 'Lugar donde humea'." },
            { name: "Colegio Militar", year: "1970", meaning: "Por el Heroico Colegio Militar." },
            { name: "Normal", year: "1970", meaning: "Por la Escuela Normal de Maestros." },
            { name: "San Cosme", year: "1970", meaning: "Por la calzada y barrio de San Cosme." },
            { name: "Revolución", year: "1970", meaning: "En referencia a la Revolución Mexicana." },
            { name: "Hidalgo", year: "1970", meaning: "En honor a Miguel Hidalgo." },
            { name: "Bellas Artes", year: "1970", meaning: "Por el Palacio de Bellas Artes." },
            { name: "Allende", year: "1970", meaning: "En honor a Ignacio Allende." },
            { name: "Zócalo", year: "1970", meaning: "Por la Plaza de la Constitución." },
            { name: "Pino Suárez", year: "1970", meaning: "En honor a José María Pino Suárez." },
            { name: "San Antonio Abad", year: "1970", meaning: "Por la antigua calzada." },
            { name: "Chabacano", year: "1970", meaning: "Del náhuatl: 'Lugar de chabacanos'." },
            { name: "Viaducto", year: "1970", meaning: "Por el Viaducto Miguel Alemán." },
            { name: "Xola", year: "1970", meaning: "Por la calzada Xola." },
            { name: "Villa de Cortés", year: "1970", meaning: "En honor a Hernán Cortés." },
            { name: "Nativitas", year: "1970", meaning: "Por el barrio de Nativitas." },
            { name: "Portales", year: "1970", meaning: "Por la colonia Portales." },
            { name: "Ermita", year: "1970", meaning: "Por la Calzada de la Ermita." },
            { name: "General Anaya", year: "1970", meaning: "En honor al general Pedro María Anaya." },
            { name: "Tasqueña", year: "1970", meaning: "Por la antigua hacienda Tasqueña." }
        ]
    },
    {
        name: "Línea 3",
        color: "#AF9800",
        stations: [
            { name: "Indios Verdes", year: "1970", meaning: "Por los monumentos de Los Indios Verdes." },
            { name: "Deportivo 18 de Marzo", year: "1970", meaning: "Por la expropiación petrolera." },
            { name: "Potrero", year: "1970", meaning: "Por la colonia El Potrero." },
            { name: "La Raza", year: "1970", meaning: "Por el conjunto habitacional." },
            { name: "Tlatelolco", year: "1970", meaning: "Del náhuatl: 'Montículo de arena'." },
            { name: "Guerrero", year: "1970", meaning: "En honor a Vicente Guerrero." },
            { name: "Hidalgo", year: "1970", meaning: "En honor a Miguel Hidalgo." },
            { name: "Juárez", year: "1970", meaning: "En honor a Benito Juárez." },
            { name: "Balderas", year: "1970", meaning: "Por la calle Balderas." },
            { name: "Niños Héroes", year: "1970", meaning: "Por los Niños Héroes de Chapultepec." },
            { name: "Hospital General", year: "1970", meaning: "Por el Hospital General de México." },
            { name: "Centro Médico", year: "1970", meaning: "Por el Centro Médico Nacional." },
            { name: "Etiopía", year: "1970", meaning: "Por la antigua glorieta Etiopía." },
            { name: "Eugenia", year: "1970", meaning: "Por la avenida Eugenia." },
            { name: "División del Norte", year: "1970", meaning: "Por el ejército villista." },
            { name: "Zapata", year: "1970", meaning: "En honor a Emiliano Zapata." },
            { name: "Coyoacán", year: "1970", meaning: "Del náhuatl: 'Lugar de coyotes'." },
            { name: "Viveros", year: "1970", meaning: "Por los Viveros de Coyoacán." },
            { name: "Miguel Ángel de Quevedo", year: "1970", meaning: "En honor al ingeniero ambientalista." },
            { name: "Copilco", year: "1970", meaning: "Del náhuatl: 'Lugar de la corona'." },
            { name: "Universidad", year: "1970", meaning: "Por la UNAM." }
        ]
    },
    {
        name: "Línea 4",
        color: "#6BC1B6",
        stations: [
            { name: "Martín Carrera", year: "1981", meaning: "En honor al insurgente Martín Carrera." },
            { name: "Talismán", year: "1981", meaning: "Por el barrio de Talismán." },
            { name: "Bondojito", year: "1981", meaning: "Del náhuatl: 'Pequeño nudo'." },
            { name: "Consulado", year: "1981", meaning: "Por el edificio del antiguo consulado." },
            { name: "Canal del Norte", year: "1981", meaning: "Por el canal histórico." },
            { name: "Morelos", year: "1981", meaning: "En honor a José María Morelos." },
            { name: "Candelaria", year: "1981", meaning: "Por el barrio de La Candelaria." },
            { name: "Fray Servando", year: "1981", meaning: "En honor a Fray Servando Teresa de Mier." },
            { name: "Jamaica", year: "1981", meaning: "Por el mercado de Jamaica." },
            { name: "Santa Anita", year: "1981", meaning: "Por el antiguo barrio lacustre." }
        ]
    },
    {
        name: "Línea 5",
        color: "#FFD600",
        stations: [
            { name: "Politécnico", year: "1981", meaning: "Por el Instituto Politécnico Nacional." },
            { name: "Instituto del Petróleo", year: "1981", meaning: "Por el centro de investigación petrolera." },
            { name: "Autobuses del Norte", year: "1981", meaning: "Por la terminal de autobuses." },
            { name: "La Raza", year: "1981", meaning: "Por el complejo habitacional." },
            { name: "Misterios", year: "1981", meaning: "Por la Calzada de los Misterios." },
            { name: "Valle Gómez", year: "1981", meaning: "Por la colonia Valle Gómez." },
            { name: "Consulado", year: "1981", meaning: "Por la zona consular." },
            { name: "Eduardo Molina", year: "1981", meaning: "Por la avenida Eduardo Molina." },
            { name: "Aragón", year: "1981", meaning: "Por la colonia Aragón." },
            { name: "Oceanía", year: "1981", meaning: "Por el complejo vial Oceanía." },
            { name: "Terminal Aérea", year: "1981", meaning: "Por la terminal aérea del aeropuerto." },
            { name: "Hangares", year: "1981", meaning: "Por los hangares del aeropuerto." },
            { name: "Pantitlán", year: "1981", meaning: "Del náhuatl: 'Lugar entre banderas'." }
        ]
    },
    {
        name: "Línea 6",
        color: "#DA291C",
        stations: [
            { name: "El Rosario", year: "1983", meaning: "Por el pueblo de El Rosario." },
            { name: "Tezozómoc", year: "1983", meaning: "En honor al tlatoani Tezozómoc." },
            { name: "UAM-Azcapotzalco", year: "1983", meaning: "Por la Universidad Autónoma Metropolitana." },
            { name: "Ferrería", year: "1983", meaning: "Por la antigua zona industrial." },
            { name: "Norte 45", year: "1983", meaning: "Por la avenida Norte 45." },
            { name: "Vallejo", year: "1983", meaning: "Por la zona industrial Vallejo." },
            { name: "Instituto del Petróleo", year: "1983", meaning: "Por el centro petrolero." },
            { name: "Lindavista", year: "1983", meaning: "Por la colonia Lindavista." },
            { name: "Deportivo 18 de Marzo", year: "1983", meaning: "Por el deportivo conmemorativo." },
            { name: "La Villa-Basílica", year: "1983", meaning: "Por la Basílica de Guadalupe." },
            { name: "Martín Carrera", year: "1983", meaning: "En honor a Martín Carrera." }
        ]
    },
    {
        name: "Línea 7",
        color: "#E37C00",
        stations: [
            { name: "El Rosario", year: "1984", meaning: "Por el pueblo de El Rosario." },
            { name: "Aquiles Serdán", year: "1984", meaning: "En honor al revolucionario." },
            { name: "Camarones", year: "1984", meaning: "Por la colonia Camarones." },
            { name: "Refinería", year: "1984", meaning: "Por la antigua refinería de Azcapotzalco." },
            { name: "Tacuba", year: "1984", meaning: "Del náhuatl: 'Lugar de jarillas'." },
            { name: "San Joaquín", year: "1984", meaning: "Por el barrio de San Joaquín." },
            { name: "Polanco", year: "1984", meaning: "Por la colonia Polanco." },
            { name: "Auditorio", year: "1984", meaning: "Por el Auditorio Nacional." },
            { name: "Constituyentes", year: "1984", meaning: "Por la avenida Constituyentes." },
            { name: "Tacubaya", year: "1984", meaning: "Del náhuatl: 'Lugar donde se junta el agua'." },
            { name: "San Pedro de los Pinos", year: "1984", meaning: "Por el antiguo pueblo." },
            { name: "San Antonio", year: "1984", meaning: "Por la colonia San Antonio." },
            { name: "Mixcoac", year: "1984", meaning: "Del náhuatl: 'Lugar de serpientes'." },
            { name: "Barranca del Muerto", year: "1984", meaning: "Por la barranca histórica." }
        ]
    },
    {
        name: "Línea 8",
        color: "#009A44",
        stations: [
            { name: "Garibaldi", year: "1994", meaning: "Por la Plaza Garibaldi." },
            { name: "Bellas Artes", year: "1994", meaning: "Por el Palacio de Bellas Artes." },
            { name: "San Juan de Letrán", year: "1994", meaning: "Nombre histórico del Eje Central." },
            { name: "Salto del Agua", year: "1994", meaning: "Por la fuente colonial." },
            { name: "Doctores", year: "1994", meaning: "Por la colonia Doctores." },
            { name: "Obrera", year: "1994", meaning: "Por la colonia Obrera." },
            { name: "Chabacano", year: "1994", meaning: "Del náhuatl: 'Lugar de chabacanos'." },
            { name: "La Viga", year: "1994", meaning: "Por el antiguo canal." },
            { name: "Santa Anita", year: "1994", meaning: "Por el barrio lacustre." },
            { name: "Coyuya", year: "1994", meaning: "Por la calzada Coyuya." },
            { name: "Iztacalco", year: "1994", meaning: "Del náhuatl: 'Casa de sal'." },
            { name: "Apatlaco", year: "1994", meaning: "Del náhuatl: 'Lugar húmedo'." },
            { name: "Aculco", year: "1994", meaning: "Del náhuatl: 'Lugar donde tuerce el agua'." },
            { name: "Escuadrón 201", year: "1994", meaning: "En honor al escuadrón aéreo mexicano." },
            { name: "Atlalilco", year: "1994", meaning: "Del náhuatl: 'Lugar donde hay agua'." },
            { name: "Iztapalapa", year: "1994", meaning: "Del náhuatl: 'Lugar de losas sobre el agua'." },
            { name: "Cerro de la Estrella", year: "1994", meaning: "Por el cerro ceremonial prehispánico." },
            { name: "UAM-I", year: "1994", meaning: "Por la UAM Iztapalapa." },
            { name: "Constitución de 1917", year: "1994", meaning: "En honor a la Constitución Mexicana." }
        ]
    },
    {
        name: "Línea 9",
        color: "#5C352D",
        stations: [
            { name: "Tacubaya", year: "1987", meaning: "Del náhuatl: 'Lugar donde se junta el agua'." },
            { name: "Patriotismo", year: "1987", meaning: "Por la avenida Patriotismo." },
            { name: "Chilpancingo", year: "1987", meaning: "Por la ciudad de Chilpancingo." },
            { name: "Centro Médico", year: "1987", meaning: "Por el Centro Médico Nacional." },
            { name: "Lázaro Cárdenas", year: "1987", meaning: "En honor al expresidente." },
            { name: "Chabacano", year: "1987", meaning: "Del náhuatl: 'Lugar de chabacanos'." },
            { name: "Jamaica", year: "1987", meaning: "Por el mercado de Jamaica." },
            { name: "Mixiuhca", year: "1987", meaning: "Del náhuatl: 'Lugar de parto'." },
            { name: "Velódromo", year: "1987", meaning: "Por el Velódromo Olímpico." },
            { name: "Ciudad Deportiva", year: "1987", meaning: "Por la Ciudad Deportiva Magdalena Mixhuca." },
            { name: "Puebla", year: "1987", meaning: "Por la avenida Puebla." },
            { name: "Pantitlán", year: "1987", meaning: "Del náhuatl: 'Lugar entre banderas'." }
        ]
    },
    {
        name: "Línea A",
        color: "#9E2064",
        stations: [
            { name: "Pantitlán", year: "1991", meaning: "Del náhuatl: 'Lugar entre banderas'." },
            { name: "Agrícola Oriental", year: "1991", meaning: "Por la colonia Agrícola Oriental." },
            { name: "Canal de San Juan", year: "1991", meaning: "Por el canal histórico." },
            { name: "Tepalcates", year: "1991", meaning: "Del náhuatl: 'Lugar de tepalcates'." },
            { name: "Guelatao", year: "1991", meaning: "En honor a Benito Juárez." },
            { name: "Peñón Viejo", year: "1991", meaning: "Por el cerro Peñón Viejo." },
            { name: "Acatitla", year: "1991", meaning: "Del náhuatl: 'Entre cañas'." },
            { name: "Santa Marta", year: "1991", meaning: "Por el pueblo de Santa Marta." },
            { name: "Los Reyes", year: "1991", meaning: "Por el municipio de Los Reyes La Paz." },
            { name: "La Paz", year: "1991", meaning: "Por el municipio de La Paz." }
        ]
    },
    {
        name: "Línea B",
        color: "#B0B3B2",
        stations: [
            { name: "Ciudad Azteca", year: "1999", meaning: "Por la colonia Ciudad Azteca." },
            { name: "Plaza Aragón", year: "1999", meaning: "Por el centro comercial." },
            { name: "Olímpica", year: "1999", meaning: "Por la unidad deportiva." },
            { name: "Ecatepec", year: "1999", meaning: "Del náhuatl: 'Cerro del viento'." },
            { name: "Múzquiz", year: "1999", meaning: "En honor al general Melchor Múzquiz." },
            { name: "Río de los Remedios", year: "1999", meaning: "Por el río entubado." },
            { name: "Impulsora", year: "1999", meaning: "Por la colonia Impulsora." },
            { name: "Nezahualcóyotl", year: "1999", meaning: "En honor al tlatoani poeta." },
            { name: "Villa de Aragón", year: "1999", meaning: "Por la colonia Villa de Aragón." },
            { name: "Bosque de Aragón", year: "1999", meaning: "Por el bosque cercano." },
            { name: "Deportivo Oceanía", year: "1999", meaning: "Por el complejo deportivo." },
            { name: "Oceanía", year: "1999", meaning: "Por el complejo vial Oceanía." },
            { name: "Romero Rubio", year: "1999", meaning: "En honor a Manuel Romero Rubio." },
            { name: "Ricardo Flores Magón", year: "1999", meaning: "En honor al revolucionario." },
            { name: "San Lázaro", year: "1999", meaning: "Por la estación ferroviaria." },
            { name: "Morelos", year: "1999", meaning: "En honor a José María Morelos." },
            { name: "Tepito", year: "1999", meaning: "Del náhuatl: 'Montículo pequeño'." },
            { name: "Lagunilla", year: "1999", meaning: "Por el mercado de La Lagunilla." },
            { name: "Garibaldi", year: "1999", meaning: "Por la Plaza Garibaldi." },
            { name: "Guerrero", year: "1999", meaning: "En honor a Vicente Guerrero." },
            { name: "Buenavista", year: "1999", meaning: "Por la estación ferroviaria Buenavista." }
        ]
    },
    {
        name: "Línea 12",
        color: "#C0992F",
        stations: [
            { name: "Mixcoac", year: "2012", meaning: "Del náhuatl: 'Lugar de serpientes'." },
            { name: "Insurgentes Sur", year: "2012", meaning: "Por la avenida Insurgentes Sur." },
            { name: "Hospital 20 de Noviembre", year: "2012", meaning: "Por el hospital del ISSSTE." },
            { name: "Zapata", year: "2012", meaning: "En honor a Emiliano Zapata." },
            { name: "Parque de los Venados", year: "2012", meaning: "Por el parque cercano." },
            { name: "Eje Central", year: "2012", meaning: "Por el Eje Central Lázaro Cárdenas." },
            { name: "Ermita", year: "2012", meaning: "Por la Calzada de la Ermita." },
            { name: "Mexicaltzingo", year: "2012", meaning: "Del náhuatl: 'Lugar del pequeño templo'." },
            { name: "Atlalilco", year: "2012", meaning: "Del náhuatl: 'Lugar donde hay agua'." },
            { name: "Culhuacán", year: "2012", meaning: "Del náhuatl: 'Lugar de los ancestros'." },
            { name: "San Andrés Tomatlán", year: "2012", meaning: "Por el pueblo originario." },
            { name: "Lomas Estrella", year: "2012", meaning: "Por la colonia Lomas Estrella." },
            { name: "Calle 11", year: "2012", meaning: "Por la vialidad Calle 11." },
            { name: "Periférico Oriente", year: "2012", meaning: "Por el Anillo Periférico." },
            { name: "Tezonco", year: "2012", meaning: "Del náhuatl: 'Lugar del tezontle'." },
            { name: "Olivos", year: "2012", meaning: "Por la colonia Olivos." },
            { name: "Nopalera", year: "2012", meaning: "Por la colonia Nopalera." },
            { name: "Zapotitlán", year: "2012", meaning: "Del náhuatl: 'Lugar de zapotes'." },
            { name: "Tlaltenco", year: "2012", meaning: "Del náhuatl: 'En la orilla de la tierra'." },
            { name: "Tláhuac", year: "2012", meaning: "Del náhuatl: 'Lugar de quien cuida el agua'." }
        ]
    }
];

    await Line.insertMany(linesData);
    res.json({ success: true, message: "¡Base de datos migrada exitosamente!", count: linesData.length });
    } catch (error) {
    res.status(500).json({ error: error.message });
    }
    });

    app.get('/api/lines', async (req, res) => {
    const lines = await Line.find();
    res.json(lines);
    });

    app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});