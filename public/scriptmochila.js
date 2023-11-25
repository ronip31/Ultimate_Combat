document.addEventListener('DOMContentLoaded', function () {
    // Check if userId and token are present in localStorage
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        // Redirect the user to the login page if not logged in
        window.location.href = '/login'; // Update with the actual login page URL
    } else {
        // User is logged in, continue with your existing code
        mostraInfoJogador();
        buscarArmaEquipada();
        atualizarTempo();
        // ... (other code)
    }
});

const userId = localStorage.getItem('userId');
const token = localStorage.getItem('token');
const $horas = document.querySelector('.horas');
const $dias = document.querySelector('.dias');
const $estamina = document.querySelector('#estamina');
const $barraEstamina = document.querySelector('.barra-estamina div');

//Gravar e recuperar dados no Local Storage
function gravarLS(key,valor){
    localStorage.setItem(key, valor)
}
function recuperaLS(key,valor){
    let valorBD = localStorage.getItem(key)
    if(valorBD == null){
        valor = valor
    }else{
        valor = valorBD
    }
    valor = parseFloat(valor);

    return valor;
}


    // atualizar Dados Jogador 
function atualizarDadosJogador(data) {
    fetch('http://localhost:3000/atualizar_informacoes_jogador', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, userId }),
    })
    .then(response => response.json())
    .then(data => {
        //console.log('Dados do jogador atualizados:', data);
        mostraInfoJogador();
        // Lógica adicional após a atualização, se necessário
    })
    .catch(error => {
        //console.error('Erro ao atualizar dados do jogador:', error);
    });
}

//mostra e atualiza as informações do jogador na tela/
async function  mostraInfoJogador(){
    
    try {
        
        const response = await fetch(`http://localhost:3000/obter_informacoes_jogador?id=${userId}`);
        
        const data = await response.json();

        // Atualiza os elementos HTML com as informações do jogador
        document.getElementById('nome').textContent = data.players[0].nome;
        document.getElementById('respeito').textContent = data.players[0].respeito;
        document.getElementById('estamina').textContent = data.players[0].estamina + '%';
        document.getElementById('inteligencia').textContent = data.players[0].inteligencia;
        document.getElementById('forca').textContent = data.players[0].forca;
        document.getElementById('carisma').textContent = data.players[0].carisma;
        document.getElementById('resistencia').textContent = data.players[0].resistencia;
        document.getElementById('grana').textContent = '$' + data.players[0].grana;
        document.getElementById('power').textContent =  data.players[0].powerjogador;

        $estamina.innerHTML = `${data.players[0].estamina}%`;
        $barraEstamina.style.width = `${data.players[0].estamina}%`;
    
    } catch (error) {
        console.log("resultadoBuscaerro: " + error);
    }
}


function logout() {
    // Function to handle logout
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    
    // Redirect the user to the login page or perform other actions
    window.location.href = '/login'; // Update with the actual login page URL
}

let tabelaPreenchida = false;



// Função para simular a compra de uma arma
function comprarArma(idArma) {
    console.log('Comprar arma com o ID:', idArma);

    // Adicione lógica adicional aqui, como enviar uma solicitação para o servidor para registrar a compra
    fetch('/comprarArma', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idArma: idArma,
            userId: userId, // Certifique-se de que a variável userId está definida antes de chamar a função
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao comprar arma.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);

        if (data.error) {
            // Se o servidor retornar um erro, exiba um alerta com a mensagem de erro específica
            alert(data.error);
        } else if (data.message) {
            // Se o servidor retornar uma mensagem, exiba um alerta com a mensagem de sucesso
            alert(data.message);
            // Depois, chame buscarArmasJogador() para atualizar a tabela de armas do jogador
            buscarArmasJogador();
            mostraInfoJogador()
            console.log("comprarArma CHAMADO 0");
        } else {
            console.log('Compra realizada com sucesso!');
            // Depois, chame buscarArmasJogador() para atualizar a tabela de armas do jogador
            buscarArmasJogador();
            mostraInfoJogador()
            console.log("comprarArma CHAMADO");
        }
    })
    .catch(error => {
        console.error('Erro ao comprar arma:', error);

        // Exiba um alerta específico para erros relacionados à compra de arma
        alert('Erro ao comprar a arma. Tente novamente mais tarde.');
    });
}


