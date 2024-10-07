$(document).ready(function() {
  $('#loginForm').on('submit', function(event) {
    event.preventDefault();
    const formData = {
      nome: $('#nome').val(),
      senha: $('#senha').val()
    };

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/api/auth/login',
      data: JSON.stringify(formData),
      contentType: 'application/json',
      success: function(response) {
        $('#message').removeClass('alert-danger').addClass('alert alert-success').text('Login successful!').show();
        // Armazena o token e o tipo de usuário no localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('tipo', response.tipo);
        localStorage.setItem('nome', response.nome);
        // Adiciona um atraso de 1 segundo antes de redirecionar
        setTimeout(function() {
          if (response.tipo === 'coordenador') {
            window.location.href = 'coord/coordenador.html';
          } else if (response.tipo === 'professor') {
            window.location.href = 'prof/professor.html';
          }
        }, 1000); // 1000 milissegundos = 1 segundo
      },
      error: function(xhr) {
        console.log('Erro no login:', xhr);
        $('#message').removeClass('alert-success').addClass('alert alert-danger').text('Invalid credentials').show();
      }
    });
  });
});