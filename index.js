$(document).ready(function() {
  $('#loginForm').on('submit', function(event) {
    event.preventDefault();
    const formData = {
      email: $('#email').val(),
      senha: $('#senha').val()
    };

    $.ajax({
      type: 'POST',
      url: 'https://projeto-pi-zk6e.onrender.com/api/auth/login',
      data: JSON.stringify(formData),
      contentType: 'application/json',
      success: function(response) {
        console.log('Resposta do backend:', response); // Adicione este log para verificar a resposta do backend
        $('#message').removeClass('alert-danger').addClass('alert alert-success').text('Login successful!').show();
        // Armazena o token e o tipo de usuário no localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId); // Certifique-se de que o userId está sendo armazenado
        localStorage.setItem('tipo', response.tipo);
        localStorage.setItem('nome', response.nome);
        console.log('userId armazenado:', response.userId); // Adicione este log para verificar o userId
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