function venderArma(idArma) {
    console.log('Vender arma com o ID:', idArma);

    // Adicione lógica adicional aqui, como enviar uma solicitação para o servidor para registrar a venda
    fetch('/venderArma', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idArma: idArma,
            userId: userId,
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao vender arma.');
        }
        return response.json();
    })
    .then(data => {
        console.log('Resposta do servidor:', data);
       
        if (data.message) {
            alert(data.message);
            buscarArmasJogador();
            mostraInfoJogador()
            console.log("venderArma CHAMADO-1")
        } else {
            console.log('Venda realizada com sucesso!');
            buscarArmasJogador(); // Atualize a tabela de armas do jogador após a venda
            mostraInfoJogador()
            console.log("venderArma CHAMADO-2")
        }
    })
    .catch(error => {
        console.error('Erro ao vender arma:', error);
        alert('Erro ao vender a arma. Tente novamente mais tarde.');
    });
}

async function equiparArma(idArma, botaoEquipar) {
    console.log('Equipar arma com o ID:', idArma);

    try {
        const response = await fetch('/equiparArma', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idArma: idArma,
                userId: userId,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao equipar arma.');
        }

        const data = await response.json();
        console.log('Resposta do servidor:', data);

        if (data.armaEquipada) {
            alert('Arma equipada com sucesso!');
            // Adicione o status de equipamento à arma equipada
            data.armaEquipada.equipada = true;
            gravarLS('idArma', idArma);
            calcularPR(idArma,userId);

            // Atualize o botão e a tabela com base nos dados recebidos
            botaoEquipar.innerText = 'Desequipar';
            botaoEquipar.onclick = function() {
                desequiparArma(data.armaEquipada.id, botaoEquipar);
            };

            // Atualize a página HTML
            buscarEquipamentoJogador();
        }
    } catch (error) {
        console.error('Erro ao equipar arma:', error);
        alert('Erro ao equipar a arma. Tente novamente mais tarde.');
    }
}

async function desequiparArma(idArma, botaoDesequipar) {
    console.log('Desequipar arma com o ID:', idArma);

    try {
        const response = await fetch('/desequiparArma', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idArma: idArma,
                userId: userId,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao desequipar arma.');
        }

        const data = await response.json();
        console.log('Resposta do servidor:', data);

        if (data.message) {
            alert(data.message);
            // Atualize a tabela de equipamento do jogador após o desequipamento
            buscarEquipamentoJogador();

            // Atualizar o texto do botão para "Equipar"
            botaoDesequipar.innerText = 'Equipar';
            // Adicionar um evento de clique para chamar a função equiparArma
            botaoDesequipar.onclick = function() {
                equiparArma(idArma, botaoDesequipar);
            };
        } else {
            console.log('Erro ao desequipar arma:', data.error);
        }
    } catch (error) {
        console.error('Erro ao desequipar arma:', error);
        alert('Erro ao desequipar a arma. Tente novamente mais tarde.');
    }
}

async function buscarEquipamentoJogador() {
    try {
        const timestamp = new Date().getTime();

        // Buscar a arma equipada antes de listar as armas do jogador
        const armaEquipadaData = await fetch(`/armaEquipada?id=${userId}`);
        const armaEquipada = (await armaEquipadaData.json()).armaEquipada;

        const tabelaArmasJogador = document.getElementById('tabela-mochila');

        // Limpar a tabela antes de preenchê-la novamente
        tabelaArmasJogador.innerHTML = '';

        // Buscar a lista de armas do jogador
        const armasJogadorData = await fetch(`/armasJogador?id=${userId}`);
        const data = await armasJogadorData.json();

        data.armasJogador.forEach(arma => {
            const row = tabelaArmasJogador.insertRow();
            const botaoEquipar = document.createElement('button');

            if (arma && arma.equipada) {
                // Se a arma estiver equipada, configure o botão para desequipar
                botaoEquipar.innerText = 'Desequipar';
                botaoEquipar.onclick = function() {
                    desequiparArma(arma.id, botaoEquipar);
                };
            } else {
                // Se a arma não estiver equipada, configure o botão para equipar
                botaoEquipar.innerText = 'Equipar';
                botaoEquipar.onclick = function() {
                    equiparArma(arma.id, botaoEquipar);
                };
            }

            const cellNome = row.insertCell();
            const cellForca = row.insertCell();
            const cellPreco = row.insertCell();
            const cellEquipar = row.insertCell();

            cellNome.textContent = arma.nome;
            cellForca.textContent = arma.forca;
            cellPreco.textContent = arma.precoTxt;
            cellEquipar.appendChild(botaoEquipar);

            // Se esta arma é a equipada, atualize o botão e evento de clique
            if (arma && armaEquipada && arma.id === armaEquipada.id) {
                botaoEquipar.innerText = 'Desequipar';
                botaoEquipar.onclick = function() {
                    desequiparArma(arma.id, botaoEquipar);
                };
            }
        });

        // Atualizar a informação da arma equipada
        atualizarInformacaoArmaEquipada(armaEquipada);

    } catch (error) {
        console.error('Erro ao buscar armas do jogador:', error);
    }
}


