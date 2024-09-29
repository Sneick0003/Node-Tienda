document.addEventListener('DOMContentLoaded', function() {
    const toggleCartButton = document.getElementById('toggle-cart-btn');
    const cart = document.getElementById('shopping-cart');

    toggleCartButton.addEventListener('click', function() {
        if (cart.style.display === 'none') {
            cart.style.display = 'block';
        } else {
            cart.style.display = 'none';
        }
    });
});
