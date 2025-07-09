const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.post('/trade', async (req, res) => {
  try {
    const { email, trade_type, symbol, entry_price, exit_price, pnl, timestamp } = req.body;

    // Check required fields
    if (!email || !trade_type || !symbol || pnl === undefined || !timestamp) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Insert trade into Supabase
    const { error } = await supabase.from('trades').insert([
      {
        email,
        trade_type,
        symbol,
        entry_price,
        exit_price,
        pnl,
        timestamp: new Date(timestamp),
      }
    ]);

    if (error) {
      return res.status(500).json({ success: false, message: 'Supabase error', error });
    }

    return res.json({ success: true, message: 'Trade logged successfully' });
  } catch (err) {
    console.error('Error in /api/trade:', err);
    return res.status(500).json({ success: false, message: 'Unexpected error', error: err.message });
  }
});

module.exports = router;
