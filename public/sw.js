const CACHE_NAME = 'noor-islam-cache-v17';
const DATA_CACHE_NAME = 'noor-islam-data-v17';

const STATIC_ASSETS = [
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Kufi+Arabic:wght@300;400;600;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // 1. Network First for App Shell and Code Files
  if (
      requestUrl.origin === location.origin && 
      (
        requestUrl.pathname.endsWith('.html') || 
        requestUrl.pathname.endsWith('.js') || 
        requestUrl.pathname.endsWith('.ts') || 
        requestUrl.pathname.endsWith('.tsx') ||
        requestUrl.pathname.endsWith('.css') ||
        requestUrl.pathname.endsWith('.json')
      )
  ) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 2. API Caching (Stale While Revalidate)
  if (
      requestUrl.href.includes('api.quran.com') || 
      requestUrl.href.includes('api.aladhan.com') ||
      requestUrl.href.includes('quranenc.com')
  ) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if(networkResponse.ok) {
               cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse); 
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. Default Cache First for other static assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});