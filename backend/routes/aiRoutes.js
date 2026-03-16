const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect, organizer } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limit all AI routes
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: 'Too many AI requests, slow down.' }
});

router.use(protect);
router.use(aiLimiter);

// Feature 1: AI Description Generator
router.post('/generate-description', organizer, aiController.generateDescription);

// Feature 2: AI Recommendations
router.get('/recommendations', aiController.getRecommendations);

// Feature 3: AI Smart Search
router.post('/smart-search', aiController.smartSearch);

// Feature 4: AI Chatbot
router.post('/chat', aiController.chat);

// Feature 5: AI Post-Event Summary
router.post('/event-summary/:eventId', organizer, aiController.getEventSummary);

// Feature 6: AI Attendance Predictor
router.post('/predict-attendance', organizer, aiController.predictAttendance);

// Feature 7: AI Content Moderation
router.post('/moderate', aiController.moderateContent);

module.exports = router;
