const pgp = require('pg-promise')();
require('dotenv').config();

const db = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: "zomato_db",
  user: "postgres",
  password: "hibernation@1"
});

module.exports = db;

db.connect()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });