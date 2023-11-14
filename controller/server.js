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
                        grana: grana !== undefined ? parseFloat(grana) : currentData.grana,
                        powerjogador: powerjogador !== undefined ? parseInt(powerjogador) : currentData.powerjogador
                    };
                    console.log("updatedData", updatedData)
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

    async getarmas(req, res){
        try {
            const results = await this.db.query('SELECT * FROM Armas');
            res.json({ armas: results });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar armas. ' + error });
        }
    };


    async armasJogador (req, res){
        try {
            const { id } = req.query;
            
            const userId = id; 
 
            //console.log("armasJogador userId ", userId)
    
            // Supondo que você tenha uma função no seu banco de dados que busca as armas do jogador pelo ID do jogador
            const results = await db.query('SELECT * FROM Armas WHERE id IN (SELECT id_arma FROM JogadorArma WHERE id_jogador = ?)', [userId]);
            //console.log("results armasJogador", results)
            res.json({ armasJogador: results });
        } catch (error) {
            console.error('Erro ao buscar armas do jogador:', error);
            res.status(500).json({ error: 'Erro ao buscar armas do jogador. ' + error.message });
        }
    };

    async comprarArma(req, res) {
        const { idArma, userId } = req.body;
    
        try {
            // Inicia uma transação
            await db.query('START TRANSACTION');
    
            // Verifica se o jogador já possui a arma
            const verificaExistencia = await db.query('SELECT * FROM JogadorArma WHERE id_jogador = ? AND id_arma = ?', [userId, idArma]);
    
            if (verificaExistencia.length > 0) {
                // O jogador já possui a arma, retorne uma mensagem personalizada
                await db.query('ROLLBACK');
                return res.json({ message: 'Você já possui esta arma.' });
            }
    
            // Verifica o saldo do jogador
            const infoJogador = await db.query('SELECT grana FROM jogadores WHERE id = ?', [userId]);
            const saldoJogador = parseFloat(infoJogador[0].grana); 
    
            // Recupera o preço da arma que está sendo comprada
            const infoArma = await db.query('SELECT preco FROM Armas WHERE id = ?', [idArma]);
            const precoArma = parseFloat(infoArma[0].preco); // Converte para número

            console.log("Tipo de saldoJogador: ", typeof saldoJogador);
            console.log("Tipo de precoArma: ", typeof precoArma);

            console.log("saldoJogador: ", saldoJogador, " precoArma: ", precoArma);
                
            if (saldoJogador < precoArma) {
                // Saldo insuficiente, rollback e retorne uma mensagem
                console.log("saldoJogador < precoArma", saldoJogador , precoArma)
                console.log("Tipo de saldoJogador: ", typeof saldoJogador);
                console.log("Tipo de precoArma: ", typeof precoArma);
                await db.query('ROLLBACK');
                return res.json({ message: 'Saldo insuficiente para comprar esta arma.' });
            }
    
            // Procede com a compra
            const insercao = await db.query('INSERT INTO JogadorArma (id_jogador, id_arma) VALUES (?, ?)', [userId, idArma]);
    
            if (insercao.affectedRows > 0) {
                // Atualiza o saldo do jogador após a compra
                const novoSaldo = saldoJogador - precoArma;
                console.log("Tipo de saldoJogador: ", typeof saldoJogador);
                console.log("Tipo de precoArma: ", typeof precoArma);
                console.log("novoSaldo = saldoJogador - precoArma;", novoSaldo , saldoJogador , precoArma)
                await db.query('UPDATE jogadores SET grana = ? WHERE id = ?', [novoSaldo, userId]);
    
                // Commit se tudo ocorrer bem
                await db.query('COMMIT');
                return res.json({ message: 'Compra realizada com sucesso!' });
            } else {
                // Se a inserção falhar, rollback
                await db.query('ROLLBACK');
                return res.status(500).json({ error: 'Erro ao comprar arma. Não foi possível inserir o registro.' });
            }
        } catch (error) {
            // Em caso de erro, rollback e retorne uma mensagem
            await db.query('ROLLBACK');
            console.error('Erro ao comprar arma:', error);
            return res.status(500).json({ error: 'Erro ao comprar arma. ' + error.message });
        }
    }
    

    // Dentro do seu playerController
    async venderArma(req, res) {
        try {
            const { idArma, userId } = req.body;
    
            // Verifique se o jogador possui a arma antes de vender
            const verificaExistencia = await db.query('SELECT * FROM JogadorArma WHERE id_jogador = ? AND id_arma = ?', [userId, idArma]);
    
            if (verificaExistencia.length === 0) {
                return res.status(400).json({ error: 'Você não possui esta arma para vender.' });
            }
    
            // Verifique se a arma está equipada
            const infoJogador = await db.query('SELECT id_arma_equipada FROM jogadores WHERE id = ?', [userId]);
            const idArmaEquipada = infoJogador[0].id_arma_equipada;
    
            if (idArmaEquipada === idArma) {
                // Se a arma está equipada, remova a associação
                await db.query('UPDATE jogadores SET id_arma_equipada = NULL WHERE id = ?', [userId]);
            }
    
            // Obtenha o preço original da arma
            const infoArma = await db.query('SELECT preco FROM Armas WHERE id = ?', [idArma]);
            const precoOriginal = parseFloat(infoArma[0].preco);
    
            // Calcule o preço com desconto de 30%
            const precoComDesconto = precoOriginal * 0.7;
    
            // Adicione a lógica para remover a arma da posse do jogador no banco de dados
            const remocao = await db.query('DELETE FROM JogadorArma WHERE id_jogador = ? AND id_arma = ?', [userId, idArma]);
    
            if (remocao.affectedRows > 0) {
                // Adicione a lógica para atualizar o saldo do jogador com o valor da venda (com desconto)
                const infoJogador = await db.query('SELECT grana FROM jogadores WHERE id = ?', [userId]);
                const saldoAtual = parseFloat(infoJogador[0].grana);
                const novoSaldo = saldoAtual + precoComDesconto;
    
                // Atualize o saldo do jogador após a venda (com desconto)
                await db.query('UPDATE jogadores SET grana = ? WHERE id = ?', [novoSaldo, userId]);
    
                // Retorne uma mensagem de sucesso informando o valor da venda com desconto
                res.json({ message: `Venda realizada! Valor recebido: R$ ${precoComDesconto.toFixed(2)} \n    30% de desvalorização.` });
            } else {
                res.status(500).json({ error: 'Erro ao vender arma. Não foi possível remover o registro.' });
            }
        } catch (error) {
            console.error('Erro ao vender arma:', error);
            res.status(500).json({ error: 'Erro ao vender arma. ' + error.message });
        }
    }
    


    // Dentro do seu arquivo de controlador (server.js ou similar)
    async equiparArma(req, res) {
        try {
            const { idArma, userId } = req.body;
    
            // Verifique se o jogador possui a arma antes de equipar
            const verificaExistencia = await db.query('SELECT * FROM JogadorArma WHERE id_jogador = ? AND id_arma = ?', [userId, idArma]);
    
            if (verificaExistencia.length === 0) {
                return res.status(400).json({ error: 'Você não possui esta arma para equipar.' });
            }
    
            // Atualize a tabela de equipamento do jogador com a nova arma
            const atualizacao = await db.query('UPDATE jogadores SET id_arma_equipada = ? WHERE id = ?', [idArma, userId]);
    
            if (atualizacao.affectedRows > 0) {
                // Recupere o nome da arma
                const infoArma = await db.query('SELECT nome FROM Armas WHERE id = ?', [idArma]);
                const nomeArma = infoArma[0].nome;
    
                // Retorne uma mensagem de sucesso com o nome da arma
                res.json({ message: 'Arma equipada com sucesso!', nomeEquipado: nomeArma });
            } else {
                res.status(500).json({ error: 'Erro ao equipar arma. Não foi possível atualizar o registro.' });
            }
        } catch (error) {
            console.error('Erro ao equipar arma:', error);
            res.status(500).json({ error: 'Erro ao equipar arma. ' + error.message });
        }
    }
    
    // Adicione a rota no seu arquivo de rotas
    async armaEquipada (req, res) {
        try {
            const userId = req.query.id;

            // Verifique se o jogador possui uma arma equipada
            const infoJogador = await db.query('SELECT id_arma_equipada FROM jogadores WHERE id = ?', [userId]);
            const idArmaEquipada = infoJogador[0].id_arma_equipada;

            if (idArmaEquipada) {
                // Se o jogador tiver uma arma equipada, busque as informações da arma
                const infoArmaEquipada = await db.query('SELECT nome FROM armas WHERE id = ?', [idArmaEquipada]);

                // Retorne os dados da arma equipada
                res.json({ nomeEquipado: infoArmaEquipada[0].nome });
            } else {
                // Se o jogador não tiver nenhuma arma equipada, retorne uma mensagem padrão ou vazio
                res.json({ nomeEquipado: '' });
            }
        } catch (error) {
            console.error('Erro ao buscar arma equipada:', error);
            res.status(500).json({ error: 'Erro ao buscar arma equipada. ' + error.message });
        }
    };


    
}  

module.exports = PlayerController;
