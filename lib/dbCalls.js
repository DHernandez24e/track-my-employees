const inquirer = require('inquirer');
const connection = require('../db/database');

function dbCalls() {
    console.log('Application starting...');
    this.initialPrompt();
};


dbCalls.prototype.initialPrompt = function() {
    const choiceArr = [
        'View all Departments',
        'View all Roles',
        'View all Employees',
        'View Employees by Department',
        'View Employees by Manager',
        'View Department Budget',
        'Add a Department',
        'Add a Role',
        'Add an Employee',
        'Update an Employee Role',
        'Update Employee Manager',
        'Delete Department',
        'Delete Role',
        'Delete Employee',
        'Quit'
    ];

        inquirer.prompt({
            type: 'list',
            name: 'initialSelection',
            message: 'What would you like to do?',
            choices: choiceArr
        }).then(answer => {
            const {initialSelection} = answer;
            console.log(initialSelection);

            if (initialSelection === 'View all Departments') {
                this.showAllDepts();
            };

            if (initialSelection === 'View all Roles') {
                this.showAllRoles();
            };

            if (initialSelection === 'View all Employees') {
                this.showAllEmployees();
            };

            if (initialSelection === 'View Employees by Department') {
                this.employeesByDept();
            };

            if (initialSelection === 'View Employees by Manager') {
                this.employeesByMng();
            };

            if (initialSelection === 'View Department Budget') {
                this.viewDeptsBudget();
            }

            if (initialSelection === 'Add a Department') {
                this.addDepartment();
            };

            if (initialSelection === 'Add a Role') {
                this.addRole();
            };

            if (initialSelection === 'Add an Employee') {
                this.addEmployee();
            };

            if (initialSelection === 'Update an Employee Role') {
                this.updateEmployeeRole();
            };

            if (initialSelection === 'Update Employee Manager') {
                this.updateEmployeeMng();
            };

            if (initialSelection === 'Delete Department') {
                this.deleteDepartment();
            };

            if (initialSelection === 'Delete Role') {
                this.deleteRole();
            };

            if (initialSelection === 'Delete Employee') {
                this.deleteEmployee();
            };

            if (initialSelection === 'Quit') {
                console.log('Goodbye!')
                connection.end();
            };
        });
}

dbCalls.prototype.showAllDepts = function() {
    const sql = `SELECT id, name AS Departments FROM department
                 ORDER BY id ASC`;

    connection.promise().query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);

        this.initialPrompt();
    })
}

dbCalls.prototype.showAllRoles = function() {
    const sql = `SELECT r.id, r.title AS Roles, d.name AS Departments 
                 FROM roles AS r 
                 LEFT JOIN department AS d ON r.department_id = d.id`;
    
    connection.promise().query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);

        this.initialPrompt();
    })
}

dbCalls.prototype.showAllEmployees = function() {
    const sql = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", 
                 roles.title AS Role, roles.salary as Salary, department.name as Department,
                 CONCAT (emp_mng.first_name, " ", emp_mng.last_name) as Manager
                 FROM employees AS e 
                 LEFT JOIN roles ON e.role_id = roles.id
                 LEFT JOIN department ON roles.department_id = department.id 
                 LEFT JOIN employees AS emp_mng ON e.manager_id = emp_mng.id
                 ORDER BY e.last_name ASC`;
        
    connection.promise().query(sql, (err, result) => {
        if (err) throw err;
        console.table(result);
        
        this.initialPrompt();
    })
};

dbCalls.prototype.addEmployee = function() {

    const mngQuery = `SELECT e.first_name, e.last_name, e.id
                      FROM employees AS e
                      WHERE e.manager_id IS NULL`;
    
    const rolesQuery = `SELECT * FROM roles`;

    connection.query(mngQuery, (err, allMng) => {
        if (err) throw err;

        connection.query(rolesQuery, (err, allRoles) => {
            if (err) throw err;

            const mngChoices = allMng.map(manager => {
                const mngChoice = {name: manager.first_name + " " + manager.last_name, value: manager.id}
                return mngChoice;
            });

            const rolesChoices = allRoles.map(role => {
                const rolesChoice = {name: role.title, value: role.id};
                return rolesChoice;
            });

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'newEmpFirstName',
                    message: 'Enter their first name.',
                    validate: firstNameInp => {
                        if (firstNameInp.match("[a-zA-Z]+$")) {
                            return true;
                        } else {
                            console.log('Please enter first name with alpha characters only.');
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'newEmpLastName',
                    message: 'Enter their last name.',
                    validate: lastNameInp => {
                        if (lastNameInp.match("[a-zA-Z]+$")) {
                            return true;
                        } else {
                            console.log('Please enter last name with alpha characters only.');
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'addNewRole',
                    message: 'Select which role they will be taking',
                    choices: rolesChoices
                },
                {
                    type: 'list',
                    name: 'addNewManager',
                    message: 'Select their manager',
                    choices: mngChoices
                }
            ])
            .then(answer => {
                const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                             VALUES (?, ?, ?, ?)`;
                const params = [answer.newEmpFirstName, answer.newEmpLastName, answer.addNewRole, answer.addNewManager];

                connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log(`Added new employee ${answer.newEmpFirstName} ${answer.newEmpLastName}`);

                    this.showAllEmployees();
                });
            });
        });
    });
};

