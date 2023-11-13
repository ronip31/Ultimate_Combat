const express = require('express');
const path = require('path');
const Db = require('../config/db');
const PlayerController = require('../controller/server');
const cors = require('cors');
const passport = require('passport');
const app = express();
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json()); // Configura o middleware para analisar o corpo da requisição como JSON
app.use(express.static('public'));
const playerController = new PlayerController();


app.db = new Db();
// //ABRE AS PÁGINAS HTML

app.get('/login', (req, res) => {
    console.log("Página /login acessada");
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});


app.get('/lutar', (req, res) => {
        console.log("Página /lutar acessada");
        res.sendFile(path.join(__dirname, '..', 'public', 'lutar.html'));

});


 app.get('/lutarpvp', (req, res) => {
    console.log("Página /lutarpvp acessada");
    res.sendFile(path.join(__dirname, '..', 'public', 'lutarteste.html'));
});

app.get('/mochila', (req, res) => {
    console.log("Página /mochila acessada");
    res.sendFile(path.join(__dirname, '..', 'public', 'mochila.html'));
});

app.get('/mercado', (req, res) => {
    console.log("Página /mercado acessada");
    res.sendFile(path.join(__dirname, '..', 'public', 'mercado.html'));
});

app.get('/banco', (req, res) => {
    console.log("Página /mercado acessada");
    res.sendFile(path.join(__dirname, '..', 'public', 'banco.html'));
});

app.get('/lutarteste', (req, res) => {
    console.log("Página /lutarteste acessada");
    res.sendFile(path.join(__dirname, '..', 'public', 'lutarteste.html'));
});

app.get('/createuser', (req, res) => {
    console.log("Acessado /createuser");
    res.sendFile(path.join(__dirname, '..', 'public', 'createuser.html'));
});

// ADICIONAR UM PLAYER
app.post('/addplayer', (req, res) => {
    console.log("Acessado /addplayer_db");
    playerController.createPlayer(req, res);
});

app.get('/obter_informacoes_jogador', (req, res) => {
    //console.log("Página /obter_informacoes_jogador acessada", req.params);
    //const jogadorId = req.params.id;
    playerController.searchPlayerInfo(req, res);
});

app.put('/atualizar_informacoes_jogador', (req, res) => {
    console.log("Página /atualizar_informacoes_jogador acessada");
    //const jogadorId = req.params.id;
    playerController.updatePlayer(req, res);
});


// Rota para validar o login
app.post('/verificartoken', (req, res) => {
    console.log("Página /verificar-token acessada");
playerController.verifyToken(req, res);
});

app.post('/validalogin', (req, res) => {
    console.log("Página /validalogin acessada");
    playerController.validalogin(req, res);
});
app.post('/renewToken', (req, res) => {
    console.log("Página /renewToken acessada");
    playerController.renewToken(req, res);
});



// Rota protegida, acessível somente após o login
// Rota protegida que requer um token JWT válido para acessar
// app.get('/protegida', verifyToken, function(req, res) {
//     res.json({ success: true, message: 'Rota protegida acessada com sucesso' });
// })


// app.get('/allplayers', (req, res) => {
//     console.log("Página /allplayers acessada");
//     res.sendFile(path.join(__dirname, '..', 'public', 'allplayers.html'));
// });

// // CHAMA AS FUNÇÕES DO CRUD
// app.get('/allsearch', (req, res) => {
//     console.log("Acessado /allsearch");
//     playersController.allsearch(req, res);
// });

// // ADICIONAR UM PLAYER
// app.post('/addplayers', (req, res) => {
//     console.log("Acessado /addplayers");
//     playersController.addPlayers(req, res);
// });

// //PROCURAR UM PLAYER POR NOME
// app.get('/searchPlayersName', (req, res) => {
//     console.log("Acessado /searchPlayersName"); // Isso acessa o parâmetro de consulta 'nome'
//     playersController.searchPlayersName(req, res);
// });

// //PROCURA UM PLAYER POR ID
// app.get('/searchplayersid', (req, res) => {
//     console.log("Acessado /searchplayersid"); // Isso acessa o parâmetro de consulta 'nome'
//     playersController.searchPlayersId(req, res);
// });

// //ATUALIZA A HABILITADE DE UM PLAYER
// app.put('/updateplayer', (req, res) => {
//     console.log("Acessado /updateplayer");
//     playersController.updateplayers(req, res);
// });

// //DELETA UM PALYER POR ID
// app.delete('/deleteplayer/:id', (req, res) => {
//     //const playerId = req.params.id; // Captura o parâmetro 'id' da URL
//     console.log("Acessado /deleteplayer");
//     playersController.deleteplayer(req, res);
// });

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
