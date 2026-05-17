self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

const pendingTimers = {};

self.addEventListener('message', e => {
  const { type, id, title, body, delay } = e.data || {};
  if (type === 'SCHEDULE_NOTIFICATION') {
    if (pendingTimers[id]) clearTimeout(pendingTimers[id]);
    pendingTimers[id] = setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/favicon.ico',
        tag: id,
        renotify: true,
        requireInteraction: false,
      });
      delete pendingTimers[id];
    }, Math.max(0, delay));
  }
  if (type === 'CANCEL_NOTIFICATION') {
    if (pendingTimers[id]) { clearTimeout(pendingTimers[id]); delete pendingTimers[id]; }
    self.registration.getNotifications({ tag: id }).then(ns => ns.forEach(n => n.close()));
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      if (clients.length > 0) return clients[0].focus();
      return self.clients.openWindow('/');
    })
  );
});
