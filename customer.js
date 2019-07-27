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

function showItems() {
  db.query("SELECT item_id, product_name, product_price, stock_quantity FROM items", (err, data) => {
    if (err) throw new Error(`Error: ${err.message}`);
    console.log("<><><><><><> ITEMS AVAILABLE <><><><><><>");
    // console.log(data);
    data.forEach(item => {
      console.log(
        "ID: " +
          item.item_id.toString().padEnd(2) +
          "  ||   " +
          "Product:".padEnd(12) +
          item.product_name.padEnd(20) +
          "  ||  " + (item.stock_quantity > 0 ? "Price:".padEnd(8) + "$" + item.product_price.toFixed(2) : "SOLD OUT") + "\n"
      );
    });
  });
}

function purchase() {
  inquirer
    .prompt([
      {
        name: "id",
        message: "Which ID would you like to buy?"
      },
      {
        name: "quantity",
        message: "How many would you like to order?",
        type: "number"
      }
    ])
    .then(answers => {
      const conditions = {
        item_id: answers.id
      };
      db.query("SELECT * FROM items WHERE ?", conditions, (err, item) => {
        // console.log(data);
        if (item[0].stock_quantity < answers.quantity) {
          console.log("INSUFFICIENT QUANTITY! Please try again later.");
          showChoices();
        } else {
          db.query(
            "UPDATE items SET ? WHERE ?",
            [
              {
                stock_quantity: item[0].stock_quantity - answers.quantity,
                product_sales: item[0].product_sales + (item[0].product_price * answers.quantity)
              },
              conditions
            ],
            (err, change) => {
              console.log(change);
              console.log(
                `You bought ${answers.quantity} of Product: ${
                  item[0].product_name
                } for  $${(
                  parseInt(answers.quantity) * item[0].product_price
                ).toFixed(2)}`
              );
              showChoices();
            }
          );
        }
      });
    });
}

function showChoices() {
  inquirer
    .prompt([
      {
        name: "view",
        message: "What would you like to do?",
        type: "list",
        choices: ["View items", "Purchase an item", "Leave store"]
      }
    ])
    .then(answers => {
      if (answers.view === "View items") {
        showItems();
        console.log("\n");
        setTimeout(purchase, 1000);
      } else if (answers.view === "Purchase an item") {
        purchase();
      } else {
        console.log("Closing connection to database.")
        db.end();
      }
    });
}

showChoices();
