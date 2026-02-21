const CACHE_VERSION = 'drivecalc-cache-v45';
const APP_SHELL = [
  './',
  'index.html',
  'budget.html',
  'companions.html',
  'friends.html',
  'fuel-finder.html',
  'ai-chat.html',
  'favorites.html',
  'security.html',
  'account.html',
  'info.html',
  'style.css?v=44',
  'script.js?v=70',
  'car_models.json',
  'background-travel.jpg',
  'header-hero-sm.jpg',
  'header-hero.jpg',
  'header-hero-mobile-sm.jpg',
  'header-hero-mobile.jpg',
  'logo-96.png',
  'logo-160.png',
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

self.addEventListener('message', (event) => {
  if (!event || !event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
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
  const isRuntimeConfigRequest = url.pathname === '/config.public.js' || url.pathname.endsWith('/config.public.js');

  if (isRuntimeConfigRequest) {
    event.respondWith(
      fetch(request, { cache: 'no-store' }).catch(() => caches.match(request))
    );
    return;
  }

  if (isNavigationRequest || isIndexRequest) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then((networkResponse) => {
          if (!networkResponse || !networkResponse.ok) return networkResponse;
          const responseClone = networkResponse.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            const cacheTarget = isIndexRequest ? 'index.html' : request;
            cache.put(cacheTarget, responseClone).catch(() => {});
          });
          return networkResponse;
        })
        .catch(() => caches.match(isIndexRequest ? 'index.html' : request).then((cached) => cached || caches.match('index.html')))
    );
    return;
  }

  const isApi = url.pathname.startsWith('/api/');
  if (isApi) {
    event.respondWith(fetch(request));
    return;
  }

  const isStaticCodeAsset = /\.(css|js)$/i.test(url.pathname);
  if (isStaticCodeAsset) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then((networkResponse) => {
          if (!networkResponse || !networkResponse.ok) return networkResponse;
          const responseClone = networkResponse.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(request, responseClone).catch(() => {});
          });
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
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
