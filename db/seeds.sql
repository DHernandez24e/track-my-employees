INSERT INTO department (name) 
  VALUES ('Sales'),
         ('Engineering'),
         ('Accounting'),
         ('Legal'),
         ('Information Technology');

INSERT INTO roles (title, salary, department_id) 
  VALUES('Sales Lead', 80000, 1),
        ('Salesperson', 8000, 1),
        ('Lead Engineer', 80000, 2),
        ('Software Engineer', 80000, 2),
        ('Account Manager', 80000, 3),
        ('Accountant', 80000, 3),
        ('Legal Team Lead', 8000, 4),
        ('Lawyer', 8000, 4),
        ('IT Manager', 80000, 5),
        ('IT Consultant', 80000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id) 
    VALUES  ('William', 'Graham', 1, NULL),
            ('Kayleigh', 'Barker', 3, NULL),
            ('Harry', 'Mullins', 5, NULL),
            ('Mimi', 'Fong', 7, NULL),
            ('Samuel', 'Weaver', 9, NULL),
            ('Fern', 'Morton', 4, 2),
            ('Daniel', 'Williamson', 8, 4),
            ('Rhianna', 'Mitchell', 6, 3),
            ('Kim', 'Davison', 8, 4),
            ('Oliver', 'Shelton', 10, 5),
            ('Daisy', 'Castro', 8, 4),
            ('Thomas', 'Rogers', 4, 2),
            ('Harley', 'Parsons', 2, 1),
            ('Joshua', 'Drew', 6, 3),
            ('James', 'Bird', 2, 1),
            ('Ham', 'Man', 2, 1),
            ('Kerry', 'McCoy', 10, 5),
            ('Natalia', 'Matthews', 8, 4),
            ('Joey', 'Meyer', 4, 2),
            ('Sammie', 'Houston', 2, 1);