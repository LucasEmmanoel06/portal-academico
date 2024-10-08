const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const turmasController = require('../controllers/turma.controller');

router.get('/', authMiddleware, turmasController.getTurmas);
router.get('/:id', authMiddleware, turmasController.getTurmaById);
router.post('/', authMiddleware, turmasController.createTurma);
router.put('/:id', authMiddleware, turmasController.updateTurma);
router.delete('/:id', authMiddleware, turmasController.deleteTurma);
router.get('/:id/alunos', authMiddleware, turmasController.getAlunosByTurmaId);

//novas rotas
router.post('/:id/add-aluno', turmasController.addAlunotoTurma);
router.delete('/:id/remove-aluno/:alunoId', turmasController.removeAlunofromTurma);

module.exports = router;
