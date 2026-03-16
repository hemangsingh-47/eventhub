const express = require('express');
const router = express.Router();
const { subscribeUser, unsubscribeUser, getVapidPublicKey } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/vapid-public-key', getVapidPublicKey);
router.post('/subscribe', protect, subscribeUser);
router.post('/unsubscribe', protect, unsubscribeUser);

module.exports = router;
