const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AchievementSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    unlockedAt: { type: Date, default: Date.now },
}, { _id: false });

const LearnedStationSchema = new mongoose.Schema({
    lineName: { type: String, required: true },
    stationName: { type: String, required: true },
    learnedAt: { type: Date, default: Date.now },
}, { _id: false });

const ProfileConfigSchema = new mongoose.Schema({
    favoriteLine: { type: String, default: '' },
    avatarColor: { type: String, default: '#0066CC' },
}, { _id: false });

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    highScore: {
        type: Number,
        default: 0,
    },
    achievements: {
        type: [AchievementSchema],
        default: [],
    },
    learnedStations: {
        type: [LearnedStationSchema],
        default: [],
    },
    profileConfig: {
        type: ProfileConfigSchema,
        default: () => ({}),
    },
}, { timestamps: true });

// Hash de contraseña antes de guardar (Mongoose 9 maneja async automáticamente)
UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
