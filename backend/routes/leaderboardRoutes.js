const express = require('express');
const router = express.Router();
const { getLeaderboard, getMyRank } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getLeaderboard);
router.get('/me', protect, getMyRank);

module.exports = router;
