const mongoose = require('mongoose');

const ComunicadosSchema = new mongoose.Schema({
    mensagem: { type: String, required: true },
    data: { type: Date, default: Date.now, required:true},
    turma: { type: mongoose.Schema.Types.ObjectId, ref: 'Turma', required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios', required: true }
});

module.exports = mongoose.model('Comunicados', ComunicadosSchema);