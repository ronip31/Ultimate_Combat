const mysql = require('mysql2');

class Db {
    constructor() {
        this.pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'ultimatecombat',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    async query(sql, params) {
        const connection = await this.pool.promise().getConnection();

        try {
            const [results] = await connection.query(sql, params);
            return results;
        } finally {
            connection.release();
        }
    }

    async beginTransaction() {
        const connection = await this.pool.promise().getConnection();
        await connection.beginTransaction();
        return connection;
    }

    async commitTransaction(connection) {
        await connection.commit();
        connection.release();
    }

    async rollbackTransaction(connection) {
        await connection.rollback();
        connection.release();
    }
}

module.exports = Db;
