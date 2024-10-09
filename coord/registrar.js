$(document).ready(function() {
  // Verifica se o usuário está autenticado
  if (!localStorage.getItem('token')) {
    window.location.href = '../index.html';
  }
  
  // Verifica se o usuário logado é coordenador
  const userType = localStorage.getItem('tipo');
  if (userType !== 'coordenador') {
    $('#message').html('<div class="alert alert-danger">Apenas coordenadores podem registrar novos usuários.</div>');
    $('#registerform').hide();
    return;
  }

  $('#registerform').on('submit', function(event) {
    event.preventDefault();

    const nome = $('#nome').val();
    const email = $('#email').val();
    const senha = $('#senha').val();
    const tipo = $('#tipo').val();
    const token = localStorage.getItem('token');

    $.ajax({
      url: 'https://projeto-pi-zk6e.onrender.com/api/auth/registrar',
      type: 'POST',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      data: JSON.stringify({
        nome: nome,
        email: email,
        senha: senha,
        tipo: tipo
      }),
      success: function(response) {
        $('#message').removeClass('alert-danger').addClass('alert alert-success').text('Usuário Registrado com Sucesso!').show();
        $('#registerform')[0].reset();

        // Atualiza o contêiner com as informações do último usuário registrado
        $('#lastUserName').text(nome);
        $('#lastUserEmail').text(email);
        $('#lastUserType').text(tipo);
        $('#lastRegisteredUser').show();
      },
      error: function(xhr) {
        console.log('Erro ao registrar Usuário:', xhr);
        $('#message').removeClass('alert-success').addClass('alert alert-danger').text('Erro ao registrar Usuário').show();
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
});