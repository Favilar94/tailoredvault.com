"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRelation = exports.getRelations = exports.deleteRelation = exports.createRelation = void 0;

var _database = _interopRequireDefault(require("../database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var createRelation = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var _req$body, user_ID1, user_ID2, status, values1, values2, response, response2, _values, _values2, _response, respons2;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, user_ID1 = _req$body.user_ID1, user_ID2 = _req$body.user_ID2, status = _req$body.status;
            _context.prev = 1;

            if (!(req.relationWithUser == 0)) {
              _context.next = 14;
              break;
            }

            values1 = [user_ID1, user_ID2, status];
            values2 = [user_ID2, user_ID1, status];
            _context.next = 7;
            return _database["default"].query("INSERT INTO Relationships (user_ID1,user_ID2,status) VALUES($1,$2,$3);", values1);

          case 7:
            response = _context.sent;
            _context.next = 10;
            return _database["default"].query("INSERT INTO Relationships (user_ID1,user_ID2,status) VALUES($1,$2,$3);", values2);

          case 10:
            response2 = _context.sent;
            res.status(200).json({
              message: "Created"
            });
            _context.next = 27;
            break;

          case 14:
            if (!(user_ID1 == req.userID || user_ID2 == req.userID)) {
              _context.next = 26;
              break;
            }

            _values = [user_ID1, user_ID2];
            _values2 = [user_ID2, user_ID1];
            _context.next = 19;
            return _database["default"].query("INSERT INTO Relationships (user_ID1,user_ID2,status) VALUES($1,$2);", _values);

          case 19:
            _response = _context.sent;
            _context.next = 22;
            return _database["default"].query("INSERT INTO Relationships (user_ID1,user_ID2,status) VALUES($1,$2);", _values2);

          case 22:
            respons2 = _context.sent;
            res.status(200).json({
              message: "Created"
            });
            _context.next = 27;
            break;

          case 26:
            res.status(403).json({
              message: "Forbidden"
            });

          case 27:
            _context.next = 32;
            break;

          case 29:
            _context.prev = 29;
            _context.t0 = _context["catch"](1);
            res.status(404).json({
              message: "Error"
            });

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 29]]);
  }));

  return function createRelation(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.createRelation = createRelation;

var getRelations = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            if (!(req.profilePryvacyID >= req.relationWithUser)) {
              _context2.next = 8;
              break;
            }

            _context2.next = 4;
            return _database["default"].query('SELECT user_ID2 FROM Relationships WHERE user_ID1 = $1 AND status = true;', [req.params.userID]);

          case 4:
            response = _context2.sent;
            res.status(200).json(response.rows);
            _context2.next = 9;
            break;

          case 8:
            res.status(403).json({
              message: "Forbidden"
            });

          case 9:
            _context2.next = 14;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](0);
            res.status(404).json({
              message: "Error"
            });

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 11]]);
  }));

  return function getRelations(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getRelations = getRelations;

var updateRelation = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var status, relationID, responseRelationExists, response;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            status = req.body.status;
            relationID = req.params.relationID;
            _context3.next = 5;
            return _database["default"].query("SELECT user_ID1, user_ID2 FROM Relationships WHERE relation_id = $1;", [relationID]);

          case 5:
            responseRelationExists = _context3.sent;

            if (!(responseRelationExists.rows.length > 0)) {
              _context3.next = 17;
              break;
            }

            if (!(responseRelationExists.rows[0]["user_id1"] == req.userID || responseRelationExists.rows[0]["user_id2"] == req.userID || req.relationWithUser == 0)) {
              _context3.next = 14;
              break;
            }

            _context3.next = 10;
            return _database["default"].query('UPDATE Relationships SET status = $1 WHERE relation_id = $2;', [status, relationID]);

          case 10:
            response = _context3.sent;
            res.status(204).json({
              message: "Updated"
            });
            _context3.next = 15;
            break;

          case 14:
            return _context3.abrupt("return", res.status(401).json({
              message: "Unauthorized",
              error: error
            }));

          case 15:
            _context3.next = 18;
            break;

          case 17:
            return _context3.abrupt("return", res.status(404).json({
              message: "No found"
            }));

          case 18:
            _context3.next = 23;
            break;

          case 20:
            _context3.prev = 20;
            _context3.t0 = _context3["catch"](0);
            res.status(404).json({
              message: "Error"
            });

          case 23:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 20]]);
  }));

  return function updateRelation(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.updateRelation = updateRelation;

var deleteRelation = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var relationID, responseRelationExists, response;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            relationID = req.params.relationID;
            _context4.next = 4;
            return _database["default"].query("SELECT user_ID1, user_ID2 FROM Relationships WHERE relation_id = $1;", [relationID]);

          case 4:
            responseRelationExists = _context4.sent;

            if (!(responseRelationExists.rows.length > 0)) {
              _context4.next = 16;
              break;
            }

            if (!(responseRelationExists.rows[0]["user_id1"] == req.userID || responseRelationExists.rows[0]["user_id2"] == req.userID || req.relationWithUser == 0)) {
              _context4.next = 13;
              break;
            }

            _context4.next = 9;
            return _database["default"].query('DELETE FROM Relationships WHERE relation_id = $1;', [relationID]);

          case 9:
            response = _context4.sent;
            res.status(204).json({
              message: "Deleted"
            });
            _context4.next = 14;
            break;

          case 13:
            return _context4.abrupt("return", res.status(401).json({
              message: "Unauthorized",
              error: error
            }));

          case 14:
            _context4.next = 17;
            break;

          case 16:
            return _context4.abrupt("return", res.status(404).json({
              message: "No found"
            }));

          case 17:
            _context4.next = 22;
            break;

          case 19:
            _context4.prev = 19;
            _context4.t0 = _context4["catch"](0);
            res.status(404).json({
              message: "Error"
            });

          case 22:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 19]]);
  }));

  return function deleteRelation(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.deleteRelation = deleteRelation;