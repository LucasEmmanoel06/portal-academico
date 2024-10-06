const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuariosSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  matricula: { type: String, required: true, unique: true },
  tipo: { type: String, enum: ['aluno', 'professor', 'coordenador'], required: true },
});

UsuariosSchema.pre('save', async function(next) {
  if (this.isModified('senha')) {
    this.senha = await bcrypt.hash(this.senha, 10);
  }
  next();
});

UsuariosSchema.methods.compareSenha = function(senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model('Usuarios', UsuariosSchema);
