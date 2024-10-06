const Turma = require('../models/turmas.models');
const Usuario = require('../models/usuarios.models');

// @desc    Get all turmas
// @route   GET /api/turmas
// @access  Public
exports.getTurma = async (req, res) => {
  try {
    const turma = await Turma.find();
    res.json(turma);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single turma
// @route   GET /api/turmas/:id
// @access  Public
exports.getTurmaById = async (req, res) => {
  try {
    const turma = await Turma.findById(req.params.id);
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }
    res.json(turma);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create new turma
// @route   POST /api/turmas
// @access  Public
exports.createTurma = async (req, res) => {
  const { nome, ano, semestre, alunos, disciplina } = req.body;
  try {
    const turma = new Turma({
      nome,
      ano,
      semestre,
      alunos,
      disciplina
    });
    await turma.save();
    res.status(201).json(turma);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update turma
// @route   PUT /api/turmas/:id
// @access  Public
exports.updateTurma = async (req, res) => {
  try {
    const turma = await Turma.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encotrada' });
    }
    res.json(turma);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete turma
// @route   DELETE /api/turmas/:id
// @access  Public
exports.deleteTurma = async (req, res) => {
  try {
    const turma = await Turma.findByIdAndDelete(req.params.id);
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }
    res.json({ message: 'Turma deletada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get alunos by turma id
// @route   GET /api/turmas/:id/alunos
// @access  Public
exports.getAlunosByTurmaId = async (req, res) => {
  try {
    const turma = await Turma.findById(req.params.id).populate('alunos');
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }
    res.json(turma.alunos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Funcionando
exports.addAlunotoTurma = async (req, res) => {
  try {
    // Verifica se o email foi fornecido
    if (!req.body.email) {
      return res.status(400).json({ message: 'Email é obrigatório' });
    }

    // Busca o aluno pelo email
    const aluno = await Usuario.findOne({ email: req.body.email });
    if (!aluno) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    // Verifica se o usuário encontrado é um aluno
    if (aluno.tipo !== 'aluno') {
      return res.status(400).json({ message: 'Usuário não é um aluno' });
    }

    // Busca a turma pelo ID
    const turma = await Turma.findById(req.params.id);
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }

    // Verifica se o aluno já está na lista de alunos da turma
    if (turma.alunos.includes(aluno._id)) {
      return res.status(400).json({ message: 'Aluno já está na turma' });
    }

    // Adiciona o ID do aluno à lista de alunos da turma
    turma.alunos.push(aluno._id);
    await turma.save();

    res.status(201).json(turma);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Funcionando
exports.removeAlunofromTurma = async (req, res) => {
  try {
    // Busca a turma pelo ID
    const turma = await Turma.findById(req.params.id);
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }

    // Verifica se o aluno está na lista de alunos da turma
    const alunoIndex = turma.alunos.findIndex(alunoId => alunoId.toString() === req.params.alunoId);
    if (alunoIndex === -1) {
      return res.status(404).json({ message: 'Aluno não encontrado na turma' });
    }

    // Remove o aluno da lista de alunos
    turma.alunos.splice(alunoIndex, 1);
    await turma.save();

    res.json(turma);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};