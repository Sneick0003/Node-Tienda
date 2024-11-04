if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/js/sw.js') // Ruta a `sw.js` en `public/js`
        .then(registration => {
          console.log("Service Worker registrado con éxito:", registration);
        })
        .catch(error => {
          console.log("Error en el registro del Service Worker:", error);
        });
    });
  }
  