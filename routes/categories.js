import { Router } from "express";
export const categoriesRouter = Router();
import {CategoriesController} from '../controllers/categories.js'

categoriesRouter.get('/', CategoriesController.getAll)
categoriesRouter.get('/:id', CategoriesController.geyById)
categoriesRouter.post('/', CategoriesController.create)


