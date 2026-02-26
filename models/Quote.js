const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    empresa: {
        type: String,
        required: [true, 'El nombre de la empresa es obligatorio']
    },
    contacto: {
        type: String,
        required: [true, 'El nombre del contacto es obligatorio']
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor agregá un correo válido']
    },
    telefono: {
        type: String,
        required: [true, 'El teléfono es obligatorio']
    },
    flotaSize: {
        type: Number,
        required: [true, 'El tamaño de la flota es obligatorio']
    },
    tipoServicio: {
        type: String,
        required: [true, 'El servicio necesitado es obligatorio']
    },
    mensaje: {
        type: String
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Cotizado', 'Cerrado'],
        default: 'Pendiente'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quote', quoteSchema);
