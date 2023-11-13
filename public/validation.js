async function loginuser() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/validalogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: username,
                password: password,
            }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.error('Erro na requisição:', response.statusText);
                alert('Usuário ou senha incorretos. Tente novamente.');
            } else {
                console.error('Erro na requisição:', response.statusText);
                throw new Error('Erro na requisição');
            }
        }

        const userResponse = await response.json();

        console.log("userResponse loginuser", userResponse);

        // Log the value of userResponse.success
        console.log("userResponse.success:", userResponse.success);

        if (userResponse.success) {
            // Assuming userService is defined somewhere
            console.log("loginuser UserId:", userResponse.userId);
            console.log("loginuser token ", userResponse.token);
            console.log("loginuser expiration ", userResponse.expiration);
            localStorage.setItem('userId', userResponse.userId);
           // localStorage.setItem('expiration', userResponse.expiration);
            localStorage.setItem('token', userResponse.token);
            localStorage.setItem('expiration', userResponse.expiration);
            
            // Adiciona a lógica para renovar o token se estiver prestes a expirar
            if (shouldRenewToken()) {
                await renewToken();
            }

            localStorage.setItem('token', userResponse.token);

            // Redirect the user to the main page or perform other actions
            window.location.href = '/lutar';
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

function redirectToCreateLogin() {
    // Add code to redirect to the create login page
    window.location.href = '/createuser';
}

// Função para verificar se o token está prestes a expirar
function shouldRenewToken() {
    const expiration = localStorage.getItem('expiration');
    return expiration && Date.now() + 300000 >= parseInt(expiration); // Renova se estiver prestes a expirar (por exemplo, nos últimos 5 minutos)
}

// Função para renovar o token
async function renewToken() {
    try {
        const response = await fetch('http://localhost:3000/renewToken', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (response.ok) {
            const newToken = await response.json().token;

            // Extrai a data de expiração do novo token
            const decodedToken = jwt.decode(newToken);
            const expiration = decodedToken ? decodedToken.exp * 1000 : 0; // Multiplica por 1000 para converter segundos em milissegundos

            // Atualiza o token e sua data de expiração
            localStorage.setItem('token', newToken);
            localStorage.setItem('expiration', expiration);

            console.log('Token renovado com sucesso!');
        } else {
            console.error('Falha ao renovar o token:', response.statusText);
            // Implemente a lógica para lidar com falhas na renovação
        }
    } catch (error) {
        console.error('Erro na renovação do token:', error);
        // Implemente a lógica para lidar com erros na renovação
    }
}

