import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Robust Service Worker Registration for Offline Support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      // Construct absolute URL based on current location to ensure origin match
      // This prevents errors where relative paths resolve to a different origin (e.g. in previews)
      const swUrl = new URL('sw.js', window.location.href).href;

      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('Hidaya ServiceWorker registered with scope: ', registration.scope);
          
          // Check for updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New content is available and will be used when all tabs for this page are closed.');
                } else {
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch(err => {
          console.error('ServiceWorker registration failed: ', err);
        });
    } catch (e) {
      console.warn('Failed to construct absolute SW URL, falling back to relative path.', e);
      // Fallback to simple registration if URL construction fails
      navigator.serviceWorker.register('sw.js').catch(err => console.error('Fallback SW registration failed:', err));
    }
  });
}