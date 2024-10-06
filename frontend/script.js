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
          // Redirect to another page or perform other actions
        },
        error: function(xhr) {
          console.log('Erro no login:', xhr); // Adicione esta linha para depuração
          $('#message').removeClass('alert-success').addClass('alert alert-danger').text('Invalid credentials').show();
        }
      });
    });
  });