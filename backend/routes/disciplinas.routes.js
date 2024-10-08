const express = require('express');
const router = express.Router();
const disciplinasController = require('../controllers/disciplinas.controller');

router.get('/', authMiddleware, disciplinasController.getDisciplina);
router.get('/:id', authMiddleware, disciplinasController.getDisciplinaById);
router.post('/', authMiddleware, disciplinasController.createDisciplina);
router.put('/:id', authMiddleware, disciplinasController.updateDisciplina);
router.delete('/:id', authMiddleware, disciplinasController.deleteDisciplina);
//novas funções 
router.post('/:id/add-professor', disciplinasController.addProfessortoDisciplina);
router.delete('/:id/remove-professor/:professorId', disciplinasController.removeProfessorfromDisciplina);
router.post('/:id/add-turma/:turmaId', disciplinasController.addTurmatoDisciplina);
router.delete('/:id/remove-turma/:turmaId', disciplinasController.removeTurmafromDisciplina);
module.exports = router;
