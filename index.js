const mysql = require('mysql');
const inquirer = require('inquirer');

//set up connection to the mysql...
const connection = mysql.createConnection({
  host:'localhost',
  port:3306,
  user:'root',
  password:'',
  database: 'employees_db'
});

//function to begin db interaction...
const start = () =>{
  inquirer.prompt({
    name : 'options',
    type : 'list',
    message: 'what would you like to do?',
    choices: [ "Add department", "Add role", "Add employee", "View departments", "View roles", "View employees", "Update Employee Role", "Exit"]
  }).then((choice) => {
    //call functions based on user choice...
    if (choice.options === "Add department"){
      addDepartment();
    }else if (choice.options === "Add role"){
      addRole();
    }else if (choice.options === "Add employee"){
      addEmployee();
    }else if (choice.options === "View departments"){
      viewDepartments();
    }else if (choice.options === "View roles"){
      viewRoles();
    }else if (choice.options === "View employees"){
      viewEmployees();
    }else if(choice.options === "Update Employee Role"){
      updateEmployeeRole();
    }else {
      connection.end()
    }
  });

};
//adds departments to db..
const addDepartment = () =>{
  inquirer.prompt({
    name : "name",
    type : "input",
    message : "Enter department name:"
  }).then((department) =>{
    connection.query(
      'INSERT INTO department SET ?',
      { name: `${department.name}`},
      (err, res) =>{
        if (err) throw err;
        console.log(`${res.affectedRows} department added!\n`);
        start();
      }
    )
  })

};
//adds roles to db...
const addRole = () =>{
  inquirer.prompt([
    {
      name : "title",
      type : "input",
      message : "Enter position name:"
    },
    {
      name : "salary",
      type : "input",
      message : "Enter position salary:"
    },
    {
      name : "departmentId",
      type : "input",
      message : "Enter department id:"
    }
  ]).then((role) =>{
    connection.query(
      'INSERT INTO role SET ?',
      {
        title: `${role.title}`,
        salary: `${role.salary}`,
        department_id: `${role.departmentId}`,
      },
      (err, res) =>{
        if (err) throw err;
        console.log(`${res.affectedRows} department added!\n`);
        start();
      }
    )
  })
};
//adds employees to employee table
const addEmployee = () =>{
  inquirer.prompt([
    {
      name : "firstName",
      type : "input",
      message : "Enter employee's first name:"
    },
    {
      name : "lastName",
      type : "input",
      message : "Enter employee's last name:"
    },
    {
      name : "roleID",
      type : "input",
      message : "Enter role id:"
    },
    {
      name : "managerID",
      type : "input",
      message : "Enter manager id:"
    }
  ]).then((employee) =>{
    connection.query(
      'INSERT INTO employee SET ?',
      {
        first_name: `${employee.firstName}`,
        last_name: `${employee.lastName}`,
        role_id: `${employee.roleID}`,
        manager_id: `${employee.managerID}`
      },
      (err, res) =>{
        if (err) throw err;
        console.log(`${res.affectedRows} department added!\n`);
        start();
      }
    )
  })
};

//Returns all departments
const viewDepartments = () =>{
  connection.query( 'SELECT * FROM department', (err, res) => {
      if (err) throw err;
      res.forEach(({id, name}) =>{
        console.log(`${id} | ${name}`);
      });
      start();
  });

};

//Returns all roles
const viewRoles = () =>{
  connection.query( 'SELECT * FROM role', (err, res) => {
      if (err) throw err;
      res.forEach(({id, title, salary, department_id}) =>{
        console.log(`${id} | ${title} | ${salary} | ${department_id}`);
      });
      start();
  });
};

//Returns all employees...
const viewEmployees = () =>{
  connection.query( 'SELECT * FROM employee', (err, res) => {
      if (err) throw err;
      res.forEach(({id, first_name, last_name, role_id, manager_id}) =>{
        console.log(`${id} | ${first_name} | ${last_name} | ${role_id} | ${manager_id}`);
      });
      start();
  });
};

//starts connection w/ database
connection.connect((err) => {
  if (err) throw err;
  console.log(`connection as id ${connection.threadId}\n`);
  start();
});
