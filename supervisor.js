const inquirer = require("inquirer");
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "commandmazonDB"
});

db.connect(err => {
  if (err) throw new Error(`Error: ${err.message}`);
  // console.log(`Connected to database. Status: ${db.state}`);
});

function choices() {
  inquirer
    .prompt([
      {
        name: "supChoices",
        type: "list",
        choices: [
          "View Product Sales by Department",
          "Create New Department",
          "Exit"
        ]
      }
    ])
    .then(answers => {
      switch (answers.supChoices) {
        case "View Product Sales by Department":
          viewProdsByDept();
          break;
        case "Create New Department":
          createNewDept();
          break;

        default:
          db.end();
          break;
      }
    });
}

function viewProdsByDept() {
  db.query(
    "SELECT department_id, departments.department_name, over_head_costs, SUM(product_sales) AS total_sales, (SUM(product_sales) - over_head_costs) AS profit FROM departments RIGHT JOIN items ON items.department_name = departments.department_name GROUP BY department_id, department_name",
    (err, data) => {
      if (err) throw new Error(`Error: ${err.message}`);
      console.table(data);
    }
  );
}

function createNewDept() {
  inquirer
    .prompt([
      {
        name: "department",
        message: "What is the department name?"
      },
      {
        name: "overhead",
        type: "number",
        message: "What are the department's overhead costs?"
      }
    ])
    .then(answers => {
      const newData = [[answers.department, answers.overhead]];
      db.query(
        "INSERT INTO departments(department_name, over_head_costs) VALUES ?",
        [newData],
        (err, data) => {
          if (err) throw new Error(`Error: ${err.message}`);
          console.table(data);
          setTimeout(choices, 1000);
        }
      );
    });
}

choices();
