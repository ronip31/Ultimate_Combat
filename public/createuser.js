function adicionarJogador(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    // Capturar os valores dos campos
    var nome = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nome && email && password) {
        if (emailRegex.test(email)) {
            // Construir o objeto de dados a ser enviado para a rota
            var dados = {
                nome: nome,
                email: email,
                password: password
            };

            // Enviar os dados para a rota http://localhost:3000/addplayers usando fetch API
            fetch('http://localhost:3000/addplayer', {
                method: 'POST', // Método HTTP POST para enviar dados
                headers: {
                    'Content-Type': 'application/json' // Tipo de conteúdo JSON
                },
                body: JSON.stringify(dados) // Converter o objeto para JSON e enviar no corpo da requisição
            })
                .then(response => response.json())
                .then(data => {
                    // Aqui você pode lidar com a resposta da rota, se necessário
                    console.log('Server Response:', data);

                    // Verificar se o e-mail já está cadastrado
                    if (data.error && data.error.toLowerCase().includes('e-mail já cadastrado')) {
                        alert('E-mail já cadastrado. Escolha outro e-mail.');
                    } else if (data.message && data.message.toLowerCase().includes('jogador criado com sucesso.')) {
                        // Show a success alert
                        alert('Usuário cadastrado com sucesso!');

                        // Redirect to the login page
                        window.location.href = '/login';
                    } else {
                        // Handle the case where registration was not successful
                        alert('Erro ao cadastrar usuário. Tente novamente.');
                    }
                })
                .catch(error => {
                    // Lidar com erros, se houver algum problema na requisição
                    console.error('Erro:', error);
                });
        } else {
            // Se o e-mail não for válido, exiba uma mensagem de erro
            alert('Por favor, insira um endereço de e-mail válido.');
        }
    } else {
        // Se algum campo estiver vazio, exiba uma mensagem de erro
        // document.getElementById("resultadoerro").textContent = JSON.stringify("Por favor, preencha todos os campos.");
        alert('Por favor, preencha todos os campos.');
    }
}


function redirectToLogin() {
    // Add code to redirect to the create login page
    window.location.href = '/login';
}

