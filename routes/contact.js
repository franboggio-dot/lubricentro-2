const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Contact = require('../models/Contact');
const Quote = require('../models/Quote');
const { sendNotificationEmail } = require('../utils/mailer');

// @route   POST api/contact
// @desc    Submit a contact form
router.post('/contact', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Email no válido').isEmail(),
    check('telefono', 'Teléfono es obligatorio').not().isEmpty(),
    check('servicio', 'Servicio es obligatorio').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const newContact = new Contact(req.body);
        const contact = await newContact.save();

        // Enviar mail (opcional, no bloqueante)
        sendNotificationEmail('Nuevo Contacto General', req.body);

        res.json(contact);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   POST api/quotes
// @desc    Submit a business quote request
router.post('/quotes', [
    check('empresa', 'Empresa es obligatoria').not().isEmpty(),
    check('contacto', 'Nombre de contacto es obligatorio').not().isEmpty(),
    check('email', 'Email no válido').isEmail(),
    check('telefono', 'Teléfono es obligatorio').not().isEmpty(),
    check('cantidadFlota', 'Cantidad de flota es obligatoria').isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const newQuote = new Quote(req.body);
        const quote = await newQuote.save();

        // Enviar mail
        sendNotificationEmail('Nueva Solicitud Cotización B2B', req.body);

        res.json(quote);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   GET api/contact
// @desc    Get all contact messages (Admin Protected)
router.get('/contact', auth, async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (err) {
        res.status(500).send('Error del servidor');
    }
});

// @route   GET api/quotes
// @desc    Get all quotes (Admin Protected)
router.get('/quotes', auth, async (req, res) => {
    try {
        const quotes = await Quote.find().sort({ createdAt: -1 });
        res.json(quotes);
    } catch (err) {
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
