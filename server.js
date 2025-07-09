const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/start', require('./routes/start'));
app.use('/api/trade', require('./routes/trade')); // ✅ Add this

// Default route
app.get('/', (req, res) => res.send('✅ Tradient Backend Running'));

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
