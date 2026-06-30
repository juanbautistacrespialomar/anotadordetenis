/* Service worker del Anotador de Tenis
   Estrategia: cache-first del app shell. Subí el número de versión
   (CACHE) cada vez que cambies index.html para forzar la actualización. */
const CACHE = "tenis-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./Logo.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

// Instalar: precachear el shell
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activar: borrar caches viejos
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache primero, red como respaldo (y cacheo lo nuevo del mismo origen)
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      if (hit) return hit;
      return fetch(e.request).then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => caches.match("./index.html"));
    })
  );
});
