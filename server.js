const connection = require('./db/database');
const mysql = require('mysql2');

connection.connect(err => {
    if (err) throw err;
    console.log(`Connected as ID ${connection.threadId}`)
});