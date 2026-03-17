const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerRules, loginRules } = require('../middleware/validate');
const User = require('../models/User');

router.post('/register', registerRules, registerUser);
router.post('/login', loginRules, loginUser);

// Profile route
router.get('/profile', protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    points: req.user.points,
    badges: req.user.badges,
    profileImage: req.user.profileImage,
  });
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.profileImage = req.body.profileImage !== undefined ? req.body.profileImage : user.profileImage;

    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      points: user.points,
      badges: user.badges,
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
