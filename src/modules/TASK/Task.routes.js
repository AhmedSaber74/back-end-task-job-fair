
import { Router } from "express";
const router = Router();
import * as taskController from './Task.controller.js'
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import {  addTaskValidation,updateTaskValidation,deleteTASkValidation,getTaskValidationBYId} from "./Task.validationSchemas.js";
import { systemRoles } from "../../utils/system-roles.js";

router.post('/addtask/:categoryId',validationMiddleware(addTaskValidation),
auth(systemRoles.ADMIN),expressAsyncHandler(taskController.addtask)
);

router.put('/Updatetask',validationMiddleware(updateTaskValidation),
auth(systemRoles.ADMIN),expressAsyncHandler(taskController.Updatetask)
)

router.delete('/deleteTask',validationMiddleware(deleteTASkValidation),
auth(systemRoles.ADMIN),expressAsyncHandler(taskController.deleteTask)
)

router.post('/featuresTask', expressAsyncHandler(taskController.featuresTask))
    

router.get('/getOneTask',validationMiddleware(getTaskValidationBYId) ,
expressAsyncHandler(taskController.getOneTask)
)


export default router;