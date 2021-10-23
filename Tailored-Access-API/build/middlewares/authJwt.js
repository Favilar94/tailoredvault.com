"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = exports.userRole = exports.profilePrivacy = exports.isVisitorProfile = exports.isVisitor = exports.isOwnerProfile = exports.isOwner = exports.isAdmin = exports.checkAccess = exports.canUpdate = exports.canRead = exports.canDelete = exports.canCreate = void 0;

var _database = _interopRequireDefault(require("../database"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var verifyToken = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var token, decoded, responseUserID, userName;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            token = req.headers["x-access-token"];

            if (token) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", res.status(403).json({
              message: "No token provided"
            }));

          case 4:
            decoded = _jsonwebtoken["default"].verify(token, _config["default"].SECRET);
            _context.next = 7;
            return _database["default"].query("SELECT user_name, rol_id, email_validated FROM users WHERE user_id = $1", [decoded.id]);

          case 7:
            responseUserID = _context.sent;
            userName = responseUserID.rows[0];

            if (userName) {
              _context.next = 13;
              break;
            }

            return _context.abrupt("return", res.status(404).json({
              message: "No user found"
            }));

          case 13:
            userName = userName["user_name"];
            req.userID = decoded.id;
            req.userName = userName;
            req.emailValidated = responseUserID.rows[0]["email_validated"];
            req.rolID = responseUserID.rows[0]["rol_id"];
            req.rightsAccess = [];

            if (req.emailValidated) {
              _context.next = 23;
              break;
            }

            return _context.abrupt("return", res.status(200).json({
              message: "Email not validated"
            }));

          case 23:
            next();

          case 24:
            _context.next = 29;
            break;

          case 26:
            _context.prev = 26;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", res.status(401).json({
              message: "Unauthorized",
              error: _context.t0
            }));

          case 29:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 26]]);
  }));

  return function verifyToken(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.verifyToken = verifyToken;

var userRole = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _database["default"].query("SELECT description,r_read,r_update,r_delete,r_create,sysadmin FROM Roles WHERE rol_id = $1", [req.rolID]);

          case 2:
            response = _context2.sent;
            req.Roles = response.rows[0];
            next();

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function userRole(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

exports.userRole = userRole;

var canCreate = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var r_create;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            r_create = req.Roles.r_create;

            if (!r_create) {
              _context3.next = 5;
              break;
            }

            next();
            _context3.next = 6;
            break;

          case 5:
            return _context3.abrupt("return", res.status(403).json({
              message: "Forbidden"
            }));

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function canCreate(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

exports.canCreate = canCreate;

var canRead = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, next) {
    var r_read;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            r_read = req.Roles.r_read;

            if (!r_read) {
              _context4.next = 5;
              break;
            }

            next();
            _context4.next = 6;
            break;

          case 5:
            return _context4.abrupt("return", res.status(403).json({
              message: "Forbidden"
            }));

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function canRead(_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}();

exports.canRead = canRead;

var canUpdate = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, next) {
    var r_update;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            r_update = req.Roles.r_update;

            if (!r_update) {
              _context5.next = 5;
              break;
            }

            next();
            _context5.next = 6;
            break;

          case 5:
            return _context5.abrupt("return", res.status(403).json({
              message: "Forbidden"
            }));

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function canUpdate(_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}();

exports.canUpdate = canUpdate;

var canDelete = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res, next) {
    var r_delete;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            r_delete = req.Roles.r_delete;

            if (!r_delete) {
              _context6.next = 5;
              break;
            }

            next();
            _context6.next = 6;
            break;

          case 5:
            return _context6.abrupt("return", res.status(403).json({
              message: "Forbidden"
            }));

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function canDelete(_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}();

exports.canDelete = canDelete;

var isAdmin = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(req, res, next) {
    var sysadmin;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            sysadmin = req.Roles.sysadmin;

            if (sysadmin) {
              req.relationWithUser = 0;
              req.rightsAccess.push(true);
              next();
            } else {
              req.relationWithUser = null;
              req.rightsAccess.push(false);
              next();
            }

          case 2:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function isAdmin(_x19, _x20, _x21) {
    return _ref7.apply(this, arguments);
  };
}();

exports.isAdmin = isAdmin;

var isOwner = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(req, res, next) {
    var response, fileMetadata;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return _database["default"].query("SELECT user_id, privacy_id FROM Files WHERE file_id = $1", [req.params.fileID]);

          case 2:
            response = _context8.sent;
            fileMetadata = response.rows;

            if (!(fileMetadata.length != 0)) {
              _context8.next = 11;
              break;
            }

            req.fileOwner = fileMetadata[0]["user_id"];
            req.filePrivacyID = fileMetadata[0]["privacy_id"];
            req.rightsAccess.push(req.userID == req.fileOwner);
            next();
            _context8.next = 12;
            break;

          case 11:
            return _context8.abrupt("return", res.status(404).json({
              message: "No file found"
            }));

          case 12:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));

  return function isOwner(_x22, _x23, _x24) {
    return _ref8.apply(this, arguments);
  };
}();

exports.isOwner = isOwner;

var isVisitor = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(req, res, next) {
    var responsePrivacy, _responsePrivacy$rows, description, is_personal, friends, friends_friends, everyone, response, relationValues, responsefriends, AllfriendsList, friendOfFriend, _iterator, _step, friendOfTheOwner, friend, responseRelation, relationShipFounded;

    return regeneratorRuntime.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            if (!(req.rightsAccess.indexOf(true) !== -1)) {
              _context9.next = 4;
              break;
            }

            next();
            _context9.next = 65;
            break;

          case 4:
            _context9.next = 6;
            return _database["default"].query("SELECT description,is_personal,friends,friends_friends,everyone FROM Pryvacy_Options WHERE privacy_id = $1", [req.filePrivacyID]);

          case 6:
            responsePrivacy = _context9.sent;
            _responsePrivacy$rows = responsePrivacy.rows[0], description = _responsePrivacy$rows.description, is_personal = _responsePrivacy$rows.is_personal, friends = _responsePrivacy$rows.friends, friends_friends = _responsePrivacy$rows.friends_friends, everyone = _responsePrivacy$rows.everyone;

            if (!is_personal) {
              _context9.next = 12;
              break;
            }

            return _context9.abrupt("return", res.status(403).json({
              message: "Forbidden"
            }));

          case 12:
            if (!everyone) {
              _context9.next = 17;
              break;
            }

            req.rightsAccess.push(true);
            next();
            _context9.next = 65;
            break;

          case 17:
            if (!(friends || friends_friends)) {
              _context9.next = 65;
              break;
            }

            _context9.next = 20;
            return _database["default"].query("SELECT relation_id FROM Relationships WHERE user_ID1 = $1 AND user_ID2 = $2 AND status = true", [req.fileOwner, req.userID]);

          case 20:
            response = _context9.sent;
            relationValues = response.rows;

            if (!(relationValues.length > 0)) {
              _context9.next = 27;
              break;
            }

            req.rightsAccess.push(true);
            next();
            _context9.next = 65;
            break;

          case 27:
            if (!friends_friends) {
              _context9.next = 63;
              break;
            }

            _context9.next = 30;
            return _database["default"].query("SELECT user_ID2 FROM Relationships WHERE user_ID1 = $1 AND status = true", [req.fileOwner]);

          case 30:
            responsefriends = _context9.sent;
            AllfriendsList = responsefriends.rows;
            friendOfFriend = false;
            _iterator = _createForOfIteratorHelper(AllfriendsList);
            _context9.prev = 34;

            _iterator.s();

          case 36:
            if ((_step = _iterator.n()).done) {
              _context9.next = 46;
              break;
            }

            friendOfTheOwner = _step.value;
            friend = friendOfTheOwner["user_id2"];
            _context9.next = 41;
            return _database["default"].query("SELECT relation_id FROM Relationships WHERE user_ID1 = $1 AND user_ID2 = $2 AND status = true", [friend, req.userID]);

          case 41:
            responseRelation = _context9.sent;
            relationShipFounded = responseRelation.rows;

            if (!(relationShipFounded.length < 1)) {
              friendOfFriend = true;
            }

          case 44:
            _context9.next = 36;
            break;

          case 46:
            _context9.next = 51;
            break;

          case 48:
            _context9.prev = 48;
            _context9.t0 = _context9["catch"](34);

            _iterator.e(_context9.t0);

          case 51:
            _context9.prev = 51;

            _iterator.f();

            return _context9.finish(51);

          case 54:
            ;

            if (!friendOfFriend) {
              _context9.next = 60;
              break;
            }

            req.rightsAccess.push(true);
            next();
            _context9.next = 61;
            break;

          case 60:
            return _context9.abrupt("return", res.status(403).json({
              message: "Forbidden"
            }));

          case 61:
            _context9.next = 65;
            break;

          case 63:
            return _context9.abrupt("return", res.status(403).json({
              message: "Forbidden"
            }));

          case 65:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[34, 48, 51, 54]]);
  }));

  return function isVisitor(_x25, _x26, _x27) {
    return _ref9.apply(this, arguments);
  };
}();

