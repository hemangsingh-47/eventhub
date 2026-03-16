const Bookmark = require('../models/Bookmark');
const Event = require('../models/Event');

// @desc    Toggle bookmark for an event
// @route   POST /api/bookmarks/:eventId
// @access  Private
const toggleBookmark = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const userId = req.user._id;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({ user: userId, event: eventId });

    if (existingBookmark) {
      // Remove bookmark
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      res.json({ message: 'Bookmark removed', bookmarked: false });
    } else {
      // Add bookmark
      await Bookmark.create({ user: userId, event: eventId });
      res.status(201).json({ message: 'Event bookmarked', bookmarked: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's bookmarked events
// @route   GET /api/bookmarks
// @access  Private
const getBookmarkedEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookmarks = await Bookmark.find({ user: userId })
      .populate({
        path: 'event',
        populate: { path: 'organizerId', select: 'name email' } // populate organizer details if needed
      })
      .sort({ createdAt: -1 });
    
    // Extract just the events
    const events = bookmarks.map(b => b.event).filter(e => e != null); // filter out nulls if event was deleted

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if an event is bookmarked by current user
// @route   GET /api/bookmarks/check/:eventId
// @access  Private
const checkBookmarkStatus = async (req, res) => {
  try {
    const existingBookmark = await Bookmark.findOne({ user: req.user._id, event: req.params.eventId });
    res.json({ bookmarked: !!existingBookmark });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  toggleBookmark,
  getBookmarkedEvents,
  checkBookmarkStatus
};
