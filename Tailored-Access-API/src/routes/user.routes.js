import { Router } from "express";

import * as userCtrl from '../controllers/user.controller'
import {authJwt} from "../middlewares";

const router = Router();

router.post('/',[authJwt.verifyToken, authJwt.userRole, authJwt.isAdmin, authJwt.checkAccess], userCtrl.createUser); // Create

router.get('/', [authJwt.verifyToken, authJwt.userRole, authJwt.isAdmin, authJwt.checkAccess], userCtrl.getUsers); // Load all

router.get('/:userID', [authJwt.verifyToken, authJwt.profilePrivacy, authJwt.userRole, authJwt.isAdmin, authJwt.isOwnerProfile, authJwt.isVisitorProfile,authJwt.checkAccess], userCtrl.getUser); //Load user

router.put('/:userID', [authJwt.verifyToken, authJwt.userRole,  authJwt.isAdmin, authJwt.isOwnerProfile, authJwt.checkAccess], userCtrl.updateUser); //Update user
router.delete('/:userID', [authJwt.verifyToken, authJwt.userRole, authJwt.isAdmin,authJwt.isOwnerProfile, authJwt.checkAccess], userCtrl.deleteUser); //Delete user

export default router;