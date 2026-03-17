const Event = require('../models/Event');
const User = require('../models/User');

// ——— Cosine Similarity Utility ———
const cosineSimilarity = (vecA, vecB) => {
  const allKeys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
  let dotProduct = 0, magA = 0, magB = 0;

  for (const key of allKeys) {
    const a = vecA[key] || 0;
    const b = vecB[key] || 0;
    dotProduct += a * b;
    magA += a * a;
    magB += b * b;
  }

  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
};

// Build a vector from an event's category + tags
const buildEventVector = (event) => {
  const vec = {};
  // Category gets a higher weight
  if (event.category) vec[event.category] = 2;
  // Each tag contributes
  if (event.tags && event.tags.length > 0) {
    event.tags.forEach(tag => {
      const normalized = tag.toLowerCase().trim();
      if (normalized) vec[normalized] = (vec[normalized] || 0) + 1;
    });
  }
  return vec;
};

// @desc    Get AI-powered event recommendations for logged-in user
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const userPrefs = user.preferences && user.preferences.size > 0 
      ? Object.fromEntries(user.preferences.entries()) 
      : {};

    // If user has no preferences yet (cold start), return popular upcoming events
    if (Object.keys(userPrefs).length === 0) {
      const popular = await Event.find({
        date: { $gte: new Date() },
        availableSeats: { $gt: 0 }
      })
        .populate('organizerId', 'name email')
        .sort({ attendees: -1, date: 1 })
        .limit(6)
        .lean();

      return res.json({
        recommendations: popular,
        strategy: 'popular',
        message: 'Showing popular events. RSVP to events to get personalized recommendations!'
      });
    }

    // Get events the user has already RSVP'd to
    const attendedEvents = await Event.find({
      attendees: req.user._id
    }).select('_id').lean();
    const attendedIds = attendedEvents.map(e => e._id.toString());

    // Get all upcoming events the user hasn't RSVP'd to
    const upcoming = await Event.find({
      _id: { $nin: attendedIds },
      date: { $gte: new Date() },
      availableSeats: { $gt: 0 }
    })
      .populate('organizerId', 'name email')
      .lean();

    // Score each event via cosine similarity against user preference vector
    const scored = upcoming.map(event => {
      const eventVec = buildEventVector(event);
      const score = cosineSimilarity(userPrefs, eventVec);
      return { ...event, _score: score };
    });

    // Sort by score descending, take top 6
    const recommendations = scored
      .sort((a, b) => b._score - a._score)
      .slice(0, 6);

    res.json({
      recommendations,
      strategy: 'content-matching',
      message: 'Personalized recommendations based on your interests'
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendations };
