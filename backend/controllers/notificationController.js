const Subscription = require('../models/Subscription');

// @desc    Save a user's web push subscription
// @route   POST /api/notifications/subscribe
// @access  Private
const subscribeUser = async (req, res) => {
  try {
    const { subscription } = req.body;
    const userId = req.user._id;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({ message: 'Invalid subscription object' });
    }

    // Upsert subscription
    await Subscription.findOneAndUpdate(
      { user: userId, endpoint: subscription.endpoint }, // Match
      { 
        user: userId,
        endpoint: subscription.endpoint,
        expirationTime: subscription.expirationTime,
        keys: subscription.keys
      }, // Update
      { upsert: true, new: true, setDefaultsOnInsert: true } // Options
    );

    res.status(201).json({ message: 'Push subscription saved successfully.' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a user's web push subscription
// @route   POST /api/notifications/unsubscribe
// @access  Private
const unsubscribeUser = async (req, res) => {
  try {
    const { endpoint } = req.body;
    const userId = req.user._id;

    if (!endpoint) {
      return res.status(400).json({ message: 'Endpoint is required to unsubscribe' });
    }

    await Subscription.findOneAndDelete({ user: userId, endpoint });

    res.json({ message: 'Unsubscribed successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get VAPID public key for frontend subscription
// @route   GET /api/notifications/vapid-public-key
// @access  Public
const getVapidPublicKey = (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};

module.exports = {
  subscribeUser,
  unsubscribeUser,
  getVapidPublicKey
};
