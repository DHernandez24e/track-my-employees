const mysql = require('mysql2');
const env = require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'employees_db'
});

module.exports = connection;