exports.isVisitor = isVisitor;

var isOwnerProfile = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(req, res, next) {
    return regeneratorRuntime.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            if (req.params.userID == req.userID) {
              req.relationWithUser = 1;
              req.rightsAccess.push(true);
              next();
            } else {
              req.rightsAccess.push(false);
              next();
            }

          case 1:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));

  return function isOwnerProfile(_x28, _x29, _x30) {
    return _ref10.apply(this, arguments);
  };
}();

exports.isOwnerProfile = isOwnerProfile;

var isVisitorProfile = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(req, res, next) {
    var response, relationValues, responsefriends, AllfriendsList, friendOfFriend, _iterator2, _step2, friendOfTheOwner, friend, responseRelation, relationShipFounded;

    return regeneratorRuntime.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            if (!(req.rightsAccess.indexOf(true) !== -1)) {
              _context11.next = 4;
              break;
            }

            next();
            _context11.next = 42;
            break;

          case 4:
            _context11.next = 6;
            return _database["default"].query("SELECT relation_id FROM Relationships WHERE user_ID1 = $1 AND user_ID2 = $2 AND status = true", [req.params.userID, req.userID]);

          case 6:
            response = _context11.sent;
            relationValues = response.rows;

            if (!(relationValues.length > 0)) {
              _context11.next = 14;
              break;
            }

            req.relationWithUser = 2;
            req.rightsAccess.push(true);
            next();
            _context11.next = 42;
            break;

          case 14:
            _context11.next = 16;
            return _database["default"].query("SELECT user_ID2 FROM Relationships WHERE user_ID1 = $1 AND status = true", [req.params.userID]);

          case 16:
            responsefriends = _context11.sent;
            AllfriendsList = responsefriends.rows;
            friendOfFriend = false;
            _iterator2 = _createForOfIteratorHelper(AllfriendsList);
            _context11.prev = 20;

            _iterator2.s();

          case 22:
            if ((_step2 = _iterator2.n()).done) {
              _context11.next = 32;
              break;
            }

            friendOfTheOwner = _step2.value;
            friend = friendOfTheOwner["user_id2"];
            _context11.next = 27;
            return _database["default"].query("SELECT relation_id FROM Relationships WHERE user_ID1 = $1 AND user_ID2 = $2 AND status = true", [friend, req.userID]);

          case 27:
            responseRelation = _context11.sent;
            relationShipFounded = responseRelation.rows;

            if (!(relationShipFounded.length < 1)) {
              friendOfFriend = true;
            }

          case 30:
            _context11.next = 22;
            break;

          case 32:
            _context11.next = 37;
            break;

          case 34:
            _context11.prev = 34;
            _context11.t0 = _context11["catch"](20);

            _iterator2.e(_context11.t0);

          case 37:
            _context11.prev = 37;

            _iterator2.f();

            return _context11.finish(37);

          case 40:
            ;

            if (friendOfFriend) {
              req.relationWithUser = 3;
              req.rightsAccess.push(true);
              next();
            } else {
              req.relationWithUser = 4;
              req.rightsAccess.push(true);
              next();
            }

          case 42:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[20, 34, 37, 40]]);
  }));

  return function isVisitorProfile(_x31, _x32, _x33) {
    return _ref11.apply(this, arguments);
  };
}();

