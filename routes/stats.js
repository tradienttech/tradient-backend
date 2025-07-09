// routes/stats.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET /api/stats/:uid
router.get('/stats/:uid', async (req, res) => {
  const uid = req.params.uid;

  if (!uid) {
    return res.status(400).json({ success: false, message: 'UID is required' });
  }

  try {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('uid', uid);

    if (error) {
      return res.status(500).json({ success: false, message: 'Supabase error', error });
    }

    // Aggregate stats
    const totalTrades = data.length;
    const totalPnl = data.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const winRate =
      totalTrades > 0
        ? (data.filter((t) => t.pnl > 0).length / totalTrades) * 100
        : 0;

    return res.json({
      success: true,
      stats: {
        uid,
        totalTrades,
        totalPnl,
        winRate: winRate.toFixed(2) + '%',
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Unexpected error', error: err.message });
  }
});

module.exports = router;
