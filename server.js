// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const startRoute = require('./routes/start');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/start', startRoute);

// Default Route
app.get('/', (req, res) => {
  res.send('Tradient backend is running 🚀');
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
