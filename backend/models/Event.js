const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['hackathon', 'workshop', 'seminar', 'cultural', 'other'],
    required: true 
  },
  totalSeats: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, default: '' },
}, { timestamps: true });

// Add text index for searching
eventSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Event', eventSchema);
