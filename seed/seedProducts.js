module.exports = function() {
  const mysql = require("mysql");

  const seedDB = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "password",
    database: "commandmazonDB"
  });

  seedDB.connect(err => {
    if (err) throw new Error(`Error: ${err.message}`);
    console.log(`Connected to database. Status: ${seedDB.state}`);
  });

  seedDB.query("DROP TABLE IF EXISTS items", (err, data) => {
    if (err) throw new Error(`Error: ${err.message}`);
    console.log("TABLE DROPPED.");
  });

  seedDB.query(
    "CREATE TABLE items(item_id INT NOT NULL AUTO_INCREMENT, product_name VARCHAR(50), department_name VARCHAR(50), product_price DECIMAL(10,2) NOT NULL, stock_quantity INT DEFAULT(10), product_sales INT DEFAULT(0), PRIMARY KEY (item_id))",
    (err, data) => {
      if (err) throw new Error(`Error: ${err.message}`);
      console.log("TABLE CREATED.");
    }
  );

  const seedData = [
    ["iPhone XS", "electronics", 800.00, 12000],
    ["Macbook Pro 13-inch", "electronics", 1500.00, 1000],
    ["Samsung Tablet", "electronics", 500.00, 1500],
    ["Sofa", "furniture", 450.00, 1500],
    ["Dresser", "furniture", 150.00, 2500],
    ["Bed", "furniture", 700.00, 3500],
    ["Hue Lightbulb", "household", 60.00, 2600],
    ["Nest Thermostat", "household", 220.00, 1800],
    ["Nest Camera", "electronics", 135.00, 6500],
    ["Coffee Grounds", "groceries", 35.00, 1500]
  ];

  seedDB.query(
    "INSERT INTO items(product_name, department_name, product_price, product_sales) VALUES ?",
    [seedData],
    (err, data) => {
      if (err) throw new Error(`Error: ${err.message}`);
      console.log(`DATA INSERTED: ${data.affectedRows} rows`);
      seedDB.end();
    }
  );
};
