import { Router } from "express";
const router = Router();

import * as authCtrl from '../controllers/auth.controller'

router.post('/signup', authCtrl.signUp);

router.post('/singin',authCtrl.signIn);

export default router;