dbCalls.prototype.addDepartment = function() {

    inquirer.prompt([
        {
            type: 'input',
            name: 'newDept',
            message: 'What is the name of the new department?',
            validate: newDeptInp => {
                if (newDeptInp.match("[a-zA-Z]+$")) {
                    return true;
                } else {
                    console.log('Enter a department with alpha characters only.')
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO department (name)
                     VALUE (?)`;
        const param = [answer.newDept];

        connection.query(sql, param, (err, result) => {
            if (err) throw err;
            console.log(`Added new department: ${answer.newDept}`);

            this.showAllDepts();
        });
    });
};

dbCalls.prototype.addRole = function() {

    const deptQuery = `SELECT * FROM department`;

    connection.query(deptQuery, (err, allDept) => {
        if (err) throw err;

        const deptChoices = allDept.map(dept => {
            const deptChoice = {name: dept.name, value: dept.id};
            return deptChoice;
        });

        inquirer.prompt([
            {
                type: 'input',
                name: 'newRole',
                message: 'What is the name of the new role?',
                validate: roleInp => {
                    if (roleInp.match("[a-zA-Z]+$")) {
                        return true;
                    } else {
                        console.log('Please enter a role with alpha characters only');
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'addSalary',
                message: 'What is the average salary for this role?',
                validate: salaryInp => {
                    if (salaryInp.match('[0-9]+$')) {
                        return true;
                    } else {
                        console.log('Please enter a salary with numerical values only.');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'deptConfirm',
                message: 'Which department does this role belong to?',
                choices: deptChoices
            }
        ])
        .then(answer => {
            const sql = `INSERT INTO roles (title, salary, department_id)
                         VALUES (?, ?, ?)`
            const params = [answer.newRole, answer.addSalary, answer.deptConfirm];

            connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log(`Added new role: ${answer.newRole}`);

                this.showAllRoles();
            });
        });
    });
};

dbCalls.prototype.employeesByDept = function() {
    
    const deptQuery = `SELECT * FROM department`;

    connection.query(deptQuery, (err, allDept) => {
        if (err) throw err;

        const deptChoices = allDept.map(dept => {
            const deptChoice = {name: dept.name, value: dept.id};
            return deptChoice;
        });

        inquirer.prompt([
            {
                type: 'list',
                name: 'selectDept',
                message: 'Which department would you like to display?',
                choices: deptChoices
            }
        ])
        .then(answer => {
            const sql = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", 
                         roles.title AS Role, roles.salary as Salary
                         FROM employees AS e 
                         LEFT JOIN roles ON e.role_id = roles.id
                         LEFT JOIN department ON roles.department_id = department.id 
                         WHERE roles.department_id = ?
                         ORDER BY e.last_name ASC`;
            const param = [answer.selectDept];

            connection.query(sql, param, (err, result) => {
                if (err) throw err;
                console.table(result);

                this.initialPrompt();
            });
        });
    });
};

dbCalls.prototype.employeesByMng = function() {

    const mngQuery = `SELECT e.first_name, e.last_name, e.id
                      FROM employees AS e
                      WHERE e.manager_id IS NULL`;

    connection.query(mngQuery, (err, allMng) => {
        if (err) throw err;

        const mngChoices = allMng.map(manager => {
            const mngChoice = {name: manager.first_name + " " + manager.last_name, value: manager.id}
            return mngChoice;
        });

        inquirer.prompt([
            {
                type: 'list',
                name: 'selectMng',
                message: 'Which manager would you like to choose?',
                choices: mngChoices
            }
        ])
        .then(answer => {
            const sql = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", 
                         roles.title AS Role, roles.salary as Salary
                         FROM employees AS e 
                         LEFT JOIN roles ON e.role_id = roles.id
                         LEFT JOIN department ON roles.department_id = department.id 
                         WHERE e.manager_id = ?
                         ORDER BY e.last_name ASC`;
            const param = [answer.selectMng];

            connection.query(sql, param, (err, result) => {
                if (err) throw err;
                console.table(result);

                this.initialPrompt();
            });
        });
    });
};

dbCalls.prototype.viewDeptsBudget = function() {
    const sql = `SELECT r.department_id AS ID, 
                 d.name AS Department, 
                 SUM(r.salary) AS Budget 
                 FROM roles AS r 
                 INNER JOIN department AS d ON r.department_id = d.id 
                 GROUP BY r.department_id 
                 ORDER BY r.department_id ASC`;

    connection.promise().query(sql, (err, result) => {
        if (err) throw err;

        console.table(result);
        this.initialPrompt();
    });
};

dbCalls.prototype.updateEmployeeRole = function() {

    const allEmpQuery = `SELECT * FROM employees`;

    const allRolesQuery = `SELECT * FROM roles`;

    connection.query(allEmpQuery, (err, allEmployees) => {
        if (err) throw err;

        connection.query(allRolesQuery, (err, allRoles) => {
            if (err) throw err;

            const empChoices = allEmployees.map(employee => {
                const empChoice = { name: employee.first_name + " " + employee.last_name, value: employee.id};
                return empChoice;
            });

            const roleChoices = allRoles.map(role => {
                const roleChoice = { name: role.title, value: role.id };
                return roleChoice;
            })

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'updatedEmp',
                    message: 'Which employee would you like to update?',
                    choices: empChoices
                },
                {
                    type: 'list',
                    name: 'updatedRole',
                    message: 'Which role will they now be taking?',
                    choices: roleChoices
                }
            ])
            .then(answer => {
                const sql = `UPDATE employees 
                             SET role_id = ?
                             WHERE id = ?`;
                const params = [answer.updatedRole, answer.updatedEmp];

                connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log(`Updated employee!`);

                    this.showAllEmployees();
                });
            });
        });
    });
};

dbCalls.prototype.updateEmployeeMng = function() {

    const allEmpQuery = `SELECT * FROM employees`;

    const mngQuery = `SELECT e.first_name, e.last_name, e.id
                      FROM employees AS e
                      WHERE e.manager_id IS NULL`;
    
    connection.query(allEmpQuery, (err, allEmployees) => {
        if (err) throw err;

        connection.query(mngQuery, (err, allManagers) => {
            if (err) throw err;

            const empChoices = allEmployees.map(employee => {
                const empChoice = { name: employee.first_name + " " + employee.last_name, value: employee.id};
                return empChoice;
            });

            const mngChoices = allManagers.map(manager => {
                const mngChoice = {name: manager.first_name + " " + manager.last_name, value: manager.id}
                return mngChoice;
            });

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'updatedEmp',
                    message: 'Which employee would you like to update?',
                    choices: empChoices
                },
                {
                    type: 'list',
                    name: 'updateMng',
                    message: 'Who will be their new manager?',
                    choices: mngChoices
                }
            ])
            .then(answer => {
                const sql = `UPDATE employees
                             SET manager_id = ?
                             WHERE id = ?`;
                const params = [answer.updateMng, answer.updatedEmp];

                connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log('Updated employee!');

                    this.showAllEmployees();
                });
            });
        });
    });
};

dbCalls.prototype.deleteDepartment = function() {

    const allDeptQuery = `SELECT * FROM department`;

    connection.query(allDeptQuery, (err, allDepts) => {
        if (err) throw err;

        const deptChoices = allDepts.map(department => {
            const deptChoice = { name: department.name, value: department.id };
            return deptChoice;
        });

        inquirer.prompt([
            {
                type: 'list',
                name: 'deleteDept',
                message: 'Which department would you like to delete?',
                choices: deptChoices
            }
        ])
        .then(answer => {
            const sql = `DELETE FROM department
                         WHERE id = ?`;
            const param = [answer.deleteDept];

            connection.query(sql, param, (err, result) => {
                if (err) throw err;
                console.log(`Deleted department ${answer.deleteDept}`);

                this.showAllDepts();
            });
        });
    });
};

dbCalls.prototype.deleteRole = function() {

    const allRolesQuery = `SELECT * FROM roles`;

    connection.query(allRolesQuery, (err, allRoles) => {
        if (err) throw err;

        const roleChoices = allRoles.map(role => {
            const roleChoice = { name: role.title, value: role.id };
            return roleChoice
        });

        inquirer.prompt([
            {
                type: 'list',
                name: 'deletedRole',
                message: 'Which role would you like to delete?',
                choices: roleChoices
            }
        ])
        .then(answer => {
            const sql = `DELETE FROM roles
                         WHERE id = ?`;
            const param = [answer.deletedRole];

            connection.query(sql, param, (err, result) => {
                if (err) throw err;
                console.log(`Deleted role ${answer.deletedRole}`);

                this.showAllRoles();
            });
        });
    });
};

dbCalls.prototype.deleteEmployee = function() {

    const allEmpQuery = `SELECT * FROM employees`;
    
    connection.query(allEmpQuery, (err, allEmployees) => {
        if (err) throw err;

        const empChoices = allEmployees.map(employee => {
            const empChoice = { name: employee.first_name + " " + employee.last_name, value: employee.id};
            return empChoice;
        });

        inquirer.prompt([
            {
                type: 'list',
                name: 'deleteEmp',
                message: 'Which employee would you like to delete?',
                choices: empChoices
            }
        ])
        .then(answer => {
            const sql = `DELETE FROM employees
                         WHERE id = ?`;
            const param = [answer.deleteEmp];

            connection.query(sql, param, (err, result) => {
                if (err) throw err;
                console.log(`Deleted employee ${answer.deleteEmp}`);

                this.showAllEmployees();
            });
        });
    });
};

module.exports = dbCalls;