const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const Settings = require('../models/Settings');

// Create a new prediction
router.post('/', async (req, res) => {
  try {
    const { name, phone, winner, runnerUp, winnerGoals, runnerUpGoals } = req.body;

    // Validation
    if (!name || !phone || !winner || !runnerUp || winnerGoals === undefined || runnerUpGoals === undefined) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    
    if (winner === runnerUp) {
      return res.status(400).json({ error: 'Winner and Runner-up cannot be the same team.' });
    }

    if (winnerGoals <= runnerUpGoals) {
      return res.status(400).json({ error: 'Winner goals must be greater than runner-up goals.' });
    }

    // Check for duplicate phone
    const existing = await Prediction.findOne({ phone });
    if (existing) {
      return res.status(400).json({ error: 'A prediction with this phone number already exists.' });
    }

    const prediction = new Prediction({
      name,
      phone,
      winner,
      runnerUp,
      winnerGoals,
      runnerUpGoals
    });

    await prediction.save();
    res.status(201).json({ message: 'Prediction submitted successfully!' });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Phone number already registered.' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leaderboard (only if unlocked)
router.get('/leaderboard', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    if (!settings.leaderboardUnlocked) {
      return res.status(403).json({ error: 'Leaderboard is currently locked.', locked: true });
    }

    const leaderboard = await Prediction.find()
      .select('name points winner runnerUp winnerGoals runnerUpGoals')
      .sort({ points: -1, createdAt: 1 })
      .limit(100);

    res.json({ leaderboard, locked: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
