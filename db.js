// db.js -- one shared connection pool to MySQL
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Mysql@123', // <-- change this
  database: 'gqldemo',
});

module.exports = pool;
