const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productos.Controller.js');
const { isAuthenticated } = require('../middleware/authMiddleware.js');

// Ruta para mostrar los productos disponibles para comprar junto con el carrito
router.get('/comprar', productoController.mostrarProductos);

// Ruta para agregar un producto al carrito
router.post('/agregar-al-carrito', isAuthenticated, productoController.agregarAlCarrito);

// Ruta para finalizar la compra
router.post('/finalizar-compra', isAuthenticated, productoController.finalizarCompra);

module.exports = router;
