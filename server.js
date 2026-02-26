require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false, // For simpler initial deployment
}));

// Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Demasiadas solicitudes desde esta IP, por favor intentá de nuevo más tarde.'
});

app.use('/api/', apiLimiter);

// Serve static files from 'public' folder (Standard for Vercel and local Express)
app.use(express.static(path.join(__dirname, 'public')));

// Custom Routes
app.use('/api/auth', authRoutes);
app.use('/api', contactRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
    console.error(err.stack); // For development
    res.status(500).json({ error: 'Algo salió mal en el servidor.' });
});

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;

// Connect to MongoDB (non-blocking for server startup in serverless)
if (DB_URI) {
    mongoose.connect(DB_URI)
        .then(() => {
            console.log('Connected to MongoDB');
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
        });
} else {
    console.warn('WARNING: MONGO_URI is missing. Database features will fail.');
}

// Export for Vercel
module.exports = app;

// Only listen if not in Vercel environment (module.parent is for older node, require.main for newer)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
