const { Pool } = require("pg");
require('dotenv').config()

const pool = new Pool({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "tailoredvault_DB",
  port: "5432",
});

export default pool;

