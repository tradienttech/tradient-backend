const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// Helper to extract field by label
function getField(fields, label) {
  return fields.find(
    (f) => f.label?.trim().toLowerCase() === label.trim().toLowerCase()
  )?.value;
}

router.post('/start', async (req, res) => {
  try {
    const fields = req.body?.data?.fields;
    if (!fields) {
      return res.status(400).json({ success: false, message: 'Missing required fields', received: req.body });
    }

    // Extract values
    const fullName = getField(fields, 'Full Name');
    const email = getField(fields, 'Email');
    const total = parseInt(getField(fields, 'Total')) || 0;

    // Plan text from dropdown options
    const planField = fields.find(f => f.label === 'Plan');
    const planId = planField?.value?.[0];
    const plan = planField?.options?.find(opt => opt.id === planId)?.text || 'Unknown';

    // Add-ons from multiple choice
    const addonsField = fields.find(f => f.label === 'Add-ons (Optional)');
    const addonIds = addonsField?.value || [];
    const addons = addonIds.map(id => {
      const opt = addonsField.options.find(o => o.id === id);
      return opt?.text || id;
    });

    // Check if user already exists
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
        email,
        full_name: fullName,
        plan,
        addons,
        total,
        signup_date: new Date(),
      },
    ]);

    if (error) {
      return res.status(500).json({ success: false, message: 'Supabase error', error });
    }

    return res.json({ success: true, message: 'User created successfully' });

  } catch (err) {
    console.error('Error in /api/start:', err);
    return res.status(500).json({ success: false, message: 'Unexpected error', error: err.message });
  }
});

module.exports = router;
