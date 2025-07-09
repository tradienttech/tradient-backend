// routes/leaderboard.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET /api/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('trades')
      .select('email, pnl')
      .order('pnl', { ascending: false });

    if (error) {
      return res.status(500).json({ success: false, message: 'Supabase error', error });
    }

    // Aggregate total P&L by user
    const leaderboard = data.reduce((acc, trade) => {
      const user = acc.find((u) => u.email === trade.email);
      if (user) {
        user.total_pnl += trade.pnl;
      } else {
        acc.push({ email: trade.email, total_pnl: trade.pnl });
      }
      return acc;
    }, []);

    // Sort by total_pnl descending
    leaderboard.sort((a, b) => b.total_pnl - a.total_pnl);

    res.json({ success: true, leaderboard });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unexpected error', error: err.message });
  }
});

module.exports = router;
