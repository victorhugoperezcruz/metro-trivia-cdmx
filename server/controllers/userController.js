const User = require('../models/User');
const Line = require('../models/Line');

// ============================================================
// GET /api/users/leaderboard  (público)
// ============================================================
const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({ highScore: { $gt: 0 } })
            .select('username highScore achievements profileConfig createdAt')
            .sort({ highScore: -1 })
            .limit(20);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// POST /api/users/achievements  (protegida)
// ============================================================
const unlockAchievement = async (req, res) => {
    try {
        const { id, name, description } = req.body;
        if (!id || !name) {
            return res.status(400).json({ error: 'id y name son obligatorios.' });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

        const alreadyUnlocked = user.achievements.some(a => a.id === id);
        if (alreadyUnlocked) {
            return res.json({ alreadyUnlocked: true, achievements: user.achievements });
        }

        user.achievements.push({ id, name, description });
        await user.save();

        res.status(201).json({ newAchievement: { id, name, description }, achievements: user.achievements });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// PATCH /api/users/progress  (protegida)
// Agrega una estación a learnedStations sin duplicados
// Body: { lineName, stationName }
// ============================================================
const patchProgress = async (req, res) => {
    try {
        console.log('📚 PATCH /progress recibido:', { userId: req.user?.id, body: req.body });
        const { lineName, stationName } = req.body;
        if (!lineName || !stationName) {
            console.log('❌ Faltan parámetros:', { lineName, stationName });
            return res.status(400).json({ error: 'lineName y stationName son obligatorios.' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            console.log('❌ Usuario no encontrado:', req.user.id);
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Verificar duplicado
        const alreadyLearned = user.learnedStations.some(
            s => s.lineName === lineName && s.stationName === stationName
        );

        if (alreadyLearned) {
            return res.json({ alreadyLearned: true, total: user.learnedStations.length });
        }

        user.learnedStations.push({ lineName, stationName });
        await user.save();

        console.log('✅ Estación guardada:', { lineName, stationName, userId: req.user.id, totalEstaciones: user.learnedStations.length });

        res.status(201).json({
            newStation: { lineName, stationName },
            total: user.learnedStations.length,
            learnedStations: user.learnedStations,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// GET /api/users/profile  (protegida)
// Retorna datos del usuario + estadísticas de progreso por línea
// ============================================================
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

        // Calcular total de estaciones en la BD
        const lines = await Line.find().select('name stations');
        const totalStations = lines.reduce((acc, l) => acc + l.stations.length, 0);

        // Progreso por línea
        const progressByLine = lines.map(line => {
            const learnedInLine = user.learnedStations.filter(s => s.lineName === line.name).length;
            return {
                lineName: line.name,
                learned: learnedInLine,
                total: line.stations.length,
                percent: Math.round((learnedInLine / line.stations.length) * 100),
            };
        }).sort((a, b) => b.percent - a.percent);

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                highScore: user.highScore,
                achievements: user.achievements,
                profileConfig: user.profileConfig,
                createdAt: user.createdAt,
            },
            progress: {
                learnedTotal: user.learnedStations.length,
                totalStations,
                percent: totalStations > 0
                    ? Math.round((user.learnedStations.length / totalStations) * 100)
                    : 0,
                byLine: progressByLine,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// PUT /api/users/profile  (protegida)
// Actualiza username, favoriteLine, avatarColor
// Body: { username?, favoriteLine?, avatarColor? }
// ============================================================
const updateProfile = async (req, res) => {
    try {
        const { username, favoriteLine, avatarColor } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

        if (username && username !== user.username) {
            const taken = await User.findOne({ username });
            if (taken) return res.status(409).json({ error: 'Ese nombre de usuario ya está en uso.' });
            user.username = username.trim();
        }

        if (favoriteLine !== undefined) user.profileConfig.favoriteLine = favoriteLine;
        if (avatarColor !== undefined) user.profileConfig.avatarColor = avatarColor;

        await user.save();

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                highScore: user.highScore,
                profileConfig: user.profileConfig,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ============================================================
// DELETE /api/users/progress  (protegida)
// Vacía el arreglo learnedStations del usuario en la BD
// ============================================================
const deleteProgress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
        user.learnedStations = [];
        await user.save();
        res.json({ message: 'Progreso reiniciado.', total: 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getLeaderboard, unlockAchievement, patchProgress, deleteProgress, getProfile, updateProfile };
