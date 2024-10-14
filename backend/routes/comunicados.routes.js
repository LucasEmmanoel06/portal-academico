const express = require('express');
const { 
    getComunicados,
    getComunicadoById,
    createComunicado,
    updateComunicado,
    deleteComunicado,
    getComunicadosByTurmaId
} = require('../controllers/comunicados.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/', authMiddleware, getComunicados);
router.get('/:id', authMiddleware, getComunicadoById);
router.post('/', authMiddleware, createComunicado);
router.put('/:id', authMiddleware, updateComunicado);
router.delete('/:id', authMiddleware, deleteComunicado);
router.get('/turma/:turmaId', getComunicadosByTurmaId);

module.exports = router;
