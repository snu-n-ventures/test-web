const mysql = require('mysql');
require('dotenv').config();

module.exports = {
    init: () => {
        return mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT,
        });
    },
    test: (conn) => {
        conn.connect(error => {
            if(error) {
                console.log('mysql connection error: ' + error);
            }
        })
    }
};