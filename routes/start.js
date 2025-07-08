const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

router.post('/start', async (req, res) => {
  try {
    const body = req.body.fields || req.body;

    const email = body.email;
    const plan = body.plan;
    const uid = req.body.response_id || body.uid || `uid_${Date.now()}`;
    const addons = {
      profit_split: body.profit_split || "60%",
      payout_weekly: body.payout_weekly === true || body.payout_weekly === "true"
    };

    if (!email || !plan) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        received: req.body
      });
    }

    const { data, error } = await supabase
      .from('challenge_users')
      .insert([
        {
          uid,
          email,
          plan,
          profit_split: addons.profit_split,
          payout_weekly: addons.payout_weekly
        }
      ]);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
    }

    return res.status(200).json({
      success: true,
      user: data[0]
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
});

module.exports = router;
