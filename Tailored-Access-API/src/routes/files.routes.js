import { Router } from "express";
const router = Router();

import * as filesCtrl from "../controllers/files.controller";
import {authJwt} from "../middlewares";

router.post('/', [authJwt.verifyToken, authJwt.isOwner], filesCtrl.uploadFile);
router.post('/newnote', [authJwt.verifyToken, authJwt.isOwner], filesCtrl.createNote);

router.get('/user/:userID', [authJwt.verifyToken,authJwt.isOwner, authJwt.isAdmin, authJwt.isVisitor], filesCtrl.getFiles);
router.get('/:fileID', [authJwt.verifyToken, authJwt.isOwner, authJwt.isAdmin, authJwt.isVisitor], filesCtrl.getFileById);

router.put('/:fileID', [authJwt.verifyToken, authJwt.isOwner, authJwt.isAdmin], filesCtrl.updateFileById);
router.delete('/:fileID', [authJwt.verifyToken, authJwt.isOwner, authJwt.isAdmin], filesCtrl.deleteFileById);

export default router;