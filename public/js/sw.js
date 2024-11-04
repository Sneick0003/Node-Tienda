const CACHE_NAME = 'primera-version-del-cache';
const public = [
  '/index.ejs',
  '/css/compras.css',
  '/css/dash.css',
  '/css/login.css',
  '/css/header.css',
  '/css/sidebar.css',
  '/css/home.css',
];

// Evento de Instalación del service worker
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Archivos en caché:");
      return cache.addAll(public).catch(error => {
        console.error("Error al agregar archivos al caché:", error);
      });
    })
  );
});

// Evento de Activación del service worker
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cache => cache !== CACHE_NAME) // Elimina cachés antiguas
          .map(cache => caches.delete(cache))
      );
    })
  );
});

// Evento Fetch: Intercepta las solicitudes de red
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Si hay una respuesta en caché, la retorna; si no, va a la red
      return cachedResponse || fetch(event.request);
    })
  );
});
