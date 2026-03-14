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
      attendees: [],
      imageUrl
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Organizer
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Ensure the organizer owns this event
    if (event.organizerId && event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    }

    const { title, description, date, time, location, category, totalSeats, imageUrl } = req.body;

    // If totalSeats changed, adjust availableSeats proportionally
    if (totalSeats && totalSeats !== event.totalSeats) {
      const seatDiff = totalSeats - event.totalSeats;
      event.availableSeats = Math.max(0, event.availableSeats + seatDiff);
      event.totalSeats = totalSeats;
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.category = category || event.category;
    if (imageUrl !== undefined) event.imageUrl = imageUrl;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Organizer
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Ensure the organizer owns this event
    if (event.organizerId && event.organizerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    RSVP to an event (one per user)
// @route   POST /api/events/:id/rsvp
// @access  Private
const rsvpEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user has already registered
    if (event.attendees && event.attendees.map(a => a.toString()).includes(req.user._id.toString())) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({ message: 'Event is fully booked' });
    }

    event.attendees.push(req.user._id);
    event.availableSeats -= 1;
    await event.save();

    res.json({ message: 'RSVP successful', availableSeats: event.availableSeats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  rsvpEvent,
};
