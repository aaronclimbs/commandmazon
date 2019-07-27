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
        name: "manageChoice",
        message: "What would you like to do?",
        type: "list",
        choices: [
          "View products for sale",
          "View low itinerary",
          "Add to inventory",
          "Add new product"
        ]
      }
    ])
    .then(answer => {
      switch (answer.manageChoice) {
        case "View products for sale":
          viewProducts();
          break;
        case "View low itinerary":
          viewLowItinerary();
          break;
        case "Add to inventory":
          addInventory();
          break;
        case "Add new product":
          addProduct();
          break;

        default:
          break;
      }
    });
}

function viewProducts(){
  choices();
}

function addProduct(){
  choices();
}

function viewLowItinerary(){
  choices();
}

function addInventory() {
  choices();
}