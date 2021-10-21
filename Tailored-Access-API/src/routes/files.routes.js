import { Router } from "express";
const router = Router();

import * as filesCtrl from "../controllers/files.controller";

router.post('/', filesCtrl.uploadFile);
router.post('/newnote', filesCtrl.createNote);

router.get('/', filesCtrl.getFiles);
router.get('/:fileID', filesCtrl.getFileById);

router.put('/:fileID', filesCtrl.updateFileById);
router.delete('/:fileID', filesCtrl.deleteFileById);

export default router;