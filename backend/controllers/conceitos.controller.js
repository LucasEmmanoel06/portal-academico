const Conceito = require('../models/conceitos.models');
const Usuario = require('../models/usuarios.models');

// @desc    Get all conceitos
// @route   GET /api/conceitos
// @access  Private
exports.getConceito = async (req, res) => {
  try {
    const conceito = await Conceito.find();
    res.json(conceito);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single conceito
// @route   GET /api/conceitos/:id
// @access  Private
exports.getConceitoById = async (req, res) => {
  try {
    const conceito = await Conceito.findById(req.params.id);
    if (!conceito) {
      return res.status(404).json({ message: 'Conceito não encontrado' });
    }
    res.json(conceito);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create new conceito
// @route   POST /api/conceitos
// @access  Private
// Agora tá Funcionando
exports.createConceito = async (req, res) => {
  const { aluno, disciplina, unidade, av1, av2, noa } = req.body;
  try {
    const usuario = await Usuario.findById(aluno);
    if (!usuario || usuario.tipo !== 'aluno') {
      return res.status(400).json({ message: 'Usuário não encontrado ou não é um aluno' });
    }

    const conceito = new Conceito({
        aluno,
        disciplina,
        unidade,
        av1,
        av2,
        noa
    });
    await conceito.save();
    res.status(201).json(conceito);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update conceito
// @route   PUT /api/conceitos/:id
// @access  Private
exports.updateConceito = async (req, res) => {
  try {
    const conceito = await Conceito.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!conceito) {
      return res.status(404).json({ message: 'Conceito não encotrado' });
    }
    res.json(conceito);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete conceito
// @route   DELETE /api/conceitos/:id
// @access  Private
exports.deleteConceito = async (req, res) => {
  try {
    const conceito = await Conceito.findByIdAndDelete(req.params.id);
    if (!conceito) {
      return res.status(404).json({ message: 'Conceito não encontrado' });
    }
    res.json({ message: 'Conceito deletado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all conceitos of a specific aluno
// @route   GET /api/usuarios/:id/conceitos
// @access  Private
exports.getConceitosByAluno = async (req, res) => {
  try {
    const alunoId = req.params.id;
    const usuario = await Usuario.findById(alunoId);
    if (!usuario || usuario.tipo !== 'aluno') {
      return res.status(400).json({ message: 'Usuário não é um aluno' });
    }
    const conceitos = await Conceito.find({ aluno: alunoId })
      .populate('disciplina')
      .populate('aluno');
    if (!conceitos.length) {
      return res.status(404).json({ message: 'Conceitos não encontrados' });
    }
    res.json(conceitos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};