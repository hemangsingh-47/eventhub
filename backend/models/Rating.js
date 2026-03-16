const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, { timestamps: true });

// Ensure one user can only rate an event once
ratingSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
