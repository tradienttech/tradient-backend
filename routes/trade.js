// routes/trade.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.post('/trade', async (req, res) => {
  try {
    const { uid, symbol, pnl, side, timestamp } = req.body;

    // Basic validation
    if (!uid || !symbol || typeof pnl !== 'number' || !side || !timestamp) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const { error } = await supabase.from('trades').insert([
      { uid, symbol, pnl, side, timestamp: new Date(timestamp) }
    ]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ success: false, message: 'Supabase error', error });
    }

    return res.json({ success: true, message: 'Trade logged successfully' });
  } catch (err) {
    console.error('Error in /api/trade:', err);
    return res.status(500).json({ success: false, message: 'Unexpected error', error: err.message });
  }
});

module.exports = router;
