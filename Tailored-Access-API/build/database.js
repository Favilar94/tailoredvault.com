"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _require = require("pg"),
    Pool = _require.Pool;

require('dotenv').config();

var pool = new Pool({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "tailoredvault_DB",
  port: "5432"
});
var _default = pool;
exports["default"] = _default;