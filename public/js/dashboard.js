document.addEventListener('DOMContentLoaded', function () {
    const almacenTrigger = document.getElementById('almacen-trigger');
    const ventaTrigger = document.getElementById('venta-trigger');

    almacenTrigger.addEventListener('click', function () {
        updateCards('almacen');
        toggleActiveTab(this, ventaTrigger);
    });

    ventaTrigger.addEventListener('click', function () {
        updateCards('venta');
        toggleActiveTab(this, almacenTrigger);
    });

    function updateCards(type) {
        const almacenElements = document.querySelectorAll('.product-quantity.almacen');
        const ventaElements = document.querySelectorAll('.product-quantity.venta');
        
        if (type === 'almacen') {
            almacenElements.forEach(el => el.style.display = 'block');
            ventaElements.forEach(el => el.style.display = 'none');
        } else if (type === 'venta') {
            almacenElements.forEach(el => el.style.display = 'none');
            ventaElements.forEach(el => el.style.display = 'block');
        }
    }

    function toggleActiveTab(activeTab, inactiveTab) {
        activeTab.classList.add('active');
        inactiveTab.classList.remove('active');
    }
});
