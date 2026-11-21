const CACHE_NAME = "recipe-blog-v1";
const STATIC_ASSETS = [
    "/",
    "/about",
    "/style.css",
    "/script.js",
    "/manifest.json",
    "/images/avatar.png",
    "/icons/icon-192.png",
    "/icons/icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

async function NetworkFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        }
        throw error;
    }
}

async function CacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) {
        return cached;
    }
    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        if (request.mode === "navigate") {
            const fallback = await cache.match("/");
            if (fallback) {
                return fallback;
            }
        }
        throw error;
    }
}

self.addEventListener("fetch", event => {
    const { request } = event;
    if (request.method !== "GET") {
        return;
    }
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) {
        return;
    }
    if (url.pathname.startsWith("/api/")) {
        event.respondWith(NetworkFirst(request));
    } else {
        event.respondWith(CacheFirst(request));
    }
});
