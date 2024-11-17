const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index.Controller');


// Mostrar vista principal (index.ejs)
router.get('/', indexController.renderIndex);

module.exports = router;
