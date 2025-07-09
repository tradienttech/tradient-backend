const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const startRoute = require('./routes/start');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 🔥 Logs every request
app.use((req, res, next) => {
  console.log(`🔥 Incoming request: ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/start', startRoute);

// Default route (for Render root URL check)
app.get('/', (req, res) => {
  res.send('🟢 Tradient backend is running!');
});

// Start server
app.listen(port, () => {
  console.log(`✅ Backend running on port ${port}`);
});
