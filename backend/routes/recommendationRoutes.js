const express = require('express');
const router = express.Router();
const { getRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/recommendations — AI-powered personalized event feed
router.get('/', protect, getRecommendations);

module.exports = router;
