
import { Router } from "express";
import * as authController from './auth.controller.js';
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-roles.js";
const router = Router();


router.post('/', expressAsyncHandler(authController.signUp))

router.post('/login', expressAsyncHandler(authController.signIn))

router.put('/update_password',auth([systemRoles.USER,systemRoles.USER]) ,expressAsyncHandler(authController.update_password))
router.put('/forgetPassword',auth([systemRoles.USER,systemRoles.USER]) ,expressAsyncHandler(authController.forgetPassword))
router.put('/resetPassword',auth([systemRoles.USER,systemRoles.USER]) ,expressAsyncHandler(authController.resetPassword))



export default router;