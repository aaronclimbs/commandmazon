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
  console.log(`Connected to database. Status: ${db.state}`);
});

db.query("SELECT * FROM items", (err, data) => {
  if (err) throw new Error(`Error: ${err.message}`);
  console.log("<><><><><><> ITEMS AVAILABLE <><><><><><>");
  // console.log(data);
  data.forEach(item => {
    console.log(
      "ID: " +
        item.item_id.toString().padEnd(2) + "  ||   " +
        "Product:".padEnd(12) +
        item.product_name.padEnd(20) + "  ||  " +
        "Price:".padEnd(8) + "$" +
        item.product_price.toFixed(2)
    );
  });
});

function purchase() {
    inquirer.prompt([
      {
      name: "id",
      message: "Which ID would you like to buy?"
    },
      {
      name: "quantity",
      message: "How many would you like to order?",
      type: "number"
    }
  ]).then(answers => {
    const conditions = {
      item_id: answers.id
    }
    db.query("SELECT * FROM items WHERE ?", conditions, (err, data) => {
      if (data.stock_quantity > answers.quantity) {
        console.log(`You bought ${answers.quantity} of Product: ${data.product_name}`);
      } else {
        console.log("INSUFFICIENT QUANTITY")
      }

    })
  })
}