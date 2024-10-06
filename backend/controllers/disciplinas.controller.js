const Disciplina = require('../models/disciplinas.models');
const Usuario = require('../models/usuarios.models');
const Turma = require('../models/turmas.models');

// @desc    Get all disciplinas
// @route   GET /api/disciplinas
// @access  Public
exports.getDisciplina = async (req, res) => {
  try {
    const disciplina = await Disciplina.find();
    res.json(disciplina);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single disciplina
// @route   GET /api/disciplinas/:id
// @access  Public
exports.getDisciplinaById = async (req, res) => {
  try {
    const disciplina = await Disciplina.findById(req.params.id);
    if (!disciplina) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }
    res.json(disciplina);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create new disciplina
// @route   POST /api/disciplinas
// @access  Public
exports.createDisciplina = async (req, res) => {
  const { nome, descricao, professores } = req.body;
  try {
    const disciplina = new Disciplina({
      nome,
      descricao,
      professores
    });
    await disciplina.save();
    res.status(201).json(disciplina);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update disciplina
// @route   PUT /api/disciplinas/:id
// @access  Public
exports.updateDisciplina = async (req, res) => {
  try {
    const disciplina = await Disciplina.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!disciplina) {
      return res.status(404).json({ message: 'Disciplina não encotrada' });
    }
    res.json(disciplina);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete disciplina
// @route   DELETE /api/disciplinas/:id
// @access  Public
exports.deleteDisciplina = async (req, res) => {
  try {
    const disciplina = await Disciplina.findByIdAndDelete(req.params.id);
    if (!disciplina) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }
    res.json({ message: 'Disciplina deletada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add professor (by email) to disciplina
// Funcionando
exports.addProfessortoDisciplina = async (req, res) => {
  try {
    // Verifica se o email foi fornecido
    if (!req.body.email) {
      return res.status(400).json({ message: 'Email é obrigatório' });
    }

    // Busca o professor pelo email
    const professor = await Usuario.findOne({ email: req.body.email });
    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado' });
    }

    // Verifica se o usuário encontrado é um professor
    if (professor.tipo !== 'professor') {
      return res.status(400).json({ message: 'Usuário não é um professor' });
    }

    // Busca a disciplina pelo ID
    const disciplina = await Disciplina.findById(req.params.id);
    if (!disciplina) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }

    // Verifica se o professor já está na lista de professores da disciplina
    if (disciplina.professores.includes(professor._id)) {
      return res.status(400).json({ message: 'Professor já está na disciplina' });
    }

    // Adiciona o ID do professor à lista de professores da disciplina
    disciplina.professores.push(professor._id);
    await disciplina.save();

    res.status(201).json(disciplina);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Remove professor (by id in route) from disciplina
// Funcionando
exports.removeProfessorfromDisciplina = async (req, res) => {
  try {
    // Busca a disciplina pelo ID
    const disciplina = await Disciplina.findById(req.params.id);
    if (!disciplina) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }

    // Verifica se o professor está na lista de professores da disciplina
    const professorIndex = disciplina.professores.findIndex(professorId => professorId.toString() === req.params.professorId);
    if (professorIndex === -1) {
      return res.status(404).json({ message: 'Professor não encontrado na disciplina' });
    }

    // Remove o professor da lista de professores
    disciplina.professores.splice(professorIndex, 1);
    await disciplina.save();

    res.json(disciplina);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Funcionando
exports.addTurmatoDisciplina = async (req, res) => {
  try {
    // Busca a turma pelo ID fornecido na URL
    const turma = await Turma.findById(req.params.turmaId);
    if (!turma) {
      return res.status(404).json({ message: 'Turma não encontrada' });
    }

    // Busca a disciplina pelo ID
    const disciplina = await Disciplina.findById(req.params.id);
    if (!disciplina) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }

    // Verifica se a turma já está na lista de turmas da disciplina
    if (disciplina.turmas.includes(turma._id)) {
      return res.status(400).json({ message: 'Turma já está na disciplina' });
    }

    // Adiciona o ID da turma à lista de turmas da disciplina
    disciplina.turmas.push(turma._id);
    await disciplina.save();

    res.status(201).json(disciplina);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Funcionando
exports.removeTurmafromDisciplina = async (req, res) => {
  try {
    // Busca a disciplina pelo ID
    const disciplina = await Disciplina.findById(req.params.id);
    if (!disciplina) {
      return res.status(404).json({ message: 'Disciplina não encontrada' });
    }

    // Verifica se a turma está na lista de turmas da disciplina
    const turmaIndex = disciplina.turmas.findIndex(turmaId => turmaId.toString() === req.params.turmaId);
    if (turmaIndex === -1) {
      return res.status(404).json({ message: 'Turma não encontrada na disciplina' });
    }

    // Remove a turma da lista de turmas
    disciplina.turmas.splice(turmaIndex, 1);
    await disciplina.save();

    res.json(disciplina);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
