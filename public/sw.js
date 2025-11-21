const CACHE_NAME = 'noor-islam-cache-v18';
const DATA_CACHE_NAME = 'noor-islam-data-v18';

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
  // Force new SW to activate immediately
  self.skipWaiting();
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching Static Assets');
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
  // (Return cached version immediately, then fetch update in background)
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
                // Network failed, return nothing (will rely on cache)
                console.log('Network fetch failed for API, using cache', err);
            });
          
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 2. Navigation (HTML) & App Shell: Stale-While-Revalidate
  // Ensures the app opens instantly from cache, but updates in background for next visit.
  if (event.request.mode === 'navigate' || 
      requestUrl.origin === location.origin && (
        requestUrl.pathname.endsWith('.html') || 
        requestUrl.pathname.endsWith('.js') || 
        requestUrl.pathname.endsWith('.tsx') ||
        requestUrl.pathname.endsWith('.ts') || 
        requestUrl.pathname.endsWith('.json')
      )
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
            }).catch(() => cachedResponse); // If offline, just return cache
            
            return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. Static Assets (Fonts, Images, CSS): Cache First
  // These rarely change, so we check cache first to save data and speed up load.
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
              // Only cache valid responses
              if (networkResponse.ok) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
          });
      });
    })
  );
});