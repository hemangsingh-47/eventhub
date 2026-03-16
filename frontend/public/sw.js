// Listen for push events from the server
self.addEventListener('push', function(event) {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body,
        icon: data.icon || '/vite.svg', // Fallback icon
        badge: '/vite.svg',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: '2',
          url: data.url || '/'
        },
        actions: [
          {action: 'explore', title: 'View Event', icon: '✓'}
        ]
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title, options)
      );
    } catch (e) {
      // Fallback if payload isn't valid JSON
      event.waitUntil(
        self.registration.showNotification('Campus Event Hub', {
          body: event.data.text()
        })
      );
    }
  }
});

// Handle notification click events
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  // Decide which URL to open based on the notification data
  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(windowClients) {
      // Check if there is already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If none, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
