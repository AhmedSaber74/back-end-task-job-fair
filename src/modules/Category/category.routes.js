
import { Router } from "express";
const router = Router();
import * as categoryController from './category.contoller.js'
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { SaddCategory, SdeleteCategory, SupdateCategory ,SgetCategoriesBYId} from "./category.validationSchemas.js";
import { systemRoles } from "../../utils/system-roles.js";


router.post('/addCategory',validationMiddleware(SaddCategory),auth(systemRoles.ADMIN),expressAsyncHandler(categoryController.addCategory))

router.put('/updateCategory',validationMiddleware(SupdateCategory),auth(systemRoles.ADMIN),expressAsyncHandler(categoryController.updateCategory))

router.get('/getAllCategories', expressAsyncHandler(categoryController.getAllCategories))

router.get('/:categoryId',validationMiddleware(SgetCategoriesBYId), expressAsyncHandler(categoryController.getCategoriesBYId))

router.post('/featuresCategories', expressAsyncHandler(categoryController.featuresCategories))

router.delete('/:categoryId',validationMiddleware(SdeleteCategory),auth(systemRoles.ADMIN),expressAsyncHandler(categoryController.deleteCategory))

export default router;