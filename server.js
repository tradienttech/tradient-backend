require('dotenv').config();
const express = require('express');
const cors = require('cors');
const startRoute = require('./routes/start');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route (for testing Render deployment)
app.get('/', (req, res) => {
  res.send('✅ Tradient backend is live on Render.');
});

// Routes
app.use('/api/start', startRoute);

// Port setup (Render will inject PORT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
