// routes/stats.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/stats', async (req, res) => {
  const uid = req.query.uid;
  if (!uid) {
    return res.status(400).json({ success: false, message: 'UID is required' });
  }

  try {
    const { data, error } = await supabase
      .from('trades')
      .select('pnl')
      .eq('uid', uid);

    if (error) throw error;

    const totalTrades = data.length;
    const totalPnl = data.reduce((acc, trade) => acc + trade.pnl, 0);

    return res.json({
      success: true,
      stats: {
        uid,
        totalTrades,
        totalPnl,
        averagePnl: totalTrades > 0 ? totalPnl / totalTrades : 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Supabase error', error: err.message });
  }
});

module.exports = router;
