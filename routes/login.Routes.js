const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

// Ruta para renderizar la vista de login y registro
router.get('/login', loginController.renderLogin);

// Ruta para procesar el registro de usuario (debe ser POST)
router.post('/register', loginController.register);

// Ruta para procesar el inicio de sesión
router.post('/auth', loginController.login);

// Ruta para cerrar sesión
router.get('/logout', loginController.logout);

module.exports = router;
