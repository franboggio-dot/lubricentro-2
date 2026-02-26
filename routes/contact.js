const express = require('express');
const { check, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const Quote = require('../models/Quote');
const sendEmail = require('../utils/mailer');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ================= CONTACT ROUTES ================= //

// @route   POST /api/contact
// @desc    Enviar formulario de contacto general
// @access  Público
router.post(
    '/contact',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Por favor agregá un correo válido').isEmail(),
        check('telefono', 'El teléfono es obligatorio').not().isEmpty(),
        check('servicio', 'Seleccioná un servicio').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newContact = await Contact.create(req.body);

            // Descomentar para enviar mail real
            /*
            await sendEmail({
              email: process.env.EMAIL_USER,
              subject: `[Web] Nuevo Mensaje - ${req.body.servicio}`,
              html: `<h2>Nuevo contacto general</h2>
                     <p><strong>De:</strong> ${req.body.nombre}</p>
                     <p><strong>Email:</strong> ${req.body.email}</p>
                     <p><strong>Tel:</strong> ${req.body.telefono}</p>
                     <p><strong>Vehículo:</strong> ${req.body.tipoVehiculo || 'N/A'}</p>
                     <p><strong>Fecha estimativa:</strong> ${req.body.fecha || 'N/A'}</p>
                     <p><strong>Mensaje:</strong> ${req.body.mensaje || 'N/A'}</p>`
            });
            */

            res.status(201).json({ success: true, data: newContact });
        } catch (err) {
            console.error('Error in /api/contact:', err.message);
            res.status(500).json({ error: 'Error al enviar tu solicitud.' });
        }
    }
);

// @route   GET /api/contact
// @desc    Listar todos los contactos generales
// @access  Privado
router.get('/contact', protect, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: contacts.length, data: contacts });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener mensajes.' });
    }
});

// ================= QUOTE ROUTES ================= //

// @route   POST /api/quotes
// @desc    Enviar formulario de cotización B2B
// @access  Público
router.post(
    '/quotes',
    [
        check('empresa', 'Empresa es mandatorio').not().isEmpty(),
        check('contacto', 'Nombre de contacto es mandatorio').not().isEmpty(),
        check('email', 'Correo válido requerido').isEmail(),
        check('telefono', 'Teléfono es requerido').not().isEmpty(),
        check('flotaSize', 'Tamaño de flota requerido').isNumeric(),
        check('tipoServicio', 'Tipo de servicio es requerido').not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newQuote = await Quote.create(req.body);

            // Descomentar para enviar mail real
            /*
            await sendEmail({
              email: process.env.EMAIL_USER,
              subject: `[Web] Nueva Solicitud cotización B2B - ${req.body.empresa}`,
              html: `<h2>Solicitud de Cotización a Flotas</h2>
                     <p><strong>Empresa:</strong> ${req.body.empresa}</p>
                     <p><strong>Contacto Responsable:</strong> ${req.body.contacto}</p>
                     <p><strong>Email:</strong> ${req.body.email}</p>
                     <p><strong>Telefóno:</strong> ${req.body.telefono}</p>
                     <p><strong>Tamaño Flota:</strong> ${req.body.flotaSize} vehículos</p>
                     <p><strong>Servicio que solicita:</strong> ${req.body.tipoServicio}</p>
                     <p><strong>Mensaje:</strong> ${req.body.mensaje || 'N/A'}</p>`
            });
            */

            res.status(201).json({ success: true, data: newQuote });
        } catch (err) {
            console.error('Error in /api/quotes:', err.message);
            res.status(500).json({ error: 'Error al solicitar cotización.' });
        }
    }
);

// @route   GET /api/quotes
// @desc    Listar cotizaciones B2B
// @access  Privado
router.get('/quotes', protect, async (req, res) => {
    try {
        const quotes = await Quote.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: quotes.length, data: quotes });
    } catch (err) {
        res.status(500).json({ error: 'Error en la DB.' });
    }
});

module.exports = router;
