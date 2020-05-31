const connection = require('./db/database');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const dbCalls = require('./lib/dbCalls');

connection.connect(err => {
    if (err) throw err;
    console.log(`Connected as ID ${connection.threadId}`);
    new dbCalls();
});

