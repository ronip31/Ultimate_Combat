Jogo Ultimate combat


comandos para criar o banco de dados: 

create database ultimatecombat;

use ultimatecombat;

-- Comando para criar a tabela no banco de dados
CREATE TABLE jogadores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    respeito INT DEFAULT 1,
    bonus_recompensa INT DEFAULT 1,
    estamina INT DEFAULT 100,
    inteligencia INT DEFAULT 10,
    forca INT DEFAULT 10,
    carisma INT DEFAULT 10,
    resistencia INT DEFAULT 10,
    grana INT DEFAULT 10,
    saldoConta INT DEFAULT 10,
    powerjogador double default 10,
    email VARCHAR(255),
    senha VARCHAR(255),
    current_token VARCHAR(255)
);

 
