const CACHE_NAME = "asik-cache-v2"; // ⬅️ NAIKKAN VERSI CACHE

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./assets/asik192.png",
  "./assets/asik512.png"
];

// ===============================
// INSTALL – SIMPAN CACHE BARU
// ===============================
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // ⬅️ PAKSA AKTIF LANGSUNG
});

// ===============================
// ACTIVATE – HAPUS CACHE LAMA
// ===============================
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // ⬅️ LANGSUNG PAKAI FILE BARU
});

// ===============================
// FETCH – CACHE FIRST, UPDATE READY
// ===============================
self.addEventListener("fetch", event => {
  event.respon
