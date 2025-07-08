const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

router.post('/start', async (req, res) => {
  try {
    const body = req.body.fields || req.body;

    const email = body.email;
    const plan = body.plan;
    const full_name = body.full_name || "N/A";
    const uid = req.body.response_id || body.uid || `uid_${Date.now()}`;

    let profit_split = "60%";

    if (body["add-ons"]) {
      const addons = Array.isArray(body["add-ons"])
        ? body["add-ons"]
        : [body["add-ons"]];

      addons.forEach((addon) => {
        if (addon.includes("90%") || addon.includes("profit")) {
          profit_split = "90%";
        }
      });
    }

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
          full_name,
          plan,
          profit_split
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
