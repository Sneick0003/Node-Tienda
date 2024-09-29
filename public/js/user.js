function toggleUserPurchases(userId) {
    var div = document.getElementById('user-' + userId);
    if (div.style.display === 'none') {
        div.style.display = 'block';
        if (div.innerHTML === "") { // Verifica si ya se cargaron los datos
            fetch(`/compras/usuario/${userId}`) // Asume que tienes una ruta en tu servidor para esto
                .then(response => response.json())
                .then(data => {
                    data.forEach(purchase => {
                        div.innerHTML += `<p>Producto: ${purchase.producto_nombre} - Cantidad: ${purchase.cantidad}</p>`;
                    });
                })
                .catch(error => console.error('Error al cargar las compras del usuario:', error));
        }
    } else {
        div.style.display = 'none';
    }
}
