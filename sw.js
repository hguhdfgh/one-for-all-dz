/* sw.js — network-first for same-origin pages/assets, cache only as offline fallback. Never touches Supabase/CDN requests. */
const C = 'ofa-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/api/')) return;
  e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)); } return res; })
    .catch(() => caches.match(r).then(m => m || (r.mode === 'navigate' ? caches.match('/app.html') : undefined) || Response.error())));
});
self.addEventListener('push', e => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch (_) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'ONE FOR ALL', { body: d.body || '', icon: '/assets/icons/icon-192.png', badge: '/assets/icons/icon-192.png', tag: d.tag, renotify: !!d.tag, data: { url: d.url || '/app.html' }, dir: 'rtl', lang: 'ar' }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || '/app.html', self.location.origin).href;
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    const w = ws.find(c => c.url.startsWith(self.location.origin + '/app.html'));
    if (w) return w.focus().then(c => c.navigate(url)).catch(() => clients.openWindow(url));
    return clients.openWindow(url);
  }));
});
