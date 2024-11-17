const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosdash.Controller.js');
const pload = require('../config/multerConfig.js');


// Ruta para Mostrar
router.get('/productos', productosController.mostrar);

// Ruta para Crear
router.post('/productos/add', pload.single('productImage'), productosController.crear);

// Ruta para Editar
router.post('/productos/edit/:id', pload.single('productImage'), productosController.editar);

// Ruta para Eliminar
router.delete('/productos/delete/:id', productosController.eliminar);

module.exports = router;