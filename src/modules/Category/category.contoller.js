// import slugify from 'slugify'
import Category from '../../../DB/Models/category.model.js'
import Task from '../../../DB/Models/Task.model.js'
import { APIFeatures } from "../../utils/api-features.js";

// import mongoose from 'mongoose'

//============================== add category ==============================//
export const addCategory = async (req, res, next) => {
    // - destructuring the request body
    const { name } = req.body
    const { _id } = req.authUser

    // - check if the category name is already exist
    const isNameDuplicated = await Category.findOne({ name })
    if (isNameDuplicated) return next({ cause: 409, message: 'Category name is already exist' })
    
    // // - generate the categroy object
    const category = {
        name,
        userId:_id
    }
    // 6- create the category
    const categoryCreated = await Category.create(category)
    req.savedDocuments = { model: Category, _id: categoryCreated._id }

    res.status(201).json({ success: true, message: 'Category created successfully', data: categoryCreated })
}


//================================ upadte category ================================//
export const updateCategory = async (req, res, next) => {
    // 1- destructuring the request body
    const { name} = req.body
    // 2- destructuring the request params 
    const { categoryId } = req.query

    // 4- check if the category is exist bu using categoryId
    const category = await Category.findById(categoryId)
    if (!category) return next({ cause: 404, message: 'Category not found' })

    // 5- check if the use want to update the name field
    if (name) {
        // 5.1 check if the new category name different from the old name
        if (name == category.name) {
            return next({ cause: 400, message: 'Please enter different category name from the existing one.' })
        }

        // 5.2 check if the new category name is already exist
        const isNameDuplicated = await Category.findOne({ name })
        if (isNameDuplicated) {
            return next({ cause: 409, message: 'Category name is already exist' })
        }

        // 5.3 update the category name and the category slug
        category.name = name
    }
    await category.save()

    res.status(200).json({ success: true, message: 'Category updated successfully', data: category })
}


//============================== get all categories ==============================//
export const getAllCategories = async (req, res, next) => {
    
    // nested populate
    const categories = await Category.find().populate(
        [
            {
                path: 'Task',
            }
        ]
    )
    // console.log(categories);
    res.status(200).json({ success: true, message: 'Categories fetched successfully', data: categories })
}
//============================== get all categories By id ==============================//
export const getCategoriesBYId = async (req, res, next) => {
    const { categoryId } = req.params
    const categories = await Category.findById(categoryId)
    res.status(200).json({ success: true, message: 'Categories fetched successfully', data: categories })
}

//====================== delete category ======================//
export const deleteCategory = async (req, res, next) => {
    const { categoryId } = req.params

    // 1- delete category
    const catgory = await Category.findByIdAndDelete(categoryId)
    if (!catgory) return next({ cause: 404, message: 'Category not found' })

    // 2-delete the related task
    const task = await Task.deleteMany({ categoryId })
    if (task.deletedCount <= 0) {
        console.log(task.deletedCount);
        console.log('There is no related task');
    }

    res.status(200).json({ success: true, message: 'Category deleted successfully' })
}
//=========================== Apply the API features in Categories===========================
//To use the feature filter, use the key name[regex], Value:[name]

export const featuresCategories = async (req, res, next) => {
    const { page, size, sort, ...search } = req.query;
    const features = new APIFeatures(req.query, Category.find())
    .pagination({ page, size })
    .sort(sort)
    .filters(search)
    const category = await features.mongooseQuery;
    res.status(200).json({ success: true, data: category });
};
  