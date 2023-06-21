const { Client } = require("pg");
require("dotenv").config();

const DBConnect = () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });
  client.connect((err) => {
    if (err) {
      console.error("Unable to connect to the database:", err.stack);
    } else {
      console.log("Database Connected!");
    }
  });
  return client;
};

module.exports = DBConnect;
