const webpush = require('web-push');
const Subscription = require('../models/Subscription');
const dotenv = require('dotenv');

dotenv.config();

// Ensure VAPID keys are present
if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.warn('⚠️ VAPID keys not configured. Push notifications will not work.');
} else {
  webpush.setVapidDetails(
    'mailto:noreply@campuseventhub.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

/**
 * Send a push notification to specific users
 * @param {Array<ObjectId>} userIds - Array of MongoDB user IDs
 * @param {Object} payload - The notification payload
 * @returns {Promise}
 */
const sendNotificationToUsers = async (userIds, payload) => {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return;

  try {
    // Find all valid subscriptions for these users
    const subscriptions = await Subscription.find({ user: { $in: userIds } });
    
    if (subscriptions.length === 0) return;

    // Convert payload object to string as required by web-push
    const payloadString = JSON.stringify({
      title: payload.title || 'EventHub Notification',
      body: payload.body || '',
      icon: payload.icon || '/icon-192.png',
      url: payload.url || '/',
      ...payload
    });

    const notifications = subscriptions.map(sub => {
      // web-push expects the exact structure
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.keys.p256dh,
          auth: sub.keys.auth
        }
      };

      return webpush.sendNotification(pushSubscription, payloadString)
        .catch(async (error) => {
          // If the subscription is no longer valid (e.g. user revoked permission)
          if (error.statusCode === 404 || error.statusCode === 410) {
            console.log(`Subscription expired/revoked: ${sub.endpoint}`);
            await Subscription.findByIdAndDelete(sub._id);
          } else {
            console.error('Error sending push notification:', error);
          }
        });
    });

    await Promise.all(notifications);
  } catch (error) {
    console.error('Failed to send push notifications:', error);
  }
};

module.exports = {
  sendNotificationToUsers
};
