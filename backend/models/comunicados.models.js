const mongoose = require('mongoose');

const ComunicadosSchema = new mongoose.Schema({
    mensagem: { type: String, required: true },
    data: { type: Date, default: Date.now },
    turma: { type: String, required: true }, //referenciar
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuarios', required: true }
});

module.exports = mongoose.model('Comunicados', ComunicadosSchema);