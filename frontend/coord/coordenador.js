$(document).ready(function() {
  // Verifica se o usuário está autenticado
  if (!localStorage.getItem('token')) {
    window.location.href = '../index.html';
  }

  const nome = localStorage.getItem('nome');
  $('#nomeCoordenador').text(nome);

  // Função para buscar e exibir as turmas
  function loadTurmas() {
    $.ajax({
      type: 'GET',
      url: 'https://projeto-pi-zk6e.onrender.com/api/turmas',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      success: function(response) {
        const turmasContainer = $('#turmasContainer');
        turmasContainer.empty();
        if (response.length === 0) {
          turmasContainer.append('<div class="col-12 text-center"><h3>Não há turmas criadas</h3></div>');
        } else {
          response.forEach(turma => {
            const turmaCard = `
              <div class="col-md-4 mb-4">
                <div class="card turma-card">
                  <div class="card-body">
                    <h5 class="card-title">${turma.nome}</h5>
                    <p class="card-text">Ano: ${turma.ano}</p>
                    <a href="#" class="btn btn-primary ver-detalhes" data-id="${turma._id}" data-nome="${turma.nome}">Ver detalhes</a>
                    <button class="btn btn-danger deletar-turma" data-id="${turma._id}">Deletar</button>
                  </div>
                </div>
              </div>
            `;
            turmasContainer.append(turmaCard);
          });

          // Adiciona evento de clique aos botões "Ver Detalhes"
          $('.ver-detalhes').on('click', function() {
            const turmaId = $(this).data('id');
            const turmaNome = $(this).data('nome');
            localStorage.setItem('turmaId', turmaId);
            localStorage.setItem('turmaNome', turmaNome);
            window.location.href = 'turma.html';
          });

          // Adiciona o evento de clique ao botão "Deletar"
          $('.deletar-turma').click(function() {
            const turmaId = $(this).data('id');
            if (confirm('Tem certeza que deseja deletar esta turma?')) {
              $.ajax({
                url: `https://projeto-pi-zk6e.onrender.com/api/turmas/${turmaId}`,
                type: 'DELETE',
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                success: function() {
                  alert('Turma deletada com sucesso!');
                  loadTurmas(); // Recarrega as turmas após deletar
                },
                error: function() {
                  alert('Erro ao deletar a turma.');
                }
              });
            }
          });

        }
      },
      error: function(xhr) {
        console.log('Erro ao buscar turmas:', xhr);
      }
    });
  }

  // Função para criar uma nova turma
  $('#createTurmaForm').on('submit', function(event) {
    event.preventDefault();
    const formData = {
      nome: $('#nome').val(),
      ano: $('#ano').val()
    };

    $.ajax({
      type: 'POST',
      url: 'https://projeto-pi-zk6e.onrender.com/api/turmas',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(formData),
      success: function(response) {
        $('#createTurmaModal').modal('hide');
        loadTurmas(); // Recarrega as turmas após a criação
      },
      error: function(xhr) {
        console.log('Erro ao criar turma:', xhr);
      }
    });
  });

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

  // Carrega as turmas ao carregar a página
  loadTurmas();
});