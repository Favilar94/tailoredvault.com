"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUp = exports.signIn = void 0;

var _database = _interopRequireDefault(require("../database"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var signUp = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, user_name, about, user_password, first_name, last_name, email, plan_id, rol_id, privacy_id, values, response, responseUserID, userID, token;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, user_name = _req$body.user_name, about = _req$body.about, user_password = _req$body.user_password, first_name = _req$body.first_name, last_name = _req$body.last_name, email = _req$body.email, plan_id = _req$body.plan_id, rol_id = _req$body.rol_id, privacy_id = _req$body.privacy_id;
            values = [user_name.toLowerCase(), about, user_password, first_name, last_name, email.toLowerCase(), plan_id, rol_id, privacy_id];
            _context.prev = 2;
            _context.next = 5;
            return _database["default"].query("INSERT INTO Users (user_name,about,user_password,first_name,last_name,email,plan_id,rol_id,privacy_id) VALUES($1,$2,crypt($3,gen_salt('bf')),$4,$5,$6,$7,$8,$9);", values);

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
            token = _jsonwebtoken["default"].sign({
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

  return function signUp(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.signUp = signUp;

var signIn = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var _req$body2, email, user_password, responseUserID, userID, token;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _req$body2 = req.body, email = _req$body2.email, user_password = _req$body2.user_password;
            _context2.next = 3;
            return _database["default"].query("SELECT user_id FROM users WHERE email = $1 AND user_password = crypt($2, user_password)", [email.toLowerCase(), user_password]);

          case 3:
            responseUserID = _context2.sent;
            userID = responseUserID.rows[0];

            if (userID) {
              _context2.next = 9;
              break;
            }

            return _context2.abrupt("return", res.status(400).json({
              message: "User or password incorrect"
            }));

          case 9:
            userID = userID['user_id'];

          case 10:
            //Si no encuentra nada es que o no existe el usuario o el password esta mal
            token = _jsonwebtoken["default"].sign({
              id: userID
            }, _config["default"].SECRET, {
              expiresIn: 86400
            });
            res.json({
              token: token
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function signIn(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.signIn = signIn;