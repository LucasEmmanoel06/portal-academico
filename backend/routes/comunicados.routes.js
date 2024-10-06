const express = require('express');
const { 
    getComunicado,
    getComunicadoById,
    createComunicado,
    updateComunicado,
    deleteComunicado
} = require('../controllers/comunicados.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', authMiddleware, getComunicado);
router.get('/:id', authMiddleware, getComunicadoById);
router.post('/', authMiddleware, createComunicado);
router.put('/:id', authMiddleware, updateComunicado);
router.delete('/:id', authMiddleware, deleteComunicado);

module.exports = router;
