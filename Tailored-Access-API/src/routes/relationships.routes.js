import { Router } from "express";

import * as relationshipsCtrl from "../controllers/relationships.controller";
import {authJwt} from "../middlewares";
const router = Router();

router.post('/', [authJwt.verifyToken, authJwt.userRole, authJwt.isAdmin], relationshipsCtrl.createRelation); // Create Relationship


router.get('/user/:userID', [authJwt.verifyToken,authJwt.profilePrivacy, authJwt.userRole, authJwt.isAdmin, authJwt.isOwnerProfile, authJwt.isVisitorProfile,authJwt.checkAccess], relationshipsCtrl.getRelations); //Load  

router.put('/:relationID', [authJwt.verifyToken, authJwt.userRole, authJwt.isAdmin], relationshipsCtrl.updateRelation); //Update 
router.delete('/:relationID', [authJwt.verifyToken, authJwt.userRole, authJwt.isAdmin], relationshipsCtrl.deleteRelation); //Delete 

export default router;