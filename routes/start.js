const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Helper: Find a field's value by label
const getField = (fields, label) => {
  return fields.find(
    (f) => f.label?.trim().toLowerCase() === label.trim().toLowerCase()
  )?.value;
};

router.post('/start', async (req, res) => {
  try {
    const fields = req.body?.data?.fields;

    if (!fields) {
      return res.status(400).json({
        success: false,
        message: 'Missing fields in request',
        received: req.body,
      });
    }

    // Extract individual values
    const fullName = getField(fields, 'Full Name') || '';
    const email = getField(fields, 'Email') || '';
    const total = parseInt(getField(fields, 'Total')) || 0;

    // Handle plan (dropdown)
    const planField = fields.find((f) => f.label === 'Plan');
    const planId = planField?.value?.[0];
    const plan =
      planField?.options?.find((opt) => opt.id === planId)?.text || 'Unknown';

    // Handle add-ons (multiple choice)
    const addonsField = fields.find((f) => f.label === 'Add-ons (Optional)');
    const addonIds = addonsField?.value || [];
    const addons = addonIds.map((id) => {
      const option = addonsField.options.find((opt) => opt.id === id);
      return option?.text || id;
    });

    // Validation
    if (!email || !plan) {
      return res.status(400).json({
        success: false,
        message: 'Missing email or plan in form submission',
      });
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('challenge_users')
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return res.json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Insert into Supabase
    const { error } = await supabase.from('challenge_users').insert([
      {
        full_name: fullName,
        email,
        plan,
        addons,
        total,
        signup_date: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({
        success: false,
        message: 'Supabase insert failed',
        error: error.message,
      });
    }

    return res.json({ success: true, message: 'User inserted successfully' });
  } catch (err) {
    console.error('Fatal error in /api/start:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
});

module.exports = router;
