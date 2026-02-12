const CACHE_VERSION = 'drivecalc-cache-v8';
const APP_SHELL = [
  './',
  'index.html',
  'style.css?v=10',
  'script.js?v=29',
  'config.public.js?v=2',
  'car_models.json',
  'background-travel.jpg',
  'header-hero.jpg',
  'logo.png?v=3',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => {
      if (key !== CACHE_VERSION) return caches.delete(key);
      return Promise.resolve();
    }))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isNavigationRequest = request.mode === 'navigate';
  const isIndexRequest =
    url.pathname === '/' ||
    url.pathname.endsWith('/index.html') ||
    url.pathname === '/index.html';

  if (isNavigationRequest || isIndexRequest) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put('index.html', responseClone).catch(() => {});
          });
          return networkResponse;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('index.html')))
    );
    return;
  }

  const isApi = url.pathname.startsWith('/api/');
  if (isApi) {
    event.respondWith(fetch(request));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches.open(CACHE_VERSION).then((cache) => {
          cache.put(request, responseClone);
        });
        return networkResponse;
      }).catch(() => caches.match('index.html'));
    })
  );
});