exports.isVisitorProfile = isVisitorProfile;

var checkAccess = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(req, res, next) {
    return regeneratorRuntime.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            if (!(req.rightsAccess.indexOf(true) !== -1)) {
              _context12.next = 4;
              break;
            }

            next();
            _context12.next = 5;
            break;

          case 4:
            return _context12.abrupt("return", res.status(403).json({
              message: "Forbidden"
            }));

          case 5:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12);
  }));

  return function checkAccess(_x34, _x35, _x36) {
    return _ref12.apply(this, arguments);
  };
}();

exports.checkAccess = checkAccess;

var profilePrivacy = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(req, res, next) {
    var response;
    return regeneratorRuntime.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            _context13.next = 2;
            return _database["default"].query('SELECT privacy_id FROM Users WHERE user_id = $1', [req.params.userID]);

          case 2:
            response = _context13.sent;

            if (!response.rows[0]) {
              _context13.next = 8;
              break;
            }

            req.profilePryvacyID = response.rows[0]["privacy_id"];
            next();
            _context13.next = 9;
            break;

          case 8:
            return _context13.abrupt("return", res.status(404).json({
              message: "User not found"
            }));

          case 9:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13);
  }));

  return function profilePrivacy(_x37, _x38, _x39) {
    return _ref13.apply(this, arguments);
  };
}();

exports.profilePrivacy = profilePrivacy;