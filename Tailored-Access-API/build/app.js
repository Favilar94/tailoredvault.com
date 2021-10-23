"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _package = _interopRequireDefault(require("../package.json"));

var _files = _interopRequireDefault(require("./routes/files.routes"));

var _auth = _interopRequireDefault(require("./routes/auth.routes"));

var _user = _interopRequireDefault(require("./routes/user.routes"));

var _relationships = _interopRequireDefault(require("./routes/relationships.routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

require('dotenv').config();

var path = require("path");

var app = (0, _express["default"])(); //Settings

app.set("pkg", _package["default"]);
app.set("port", process.env.PORT_BACKEND); // middlewares

app.use(_express["default"].urlencoded({
  extended: true
}));
app.use(_express["default"].json()); //Routes

app.get("/api", function (req, res) {
  res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    description: app.get("pkg").description,
    version: app.get("pkg").version
  });
});
app.use("/api/files", _files["default"]);
app.use("/api/auth", _auth["default"]);
app.use("/api/user", _user["default"]);
app.use("/api/relation", _relationships["default"]); //Static files

app.use(_express["default"]["static"](path.join(__dirname, "public")));
var _default = app;
exports["default"] = _default;