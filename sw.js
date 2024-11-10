//Nombre del caché
const CACHE_NAME = 'v1_cache';

// Archivos/Recursos que queremos cachear
const urlsToCache = [
    '/',
    '/css/home.css',
    '/css/header.css',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg'
];

// Instalar SW
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activar SW
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Eliminar caches que no se necesitan
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Evento fetch para manejar las solicitudes
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna los datos desde el caché si están disponibles
                if (response) {
                    return response;
                }

                // Si no hay datos en caché, realiza un fetch a la red
                return fetch(event.request).then(newResponse => {
                    // Asegura que solo se guarden en caché las respuestas válidas
                    if (!newResponse || newResponse.status !== 200 || newResponse.type !== 'basic') {
                        return newResponse;
                    }

                    // Clona la respuesta para poder almacenar una copia en caché
                    const responseToCache = newResponse.clone();

                    // Abre el caché y guarda los datos fetcheados
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });

                    return newResponse;
                });
            })
    );
});


// console.log('SW: Hola Mundo');
