const express = require('express');
const path = require('path');
const Db = require('../config/db');
//const cors = require('cors');

const app = express();
app.use(express.json()); // Configura o middleware para analisar o corpo da requisição como JSON
app.use(express.static('public'));
//app.use(cors());

app.db = new Db();
// //ABRE AS PÁGINAS HTML

app.get('/', (req, res) => {
    console.log("Página /login acessada");
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});


 app.get('/lutar', (req, res) => {
     console.log("Página /player acessada");
     res.sendFile(path.join(__dirname, '..', 'public', 'lutar.html'));
 });

 app.get('/lutarpvp', (req, res) => {
    console.log("Página /lutarpvp acessada");
    res.sendFile(path.join(__dirname, '..', 'public', 'lutarpvp.html'));
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
