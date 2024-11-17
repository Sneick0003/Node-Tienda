const express = require('express');
const router = express.Router();
const descuentosController = require('../controllers/descuentos.Controller');

router.get('/', descuentosController.descuento);

module.exports = router;