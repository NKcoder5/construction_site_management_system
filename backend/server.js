const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Yogesh Constructions Backend',
        version: '1.0.0'
    });
});

// API Routes
app.get('/api/status', (req, res) => {
    res.json({
        online: true,
        message: 'Backend is running',
        features: {
            offlineFirst: true,
            aiEnabled: true,
            cloudSync: false // Future feature
        }
    });
});

// Weather proxy endpoint (optional - can fetch from external API)
app.get('/api/weather/:location', async (req, res) => {
    try {
        const { location } = req.params;
        // In production, you would call a real weather API here
        // For now, return mock data
        res.json({
            location,
            temperature: 28,
            condition: 'Partly Cloudy',
            humidity: 65,
            windSpeed: 12,
            forecast: 'Good conditions for outdoor work',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Future sync endpoints placeholder
app.post('/api/sync/logs', (req, res) => {
    res.json({
        success: true,
        message: 'Sync feature coming soon',
        synced: 0
    });
});

app.post('/api/sync/finance', (req, res) => {
    res.json({
        success: true,
        message: 'Sync feature coming soon',
        synced: 0
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        path: req.path
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🏗️  Yogesh Constructions Backend Started');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
    console.log('💾 Note: This is a minimal backend. Main app runs offline-first with IndexedDB');
});

module.exports = app;
