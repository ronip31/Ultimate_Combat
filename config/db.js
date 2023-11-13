const mysql = require('mysql2');

class Db {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'ultimatecombat'
        });

        this.connection.connect((err) => {
            if (err) {
                console.error('Erro ao conectar ao banco de dados: ' + err.stack);
                return;
            }
            console.log('Conexão bem-sucedida ao banco de dados MySQL');
        });
    }

    query(sql, params) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, params, (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            });
        });
    }
}

module.exports = Db;
