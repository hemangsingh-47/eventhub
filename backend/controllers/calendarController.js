const Event = require('../models/Event');
const ical = require('ical-generator').default;

// @desc    Generate iCal (.ics) file for an event
// @route   GET /api/calendar/:eventId
// @access  Public
const generateEventCalendar = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate('organizerId', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Parse event date and time
    // Handles both "14:30" and "02:30 PM" formats
    const eventDate = new Date(event.date);
    let hours, minutes;
    
    if (event.time.includes('AM') || event.time.includes('PM')) {
      const [time, modifier] = event.time.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (h === 12) h = 0;
      if (modifier === 'PM') h += 12;
      hours = h;
      minutes = m;
    } else {
      [hours, minutes] = event.time.split(':').map(Number);
    }
    
    const startTime = new Date(eventDate);
    startTime.setHours(hours, minutes, 0, 0);

    // Default duration is 2 hours if not specified
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); 

    const cal = ical({ name: 'Campus Event Hub' });

    cal.createEvent({
      start: startTime,
      end: endTime,
      summary: event.title,
      description: event.description,
      location: event.location,
      organizer: {
        name: event.organizerId ? event.organizerId.name : 'Organizer',
        email: event.organizerId ? event.organizerId.email : 'noreply@campuseventhub.com'
      },
      url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/events/${event._id}`
    });

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics"`);
    res.send(cal.toString());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateEventCalendar
};
