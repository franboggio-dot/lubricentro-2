require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

const app = express();

// Security middlewares
// COMPLETELY DISABLED FOR DEBUGGING
// app.use(helmet());
// app.use(helmet.contentSecurityPolicy({
//     useDefaults: true,
//     directives: {
//         "default-src": ["'self'"],
//         "script-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com"],
//         "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
//         "font-src": ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
//         "img-src": ["'self'", "data:", "https://images.unsplash.com", "https://maps.gstatic.com", "https://maps.googleapis.com"]
//     }
// }));

// CORS setup
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' })); // Body parser
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: { error: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo después de 15 minutos.' }
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
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Error interno del servidor.'
            : err.message
    });
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
            console.error('\n======================================================');
            console.error('WARNING: MongoDB connection failed.');
            console.error(err.message);
            console.error('The backend APIs will return errors, but the frontend will load.');
            console.error('======================================================\n');
        });
} else {
    console.warn('WARNING: MONGO_URI is missing. Database features will be disabled.');
}

// Start Express server ONLY if not being imported (for local development)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Open http://localhost:${PORT} in your browser.`);
    });
}

// Export the app for Vercel
module.exports = app;
