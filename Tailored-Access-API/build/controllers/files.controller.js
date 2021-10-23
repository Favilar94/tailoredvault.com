"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadFile = exports.updateFileById = exports.getFiles = exports.getFileById = exports.deleteFileById = void 0;

var _database = _interopRequireDefault(require("../database"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var path = require("path");

var sharp = require("sharp");

var multer = require("multer");

var fs = require("fs");

var uploadFile = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var userID, userName, storage, upload;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userID = req.userID;
            userName = req.userName;
            storage = multer.diskStorage({
              destination: function destination(req, file, cb) {
                var filePath = path.join(_config["default"].savePath, "public", userName);

                try {
                  if (!fs.existsSync(filePath)) {
                    fs.mkdir(filePath, function (err) {
                      if (err) return console.error(err);
                      console.log("Directory created successfully");
                    });
                    fs.mkdir(path.join(filePath, "thumbnails"), function (err) {
                      if (err) return console.error(err);
                      console.log("Thumbnails directory created successfully");
                    });
                  }
                } catch (err) {}

                cb(null, filePath);
              },
              filename: function filename(req, file, cb) {
                cb(null, file.originalname);
              }
            });
            upload = multer({
              storage: storage
            }).array("file", 50);
            upload(req, res, function (err) {
              if (err instanceof multer.MulterError) {
                console.log("Multer Error");
              } else if (err) {
                console.log("Unknow error");
              }

              var _req$body = req.body,
                  description = _req$body.description,
                  privacyID = _req$body.privacyID;

              var _iterator = _createForOfIteratorHelper(req.files),
                  _step;

              try {
                var _loop = function _loop() {
                  var element = _step.value;
                  var fileName = element["filename"];
                  var mbSize = element["size"] / 1024 / 1024;
                  var fileExtension = path.extname(fileName).replace('.', '').toLowerCase();
                  var filePath = element["path"];
                  var thumbnailPath = null; //Computar

                  var spectRatio = null; //Computar

                  if (fileExtension == "png" || fileExtension == "jpeg" || fileExtension == "jpg") {
                    thumbnailPath = path.join(element["destination"], "thumbnails", fileName);
                    var heightPx = 200;

                    try {
                      sharp(filePath).resize({
                        fit: sharp.fit.contain,
                        height: heightPx
                      }).toFile(thumbnailPath, /*#__PURE__*/function () {
                        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(err, resizeImage) {
                          var staticPath, staticThumbnailPath, values, response;
                          return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                              switch (_context.prev = _context.next) {
                                case 0:
                                  if (!err) {
                                    _context.next = 4;
                                    break;
                                  }

                                  console.log(err);
                                  _context.next = 17;
                                  break;

                                case 4:
                                  spectRatio = resizeImage.height / resizeImage.width; // insertar En SQL

                                  staticPath = _config["default"].WEB_HOSTNAME + "/" + userName + "/" + fileName;
                                  staticThumbnailPath = _config["default"].WEB_HOSTNAME + "/" + userName + "/" + "thumbnails" + fileName;
                                  values = [fileName, mbSize, fileExtension, description, staticPath, staticThumbnailPath, spectRatio, userID, privacyID];
                                  _context.prev = 8;
                                  _context.next = 11;
                                  return _database["default"].query('INSERT INTO Files (file_name,MB_size, file_extension, description, original_path, thumbnail_path, spect_ratio, user_id, privacy_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9);', values);

                                case 11:
                                  response = _context.sent;
                                  _context.next = 17;
                                  break;

                                case 14:
                                  _context.prev = 14;
                                  _context.t0 = _context["catch"](8);
                                  res.status(404).json({
                                    message: "Error"
                                  });

                                case 17:
                                case "end":
                                  return _context.stop();
                              }
                            }
                          }, _callee, null, [[8, 14]]);
                        }));

                        return function (_x3, _x4) {
                          return _ref2.apply(this, arguments);
                        };
                      }());
                    } catch (error) {
                      console.log(error);
                    }
                  }
                };

                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  _loop();
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }

              ;
              res.status(201).json({
                message: "Uploaded"
              });
            });

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function uploadFile(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.uploadFile = uploadFile;

var getFiles = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var response;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _database["default"].query('SELECT * FROM Files WHERE user_id = $1 AND privacy_id >= $2;', [req.params.userID, req.relationWithUser]);

          case 3:
            response = _context3.sent;
            res.status(200).json(response.rows);
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            res.status(404).json({
              message: "Error"
            });

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 7]]);
  }));

  return function getFiles(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getFiles = getFiles;

var getFileById = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var response;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _database["default"].query('SELECT * FROM Files WHERE file_id = $1;', [req.params.fileID]);

          case 3:
            response = _context4.sent;
            res.status(200).json(response.rows);
            _context4.next = 10;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            res.status(404).json({
              message: "Error"
            });

          case 10:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 7]]);
  }));

  return function getFileById(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getFileById = getFileById;

var updateFileById = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    var _req$body2, description, privacyID, fileID, response;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$body2 = req.body, description = _req$body2.description, privacyID = _req$body2.privacyID;
            fileID = req.params.fileID;
            _context5.prev = 2;
            _context5.next = 5;
            return _database["default"].query('UPDATE Files SET description = $1, privacy_id = $2 WHERE file_id = $3;', [description, privacyID, fileID]);

          case 5:
            response = _context5.sent;
            res.status(204).json({
              message: "Updated"
            });
            _context5.next = 12;
            break;

          case 9:
            _context5.prev = 9;
            _context5.t0 = _context5["catch"](2);
            res.status(404).json({
              message: "Error"
            });

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[2, 9]]);
  }));

  return function updateFileById(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.updateFileById = updateFileById;

var deleteFileById = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    var fileID, filePaths, _iterator2, _step2, file, response;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            fileID = req.params.fileID;
            _context6.next = 3;
            return _database["default"].query('SELECT original_path, thumbnail_path FROM Files WHERE file_id = $1;', [fileID]);

          case 3:
            filePaths = _context6.sent;
            _iterator2 = _createForOfIteratorHelper(filePaths.rows);
            _context6.prev = 5;

            _iterator2.s();

          case 7:
            if ((_step2 = _iterator2.n()).done) {
              _context6.next = 23;
              break;
            }

            file = _step2.value;
            _context6.prev = 9;
            fs.unlinkSync(file["original_path"]);
            fs.unlinkSync(file["thumbnail_path"]);
            _context6.next = 14;
            return _database["default"].query('DELETE FROM Files WHERE file_id = $1;', [fileID]);

          case 14:
            response = _context6.sent;
            res.status(204).json({
              message: "Deleted"
            });
            _context6.next = 21;
            break;

          case 18:
            _context6.prev = 18;
            _context6.t0 = _context6["catch"](9);
            res.status(404).json({
              message: "Error"
            });

          case 21:
            _context6.next = 7;
            break;

          case 23:
            _context6.next = 28;
            break;

          case 25:
            _context6.prev = 25;
            _context6.t1 = _context6["catch"](5);

            _iterator2.e(_context6.t1);

          case 28:
            _context6.prev = 28;

            _iterator2.f();

            return _context6.finish(28);

          case 31:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[5, 25, 28, 31], [9, 18]]);
  }));

  return function deleteFileById(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

exports.deleteFileById = deleteFileById;