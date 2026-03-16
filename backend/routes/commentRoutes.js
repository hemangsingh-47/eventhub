const express = require('express');
const router = express.Router();
const { addComment, getEventComments, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addComment);
router.get('/:eventId', getEventComments);
router.delete('/:id', protect, deleteComment);

module.exports = router;
