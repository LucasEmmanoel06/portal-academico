$(document).ready(function() {
  // Verifica se o usuário está autenticado
  if (!localStorage.getItem('token')) {
    window.location.href = '../login.html';
  }

  const turmaId = localStorage.getItem('turmaId');
  const turmaNome = localStorage.getItem('turmaNome');
  const autorId = localStorage.getItem('userId'); // Recupera o ID do usuário do localStorage
  console.log('autorId recuperado:', autorId); // Adicione este log para verificar o autorId
  $('#nomeTurma').text(turmaNome);

  // Função para buscar e exibir os comunicados
  function loadComunicados() {
    $.ajax({
      type: 'GET',
      url: `http://localhost:3000/api/comunicados/turma/${turmaId}`,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      success: function(response) {
        const comunicadosContainer = $('#comunicadosContainer');
        comunicadosContainer.empty();
        if (response.length === 0) {
          comunicadosContainer.append('<div class="col-12 text-center"><p>Não há comunicados</p></div>');
        } else {
          response.forEach(comunicado => {
            getAutorNome(comunicado.autor, function(nomeAutor) {
              const comunicadoCard = `
                <div class="col-12 mb-3">
                  <div class="card comunicado-card">
                    <div class="card-body">
                      <div class="d-flex justify-content-between">
                        <h5 class="card-title">${nomeAutor} - ${new Date(comunicado.data).toLocaleString()}</h5>
                        <button class="btn btn-danger deletar-comunicado" data-id="${comunicado._id}">Deletar</button>
                      </div>
                      <p class="card-text">${comunicado.mensagem}</p>
                    </div>
                  </div>
                </div>
              `;
              comunicadosContainer.append(comunicadoCard);
            });
          });

          // Adiciona o evento de clique ao botão "Deletar"
          $(document).on('click', '.deletar-comunicado', function() {
            const comunicadoId = $(this).data('id');
            if (confirm('Tem certeza que deseja deletar este comunicado?')) {
              $.ajax({
                url: `http://localhost:3000/api/comunicados/${comunicadoId}`,
                type: 'DELETE',
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                success: function() {
                  alert('Comunicado deletado com sucesso!');
                  loadComunicados(); // Recarrega os comunicados após deletar
                },
                error: function() {
                  alert('Erro ao deletar o comunicado.');
                }
              });
            }
          });

        }
      },
      error: function(xhr) {
        console.log('Erro ao buscar comunicados:', xhr);
      }
    });
  }

  // Função para buscar e exibir as informações da turma
  function loadTurmaInfo() {
    $.ajax({
      type: 'GET',
      url: `http://localhost:3000/api/turmas/${turmaId}`,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      success: function(response) {
        $('#anoTurma').text(response.ano);
        $('#alunosTurma').text(response.alunos.join(', '));
      },
      error: function(xhr) {
        console.log('Erro ao buscar informações da turma:', xhr);
      }
    });
  }

  // Função para buscar o nome do autor
  function getAutorNome(autorId, callback) {
    $.ajax({
      type: 'GET',
      url: `http://localhost:3000/api/usuarios/${autorId}`,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      success: function(response) {
        callback(response.nome);
      },
      error: function(xhr) {
        console.log('Erro ao buscar nome do autor:', xhr);
        callback('Desconhecido');
      }
    });
  }

  // Função para criar um novo comunicado
  $('#createComunicadoForm').on('submit', function(event) {
    event.preventDefault();
    const formData = {
      mensagem: $('#mensagem').val(),
      turma: turmaId,
      autor: autorId
    };

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/api/comunicados',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(formData),
      success: function(response) {
        $('#createComunicadoModal').modal('hide');
        loadComunicados(); // Recarrega os comunicados após a criação
      },
      error: function(xhr) {
        console.log('Erro ao criar comunicado:', xhr);
      }
    });
  });

  // Função de logout
  $('#logoutButton').on('click', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('tipo');
    localStorage.removeItem('nome');
    localStorage.removeItem('turmaId');
    localStorage.removeItem('turmaNome');
    localStorage.removeItem('userId');
    window.location.href = '../login.html';
  });

  // Carrega as informações da turma e os comunicados ao carregar a página
  loadTurmaInfo();
  loadComunicados();
});