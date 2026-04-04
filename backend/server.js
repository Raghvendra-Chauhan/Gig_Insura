const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB
require('./config/db');

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/policy', require('./routes/policy'));
app.use('/api/claims', require('./routes/claims'));
app.use('/api/payout', require('./routes/payout'));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'GigInsura backend running ✅', time: new Date() });
});

// Start trigger engine
const { startTriggerEngine } = require('./services/triggerEngine');
startTriggerEngine();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));