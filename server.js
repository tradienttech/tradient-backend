// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`🔥 Incoming request: ${req.method} ${req.url}`);
  next();
});

// Routes
const startRoute = require('./routes/start');
const tradeRoute = require('./routes/trade');
const leaderboardRoute = require('./routes/leaderboard');
const statsRoute = require('./routes/stats');


app.use('/api', startRoute);
app.use('/api', tradeRoute);
app.use('/api', leaderboardRoute);
app.use('/api', statsRoute);


app.get('/', (req, res) => {
  res.send('🔧 Tradient Backend is Live!');
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
