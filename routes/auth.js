const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register a user (Limited: should be used once for initial admin)
router.post('/register', [
    check('username', 'Usuario es obligatorio').not().isEmpty(),
    check('password', 'Password debe tener al menos 6 caracteres').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ error: 'El usuario ya existe' });

        user = new User({ username, password });
        await user.save();

        res.status(201).json({ message: 'Usuario administrador creado con éxito' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', [
    check('username', 'Usuario es obligatorio').exists(),
    check('password', 'Contraseña es obligatoria').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });

        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '8h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
