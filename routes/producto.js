const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productosController');
const carritoController = require('../controllers/carritoController');
const { isAuthenticated } = require('../middleware/authMiddleware.js');

router.get('/comprar', productoController.mostrarProductos);
router.post('/carrito/agregar', carritoController.agregarAlCarrito);
router.get('/carrito', carritoController.mostrarCarrito);
router.post('/carrito/finalizar', isAuthenticated, carritoController.finalizarCompra);

module.exports = router;
