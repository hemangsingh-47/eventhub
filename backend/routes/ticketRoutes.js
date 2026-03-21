const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  stripeWebhook,
  getMyTickets,
  validateTicket,
  checkInTicket,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

// Stripe webhook must use raw body parsing, NOT express.json()
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// Protected routes
router.post('/create-checkout-session', protect, createCheckoutSession);
router.get('/my-tickets', protect, getMyTickets);

// Organizer routes
router.get('/validate/:qrCodeData', protect, validateTicket);
router.post('/checkin/:qrCodeData', protect, checkInTicket);

module.exports = router;