// Função para atualizar as informações da arma equipada
function atualizarInformacaoArmaEquipada(armaEquipada) {
    if (armaEquipada) {
        // Atualize as divs correspondentes com as informações da arma equipada
        document.getElementById('nomeEquipado').innerText = armaEquipada.nome;
        console.log("armaEquipada.pBonus>", armaEquipada.pBonus)
        localStorage.setItem('pBonus', armaEquipada.pBonus)
        //jogador1.powerRS = data.players[0].powerjogador; = armaEquipada.forca;
    } else {
        // Caso o jogador não tenha nenhuma arma equipada, exiba uma mensagem padrão ou deixe vazio
        document.getElementById('nomeEquipado').innerText = 'Vazio';
    }
}


async function buscarArmaEquipada() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/armaEquipada?id=${userId}`);
        const data = await response.json();

        if (data.armaEquipada) {
            const arma = data.armaEquipada;

            // Atualize as divs correspondentes com as informações da arma equipada
            document.getElementById('nomeEquipado').innerText = arma.nome;
            console.log("arma.pBonus>", arma.pBonus)
            localStorage.setItem('pBonus', arma.pBonus)
        } else {
            // Caso o jogador não tenha nenhuma arma equipada, exiba uma mensagem padrão ou deixe vazio
            document.getElementById('nomeEquipado').innerText = 'Vazio';
        }
    } catch (error) {
        console.error('Erro ao buscar arma equipada:', error);
    }
}

async function calcularPR(idArma,userId) {
    try {
        const response = await fetch('/calcularPR', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                idArma: idArma,
                userId: userId,
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao calcular PR.');
        }

        const data = await response.json();
        console.log('PR calculado:', data);
        atualizarDadosJogador(data.bonusRS)
        // Atualize a interface do usuário com o novo PR, se necessário
    } catch (error) {
        console.error('Erro ao calcular PR:', error);
        alert('Erro ao calcular PR. Tente novamente mais tarde.');
    }
}

async function atualizarTempo() {
    try {

        const response = await fetch('http://localhost:3000/obter-tempo');
        const tempo = await response.json();

        console.log('Tempo recebido:', tempo.dias);

        gravarLS('min', `${tempo.minutos}`);
        gravarLS('horas', `${tempo.horas}`);
        gravarLS('dias', tempo.dias);

        $horas.innerHTML = `<i class="far fa-clock"></i> ${tempo.horas} : ${tempo.minutos}`;
        $dias.innerHTML = `<i class="far fa-calendar-alt"></i> Dia: ${tempo.dias}` ;

    } catch (error) {
        console.error('Erro ao obter o tempo:', error);
    }
}

// Configurar intervalo para atualizar a cada minuto (ou conforme necessário)
setInterval(atualizarTempo, 60000); // Atualiza a cada 1 minuto (60000 milissegundos)
//setInterval(renewToken, 300);
setInterval(mostraInfoJogador, 25000); 
//FUNÇÃO PARA CHAMAR AO ABRIR A PÁGINA.
window.onload = () => {
    buscarEquipamentoJogador();
    buscarArmaEquipada();
};