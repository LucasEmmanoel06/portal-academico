$(document).ready(function() {
    const nome = localStorage.getItem('nome');
    $('#nomeCoordenador').text(nome);
  
    // Função de logout
    document.getElementById('logoutButton').addEventListener('click', function() {
      // Remover o JWT do armazenamento local
      localStorage.removeItem('jwtToken');
      // Redirecionar para a página de login
      window.location.href = '../login.html';
    });
    
    // Função para buscar e exibir as turmas
    function loadTurmas() {
      $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/api/turmas',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        success: function(response) {
          const turmasContainer = $('#turmasContainer');
          turmasContainer.empty();
          if (response.length === 0) {
            turmasContainer.append('<div class="col-12 text-center"><p>Não há turmas criadas</p></div>');
          } else {
            response.forEach(turma => {
              const turmaCard = `
                <div class="col-md-4 mb-4">
                  <div class="card turma-card">
                    <div class="card-body">
                      <h5 class="card-title">${turma.nome}</h5>
                      <p class="card-text">Ano: ${turma.ano}</p>
                      <a href="#" class="btn btn-primary">Ver detalhes</a>
                    </div>
                  </div>
                </div>
              `;
              turmasContainer.append(turmaCard);
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
        url: 'http://localhost:3000/api/turmas',
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
  
    // Carrega as turmas ao carregar a página
    loadTurmas();
  });