import { Router } from "express";

import * as filesCtrl from "../controllers/files.controller";
import {authJwt} from "../middlewares";
const router = Router();

router.post('/', [authJwt.verifyToken, authJwt.userRole, authJwt.canCreate], filesCtrl.uploadFile); // Upload files

router.get('/:fileID', [authJwt.verifyToken, authJwt.userRole, authJwt.canRead, authJwt.isAdmin, authJwt.isOwner, authJwt.isVisitor,authJwt.checkAccess], filesCtrl.getFileById); // Load file

router.get('/user/:userID', [authJwt.verifyToken, authJwt.userRole, authJwt.canRead, authJwt.isAdmin, authJwt.isOwnerProfile, authJwt.isVisitorProfile,authJwt.checkAccess], filesCtrl.getFiles); //Load all files from user

router.put('/:fileID', [authJwt.verifyToken, authJwt.userRole, authJwt.canUpdate, authJwt.isAdmin, authJwt.isOwner,authJwt.checkAccess], filesCtrl.updateFileById); //Update file
router.delete('/:fileID', [authJwt.verifyToken, authJwt.userRole, authJwt.canDelete, authJwt.isAdmin,authJwt.isOwner,authJwt.checkAccess], filesCtrl.deleteFileById); //Delete file

export default router;
