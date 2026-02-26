const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        lowercase: true,
        trim: true
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio']
    },
    vehiculo: {
        type: String,
        enum: ['', 'Auto/Camioneta', 'Camión / Línea Pesada', 'Autoelevador', 'Flota Empresarial'],
        default: ''
    },
    servicio: {
        type: String,
        required: [true, 'El servicio es obligatorio']
    },
    fechaSugerida: {
        type: String // String for simplicity from input date
    },
    mensaje: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contact', ContactSchema);
