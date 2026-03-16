const express = require('express');
const router = express.Router();
const { generateEventCalendar } = require('../controllers/calendarController');

// Calendar links can be public
router.get('/:eventId', generateEventCalendar);

module.exports = router;
