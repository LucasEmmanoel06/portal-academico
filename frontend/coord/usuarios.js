$(document).ready(function() {
  const token = localStorage.getItem('token');

  // Função para preencher a lista de usuários
  function preencherLista(url, listaId) {
    $.ajax({
      url: `http://localhost:3000/api/usuarios${url}`,
      type: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      success: function(response) {
        const lista = $(listaId);
        lista.empty();
        response.forEach(usuario => {
          const listItem = `
            <li class="list-group-item">
              <strong>Nome:</strong> ${usuario.nome}<br>
              <strong>Email:</strong> ${usuario.email}<br>
              <strong>ID:</strong> ${usuario._id}
            </li>
          `;
          lista.append(listItem);
        });
      },
      error: function(xhr) {
        console.error(`Erro ao buscar usuários de ${url}:`, xhr);
      }
    });
  }

  // Preencher as listas de coordenadores, professores e alunos
  preencherLista('/tipo/coordenadores', '#coordenadoresList');
  preencherLista('/tipo/professores', '#professoresList');
  preencherLista('/tipo/alunos', '#alunosList');
  
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
});