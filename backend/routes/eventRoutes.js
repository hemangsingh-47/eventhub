const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent } = require('../controllers/eventController');
const { protect, organizer } = require('../middleware/authMiddleware');

router.route('/')
  .get(getEvents)
  .post(protect, organizer, createEvent);

router.route('/:id')
  .get(getEventById);

module.exports = router;
