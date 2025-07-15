const express = require('express');
const router = express.Router();
const pool = require('./db');
const { authenticateToken, requireRole } = require('./middleware');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const upload = multer({ dest: 'uploads/' }); // temp local storage
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Placeholder route imports (to be implemented)
const authRoutes = require('./auth');
const founderRoutes = express.Router();
const investorRoutes = express.Router();
const startupRoutes = express.Router();
const pitchRoutes = express.Router();
const fileRoutes = express.Router();

// Example: router.use('/auth', authRoutes);

router.use('/auth', authRoutes);
router.use('/founder', founderRoutes);
router.use('/investor', investorRoutes);
router.use('/startup', startupRoutes);
router.use('/pitch', pitchRoutes);
router.use('/file', fileRoutes);

// Founder profile endpoints
founderRoutes.get('/profile', authenticateToken, requireRole('founder'), async (req, res) => {
  try {
    const userId = req.user.id;
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1 AND role = $2', [userId, 'founder']);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'Founder not found' });
    const profileResult = await pool.query('SELECT * FROM founder_profiles WHERE id = $1', [userId]);
    res.json({
      user: userResult.rows[0],
      profile: profileResult.rows[0] || null
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

founderRoutes.post('/profile', authenticateToken, requireRole('founder'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, linkedin } = req.body;
    // Check if already exists
    const exists = await pool.query('SELECT 1 FROM founder_profiles WHERE id = $1', [userId]);
    if (exists.rows.length > 0) return res.status(400).json({ error: 'Profile already exists' });
    const result = await pool.query(
      'INSERT INTO founder_profiles (id, bio, linkedin, updated_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [userId, bio, linkedin]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

founderRoutes.put('/profile', authenticateToken, requireRole('founder'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { bio, linkedin } = req.body;
    const result = await pool.query(
      'UPDATE founder_profiles SET bio = $1, linkedin = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [bio, linkedin, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Investor profile endpoints
investorRoutes.get('/profile', authenticateToken, requireRole('investor'), async (req, res) => {
  try {
    const userId = req.user.id;
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1 AND role = $2', [userId, 'investor']);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'Investor not found' });
    const profileResult = await pool.query('SELECT * FROM investor_profiles WHERE id = $1', [userId]);
    res.json({
      user: userResult.rows[0],
      profile: profileResult.rows[0] || null
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

investorRoutes.post('/profile', authenticateToken, requireRole('investor'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { firm, website, bio, check_size, preferred_sectors, preferred_geos } = req.body;
    // Check if already exists
    const exists = await pool.query('SELECT 1 FROM investor_profiles WHERE id = $1', [userId]);
    if (exists.rows.length > 0) return res.status(400).json({ error: 'Profile already exists' });
    const result = await pool.query(
      'INSERT INTO investor_profiles (id, firm, website, bio, check_size, preferred_sectors, preferred_geos, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *',
      [userId, firm, website, bio, check_size, preferred_sectors, preferred_geos]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

investorRoutes.put('/profile', authenticateToken, requireRole('investor'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { firm, website, bio, check_size, preferred_sectors, preferred_geos } = req.body;
    const result = await pool.query(
      'UPDATE investor_profiles SET firm = $1, website = $2, bio = $3, check_size = $4, preferred_sectors = $5, preferred_geos = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [firm, website, bio, check_size, preferred_sectors, preferred_geos, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Startup endpoints
startupRoutes.get('/', authenticateToken, requireRole('founder'), async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM startups WHERE founder_id = $1', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

startupRoutes.post('/', authenticateToken, requireRole('founder'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, logo_url, website, industry, stage, funding_need, equity_offered, problem, solution, market, team, traction } = req.body;
    const result = await pool.query(
      `INSERT INTO startups (founder_id, name, logo_url, website, industry, stage, funding_need, equity_offered, problem, solution, market, team, traction, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()) RETURNING *`,
      [userId, name, logo_url, website, industry, stage, funding_need, equity_offered, problem, solution, market, team, traction]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

startupRoutes.put('/:id', authenticateToken, requireRole('founder'), async (req, res) => {
  try {
    const userId = req.user.id;
    const startupId = req.params.id;
    const { name, logo_url, website, industry, stage, funding_need, equity_offered, problem, solution, market, team, traction } = req.body;
    const result = await pool.query(
      `UPDATE startups SET name = $1, logo_url = $2, website = $3, industry = $4, stage = $5, funding_need = $6, equity_offered = $7, problem = $8, solution = $9, market = $10, team = $11, traction = $12, updated_at = NOW()
       WHERE id = $13 AND founder_id = $14 RETURNING *`,
      [name, logo_url, website, industry, stage, funding_need, equity_offered, problem, solution, market, team, traction, startupId, userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Startup not found or not owned by user' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Pitch endpoints
// GET /pitch - feed (investors: full, public: preview)
pitchRoutes.get('/', authenticateToken, async (req, res) => {
  try {
    const { sector, stage, geography, traction } = req.query;
    let baseQuery = `SELECT p.*, s.name as startup_name, s.industry, s.stage, s.market, s.traction, u.name as founder_name FROM pitches p
      JOIN startups s ON p.startup_id = s.id
      JOIN users u ON p.founder_id = u.id WHERE 1=1`;
    const params = [];
    let idx = 1;
    if (sector) { baseQuery += ` AND $${idx} = ANY(s.industry)`; params.push(sector); idx++; }
    if (stage) { baseQuery += ` AND s.stage = $${idx}`; params.push(stage); idx++; }
    if (geography) { baseQuery += ` AND s.market ILIKE $${idx}`; params.push(`%${geography}%`); idx++; }
    if (traction) { baseQuery += ` AND s.traction ILIKE $${idx}`; params.push(`%${traction}%`); idx++; }
    baseQuery += ' ORDER BY p.created_at DESC';
    const result = await pool.query(baseQuery, params);
    // If investor, show all; if founder, show own; else, show public preview
    if (req.user.role === 'investor') {
      res.json(result.rows);
    } else if (req.user.role === 'founder') {
      res.json(result.rows.filter(r => r.founder_id === req.user.id));
    } else {
      // Public preview: hide confidential info
      res.json(result.rows.map(r => ({
        id: r.id,
        startup_name: r.startup_name,
        industry: r.industry,
        stage: r.stage,
        description: r.description,
        tags: r.tags,
        created_at: r.created_at
      })));
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// POST /pitch - create (founders only)
pitchRoutes.post('/', authenticateToken, requireRole('founder'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { startup_id, description, funding_ask, tags, pitch_deck_url, video_url } = req.body;
    // Validate startup ownership
    const startup = await pool.query('SELECT * FROM startups WHERE id = $1 AND founder_id = $2', [startup_id, userId]);
    if (startup.rows.length === 0) return res.status(403).json({ error: 'Not your startup' });
    const result = await pool.query(
      `INSERT INTO pitches (founder_id, startup_id, description, funding_ask, tags, pitch_deck_url, video_url, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *`,
      [userId, startup_id, description, funding_ask, tags, pitch_deck_url, video_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Saved pitches endpoints (investor only)
pitchRoutes.post('/:id/save', authenticateToken, requireRole('investor'), async (req, res) => {
  try {
    const investorId = req.user.id;
    const pitchId = req.params.id;
    // Check if already saved
    const exists = await pool.query('SELECT 1 FROM saved_pitches WHERE investor_id = $1 AND pitch_id = $2', [investorId, pitchId]);
    if (exists.rows.length > 0) return res.status(400).json({ error: 'Pitch already saved' });
    const result = await pool.query('INSERT INTO saved_pitches (investor_id, pitch_id, saved_at) VALUES ($1, $2, NOW()) RETURNING *', [investorId, pitchId]);
    // (Optional) Insert mock notification for founder
    await pool.query('INSERT INTO files (user_id, url, type) VALUES ($1, $2, $3)', [investorId, `Pitch ${pitchId} saved`, 'notification']);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

pitchRoutes.delete('/:id/save', authenticateToken, requireRole('investor'), async (req, res) => {
  try {
    const investorId = req.user.id;
    const pitchId = req.params.id;
    const result = await pool.query('DELETE FROM saved_pitches WHERE investor_id = $1 AND pitch_id = $2 RETURNING *', [investorId, pitchId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Pitch unsaved' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

pitchRoutes.get('/saved', authenticateToken, requireRole('investor'), async (req, res) => {
  try {
    const investorId = req.user.id;
    const result = await pool.query(
      `SELECT p.* FROM pitches p
       JOIN saved_pitches s ON p.id = s.pitch_id
       WHERE s.investor_id = $1`,
      [investorId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Mock notifications endpoint for founders
founderRoutes.get('/notifications', authenticateToken, requireRole('founder'), async (req, res) => {
  try {
    // In production, use a notifications table. Here, mock with files table entries of type 'notification'.
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM files WHERE user_id = $1 AND type = $2 ORDER BY uploaded_at DESC', [userId, 'notification']);
    res.json(result.rows.map(n => ({ message: n.url, date: n.uploaded_at })));
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// File upload endpoint
fileRoutes.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    // Upload to Supabase Storage (mock: just return local path for now)
    // In production, use supabase.storage.from('pitchdecks').upload(...)
    const fileUrl = `/uploads/${file.filename}`;
    const result = await pool.query(
      'INSERT INTO files (user_id, url, type, uploaded_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [userId, fileUrl, file.mimetype]
    );
    res.status(201).json({ url: fileUrl, file: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.get('/', (req, res) => {
  res.json({ message: 'Venturely API root' });
});

module.exports = router; 