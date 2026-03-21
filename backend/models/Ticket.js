const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  stripeSessionId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled', 'checked-in'], default: 'pending' },
  qrCodeData: { type: String }, // UUID generated upon successful payment
  purchaseDate: { type: Date },
  checkInDate: { type: Date }
}, { timestamps: true });

// Prevent duplicate ticket purchases for the same event by the same user if they already paid
ticketSchema.index({ user: 1, event: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
