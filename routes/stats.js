const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/stats/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const { data: trades, error } = await supabase
      .from('trades')
      .select('*')
      .eq('uid', uid);

    if (error) {
      return res.status(500).json({ success: false, message: 'Supabase error', error });
    }

    if (!trades || trades.length === 0) {
      return res.json({ success: true, message: 'No trades yet', stats: null });
    }

    const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const tradeCount = trades.length;
    const wins = trades.filter(t => t.pnl > 0).length;
    const losses = trades.filter(t => t.pnl < 0).length;
    const winRate = ((wins / tradeCount) * 100).toFixed(2);

    const stats = {
      uid,
      totalPnl,
      tradeCount,
      wins,
      losses,
      winRate: `${winRate}%`
    };

    res.json({ success: true, stats });

  } catch (err) {
    console.error('Error in /api/stats:', err);
    res.status(500).json({ success: false, message: 'Unexpected error', error: err.message });
  }
});

module.exports = router;
