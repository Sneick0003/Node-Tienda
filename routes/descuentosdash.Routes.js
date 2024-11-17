const express = require('express');
const router = express.Router();
const descuentodashController = require('../controllers/descuntodash.Controller');

// Mostrar todas las ofertas
router.get('/descuentos', descuentodashController.mostrar);

// Crear una nueva oferta
router.post('/descuentos', descuentodashController.crear);

// Editar una oferta existente
router.put('/descuentos/:id', descuentodashController.editar);

// Eliminar una oferta
router.delete('/descuentos/:id', descuentodashController.eliminar);

module.exports = router;
