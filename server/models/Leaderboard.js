const mongoose = require('mongoose');

const leaderboardEntrySchema = new mongoose.Schema({
  rank: { type: Number, default: 0 },
  teamName: { type: String, required: true },
  score: { type: Number, default: 0 },
  notes: { type: String, default: '' }
}, { _id: false });

const leaderboardSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
    enum: ['meme', 'art', 'storytelling', 'song', 'poetry']
  },
  entries: {
    type: [leaderboardEntrySchema],
    default: []
  },
  isVisible: {
    type: Boolean,
    default: false
  },
  sourceFileName: {
    type: String,
    default: null
  },
  sourceFilePath: {
    type: String,
    default: null
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema);

