function addToCart(buttonElement) {
    const form = $(buttonElement).closest('form');
    const data = form.serialize(); // Captura los datos del formulario

    $.post('/carrito/agregar', data, function(response) {
        // Actualiza la visualización del carrito
        $('#cart-contents').html(response);
        alert('Producto agregado al carrito!');
    });
}

$(document).ready(function() {
    $('#toggle-cart-btn').click(function() {
        $('#shopping-cart').toggle();
    });
});
