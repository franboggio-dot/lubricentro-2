const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
    empresa: {
        type: String,
        required: true,
        trim: true
    },
    contacto: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    cantidadFlota: {
        type: Number,
        required: true
    },
    tipoServicio: {
        type: String,
        required: true
    },
    mensaje: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quote', QuoteSchema);
