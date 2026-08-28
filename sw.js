const CACHE_NAME = 'raktosetu-v1';
const APP_SHELL = [
  '/Blood-Donate-/index.html',
  '/Blood-Donate-/manifest.json',
  '/Blood-Donate-/icons/icon-192.png',
  '/Blood-Donate-/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// নেটওয়ার্ক-প্রথম কৌশল — Firebase রিয়েল-টাইম ডেটার জন্য সবসময় নেটওয়ার্ক চেষ্টা করা হয়,
// শুধু সম্পূর্ণ অফলাইন থাকলে ক্যাশে থাকা শেল দেখানো হয়
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
