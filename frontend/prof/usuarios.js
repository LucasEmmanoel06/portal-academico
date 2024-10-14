$(document).ready(function() {
  // Verifica se o usuário está autenticado
  if (!localStorage.getItem('token')) {
    window.location.href = '../index.html';
  }

  // Função para preencher a lista de usuários
  function preencherLista(url, listaId) {
    $.ajax({
      url: `https://projeto-pi-zk6e.onrender.com/api/usuarios${url}`,
      type: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
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
    window.location.href = '../index.html';
  });
});