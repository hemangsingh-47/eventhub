const Event = require('../models/Event');

// @desc    Get all events (with pagination & search)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.q) {
      query = { $text: { $search: req.query.q } };
    }

    const events = await Event.find(query)
      .populate('organizerId', 'name email')
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      page,
      pages: Math.ceil(total / limit),
      totalEvents: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizerId', 'name email');

    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private/Organizer
const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, category, totalSeats, imageUrl } = req.body;

    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      category,
      totalSeats,
      availableSeats: totalSeats,
      organizerId: req.user._id,
      imageUrl
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent
};
