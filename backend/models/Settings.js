const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  predictionsOpen: { type: Boolean, default: true },
  leaderboardUnlocked: { type: Boolean, default: false },
  pointsWinner: { type: Number, default: 50 },
  pointsRunnerUp: { type: Number, default: 30 },
  pointsExactScore: { type: Number, default: 100 },
  pointsGoalDiff: { type: Number, default: 20 },
  // Actual result can be set when tournament ends to calculate points
  actualWinner: { type: String, default: '' },
  actualRunnerUp: { type: String, default: '' },
  actualWinnerGoals: { type: Number, default: null },
  actualRunnerUpGoals: { type: Number, default: null }
});

module.exports = mongoose.model('Settings', settingsSchema);
