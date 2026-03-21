const CACHE_NAME = ‘baby-mammoth-v21’;
const ASSETS = [
‘./’,
‘./index.html’,
‘./manifest.json’,
‘./icon-192.png’,
‘./icon-512.png’
];

// Install — cache all assets
self.addEventListener(‘install’, (e) => {
e.waitUntil(
caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
);
// Don’t skipWaiting automatically — wait for user to tap the banner
});

// Activate — delete old caches
self.addEventListener(‘activate’, (e) => {
e.waitUntil(
caches.keys().then((keys) =>
Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
)
);
self.clients.claim();
});

// Fetch — cache first, fall back to network
self.addEventListener(‘fetch’, (e) => {
e.respondWith(
caches.match(e.request).then((cached) => {
const networkFetch = fetch(e.request).then((response) => {
if (e.request.method === ‘GET’ && response.status === 200) {
const copy = response.clone();
caches.open(CACHE_NAME).then((cache) => cache.put(e.request, copy));
}
return response;
}).catch(() => cached);
return cached || networkFetch;
})
);
});

// Listen for SKIP_WAITING message from the update banner
self.addEventListener(‘message’, (e) => {
if (e.data && e.data.type === ‘SKIP_WAITING’) {
self.skipWaiting();
}
});