const mongoose = require('mongoose');

/**
 * Stores the result of a lucky draw for a given contest.
 * Only one document per contest name is allowed.
 */
const luckyDrawSchema = new mongoose.Schema({
  contest:       { type: String, default: 'World Cup Prediction 2026', unique: true },
  winnerId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Prediction' },
  name:          { type: String, required: true },
  phone:         { type: String, required: true },
  drawTime:      { type: Date,   default: Date.now },
  eligibleCount: { type: Number, required: true },
  method:        { type: String, default: 'crypto.randomInt' },
});

module.exports = mongoose.model('LuckyDraw', luckyDrawSchema);
