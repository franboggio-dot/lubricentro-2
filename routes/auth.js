const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Generar Token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

// @route   POST /api/auth/login
// @desc    Autenticar administrador y obtener token
// @access  Público
router.post('/login', [
    check('username', 'El usuario es obligatorio').exists(),
    check('password', 'La contraseña es obligatoria').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        res.json({
            success: true,
            token: generateToken(user._id)
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// @route   POST /api/auth/register (Para crear admin inicialmente)
// @desc    Crear usuario administrador
// @access  Deshabilitado luego del primer uso por seguridad
router.post('/register', async (req, res) => {
    // Sólo disponible si no hay usuarios
    const usersCount = await User.countDocuments();
    if (usersCount > 0) {
        return res.status(403).json({ error: 'Ya existe un administrador' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        const user = await User.create({ username, password });
        res.status(201).json({ success: true, user: { username: user.username } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout de usuario
// @access  Privado (handled en el frontend removiendo el token, por lo que devolvemos un sucess)
router.post('/logout', (req, res) => {
    res.status(200).json({ success: true, data: {} });
});

module.exports = router;
