const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'organizer'], default: 'student' },
  preferences: { type: Map, of: Number, default: {} },
  points: { type: Number, default: 0 },
  badges: [{ type: String }],
  profileImage: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
