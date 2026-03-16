const User = require('../models/User');

// @desc    Get top users by points
// @route   GET /api/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;

    const topUsers = await User.find({ role: 'student' })
      .select('name points badges createdAt')
      .sort({ points: -1, createdAt: 1 })
      .limit(limit);

    // Add rank manually since MongoDB doesn't return a dense rank natively
    const rankedUsers = topUsers.map((user, index) => ({
      _id: user._id,
      name: user.name,
      points: user.points || 0,
      badges: user.badges || [],
      joinedAt: user.createdAt,
      rank: index + 1
    }));

    res.json(rankedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's rank
// @route   GET /api/leaderboard/me
// @access  Private
const getMyRank = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(400).json({ message: 'Leaderboard rank is only for students' });
    }

    const { points } = req.user;

    // Rank is the number of students with strictly more points + 1
    const betterUsersCount = await User.countDocuments({
      role: 'student',
      points: { $gt: points || 0 }
    });

    res.json({
      rank: betterUsersCount + 1,
      points: points || 0,
      badges: req.user.badges || []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLeaderboard,
  getMyRank
};
