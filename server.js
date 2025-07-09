const express = require('express');
const cors = require('cors');
const startRoute = require('./routes/start'); // ✅ path to start.js

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ This must come **before** app.listen
app.use('/api', startRoute);

// Optional: root route to verify backend is live
app.get('/', (req, res) => {
  res.send('Tradient Backend is Live');
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
