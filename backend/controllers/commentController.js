const Comment = require('../models/Comment');

// @desc    Add a comment (or reply) to an event
// @route   POST /api/comments
// @access  Private
const addComment = async (req, res) => {
  try {
    const { eventId, text, parentId } = req.body;

    if (!text || !eventId) {
      return res.status(400).json({ message: 'Event ID and comment text are required' });
    }

    const comment = new Comment({
      event: eventId,
      user: req.user._id,
      text,
      parentId: parentId || null
    });

    const savedComment = await comment.save();
    
    // Populate user info before returning
    const populated = await savedComment.populate('user', 'name');

    // Broadcast live comment update via Socket.io
    if (req.io) {
      req.io.to(`event:${eventId}`).emit('comment:new', populated);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments for an event
// @route   GET /api/comments/:eventId
// @access  Public
const getEventComments = async (req, res) => {
  try {
    const comments = await Comment.find({ event: req.params.eventId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only the author can delete
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);

    // Broadcast live deletion via Socket.io
    if (req.io) {
      req.io.to(`event:${comment.event}`).emit('comment:deleted', req.params.id);
    }

    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, getEventComments, deleteComment };
