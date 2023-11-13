const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Db = require('../config/db');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cors());

// Configurar body-parser para analisar solicitações JSON
app.use(bodyParser.json());

app.use(session({
    secret: 'suachavesecreta',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const db = new Db(); // Crie uma instância do seu banco de dados




class PlayerController {
    constructor() {
        this.db = new Db();
    }

    // Rota para obter as informações do jogador
    async searchPlayerInfo(req, res) {
        //console.log('Função BUSCAR um jogador por id', req.query);
        
        try {
            const { id } = req.query;
            if (id && id.trim() !== '') {
                const searchQuery = id; 
                
                const results = await this.db.query('SELECT * FROM jogadores WHERE id = ?', [id]);
                //console.log(results,"id> ", id)
                
                res.json({ players: results });
            } else {
                res.status(400).json({ error: 'Parâmetro "id" é obrigatório.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar jogadores. ' + error });
        }
    }

    async createPlayer(req, res) {
        try {
            const { nome, password, email, respeito, bonus_recompensa, estamina, inteligencia, forca, carisma, resistencia, grana, powerjogador } = req.body;
    
            if (!nome || nome.trim() === '') {
                return res.status(400).json({ error: 'O campo "nome" é obrigatório.' });
            }
    
            // Verificar se o e-mail já está cadastrado
            const checkEmailQuery = 'SELECT * FROM jogadores WHERE email = ?';
            const emailCheckResult = await this.db.query(checkEmailQuery, [email]);
    
            if (emailCheckResult.length > 0) {
                return res.status(400).json({ error: 'E-mail já cadastrado. Escolha outro e-mail.' });
            }
    
            // Se o e-mail não estiver cadastrado, proceda com a inserção
            const insertQuery = 'INSERT INTO jogadores (nome, senha, email, respeito, bonus_recompensa, estamina, inteligencia, forca, carisma, resistencia, grana, powerjogador) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [nome, password, email, respeito || 1, bonus_recompensa || 1, estamina || 100, inteligencia || 10, forca || 10, carisma || 10, resistencia || 10, grana || 50, powerjogador || 10];
    
            await this.db.query(insertQuery, values);
    
            res.json({ message: 'Jogador criado com sucesso.' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar jogador. ' + error });
        }
    }
    

    async updatePlayer(req, res) {
        try {
            const { userId } = req.body;
            const { respeito, bonus_recompensa, estamina, inteligencia, forca, carisma, resistencia, grana, powerjogador } = req.body.data;
            //console.log(" req.body.data update: ",  req.body.data, userId)
            if (userId) {
                const currentPlayer = await this.db.query('SELECT * FROM jogadores WHERE id = ?', [userId]);
    
                if (currentPlayer.length > 0) {
                    const currentData = currentPlayer[0];
    
                    const updatedData = {
                        respeito: respeito !== undefined ? respeito : currentData.respeito,
                        bonus_recompensa: bonus_recompensa !== undefined ? bonus_recompensa : currentData.bonus_recompensa,
                        estamina: estamina !== undefined ? estamina : currentData.estamina,
                        inteligencia: inteligencia !== undefined ? inteligencia : currentData.inteligencia,
                        forca: forca !== undefined ? forca : currentData.forca,
                        carisma: carisma !== undefined ? carisma : currentData.carisma,
                        resistencia: resistencia !== undefined ? resistencia : currentData.resistencia,
                        grana: grana !== undefined ? grana : currentData.grana,
                        powerjogador: powerjogador !== undefined ? parseInt(powerjogador) : currentData.powerjogador
                    };
    
                    const updateQuery = 'UPDATE jogadores SET respeito = ?, bonus_recompensa = ?, estamina = ?, inteligencia = ?, forca = ?, carisma = ?, resistencia = ?, grana = ?, powerjogador = ? WHERE id = ?';
                    const values = [updatedData.respeito, updatedData.bonus_recompensa, updatedData.estamina, updatedData.inteligencia, updatedData.forca, updatedData.carisma, updatedData.resistencia, updatedData.grana, updatedData.powerjogador, userId];
    
                    await this.db.query(updateQuery, values);
                    res.json({ message: 'Jogador atualizado com sucesso.' });
                } else {
                    res.status(404).json({ error: 'Jogador não encontrado.' });
                }
            } else {
                res.status(400).json({ error: 'Parâmetro "id" é obrigatório.' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar jogador. ' + error.message });
        }
    }
    
  
   
    

    async  validalogin(req, res) {
        const { email, password } = req.body;
        const secretKey  = 'seuSegredoDoJWT';
        try {
            const currentPlayer = await db.query('SELECT * FROM jogadores WHERE email = ?', [email]);

            if (currentPlayer.length > 0) {
                //console.log("Password fornecido:", password);
               // console.log("Senha armazenada:", currentPlayer[0].senha);
                const passwordMatch = password.trim() === currentPlayer[0].senha.trim();

                if (passwordMatch) {
                    const userId = currentPlayer[0].id;

                    // Include a timestamp in the JWT payload to ensure a unique token on each login
                    const timestamp = new Date().getTime();
                    
                    // Create a short-lived session token with user information and timestamp
                    const token = jwt.sign({ userId, timestamp, expiration: Date.now() + 900000 /* 15 minutos em milissegundos */ }, secretKey);
                    console.log("token", token)
                    // Inclua o token na resposta JSON
                    const userResponse = {
                        success: true,
                        userId,
                        token,
                    };
                   // console.log("validalogin : ", userResponse)
                    res.json(userResponse);
                } else {
                    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
                }
            } else {
                res.status(401).json({ success: false, message: 'Credenciais inválidas!' });
            }
        } catch (error) {
            console.error(error);
        
            // Handle other specific error cases, if needed
            res.status(500).json({ success: false, message: 'Erro interno do servidor' });
        }
    }

    async renewToken(req, res) {
        const secretKey = 'seuSegredoDoJWT';
    
        // Obtém o token do cabeçalho de autorização
        const token = req.headers.authorization.split(' ')[1];
    
        try {
            // Verifica se o token é válido
            const decodedToken = jwt.verify(token, secretKey);
            console.log("Token verificado!")
            // Gera um novo token com base nas informações do token original
            const newToken = jwt.sign(
                { userId: decodedToken.userId, timestamp: new Date().getTime() },
                secretKey,
                { expiresIn: decodedToken.exp } // Manter o mesmo tempo de expiração original
            );
             console.log("Novo token gerado")   
            // Responda com o novo token
            res.json({ token: newToken });
        } catch (error) {
            console.error('Erro na renovação do token:', error);

            // Lidar com o caso em que o token expirou
            if (error.name === 'TokenExpiredError') {
                res.status(401).json({ success: false, message: 'Token expirado' });
            } else {
                // Responder com um erro genérico se a renovação falhar por outro motivo
                res.status(500).json({ success: false, message: 'Falha na renovação do token' });
            }
        }
    }    
}

module.exports = PlayerController;
