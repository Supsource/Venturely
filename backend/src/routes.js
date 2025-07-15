const express = require('express');
const router = express.Router();

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
founderRoutes.get('/profile', (req, res) => res.json({ message: 'Get founder profile (to implement)' }));
founderRoutes.post('/profile', (req, res) => res.json({ message: 'Create founder profile (to implement)' }));
founderRoutes.put('/profile', (req, res) => res.json({ message: 'Update founder profile (to implement)' }));

// Investor profile endpoints
investorRoutes.get('/profile', (req, res) => res.json({ message: 'Get investor profile (to implement)' }));
investorRoutes.post('/profile', (req, res) => res.json({ message: 'Create investor profile (to implement)' }));
investorRoutes.put('/profile', (req, res) => res.json({ message: 'Update investor profile (to implement)' }));

// Startup endpoints
startupRoutes.get('/', (req, res) => res.json({ message: 'Get startup (to implement)' }));
startupRoutes.post('/', (req, res) => res.json({ message: 'Create startup (to implement)' }));
startupRoutes.put('/', (req, res) => res.json({ message: 'Update startup (to implement)' }));

// Pitch endpoints
pitchRoutes.get('/', (req, res) => res.json({ message: 'Get all pitches/feed (to implement)' }));
pitchRoutes.post('/', (req, res) => res.json({ message: 'Create pitch (to implement)' }));

// File upload endpoint
fileRoutes.post('/upload', (req, res) => res.json({ message: 'Upload file (to implement)' }));

router.get('/', (req, res) => {
  res.json({ message: 'Venturely API root' });
});

module.exports = router; 