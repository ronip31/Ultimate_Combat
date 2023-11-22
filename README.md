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

-- Criar a tabela Armas
CREATE TABLE Armas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    forca INT,
    preco DECIMAL(10, 2),
    pBonus INT,
    precoTxt VARCHAR(50)
);

ALTER TABLE jogadores
ADD COLUMN id_arma INT,
ADD CONSTRAINT fk_id_arma
    FOREIGN KEY (id_arma)
    REFERENCES Armas(id);
    
-- Tabela de Associação para representar o relacionamento muitos-para-muitos
CREATE TABLE JogadorArma (
    id_jogador INT,
    id_arma INT,
    PRIMARY KEY (id_jogador, id_arma),
    FOREIGN KEY (id_jogador) REFERENCES jogadores(id),
    FOREIGN KEY (id_arma) REFERENCES Armas(id)
);

-- Inserir dados na tabela Armas
INSERT INTO Armas (nome, forca, preco, pBonus, precoTxt) VALUES
    ('Bastão Baseball', 10, 240, 0.02, '$240'),
    ('Faca', 20, 1.700, 0.03, '$1.700'),
    ('Machadinha', 35, 5.250, 0.03, '$5.250'),
    ('Serra-Eletrica', 150, 10.800, 0.04, '$10.800'),
    ('Taurus 96 .22', 180, 15.500, 0.05, '$15.500'),
    ('Taurus 889 .38', 280, 22.500, 0.05, '$22.500'),
    ('Magnum .357', 410, 31.000, 0.05, '$31.000'),
    ('Glock 39 .45', 740, 45.000, 0.06, '$45.000'),
    ('Bereta 92X .9mm', 1140, 58.000, 0.06, '$58.000'),
    ('FN P90', 1800, 70.000, 0.075, '$70.000'),
    ('Uzi', 2700, 99.000, 0.075, '$99.000'),
    ('MP5', 4150, 119.000, 0.075, '$119.000'),
    ('AK-47', 7200, 135.000, 0.08, '$135.000'),
    ('AR-15', 11500, 166.000, 0.08, '$166.000'),
    ('M16', 17450, 220.000, 0.08, '$220.000');
    
select * from JogadorArma;

select * from armas where id = 16;

select * from jogadores where id = 21;

-- Antes de alterar o tipo de dado
DESCRIBE jogadores;

-- Alterando o tipo de dado do campo grana
ALTER TABLE jogadores MODIFY COLUMN saldoConta DECIMAL(10, 2);

ALTER TABLE jogadores
ADD COLUMN id_arma_equipada INT DEFAULT NULL;

-- Após a alteração do tipo de dado
DESCRIBE jogadores;

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
    grana DECIMAL(10, 2) DEFAULT 10,
    saldoConta INT DEFAULT 10,
    powerjogador DOUBLE DEFAULT 10,
    email VARCHAR(255),
    senha VARCHAR(255),
    current_token VARCHAR(255),
    id_arma_equipada INT DEFAULT NULL,
    FOREIGN KEY (id_arma_equipada) REFERENCES Armas(id)
);

 
CREATE TABLE IF NOT EXISTS tempo_jogo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    segundos INT,
    minutos INT,
    horas INT,
    dias INT
);