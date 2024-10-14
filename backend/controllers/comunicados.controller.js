const Comunicado = require('../models/comunicados.models');

// @desc    Get all comunicados
// @route   GET /api/comunicados
// @access  Public
exports.getComunicados = async (req, res) => {
  try {
    const comunicado = await Comunicado.find();
    res.json(comunicado);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single comunicado
// @route   GET /api/comunicados/:id
// @access  Public
exports.getComunicadoById = async (req, res) => {
  try {
    const comunicado = await Comunicado.findById(req.params.id);
    if (!comunicado) {
      return res.status(404).json({ message: 'Comunicado não encontrado' });
    }
    res.json(comunicado);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create new comunicado
// @route   POST /api/comunicados
// @access  Public
exports.createComunicado = async (req, res) => {
  const { mensagem, data, turma, autor } = req.body;
  try {
    const comunicado = new Comunicado({
        mensagem,
        data,
        turma,
        autor
    });
    await comunicado.save();
    res.status(201).json(comunicado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update comunicado
// @route   PUT /api/comunicados/:id
// @access  Public
exports.updateComunicado = async (req, res) => {
  try {
    const comunicado = await Comunicado.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!comunicado) {
      return res.status(404).json({ message: 'Comunicado não encotrado' });
    }
    res.json(comunicado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete comunicado
// @route   DELETE /api/comunicados/:id
// @access  Public
exports.deleteComunicado = async (req, res) => {
  try {
    const comunicado = await Comunicado.findByIdAndDelete(req.params.id);
    if (!comunicado) {
      return res.status(404).json({ message: 'Comunicado não encontrado' });
    }
    res.json({ message: 'Comunicado deletado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// @desc    Get comunicados by turma id
// @route   GET /api/comunicados/turma/:turmaId
// @access  Public
exports.getComunicadosByTurmaId = async (req, res) => {
  try {
    const comunicados = await Comunicado.find({ turma: req.params.turmaId });
    if (comunicados.length === 0) {
      return res.status(404).json({ message: 'Nenhum comunicado encontrado para essa turma' });
    }
    res.json(comunicados);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
