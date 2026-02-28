const mongoose = require("mongoose");

const StationSchema = new mongoose.Schema({
    name: { type: String, required: true },     // Ej: "Pantitlán"
    meaning: { type: String, default: "Información pendiente..." }, // Ej: "Lugar entre banderas"
    year: { type: String, default: "?" },

}, { _id: false });

const LineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    stations: [StationSchema],
});

module.exports = mongoose.model("Line", LineSchema);