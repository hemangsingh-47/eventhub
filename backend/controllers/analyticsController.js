const Event = require('../models/Event');
const mongoose = require('mongoose');

// @desc    Get dashboard overview stats
// @route   GET /api/analytics/overview
// @access  Private/Organizer
const getOverviewStats = async (req, res) => {
  try {
    const organizerId = req.user._id;

    const stats = await Event.aggregate([
      { $match: { organizerId: new mongoose.Types.ObjectId(organizerId) } },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          totalCapacity: { $sum: '$totalSeats' },
          totalAvailable: { $sum: '$availableSeats' }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        totalEvents: 0,
        totalRSVPs: 0,
        totalCapacity: 0
      });
    }

    const result = stats[0];
    const totalRSVPs = result.totalCapacity - result.totalAvailable;

    res.json({
      totalEvents: result.totalEvents,
      totalRSVPs,
      totalCapacity: result.totalCapacity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get RSVP trend over time (by event date)
// @route   GET /api/analytics/rsvp-trend
// @access  Private/Organizer
const getRsvpTrend = async (req, res) => {
  try {
    const organizerId = req.user._id;

    const trend = await Event.aggregate([
      { $match: { organizerId: new mongoose.Types.ObjectId(organizerId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalRSVPs: { $sum: { $subtract: ["$totalSeats", "$availableSeats"] } }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 } // Last 30 event dates
    ]);

    res.json(trend.map(item => ({ date: item._id, rsvps: item.totalRSVPs })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get seat utilization per event
// @route   GET /api/analytics/seat-util
// @access  Private/Organizer
const getSeatUtilization = async (req, res) => {
  try {
    const organizerId = req.user._id;

    const util = await Event.aggregate([
      { $match: { organizerId: new mongoose.Types.ObjectId(organizerId) } },
      {
        $project: {
          title: 1,
          totalSeats: 1,
          rsvps: { $subtract: ["$totalSeats", "$availableSeats"] },
          utilization: {
            $multiply: [
              { $divide: [{ $subtract: ["$totalSeats", "$availableSeats"] }, { $cond: [{ $eq: ["$totalSeats", 0] }, 1, "$totalSeats"] }] },
              100
            ]
          }
        }
      },
      { $sort: { date: -1 } },
      { $limit: 10 } // Top 10 recent events
    ]);

    res.json(util);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOverviewStats,
  getRsvpTrend,
  getSeatUtilization
};
