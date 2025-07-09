// routes/trade.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.post('/trade', async (req, res) => {
  const { uid, email, trade_type, symbol, entry_price, exit_price, pnl, timestamp } = req.body;

  if (!uid || !symbol || typeof pnl === 'undefined') {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const { error } = await supabase.from('trades').insert([
      {
        uid,
        email: email || null,
        trade_type: trade_type || 'SIMULATED',
        symbol,
        entry_price: entry_price || null,
        exit_price: exit_price || null,
        pnl,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
      },
    ]);

    if (error) {
      return res.status(500).json({ success: false, message: 'Supabase error', error });
    }

    return res.json({ success: true, message: 'Trade recorded' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unexpected error', error: err.message });
  }
});

module.exports = router;
