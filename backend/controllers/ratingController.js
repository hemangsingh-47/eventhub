const Rating = require('../models/Rating');

// @desc    Add or update a rating for an event
// @route   POST /api/ratings
// @access  Private
const addRating = async (req, res) => {
  try {
    const { eventId, value } = req.body;

    if (!value || value < 1 || value > 5) {
      return res.status(400).json({ message: 'Rating value must be between 1 and 5' });
    }

    // Upsert rating (update if exists, otherwise create)
    const rating = await Rating.findOneAndUpdate(
      { event: eventId, user: req.user._id },
      { value },
      { new: true, upsert: true }
    );

    // Calculate new average and count
    const ratings = await Rating.find({ event: eventId });
    const count = ratings.length;
    const average = ratings.reduce((acc, curr) => acc + curr.value, 0) / count;

    // Broadcast live rating update
    if (req.io) {
      req.io.to(`event:${eventId}`).emit('rating:update', {
        eventId,
        count,
        average: parseFloat(average.toFixed(1))
      });
    }

    res.json({ rating, average, count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get average rating for an event
// @route   GET /api/ratings/:eventId
// @access  Public
const getEventRating = async (req, res) => {
  try {
    const ratings = await Rating.find({ event: req.params.eventId });
    
    if (ratings.length === 0) {
      return res.json({ average: 0, count: 0 });
    }

    const count = ratings.length;
    const average = ratings.reduce((acc, curr) => acc + curr.value, 0) / count;

    res.json({
      average: parseFloat(average.toFixed(1)),
      count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addRating, getEventRating };
