const express = require('express');
const router = express.Router();
const { addRating, getEventRating } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addRating);
router.get('/:eventId', getEventRating);

module.exports = router;
