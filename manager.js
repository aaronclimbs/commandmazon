const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const db = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  password: "password",
  database: "commandmazonDB"
});

db.connect(err => {
  if (err) throw new Error(`Error: ${err.message}`);
  // console.log(`Connected to database. Status: ${db.state}`);
});

choices();

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
          "Add new product",
          "Exit"
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
          console.log("SHUTTING DOWN DATABASE");
          db.end();
          break;
      }
    });
}

function viewProducts() {
  db.query("SELECT * FROM items", (err, data) => {
    if (err) throw new Error(`Error: ${err.message}`);
    console.table(data);
    setTimeout(choices, 1000);
  });
}

function addProduct() {
  inquirer
    .prompt([
      {
        name: "product",
        message: "What is the product name?"
      },
      {
        name: "department",
        message: "What department will the item be sold in?",
        default: "misc"
      },
      {
        name: "price",
        type: "number",
        message: "What is the product's price?"
      },
      {
        name: "inventory",
        type: "number",
        default: 10,
        message: "How many should be added to inventory?"
      }
    ])
    .then(answers => {
      const newData = [
        [answers.product, answers.department, answers.price, answers.inventory]
      ];
      db.query(
        "INSERT INTO items(product_name, department_name, product_price, stock_quantity) VALUES ?",
        [newData],
        (err, data) => {
          if (err) throw new Error(`Error: ${err.message}`);
          console.table(data);
          setTimeout(choices, 1000);
        }
      );
    });
}

function viewLowItinerary() {
  db.query("SELECT * FROM items WHERE stock_quantity < 5", (err, data) => {
    if (err) throw new Error(`Error: ${err.message}`);
    console.table(data);
    setTimeout(choices, 1000);
  });
}

function addInventory() {
  db.query(
    "SELECT item_id, product_name, stock_quantity FROM items",
    async (err, data) => {
      if (err) throw new Error(`Error: ${err.message}`);
      const itemList = await data.map(item => {
        return { name: item.product_name, quantity: item.stock_quantity };
      });
      console.table(itemList);
      inquirer
        .prompt([
          {
            name: "product",
            message: "Which item would you like to update the quantity for?",
            type: "list",
            choices: itemList
          },
          {
            name: "quantity",
            message: "How many exist in inventory?",
            type: "number"
          }
        ])
        .then(answers => {
          db.query(
            "UPDATE items SET stock_quantity = ? WHERE product_name = ?",
            [answers.quantity, answers.product],
            (err, data) => {
              if (err) throw new Error(`Error: ${err.message}`);
              console.table(data);
              setTimeout(choices, 1000);
            }
          );
        });
    }
  );
}
