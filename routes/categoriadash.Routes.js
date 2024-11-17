const express = require('express');
const router = express.Router();
const categoriasController = require('../controllers/categoriasdash.controller');  // Verifica la ruta y el nombre del archivo

router.get('/categoria', categoriasController.mostrar);
router.post('/categoria/add', categoriasController.crear);
router.post('/categoria/edit/:id', categoriasController.editar);
router.delete('/categoria/delete/:id', categoriasController.eliminar);

module.exports = router;
