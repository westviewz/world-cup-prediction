const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  winner: { type: String, required: true },
  runnerUp: { type: String, required: true },
  winnerGoals: { type: Number, required: true, min: 0 },
  runnerUpGoals: { type: Number, required: true, min: 0 },
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);
