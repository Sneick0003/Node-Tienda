const express = require('express');
const router = express.Router();
const nosotrosController = require('../controllers/nosotros.Controller');

router.get('/', nosotrosController.nosotros);

module.exports = router;