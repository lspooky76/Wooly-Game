const CACHE_NAME = ‘baby-mammoth-v1’;
const ASSETS = [
‘./’,
‘./index.html’,
‘./manifest.json’
];

// Install — cache core assets
self.addEventListener(‘install’, (e) => {
e.waitUntil(
caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
);
self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener(‘activate’, (e) => {
e.waitUntil(
caches.keys().then((keys) =>
Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
)
);
self.clients.claim();
});

// Fetch — serve from cache, fall back to network
self.addEventListener(‘fetch’, (e) => {
e.respondWith(
caches.match(e.request).then((cached) => {
if (cached) return cached;
return fetch(e.request).then((response) => {
// Cache successful GET responses
if (e.request.method === ‘GET’ && response.status === 200) {
const copy = response.clone();
caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
}
return response;
}).catch(() => {
// Offline fallback — return cached index
return caches.match(’./index.html’);
});
})
);
});