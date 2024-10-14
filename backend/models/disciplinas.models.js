const mongoose = require('mongoose');

const DisciplinasSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    professores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios' }],
    turmas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Turma',}],
});

module.exports = mongoose.model('Disciplinas', DisciplinasSchema);