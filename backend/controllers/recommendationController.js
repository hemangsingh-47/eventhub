const { GoogleGenerativeAI } = require("@google/generative-ai");
const Event = require('../models/Event');
const User = require('../models/User');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ——— Cosine Similarity Utility (Preserved for initial filtering) ———
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

const buildEventVector = (event) => {
  const vec = {};
  if (event.category) vec[event.category] = 2;
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

    const attendedEvents = await Event.find({ attendees: req.user._id }).select('_id').lean();
    const attendedIds = attendedEvents.map(e => e._id.toString());

    // 1. Cold Start Check
    if (Object.keys(userPrefs).length === 0) {
      const popular = await Event.find({
        _id: { $nin: attendedIds },
        date: { $gte: new Date() },
        availableSeats: { $gt: 0 }
      })
        .populate('organizerId', 'name email')
        .sort({ attendees: -1, date: 1 })
        .limit(6)
        .lean();

      return res.json({
        recommendations: popular,
        strategy: 'popular-cold-start',
        message: 'Explore trending events to get personalized recommendations!'
      });
    }

    // 2. Initial Candidate Filtering (Cosine Similarity)
    const upcoming = await Event.find({
      _id: { $nin: attendedIds },
      date: { $gte: new Date() },
      availableSeats: { $gt: 0 }
    })
      .populate('organizerId', 'name email')
      .lean();

    const candidates = upcoming.map(event => {
      const eventVec = buildEventVector(event);
      const score = cosineSimilarity(userPrefs, eventVec);
      return { ...event, _initialScore: score };
    })
    .sort((a, b) => b._initialScore - a._initialScore)
    .slice(0, 15); // Send top 15 to Gemini for refined ranking

    // 3. Refined Semantic Ranking with Gemini
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const userInterestDesc = Object.entries(userPrefs)
        .map(([tag, score]) => `${tag} (weight: ${score})`)
        .join(', ');

      const eventListStr = candidates.map((e, i) => (
        `ID: ${i}, Title: ${e.title}, Category: ${e.category}, Description: ${e.description.substring(0, 100)}...`
      )).join('\n');

      const prompt = `Rank the FOLLOWING EVENTS based on a user's interests: [${userInterestDesc}].
      Pick the top 6 most relevant events.
      
      Events:
      ${eventListStr}
      
      Response Format: JSON array of indices only, e.g. [5, 2, 0, 8, 1, 3]`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const match = responseText.match(/\[.*\]/);
      
      if (match) {
        const topIndices = JSON.parse(match[0]);
        const finalRecommendations = topIndices
          .map(idx => candidates[idx])
          .filter(Boolean);

        return res.json({
          recommendations: finalRecommendations,
          strategy: 'gemini-refined',
          message: 'Top picks analyzed by EventHub AI based on your unique interests'
        });
      }
    } catch (aiError) {
      console.error('Gemini Recommendation Refinement Failed:', aiError);
      // Fallback to pure cosine similarity if AI fails
    }

    // 4. Fallback Logic
    const fallbackRecs = candidates.slice(0, 6);
    res.json({
      recommendations: fallbackRecs,
      strategy: 'content-matching-fallback',
      message: 'Personalized recommendations based on your activity'
    });

  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendations };
