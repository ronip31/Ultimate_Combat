const express = require('express');
const path = require('path');
const Db = require('../config/db');
const PlayerController = require('../controller/server');
const Globals  = require('../controller/globals');
const cors = require('cors');
const passport = require('passport');
const app = express();
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json()); // Configura o middleware para analisar o corpo da requisição como JSON
app.use(express.static('public'));
const playerController = new PlayerController();

// Criar uma instância da classe PlayerTempo
const globals = new Globals();


app.db = new Db();

// //ABRE AS PÁGINAS HTML

app.get('/login', (req, res) => {
    console.log("Página /login acessada");
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

app.get('/', (req, res) => {
    console.log("Página /lutar acessada");
    res.sendFile(path.join(__dirname, '..', 'public', 'lutar.html'));
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


app.get('/ranking', (req, res) => {
    console.log("Página /lutarteste acessada");
    res.sendFile(path.join(__dirname, '..', 'public', 'ranking.html'));
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
    playerController.searchPlayerInfo(req, res);
});

app.put('/atualizar_informacoes_jogador', (req, res) => {
    console.log("Página /atualizar_informacoes_jogador acessada");
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

app.get('/getarmas', (req, res) => {
    console.log("Página /getarmas acessada");
    playerController.getarmas(req, res);
});

app.get('/armasJogador', (req, res) => {
    console.log("Página /armasJogador acessada");
    playerController.armasJogador(req, res);
});


app.post('/comprarArma', (req, res) => {
    console.log("Página /comprarArma acessada");
    playerController.comprarArma(req, res);
});

app.post('/venderArma', (req, res) => {
    console.log("Página /venderArma acessada");
    playerController.venderArma(req, res);
});

// No seu arquivo de rotas (routes.js ou similar)
app.post('/equiparArma', (req, res) => {
    console.log("Página /equiparArma acessada");
    playerController.equiparArma(req, res);
});

app.post('/desequiparArma', (req, res) => {
    console.log("Página /desequiparArmaacessada");
    playerController.desequiparArma(req, res);
});

app.get('/armaEquipada', (req, res) => {
    console.log("Página /armaEquipada acessada");
    playerController.armaEquipada(req, res);
});

app.post('/calcularPR', (req, res) => {
    console.log("Página /calcularPR acessada");
    playerController.calcularPR(req, res);
});

//rota para atualizar data e hora do jogo
app.get('/obter-tempo', async (req, res) => {
    console.log("Página /api/obter-tempo acessada");
    
    try {
        const tempo = await globals.obterTempoSalvo();
        res.json(tempo);
    } catch (error) {
        console.error('Erro ao obter o tempo:', error);
        res.status(500).json({ error: 'Erro ao obter o tempo' });
    }
});

app.get('/jogadores', (req, res) => {
    console.log("Página /jogadores  acessada");
    globals.ranking(req, res);
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});