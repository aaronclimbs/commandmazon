module.exports = function() {
  const mysql = require("mysql");

  const seedDB = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "commandmazonDB"
  });

  seedDB.connect(err => {
    if (err) throw new Error(`Error: ${err.message}`);
    console.log(`Connected to database. Status: ${seedDB.state}`);
  });

  seedDB.query("DROP TABLE IF EXISTS departments", (err, data) => {
    if (err) throw new Error(`Error: ${err.message}`);
    console.log("TABLE DROPPED.");
  });

  seedDB.query(
    "CREATE TABLE departments(department_id INT NOT NULL AUTO_INCREMENT, department_name VARCHAR(50), over_head_costs INT, PRIMARY KEY (department_id))",
    (err, data) => {
      if (err) throw new Error(`Error: ${err.message}`);
      console.log("TABLE CREATED.");
    }
  );

  const seedData = [
    ["electronics", 11000],
    ["household", 4800],
    ["misc", 6000],
    ["groceries", 15000],
    ["furniture", 4000]
  ];

  seedDB.query(
    "INSERT INTO departments(department_name, over_head_costs) VALUES ?",
    [seedData],
    (err, data) => {
      if (err) throw new Error(`Error: ${err.message}`);
      console.log(`DATA INSERTED: ${data.affectedRows} rows`);
      seedDB.end();
    }
  );
};
