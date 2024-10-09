const express = require('express');
const { getUsuarios, getUsuarioById, updateUsuario, deleteUsuario, getProfessores, getAlunos, getCoordenadores } = require('../controllers/usuarios.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

//Todas as rotas estão funcionando perfeitamente :)
router.get('/', authMiddleware, getUsuarios);
router.get('/:id', authMiddleware, getUsuarioById);
router.put('/:id', authMiddleware, updateUsuario);
router.delete('/:id', authMiddleware, deleteUsuario);
router.get('/tipo/professores', authMiddleware, getProfessores);
router.get('/tipo/alunos', authMiddleware, getAlunos);
router.get('/tipo/coordenadores', authMiddleware, getCoordenadores);

module.exports = router;
