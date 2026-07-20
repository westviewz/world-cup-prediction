const express    = require('express');
const router     = express.Router();
const crypto     = require('crypto'); // NEVER use Math.random() for draws
const Prediction = require('../models/Prediction');
const LuckyDraw  = require('../models/LuckyDraw');
const auth       = require('../middleware/authMiddleware');

const CONTEST = 'World Cup Prediction 2026';

// ─────────────────────────────────────────────────────────────
// Helper: resolve eligible participants (highest‑points group)
// ─────────────────────────────────────────────────────────────
async function getEligible() {
  const top = await Prediction.findOne().sort({ points: -1 }).select('points').lean();
  if (!top || top.points <= 0) return { eligible: [], topScore: 0 };

  const eligible = await Prediction
    .find({ points: top.points })
    .select('name phone createdAt points')
    .sort({ createdAt: 1 })
    .lean();

  return { eligible, topScore: top.points };
}

// ─────────────────────────────────────────────────────────────
// GET /api/admin/lucky-draw/eligible
// Returns all participants tied for the highest points score.
// ─────────────────────────────────────────────────────────────
router.get('/eligible', auth, async (req, res) => {
  try {
    const { eligible, topScore } = await getEligible();
    res.json({ eligible, topScore });
  } catch (err) {
    console.error('[lucky-draw/eligible]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/admin/lucky-draw/draw
// Selects one winner at random using crypto.randomInt().
// Saves the result to MongoDB. Rejects duplicate draws.
// ─────────────────────────────────────────────────────────────
router.post('/draw', auth, async (req, res) => {
  try {
    // Prevent duplicate draws
    const existing = await LuckyDraw.findOne({ contest: CONTEST });
    if (existing) {
      return res.status(400).json({
        error: 'Draw already conducted. Reset before drawing again.',
      });
    }

    const { eligible } = await getEligible();
    if (eligible.length === 0) {
      return res.status(400).json({ error: 'No eligible participants found.' });
    }

    // Cryptographically secure random selection — never Math.random()
    const randomIndex = crypto.randomInt(eligible.length);
    const winner      = eligible[randomIndex];

    const draw = await LuckyDraw.create({
      contest:       CONTEST,
      winnerId:      winner._id,
      name:          winner.name,
      phone:         winner.phone,
      eligibleCount: eligible.length,
      method:        'crypto.randomInt',
    });

    res.json({
      name:          draw.name,
      phone:         draw.phone,
      drawTime:      draw.drawTime,
      eligibleCount: draw.eligibleCount,
      method:        draw.method,
    });
  } catch (err) {
    console.error('[lucky-draw/draw]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/admin/lucky-draw/result
// Returns the stored draw result (or null if not yet conducted).
// ─────────────────────────────────────────────────────────────
router.get('/result', auth, async (req, res) => {
  try {
    const result = await LuckyDraw.findOne({ contest: CONTEST }).lean();
    if (!result) return res.json({ result: null });

    res.json({
      result: {
        name:          result.name,
        phone:         result.phone,
        drawTime:      result.drawTime,
        eligibleCount: result.eligibleCount,
        method:        result.method,
      },
    });
  } catch (err) {
    console.error('[lucky-draw/result]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/admin/lucky-draw/reset
// Deletes the stored result so a new draw can be conducted.
// ─────────────────────────────────────────────────────────────
router.post('/reset', auth, async (req, res) => {
  try {
    await LuckyDraw.deleteOne({ contest: CONTEST });
    res.json({ message: 'Draw reset successfully. You may conduct a new draw.' });
  } catch (err) {
    console.error('[lucky-draw/reset]', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
