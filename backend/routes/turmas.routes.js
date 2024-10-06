const express = require('express');
const router = express.Router();
const turmasController = require('../controllers/turma.controller');

router.get('/', turmasController.getTurma);
router.get('/:id', turmasController.getTurmaById);
router.post('/', turmasController.createTurma);
router.put('/:id', turmasController.updateTurma);
router.delete('/:id', turmasController.deleteTurma);
router.get('/:id/alunos', turmasController.getAlunosByTurmaId);

//novas rotas
router.post('/:id/add-aluno', turmasController.addAlunotoTurma);
router.delete('/:id/remove-aluno/:alunoId', turmasController.removeAlunofromTurma);

module.exports = router;
