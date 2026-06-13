const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { parse } = require('json2csv');
const Admin = require('../models/Admin');
const Prediction = require('../models/Prediction');
const Settings = require('../models/Settings');
const auth = require('../middleware/authMiddleware');

// Init admin from env on first run if no admin exists
router.post('/init', async (req, res) => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      const admin = new Admin({
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword
      });
      await admin.save();
      
      // Also init settings
      await Settings.create({});
      
      return res.json({ message: 'Admin initialized from .env' });
    }
    res.status(400).json({ error: 'Admin already exists' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const payload = { admin: { id: admin.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Dashboard Stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    const totalPredictions = await Prediction.countDocuments();
    
    // Most predicted winner
    const winnerStats = await Prediction.aggregate([
      { $group: { _id: '$winner', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const mostPredictedWinner = winnerStats.length > 0 ? winnerStats[0]._id : 'N/A';

    // Most predicted score
    const scoreStats = await Prediction.aggregate([
      { $group: { 
          _id: { winnerGoals: '$winnerGoals', runnerUpGoals: '$runnerUpGoals' }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    let mostPredictedScore = 'N/A';
    if (scoreStats.length > 0) {
      mostPredictedScore = `${scoreStats[0]._id.winnerGoals} - ${scoreStats[0]._id.runnerUpGoals}`;
    }

    // Most predicted runner up
    const runnerUpStats = await Prediction.aggregate([
      { $group: { _id: '$runnerUp', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const mostPredictedRunnerUp = runnerUpStats.length > 0 ? runnerUpStats[0]._id : 'N/A';

    res.json({
      totalPredictions,
      mostPredictedWinner,
      mostPredictedRunnerUp,
      mostPredictedScore
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Predictions with filtering
router.get('/predictions', auth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = { 
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } }
        ] 
      };
    }
    const predictions = await Prediction.find(query).sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Export CSV
router.get('/export', auth, async (req, res) => {
  try {
    const predictions = await Prediction.find().lean();
    if (predictions.length === 0) {
      return res.status(400).json({ error: 'No data to export' });
    }
    const csv = parse(predictions, { fields: ['name', 'phone', 'winner', 'runnerUp', 'winnerGoals', 'runnerUpGoals', 'points', 'createdAt'] });
    res.header('Content-Type', 'text/csv');
    res.attachment('predictions.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Settings
router.get('/settings', auth, async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Settings
router.put('/settings', auth, async (req, res) => {
  try {
    const { leaderboardUnlocked, pointsWinner, pointsRunnerUp, pointsExactScore, pointsGoalDiff, actualWinner, actualRunnerUp, actualWinnerGoals, actualRunnerUpGoals } = req.body;
    let settings = await Settings.findOne();
    
    settings.leaderboardUnlocked = leaderboardUnlocked !== undefined ? leaderboardUnlocked : settings.leaderboardUnlocked;
    settings.pointsWinner = pointsWinner !== undefined ? pointsWinner : settings.pointsWinner;
    settings.pointsRunnerUp = pointsRunnerUp !== undefined ? pointsRunnerUp : settings.pointsRunnerUp;
    settings.pointsExactScore = pointsExactScore !== undefined ? pointsExactScore : settings.pointsExactScore;
    settings.pointsGoalDiff = pointsGoalDiff !== undefined ? pointsGoalDiff : settings.pointsGoalDiff;
    
    settings.actualWinner = actualWinner !== undefined ? actualWinner : settings.actualWinner;
    settings.actualRunnerUp = actualRunnerUp !== undefined ? actualRunnerUp : settings.actualRunnerUp;
    settings.actualWinnerGoals = actualWinnerGoals !== undefined ? actualWinnerGoals : settings.actualWinnerGoals;
    settings.actualRunnerUpGoals = actualRunnerUpGoals !== undefined ? actualRunnerUpGoals : settings.actualRunnerUpGoals;

    await settings.save();

    // If actual results are set, recalculate points
    if (settings.actualWinner && settings.actualRunnerUp) {
      const predictions = await Prediction.find();
      for (let p of predictions) {
        let points = 0;
        
        const correctWinner = p.winner === settings.actualWinner;
        const correctRunnerUp = p.runnerUp === settings.actualRunnerUp;

        if (correctWinner) points += settings.pointsWinner;
        if (correctRunnerUp) points += settings.pointsRunnerUp;
        
        // Only award score and goal difference points if the predicted matchup is completely correct
        if (correctWinner && correctRunnerUp) {
          if (p.winnerGoals === settings.actualWinnerGoals && p.runnerUpGoals === settings.actualRunnerUpGoals) {
            points += settings.pointsExactScore;
          } else if ((p.winnerGoals - p.runnerUpGoals) === (settings.actualWinnerGoals - settings.actualRunnerUpGoals)) {
            points += settings.pointsGoalDiff;
          }
        }
        
        p.points = points;
        await p.save();
      }
    }

    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
