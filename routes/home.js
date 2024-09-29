const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController'); // Asegúrate de que la ruta sea correcta

// Define la ruta para "/home"
router.get('/', homeController.getProductos);
// router.get('/logout', homeController.getLogout);

module.exports = router;
