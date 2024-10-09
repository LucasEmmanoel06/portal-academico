const express = require('express');
const { registrar, login } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/registrar', authMiddleware, registrar);
router.post('/login', login);

module.exports = router;
