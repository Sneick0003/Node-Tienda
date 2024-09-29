// routes/auth.js
const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController')

router.get('/is-authenticated',auth.auth );

module.exports = router;
