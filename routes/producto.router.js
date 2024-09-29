const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productoController.js');


// Ruta para Mostrar
router.get('/productos', productosController.mostrar);

// Ruta para Crear
router.post('/productos/add', productosController.crear);

// Ruta para Editar
router.post('/productos/edit/:id', productosController.editar);

// Ruta para Eliminar
router.delete('/productos/delete/:id', productosController.eliminar);

module.exports = router;
