$(document).ready(function() {
  // Verifica se o usuário está autenticado
  if (!localStorage.getItem('token')) {
    window.location.href = '../index.html';
  }

  const userId = localStorage.getItem('userId'); // Recupera o ID do usuário do localStorage

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
            // Filtra as disciplinas para incluir apenas aquelas que têm o professor autenticado
            if (disciplina.professores.includes(userId)) {
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
                      </div>
                    </div>
                  </div>
                `;
                disciplinasContainer.append(disciplinaCard);
              });
            }
          });
        }
      },
      error: function(xhr) {
        console.log('Erro ao buscar disciplinas:', xhr);
      }
    });
  }

  // Carrega as disciplinas ao carregar a página
  loadDisciplinas();
});