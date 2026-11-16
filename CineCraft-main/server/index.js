require('dotenv').config();
const express = require('express');
const cors = require('cors');
const scriptRoutes = require('./routes/scriptRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', scriptRoutes);
app.use('/api', imageRoutes);
app.use('/api', require('./routes/chatRoutes'));
app.use('/api/characters', require('./routes/characterRoutes'));
app.use('/api/schedule', require('./routes/scheduleRoutes'));

// Health Check
app.get('/', (req, res) => {
    res.send('CineCraft API is running...');
});

const { connectToDb } = require('./db/connection');

// ... (existing code)

// Initialize DB Connection then start server
connectToDb((err) => {
    if (!err) {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } else {
        console.error("Database connection failed. Server not started.");
    }
});
