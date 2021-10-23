"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var userCtrl = _interopRequireWildcard(require("../controllers/user.controller"));

var _middlewares = require("../middlewares");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var router = (0, _express.Router)();
router.post('/', [_middlewares.authJwt.verifyToken, _middlewares.authJwt.userRole, _middlewares.authJwt.isAdmin, _middlewares.authJwt.checkAccess], userCtrl.createUser); // Create

router.get('/', [_middlewares.authJwt.verifyToken, _middlewares.authJwt.userRole, _middlewares.authJwt.isAdmin, _middlewares.authJwt.checkAccess], userCtrl.getUsers); // Load all

router.get('/:userID', [_middlewares.authJwt.verifyToken, _middlewares.authJwt.profilePrivacy, _middlewares.authJwt.userRole, _middlewares.authJwt.isAdmin, _middlewares.authJwt.isOwnerProfile, _middlewares.authJwt.isVisitorProfile, _middlewares.authJwt.checkAccess], userCtrl.getUser); //Load user

router.put('/:userID', [_middlewares.authJwt.verifyToken, _middlewares.authJwt.userRole, _middlewares.authJwt.isAdmin, _middlewares.authJwt.isOwnerProfile, _middlewares.authJwt.checkAccess], userCtrl.updateUser); //Update user

router["delete"]('/:userID', [_middlewares.authJwt.verifyToken, _middlewares.authJwt.userRole, _middlewares.authJwt.isAdmin, _middlewares.authJwt.isOwnerProfile, _middlewares.authJwt.checkAccess], userCtrl.deleteUser); //Delete user

var _default = router;
exports["default"] = _default;