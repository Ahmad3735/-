const CACHE_NAME = 'hidaya-cache-v2';
const DATA_CACHE_NAME = 'hidaya-data-v2';

// Critical assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Kufi+Arabic:wght@300;400;600;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
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

  // 1. API Requests: Stale-While-Revalidate
  // This allows previously visited Surahs/Adhkar to work offline immediately
  if (
      requestUrl.href.includes('api.quran.com') || 
      requestUrl.href.includes('api.aladhan.com') ||
      requestUrl.href.includes('quranenc.com')
  ) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if(networkResponse.ok) {
                 cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch((err) => {
                console.log('[Service Worker] Network fetch failed for API, using cache');
            });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 2. External Libraries (esm.sh, Fonts, Tailwind): Cache First, then Network
  // These files rarely change, so we prioritize Cache to ensure UI loads offline
  if (
      requestUrl.hostname.includes('esm.sh') || 
      requestUrl.hostname.includes('cdn.tailwindcss') || 
      requestUrl.hostname.includes('fonts.googleapis') ||
      requestUrl.hostname.includes('fonts.gstatic') ||
      requestUrl.hostname.includes('unpkg.com')
  ) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              // Opaque responses (like from CDNs) can be cached
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
        })
      );
      return;
  }

  // 3. App Shell & Code (HTML, JS, TSX): Stale-While-Revalidate
  // This guarantees the app opens OFFLINE immediately, then updates in background.
  if (
      requestUrl.origin === location.origin && 
      (
        requestUrl.pathname === '/' ||
        requestUrl.pathname.endsWith('.html') || 
        requestUrl.pathname.endsWith('.js') || 
        requestUrl.pathname.endsWith('.ts') || 
        requestUrl.pathname.endsWith('.tsx') ||
        requestUrl.pathname.endsWith('.css') ||
        requestUrl.pathname.endsWith('.json')
      )
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            })
            .catch(() => {
               // If offline and no cache, we are in trouble, but ideally cache exists from install
            });
          // Return cached response immediately if available (Offline First feel)
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 4. Default Fallback
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});