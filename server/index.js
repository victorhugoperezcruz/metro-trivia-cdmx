// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Line = require('./models/Line'); // Verifica que el nombre del archivo coincida

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS para producción
const corsOptions = {
	origin: process.env.NODE_ENV === 'production' 
		? process.env.FRONTEND_URL
		: 'http://localhost:5173',
	credentials: true,
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Conexión dinámica a MongoDB
const dbUri = process.env.MONGO_URI;

if (!dbUri) {
	console.error('❌ ERROR: MONGO_URI no está configurado en .env');
	process.exit(1);
}

mongoose.connect(dbUri, {
	serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 45000,
})
	.then(() => console.log(`✅ Conectado a MongoDB: ${dbUri.split('@')[dbUri.includes('@') ? 1 : 0].split('/')[0]}`))
	.catch(err => {
		console.error('❌ Error de conexión a MongoDB:', err.message);
		console.error('Verifica que: 1) MONGO_URI sea correcto, 2) MongoDB esté corriendo en localhost:27017, 3) Credenciales sean válidas');
	});

// Importar rutas
const lineRoutes = require('./routes/lineRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// Ruta de Salud (Health Check)
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Rutas de API
app.use('/api/lines', lineRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

console.log('✅ Rutas registradas: /api/lines, /api/auth, /api/users');

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/dist')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '../client/dist/index.html'));
	});
}

// Manejo de errores global
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
	console.log(`🚀 Servidor corriendo en puerto ${PORT} (${process.env.NODE_ENV || 'development'})`);
});