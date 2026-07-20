const express = require('express');
const router = express.Router();
const Prediction = require('../models/Prediction');
const Settings = require('../models/Settings');

// Get public status
router.get('/status', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json({ predictionsOpen: settings.predictionsOpen });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new prediction
router.post('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    if (!settings.predictionsOpen) {
      return res.status(403).json({ error: 'Predictions are closed.' });
    }

    const { name, phone, winner, runnerUp, winnerGoals, runnerUpGoals } = req.body;

    // Validation
    if (!name || !phone || !winner || !runnerUp || winnerGoals === undefined || runnerUpGoals === undefined) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (/[0-9]/.test(name)) {
      return res.status(400).json({ error: 'Name must not contain numbers.' });
    }
    
    if (winner === runnerUp) {
      return res.status(400).json({ error: 'Winner and Runner-up cannot be the same team.' });
    }

    if (winnerGoals < 0 || runnerUpGoals < 0) {
      return res.status(400).json({ error: 'Goals cannot be negative.' });
    }

    if (winnerGoals < runnerUpGoals) {
      return res.status(400).json({ error: 'Winner goals cannot be less than runner-up goals.' });
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

// Public: Get lucky draw winner (shown on homepage after draw is conducted)
router.get('/lucky-draw-winner', async (req, res) => {
  try {
    const LuckyDraw = require('../models/LuckyDraw');
    const result = await LuckyDraw.findOne({ contest: 'World Cup Prediction 2026' }).lean();
    if (!result) return res.json({ winner: null });
    res.json({
      winner: {
        name:          result.name,
        phone:         result.phone,
        drawTime:      result.drawTime,
        eligibleCount: result.eligibleCount,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
