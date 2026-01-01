/* eslint-disable no-restricted-globals */
// Minimal Service Worker for PWA compliance
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Pass-through
  event.respondWith(fetch(event.request));
});
