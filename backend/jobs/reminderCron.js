const cron = require('node-cron');
const Event = require('../models/Event');
const { sendNotificationToUsers } = require('../services/pushNotification');

// Schedule job to run every hour at minute 0 (e.g. 1:00, 2:00, 3:00)
// This checks for events starting in exactly 24 hours, and exactly 1 hour.
cron.schedule('0 * * * *', async () => {
  console.log('[CRON] Running reminder check...');
  
  try {
    const now = new Date();
    // Zero out minutes/seconds/ms for consistent hour-boundary matching
    const currentHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
    
    // Time windows
    const in24Hours = new Date(currentHour.getTime() + 24 * 60 * 60 * 1000);
    const in1Hour = new Date(currentHour.getTime() + 1 * 60 * 60 * 1000);

    const twoDaysFromNow = new Date(now.getTime() + 48 * 60 * 60 * 1000);
    
    // Fetch events happening today or tomorrow with explicit attendees populated
    const upcomingEvents = await Event.find({
      date: { $gte: new Date(now.setHours(0,0,0,0)), $lte: twoDaysFromNow }
    }).populate('attendees');

    const events24h = [];
    const events1h = [];

    upcomingEvents.forEach(event => {
      if (!event.time) return;
      const [hours, minutes] = event.time.split(':').map(Number);
      
      const eventDateTime = new Date(event.date);
      eventDateTime.setHours(hours, minutes, 0, 0);

      const diffMs = eventDateTime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours >= 23.5 && diffHours <= 24.5) {
        events24h.push(event);
      } else if (diffHours >= 0.5 && diffHours <= 1.5) {
        events1h.push(event);
      }
    });

    // Send 24h reminders
    for (const event of events24h) {
      if (event.attendees && event.attendees.length > 0) {
        const userIds = event.attendees.map(a => a._id || a);
        await sendNotificationToUsers(userIds, {
          title: `Tomorrow: ${event.title}`,
          body: `Don't forget! This event is happening tomorrow at ${event.time} @ ${event.location}.`,
          url: `/events/${event._id}`
        });
        console.log(`[CRON] Sent 24h reminders for ${event.title} to ${userIds.length} users.`);
      }
    }

    // Send 1h reminders
    for (const event of events1h) {
      if (event.attendees && event.attendees.length > 0) {
        const userIds = event.attendees.map(a => a._id || a);
        await sendNotificationToUsers(userIds, {
          title: `Starting soon: ${event.title}`,
          body: `This event is starting in 1 hour at ${event.location}!`,
          url: `/events/${event._id}`
        });
        console.log(`[CRON] Sent 1h reminders for ${event.title} to ${userIds.length} users.`);
      }
    }

  } catch (error) {
    console.error('[CRON] Error running reminder check:', error);
  }
});
