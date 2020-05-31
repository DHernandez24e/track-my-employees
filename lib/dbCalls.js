const inquirer = require('inquirer');
const connection = require('../db/database');

function dbCalls() {
    console.log('Application starting...');
    this.initialPrompt();
};


dbCalls.prototype.initialPrompt = function() {
    const choiceArr = [
        'View All Departments', 
        'View All Roles',
        'View all Employees',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Update Employee Manager',
        'View Employees by Department',
        'View Employees by Manager',
        'Delete Department',
        'Delete Roles',
        'Delete Employees',
        'View Department Budget'
    ];

        inquirer.prompt({
            type: 'list',
            name: 'initialSelection',
            message: 'What would you like to do?',
            choices: choiceArr
        }).then(answer => {
            const {initialSelection} = answer;
            console.log(initialSelection);
    
            if (initialSelection === 'View All Departments') {
                this.showAllDepartments();
            }
            
            if (initialSelection === 'View All Roles') {
                this.showAllRoles();
            }

            if (initialSelection === 'View all Employees') {
                this.showAllEmployees();
            }
        });
}

dbCalls.prototype.showAllDepartments = function() {

    const sql = 'SELECT name AS Departments FROM department';
        
    connection.promise().query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);

        this.initialPrompt();
    })
};

dbCalls.prototype.showAllRoles = function() {
    const sql = `SELECT roles.title AS Roles, department.name AS Department
                 FROM roles
                 INNER JOIN department ON department_id = department.id 
                 ORDER BY department.name ASC`
        
    connection.promise().query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        
        this.initialPrompt();
    })
};

dbCalls.prototype.showAllEmployees = function() {
    const sql = 'SELECT * FROM employees';
        
    connection.promise().query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        
        this.initialPrompt();
    })
};














module.exports = dbCalls;