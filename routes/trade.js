const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.post('/trade', async (req, res) => {
  try {
    const { email, trade_type, symbol, entry_price, exit_price, pnl, timestamp } = req.body;

    if (!email || !symbol || !trade_type || entry_price == null || exit_price == null || pnl == null) {
      return res.status(400).json({ success: false, message: 'Missing required fields', received: req.body });
    }

    const { error } = await supabase.from('trades').insert([
      {
        email,
        trade_type,
        symbol,
        entry_price,
        exit_price,
        pnl,
        timestamp: timestamp ? new Date(timestamp) : new Date()
      }
    ]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ success: false, message: 'Supabase error', error });
    }

    return res.json({ success: true, message: 'Trade logged' });

  } catch (err) {
    console.error('Error in /api/trade:', err);
    return res.status(500).json({ success: false, message: 'Unexpected error', error: err.message });
  }
});

module.exports = router;
