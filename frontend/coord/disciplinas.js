$(document).ready(function() {
    // Verifica se o usuário está autenticado
    if (!localStorage.getItem('token')) {
      window.location.href = '../login.html';
    }
  
    // Função de logout
    $('#logoutButton').on('click', function() {
      localStorage.removeItem('token');
      localStorage.removeItem('tipo');
      localStorage.removeItem('nome');
      localStorage.removeItem('userId');
      localStorage.removeItem('turmaId');
      localStorage.removeItem('turmaNome');
      window.location.href = '../login.html';
    });
  
    // Função para buscar e exibir as disciplinas
    function loadDisciplinas() {
      $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/api/disciplinas',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function(response) {
          const disciplinasContainer = $('#disciplinasContainer');
          disciplinasContainer.empty();
          if (response.length === 0) {
            disciplinasContainer.append('<div class="col-12 text-center"><p>Não há disciplinas criadas</p></div>');
          } else {
            response.forEach(disciplina => {
              // Buscar nomes dos professores
              const professorPromises = disciplina.professores.map(professorId => {
                return $.ajax({
                  type: 'GET',
                  url: `http://localhost:3000/api/usuarios/${professorId}`,
                  headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                  }
                });
              });
  
              // Buscar nomes das turmas
              const turmaPromises = disciplina.turmas.map(turmaId => {
                return $.ajax({
                  type: 'GET',
                  url: `http://localhost:3000/api/turmas/${turmaId}`,
                  headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                  }
                });
              });
  
              // Esperar todas as requisições de professores e turmas serem concluídas
              Promise.all([...professorPromises, ...turmaPromises]).then(results => {
                const professores = results.slice(0, professorPromises.length);
                const turmas = results.slice(professorPromises.length);
  
                const professorNomes = professores.map(professor => professor.nome).join(', ');
                const turmaNomes = turmas.map(turma => turma.nome).join(', ');
  
                const disciplinaCard = `
                  <div class="col-md-4 mb-4">
                    <div class="card disciplina-card">
                      <div class="card-body">
                        <h5 class="card-title">${disciplina.nome}</h5>
                        <p class="card-text">Professores: ${professorNomes}</p>
                        <p class="card-text">Turmas: ${turmaNomes}</p>
                        <button class="btn btn-primary adicionar-professor mb-2" data-id="${disciplina._id}">Adicionar Professor</button>
                        <button class="btn btn-warning remover-professor mb-2" data-id="${disciplina._id}">Remover Professor</button>
                        <button class="btn btn-danger deletar-disciplina mb-2" data-id="${disciplina._id}">Deletar</button>
                      </div>
                    </div>
                  </div>
                `;
                disciplinasContainer.append(disciplinaCard);
  
                // Adiciona o evento de clique ao botão "Adicionar Professor"
                $('.adicionar-professor').click(function() {
                  const disciplinaId = $(this).data('id');
                  $('#disciplinaId').val(disciplinaId);
                  $('#addProfessorModal').modal('show');
                });
  
                // Adiciona o evento de clique ao botão "Remover Professor"
                $('.remover-professor').click(function() {
                  const disciplinaId = $(this).data('id');
                  $('#disciplinaIdRemove').val(disciplinaId);
  
                  // Preenche a lista de professores no modal
                  const professoresList = $('#professoresList');
                  professoresList.empty();
                  professores.forEach(professor => {
                    professoresList.append(`<option value="${professor._id}">${professor.nome}</option>`);
                  });
  
                  $('#removeProfessorModal').modal('show');
                });
  
                // Adiciona o evento de clique ao botão "Deletar"
                $('.deletar-disciplina').click(function() {
                  const disciplinaId = $(this).data('id');
                  if (confirm('Tem certeza que deseja deletar esta disciplina?')) {
                    $.ajax({
                      url: `http://localhost:3000/api/disciplinas/${disciplinaId}`,
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
                });
              });
            });
          }
        },
        error: function(xhr) {
          console.log('Erro ao buscar disciplinas:', xhr);
        }
      });
    }
  
    // Função para criar uma nova disciplina
    $('#createDisciplinaForm').on('submit', function(event) {
      event.preventDefault();
      const formData = {
        nome: $('#nomeDisciplina').val()
      };
  
      $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/api/disciplinas',
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
        url: `http://localhost:3000/api/disciplinas/${disciplinaId}/add-professor`,
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
          url: `http://localhost:3000/api/disciplinas/${disciplinaId}/remove-professor/${professorId}`,
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