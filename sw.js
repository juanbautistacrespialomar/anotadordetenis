/* Service worker del Anotador de Tenis — auto-actualización
   ───────────────────────────────────────────────────────────
   Estrategia por tipo de pedido:
   • HTML (navegación)  → RED PRIMERO. Trae el index.html fresco del server y lo
     muestra; guarda una copia como respaldo offline. Así, cada vez que cambiás el
     index, la persona ve la versión nueva al abrir la app (no hace falta tocar
     ningún número de versión acá).
   • Resto (íconos, manifest, fuentes) → STALE-WHILE-REVALIDATE. Muestra lo cacheado
     al instante y actualiza en segundo plano para la próxima.
   El número de CACHE solo conviene subirlo si cambiás ESTE archivo (sw.js). */
const CACHE = "tenis-cache-v3";

const SHELL = [
  "./", "./index.html", "./manifest.json",
  "./Logo.png", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"
];

// Instalar: precachear el shell (respaldo offline) y activar de inmediato
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

// Activar: borrar caches viejas y tomar control ya
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  const isNav = req.mode === "navigate" ||
                (req.headers.get("accept") || "").includes("text/html");

  // ── HTML: red primero ──
  if (isNav) {
    e.respondWith((async () => {
      try {
        // no-store: salteamos la cache HTTP del navegador para traer SIEMPRE lo último
        const res = await fetch(url.href, { cache: "no-store", credentials: "same-origin" });
        const c = await caches.open(CACHE);
        c.put("./index.html", res.clone());   // refresca el respaldo offline
        return res;
      } catch (err) {
        const cached = await caches.match("./index.html");
        return cached || Response.error();
      }
    })());
    return;
  }

  // ── Resto: stale-while-revalidate ──
  e.respondWith((async () => {
    const cached = await caches.match(req);
    const fresh = fetch(req).then(async (res) => {
      if (res && res.status === 200 && (res.type === "basic" || res.type === "cors")) {
        const c = await caches.open(CACHE);
        c.put(req, res.clone());
      }
      return res;
    }).catch(() => cached);
    return cached || fresh;
  })());
});
