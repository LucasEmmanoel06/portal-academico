const express = require('express');
const router = express.Router();
const disciplinasController = require('../controllers/disciplinas.controller');

router.get('/', disciplinasController.getDisciplina);
router.get('/:id', disciplinasController.getDisciplinaById);
router.post('/', disciplinasController.createDisciplina);
router.put('/:id', disciplinasController.updateDisciplina);
router.delete('/:id', disciplinasController.deleteDisciplina);
//novas funções 
router.post('/:id/add-professor', disciplinasController.addProfessortoDisciplina);
router.delete('/:id/remove-professor/:professorId', disciplinasController.removeProfessorfromDisciplina);
router.post('/:id/add-turma/:turmaId', disciplinasController.addTurmatoDisciplina);
router.delete('/:id/remove-turma/:turmaId', disciplinasController.removeTurmafromDisciplina);
module.exports = router;
