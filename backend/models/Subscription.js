const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: Number,
    default: null,
  },
  keys: {
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    }
  }
}, { timestamps: true });

// Prevent duplicate subscriptions for the same user + endpoint
subscriptionSchema.index({ user: 1, endpoint: 1 }, { unique: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
