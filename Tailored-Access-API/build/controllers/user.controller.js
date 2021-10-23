"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUser = exports.getUsers = exports.getUser = exports.deleteUser = exports.createUser = void 0;

var _database = _interopRequireDefault(require("../database"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var fs = require("fs");

var path = require("path");

var createUser = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, user_name, about, user_password, first_name, last_name, email, email_validated, plan_id, rol_id, privacy_id, values, response, responseUserID, userID, token;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, user_name = _req$body.user_name, about = _req$body.about, user_password = _req$body.user_password, first_name = _req$body.first_name, last_name = _req$body.last_name, email = _req$body.email, email_validated = _req$body.email_validated, plan_id = _req$body.plan_id, rol_id = _req$body.rol_id, privacy_id = _req$body.privacy_id;
            values = [user_name.toLowerCase(), about, user_password, first_name, last_name, email.toLowerCase(), email_validated, plan_id, rol_id, privacy_id];
            _context.prev = 2;
            _context.next = 5;
            return _database["default"].query("INSERT INTO Users (user_name,about,user_password,first_name,last_name,email,email_validated,plan_id,rol_id,privacy_id) VALUES($1,$2,crypt($3,gen_salt('bf')),$4,$5,$6,$7,$8,$9,$10);", values);

          case 5:
            response = _context.sent;
            _context.next = 11;
            break;

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](2);
            res.status(400).json({
              "error": "Email or User in use"
            });

          case 11:
            _context.next = 13;
            return _database["default"].query("SELECT user_id FROM users WHERE user_name = $1", [user_name.toLowerCase()]);

          case 13:
            responseUserID = _context.sent;
            userID = responseUserID.rows[0]['user_id'];
            token = jwt.sign({
              id: userID
            }, _config["default"].SECRET, {
              expiresIn: 86400
            });
            res.status(200).json({
              token: token
            });

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 8]]);
  }));

  return function createUser(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.createUser = createUser;

var getUsers = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var response, _response;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            if (!(req.relationWithUsern == 0)) {
              _context2.next = 8;
              break;
            }

            _context2.next = 4;
            return _database["default"].query('SELECT user_name, about, member_since, last_conection, MB_used, first_name, last_name, email, email_validated, plan_id, rol_id, privacy_id FROM Users;');

          case 4:
            response = _context2.sent;
            res.status(200).json(response.rows);
            _context2.next = 12;
            break;

          case 8:
            _context2.next = 10;
            return _database["default"].query('SELECT user_name, about FROM Users;');

          case 10:
            _response = _context2.sent;
            res.status(200).json(_response.rows);

          case 12:
            _context2.next = 17;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2["catch"](0);
            res.status(404).json({
              message: "Error"
            });

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 14]]);
  }));

  return function getUsers(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getUsers = getUsers;

var getUser = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var response;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(req.profilePryvacyID >= req.relationWithUser)) {
              _context3.next = 6;
              break;
            }

            _context3.next = 3;
            return _database["default"].query('SELECT user_name, about, member_since, last_conection, MB_used, first_name, last_name, email, email_validated, plan_id, rol_id, privacy_id FROM Users WHERE user_id = $1;', [req.params.userID]);

          case 3:
            response = _context3.sent;
            _context3.next = 9;
            break;

          case 6:
            _context3.next = 8;
            return _database["default"].query('SELECT user_name, about FROM Users WHERE user_id = $1;', [req.params.userID]);

          case 8:
            response = _context3.sent;

          case 9:
            res.status(200).json(response.rows);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getUser = getUser;

var updateUser = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var _req$body2, about, first_name, last_name, email_validated, plan_id, rol_id, privacy_id, updateUserID, valuesToUpdate, response, _valuesToUpdate, _response2;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _req$body2 = req.body, about = _req$body2.about, first_name = _req$body2.first_name, last_name = _req$body2.last_name, email_validated = _req$body2.email_validated, plan_id = _req$body2.plan_id, rol_id = _req$body2.rol_id, privacy_id = _req$body2.privacy_id;
            updateUserID = req.params.userID;

            if (!(relationWithUser == 0)) {
              _context4.next = 11;
              break;
            }

            valuesToUpdate = [about, first_name, last_name, email_validated, plan_id, rol_id, privacy_id, updateUserID];
            _context4.next = 7;
            return _database["default"].query('UPDATE Users SET about = $1, first_name = $2, last_name = $3, email_validated = $4, plan_id = $5 ,rol_id = $6, privacy_id = $7 WHERE user_id = $8;', valuesToUpdate);

          case 7:
            response = _context4.sent;
            res.status(204).json({
              message: "Updated"
            });
            _context4.next = 20;
            break;

          case 11:
            if (!(relationWithUser == 1)) {
              _context4.next = 19;
              break;
            }

            _valuesToUpdate = [about, first_name, last_name, privacy_id, updateUserID];
            _context4.next = 15;
            return _database["default"].query('UPDATE Users SET about = $1, first_name = $2, last_name = $3, privacy_id = $4 WHERE user_id = $5;', _valuesToUpdate);

          case 15:
            _response2 = _context4.sent;
            res.status(204).json({
              message: "Updated"
            });
            _context4.next = 20;
            break;

          case 19:
            res.status(404).json({
              message: "Error"
            });

          case 20:
            _context4.next = 25;
            break;

          case 22:
            _context4.prev = 22;
            _context4.t0 = _context4["catch"](0);
            res.status(404).json({
              message: "Error"
            });

          case 25:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 22]]);
  }));

  return function updateUser(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.updateUser = updateUser;

var deleteUser = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var userID, userName, filePath, response;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            userID = req.params.userID;
            _context5.next = 3;
            return _database["default"].query('SELECT user_name FROM Users WHERE user_id = $1;', [userID]);

          case 3:
            userName = _context5.sent;
            userName = userName.rows[0]["user_name"];
            filePath = path.join(_config["default"].savePath, "public", userName);
            _context5.prev = 6;
            fs.rmSync(filePath, {
              recursive: true,
              force: true
            });
            _context5.next = 10;
            return _database["default"].query('DELETE FROM Users WHERE user_id = $1;', [userID]);

          case 10:
            response = _context5.sent;
            res.status(204).json({
              message: "Deleted"
            });
            _context5.next = 17;
            break;

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5["catch"](6);
            res.status(404).json({
              message: "Error"
            });

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[6, 14]]);
  }));

  return function deleteUser(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.deleteUser = deleteUser;