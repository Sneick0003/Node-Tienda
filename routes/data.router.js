const express = require('express');
const router = express.Router();
const controller = require('../controllers/dataController');

// Ruta para mostrar
router.get('/tables', controller.mostrar);

// Ruta para crear 
router.post('/add', controller.crear);

// Ruta para editar
router.post('/edit/:id', controller.editar);

// Ruta para eliminar
router.get('/delete/:id', controller.eliminar);

module.exports = router;
