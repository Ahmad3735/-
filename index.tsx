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
    // Defensive check: Service Workers only work on http/https.
    // This prevents errors when running in blob: or data: URL environments (like some previews).
    if (!window.location.protocol.startsWith('http')) {
      console.log('Service Worker registration skipped: Unsupported protocol', window.location.protocol);
      return;
    }

    // Construct absolute URL manually to avoid "Invalid URL" errors with the URL constructor
    // and to ensure we don't accidentally resolve to the wrong origin (e.g. ai.studio)
    // which causes a SecurityError.
    const currentPath = window.location.pathname;
    const basePath = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
    const swUrl = `${window.location.protocol}//${window.location.host}${basePath}sw.js`;

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
  });
}
