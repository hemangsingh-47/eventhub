const express = require('express');
const router = express.Router();
const { getOverviewStats, getRsvpTrend, getSeatUtilization } = require('../controllers/analyticsController');
const { protect, organizer } = require('../middleware/authMiddleware');

router.use(protect, organizer);

router.get('/overview', getOverviewStats);
router.get('/rsvp-trend', getRsvpTrend);
router.get('/seat-util', getSeatUtilization);

module.exports = router;
