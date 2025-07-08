const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// POST /api/start
router.post('/', async (req, res) => {
  try {
    const { email, plan, addons, uid } = req.body;

    console.log('📩 Received data:', { email, plan, addons, uid });

    // Check required fields
    if (!email || !plan || !uid) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        received: { email, plan, uid },
      });
    }

    // Insert into Supabase table
    const { data, error } = await supabase
      .from('challenge_users') // ✅ Make sure this table exists!
      .insert([{
        email,
        plan,
        addons,
        uid,
        signup_date: new Date().toISOString()
      }]);

    // Log response
    console.log('📤 Supabase Insert →', { data, error });

    // Handle Supabase errors
    if (error) {
      console.error('❌ Supabase Error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Insert failed',
        details: error.details || null,
        hint: error.hint || null,
      });
    }

    // Respond with success
    return res.status(200).json({
      success: true,
      user: data[0],
    });

  } catch (err) {
    console.error('❌ Server Exception:', err);
    return res.status(500).json({
      success: false,
      message: 'Unhandled server error',
      error: err.message,
    });
  }
});

module.exports = router;
