// src/app.js - Complete version with all features
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

console.log('Starting server...');
console.log('Environment check:');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');

const app = express();

// CORS Configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://127.0.0.1:3000',
        /\.cognitiveclass\.ai$/,
        /\.proxy\.cognitiveclass\.ai$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// MongoDB Connection
const connectDB = async () => {
    try {
        if (process.env.MONGO_URI) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('✅ MongoDB connected successfully');
            console.log(`📊 Connected to database: ${mongoose.connection.db.databaseName}`);
        } else {
            console.log('⚠️  No MONGO_URI provided, running without database');
        }
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
    }
};

// Connect to database
connectDB();

// Basic routes
app.get('/', (req, res) => {
    console.log('Root route hit');
    res.json({ 
        message: 'User Management Service is running!',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    console.log('Health check route hit');
    res.json({ 
        status: 'OK', 
        service: 'User Management Service',
        timestamp: new Date().toISOString(),
        port: process.env.PORT || 5000,
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Load user routes
try {
    const userRoutes = require('./routes/userRoutes');
    app.use('/api/users', userRoutes);
    console.log('✅ User routes loaded successfully');
} catch (error) {
    console.log('⚠️  User routes not found, creating demo endpoints:', error.message);
    
    // Demo registration endpoint
    app.post('/users/register', (req, res) => {
        console.log('Registration attempt:', req.body);
        
        // Validate required fields
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                required: ['username', 'email', 'password'],
                received: Object.keys(req.body)
            });
        }
        
        // Demo success response
        res.status(201).json({ 
            message: 'User registered successfully (demo)',
            user: {
                id: Date.now(),
                username,
                email,
                createdAt: new Date().toISOString()
            },
            note: 'This is a demo endpoint. Actual user routes not loaded.'
        });
    });
    
    // Demo users list endpoint
    app.get('/users', (req, res) => {
        res.json({ 
            message: 'Users endpoint (demo)',
            users: [
                {
                    id: 1,
                    username: 'demo_user',
                    email: 'demo@example.com',
                    createdAt: new Date().toISOString()
                }
            ],
            note: 'This is a demo endpoint. Actual user routes not loaded.'
        });
    });
}

// Load error handler
try {
    const errorHandler = require('./utils/errorHandler');
    app.use(errorHandler);
    console.log('✅ Error handler loaded successfully');
} catch (error) {
    console.log('⚠️  Custom error handler not found, using default');
    
    // Default error handler
    app.use((err, req, res, next) => {
        console.error('Error occurred:', err.message);
        console.error(err.stack);
        res.status(500).json({ 
            message: 'Something went wrong!', 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    });
}

// 404 handler (must be after all routes)
app.use('*', (req, res) => {
    console.log('404 - Route not found:', req.originalUrl);
    res.status(404).json({ 
        message: 'Route not found', 
        path: req.originalUrl,
        availableRoutes: [
            'GET /',
            'GET /health',
            'GET /users (demo)',
            'POST /users/register (demo)',
            'POST /api/users/register (if user routes loaded)'
        ]
    });
});

const PORT = process.env.PORT || 5000;

console.log(`Attempting to start server on port ${PORT}...`);

app.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
    console.log(`✅ Server successfully running on port ${PORT}`);
    console.log(`🌐 Local URL: http://localhost:${PORT}`);
    console.log(`🔗 External URL: https://cmalba10-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai`);
    console.log('📝 Available endpoints:');
    console.log('  - GET /health');
    console.log('  - POST /users/register (demo)');
    console.log('  - POST /api/users/register (if routes loaded)');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⏹️  Shutting down server...');
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
        console.log('📊 MongoDB connection closed');
    }
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});