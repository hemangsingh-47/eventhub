import api from './api';

// Utility to convert Base64 string to Uint8Array for web-push
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const subscribeToPushNotifications = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push notifications are not supported by the browser.');
  }

  try {
    // 1. Register Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered with scope:', registration.scope);

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;

    // 2. Determine current subscription status
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('User is already subscribed.');
      return existingSubscription;
    }

    // 3. Get VAPID public key from backend
    const { data: { publicKey } } = await api.get('notifications/vapid-public-key');
    if (!publicKey) {
      throw new Error('VAPID public key missing from backend.');
    }
    const convertedVapidKey = urlBase64ToUint8Array(publicKey);

    // 4. Prompt user and subscribe
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    console.log('Push Subscription Object:', subscription);

    // 5. Send subscription to our backend
    await api.post('notifications/subscribe', {
      subscription: subscription.toJSON()
    });

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    throw error;
  }
};

export const unsubscribeFromPushNotifications = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // Inform backend first
      await api.post('notifications/unsubscribe', {
        endpoint: subscription.endpoint
      });
      // Then unsubscribe locally
      const successful = await subscription.unsubscribe();
      return successful;
    }
    return true; // Was already unsubscribed
  } catch (error) {
    console.error('Error unsubscribing', error);
    throw error;
  }
};

export const checkSubscriptionStatus = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false;
  }
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return !!subscription;
};
