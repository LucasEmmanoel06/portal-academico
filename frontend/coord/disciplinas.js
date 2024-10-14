$(document).ready(function() {
  // Verifica se o usuário está autenticado
  if (!localStorage.getItem('token')) {
    window.location.href = '../index.html';
  }

  // Função de logout
  $('#logoutButton').on('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('tipo');
    localStorage.removeItem('nome');
    localStorage.removeItem('userId');
    localStorage.removeItem('turmaId');
    localStorage.removeItem('turmaNome');
    window.location.href = '../index.html';
  });

  // Função para buscar e exibir as disciplinas
  function loadDisciplinas() {
    $.ajax({
      type: 'GET',
      url: 'https://projeto-pi-zk6e.onrender.com/api/disciplinas',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      success: function(response) {
        const disciplinasContainer = $('#disciplinasContainer');
        disciplinasContainer.empty();
        if (response.length === 0) {
          disciplinasContainer.append('<div class="col-12 text-center"><h3>Não há disciplinas criadas</h3></div>');
        } else {
          response.forEach(disciplina => {
            const professorPromises = disciplina.professores.map(professorId => {
              return $.ajax({
                type: 'GET',
                url: `https://projeto-pi-zk6e.onrender.com/api/usuarios/${professorId}`,
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
              });
            });

            Promise.all(professorPromises).then(professores => {
              const professorNomes = professores.map(professor => professor.nome).join(', ');
              const turmaNomes = disciplina.turmas.map(turma => turma.nome).join(', ');
              const disciplinaCard = `
                <div class="col-md-4 mb-4" data-id="${disciplina._id}">
                  <div class="card disciplina-card">
                    <div class="card-body">
                      <h5 class="card-title">${disciplina.nome}</h5>
                      <p class="card-text">Professores: ${professorNomes}</p>
                      <button class="btn btn-primary adicionar-professor mb-2" data-id="${disciplina._id}">Adicionar Professor</button>
                      <button class="btn btn-warning remover-professor mb-2" data-id="${disciplina._id}">Remover Professor</button>
                      <button class="btn btn-danger deletar-disciplina mb-2" data-id="${disciplina._id}">Deletar</button>
                    </div>
                  </div>
                </div>
              `;
              disciplinasContainer.append(disciplinaCard);
            });
          });
        }
      },
      error: function(xhr) {
        console.log('Erro ao buscar disciplinas:', xhr);
      }
    });
  }

  // Função para deletar uma disciplina
  function deleteDisciplina(disciplinaId) {
    if (confirm('Tem certeza que deseja deletar esta disciplina?')) {
      $.ajax({
        url: `https://projeto-pi-zk6e.onrender.com/api/disciplinas/${disciplinaId}`,
        type: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function() {
          alert('Disciplina deletada com sucesso!');
          loadDisciplinas(); // Recarrega as disciplinas após deletar
        },
        error: function() {
          alert('Erro ao deletar a disciplina.');
        }
      });
    }
  }

  // Delegação de eventos para o botão "Deletar"
  $(document).on('click', '.deletar-disciplina', function() {
    const disciplinaId = $(this).data('id');
    deleteDisciplina(disciplinaId);
  });

  // Delegação de eventos para o botão "Adicionar Professor"
  $(document).on('click', '.adicionar-professor', function() {
    const disciplinaId = $(this).data('id');
    $('#disciplinaId').val(disciplinaId);
    $('#addProfessorModal').modal('show');
  });

  // Delegação de eventos para o botão "Remover Professor"
  $(document).on('click', '.remover-professor', function() {
    const disciplinaId = $(this).data('id');
    $('#disciplinaIdRemove').val(disciplinaId);

    // Buscar professores da disciplina selecionada
    $.ajax({
      type: 'GET',
      url: `https://projeto-pi-zk6e.onrender.com/api/disciplinas/${disciplinaId}`,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      success: function(disciplina) {
        const professoresList = $('#professoresList');
        professoresList.empty();
        disciplina.professores.forEach(professorId => {
          $.ajax({
            type: 'GET',
            url: `https://projeto-pi-zk6e.onrender.com/api/usuarios/${professorId}`,
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: function(professor) {
              professoresList.append(`<option value="${professor._id}">${professor.nome}</option>`);
            }
          });
        });
        $('#removeProfessorModal').modal('show');
      }
    });
  });

  // Função para criar uma nova disciplina
  $('#createDisciplinaForm').on('submit', function(event) {
    event.preventDefault();
    const formData = {
      nome: $('#nomeDisciplina').val()
    };

    $.ajax({
      type: 'POST',
      url: 'https://projeto-pi-zk6e.onrender.com/api/disciplinas',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(formData),
      success: function(response) {
        $('#createDisciplinaModal').modal('hide');
        loadDisciplinas(); // Recarrega as disciplinas após a criação
      },
      error: function(xhr) {
        console.log('Erro ao criar disciplina:', xhr);
      }
    });
  });

  // Função para adicionar um professor à disciplina
  $('#addProfessorForm').on('submit', function(event) {
    event.preventDefault();
    const disciplinaId = $('#disciplinaId').val();
    const formData = {
      email: $('#emailProfessor').val()
    };

    $.ajax({
      type: 'POST',
      url: `https://projeto-pi-zk6e.onrender.com/api/disciplinas/${disciplinaId}/add-professor`,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(formData),
      success: function(response) {
        $('#addProfessorModal').modal('hide');
        loadDisciplinas(); // Recarrega as disciplinas após adicionar o professor
      },
      error: function(xhr) {
        console.log('Erro ao adicionar professor:', xhr);
      }
    });
  });

  // Função para remover professores da disciplina
  $('#removeProfessorForm').on('submit', function(event) {
    event.preventDefault();
    const disciplinaId = $('#disciplinaIdRemove').val();
    const professores = $('#professoresList').val(); // Array de IDs dos professores selecionados

    professores.forEach(professorId => {
      $.ajax({
        type: 'DELETE',
        url: `https://projeto-pi-zk6e.onrender.com/api/disciplinas/${disciplinaId}/remove-professor/${professorId}`,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function(response) {
          $('#removeProfessorModal').modal('hide');
          loadDisciplinas(); // Recarrega as disciplinas após remover o professor
        },
        error: function(xhr) {
          console.log('Erro ao remover professor:', xhr);
        }
      });
    });
  });

  // Carrega as disciplinas ao carregar a página
  loadDisciplinas();
});