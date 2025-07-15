const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, role, name } = req.body;
  if (!email || !password || !role || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { role, name },
    email_confirm: true,
  });
  if (error) return res.status(400).json({ error: error.message });
  // Issue JWT for app
  const token = jwt.sign({ id: data.user.id, email, role, name }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: data.user.id, email, role, name } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return res.status(401).json({ error: 'Invalid credentials' });
  const { role, name } = data.user.user_metadata;
  const token = jwt.sign({ id: data.user.id, email, role, name }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: data.user.id, email, role, name } });
});

module.exports = router; 