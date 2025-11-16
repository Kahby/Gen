const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  fullName: {
    type: String,
    required: true
  },
  teamNumber: {
    type: String,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['meme', 'art', 'storytelling', 'song', 'poetry']
  },
  prompt: {
    type: String,
    required: true
  },
  outputFileName: {
    type: String,
    default: null
  },
  outputFilePath: {
    type: String,
    default: null
  },
  scores: {
    precision: { type: Number, default: 0 },
    design: { type: Number, default: 0 },
    creativity: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    overall: { type: Number, default: 0 }
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('FormSubmission', formSubmissionSchema);

