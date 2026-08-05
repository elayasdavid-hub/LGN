const CACHE_NAME = "lgn-match-index-v6";

const ARCHIVOS_CACHE = [
  "./CALCULADORA_LGN.html",
  "./style.css",
  "./logoLGN.png",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-192-maskable.png",
  "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((nombre) => nombre !== CACHE_NAME)
          .map((nombre) => caches.delete(nombre))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evento) => {
  if (evento.request.method !== "GET") return;

  evento.respondWith(
    caches.match(evento.request).then((respuestaCache) => {
      if (respuestaCache) return respuestaCache;

      return fetch(evento.request)
        .then((respuestaRed) => {
          const copia = respuestaRed.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(evento.request, copia);
          });
          return respuestaRed;
        })
        .catch(() => caches.match("./CALCULADORA_LGN.html"));
    })
  );
});
