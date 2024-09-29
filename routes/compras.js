const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/comprasController.js');

// Ruta para Mostrar todas las compras
router.get('/', comprasController.mostrarCompras);

module.exports = router;
