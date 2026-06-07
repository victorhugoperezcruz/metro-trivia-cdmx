const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ error: 'El email o nombre de usuario ya está en uso.' });
        }

        const user = await User.create({ username, email, password });
        const token = generateToken(user);

        res.status(201).json({
            token,
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                highScore: user.highScore,
                learnedStations: user.learnedStations || [],
                achievements: user.achievements || [],
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const token = generateToken(user);

        res.json({
            token,
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                highScore: user.highScore,
                learnedStations: user.learnedStations || [],
                achievements: user.achievements || [],
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /api/auth/me  (ruta protegida)
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/auth/highscore  (ruta protegida)
const updateHighScore = async (req, res) => {
    try {
        const { score } = req.body;
        if (typeof score !== 'number') {
            return res.status(400).json({ error: 'El puntaje debe ser un número.' });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

        if (score > user.highScore) {
            user.highScore = score;
            await user.save();
        }

        res.json({ highScore: user.highScore });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { register, login, getMe, updateHighScore };
