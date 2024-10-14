const mongoose = require('mongoose');

const TurmasSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    ano: { type: String, required: true },
    alunos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios'}]
});

module.exports = mongoose.model('Turmas', TurmasSchema);