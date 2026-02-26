const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
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
    tipoVehiculo: {
        type: String,
        enum: ['Auto/Camioneta', 'Camión / Línea Pesada', 'Autoelevador', 'Flota Empresarial', ''],
        default: ''
    },
    servicio: {
        type: String,
        required: [true, 'El servicio es obligatorio'],
        enum: ['Cambio de Aceite', 'Control de Fluidos', 'Servicio a Camión', 'Service de Autoelevador', 'Atención a Empresa/Flota', 'Consulta General']
    },
    fecha: {
        type: Date
    },
    mensaje: {
        type: String,
        trim: true,
        maxlength: [1000, 'El mensaje es muy largo']
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Contactado', 'Cerrado'],
        default: 'Pendiente'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contact', contactSchema);
