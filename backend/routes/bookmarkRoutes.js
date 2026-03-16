const express = require('express');
const router = express.Router();
const { toggleBookmark, getBookmarkedEvents, checkBookmarkStatus } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getBookmarkedEvents);
router.post('/:eventId', toggleBookmark);
router.get('/check/:eventId', checkBookmarkStatus);

module.exports = router;
