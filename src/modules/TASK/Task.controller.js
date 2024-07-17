
import Task from "../../../DB/Models/Task.model.js"
import Category from '../../../DB/Models/category.model.js'
import { APIFeatures } from "../../utils/api-features.js";


//============================== add task ==============================//
export const addtask = async (req, res, next) => {
    //  destructuring the request body
    const { title, body, type, Status,listItems} = req.body
    const { categoryId } = req.params
    const { _id } = req.authUser

    //  check if the task name is already exist
    const isNameDuplicated = await Task.findOne({ title })
    if (isNameDuplicated) {
        return next({ cause: 409, message: 'task name is already exist' })
        // return next( new Error('Category name is already exist' , {cause:409}) )
    }
    if (type == 'text') {
        const taskCreated = await Task.create( {title,categoryId, body, type, Status,listItems:undefined,userId: _id})
        res.status(201).json({ success: true, message: 'task created successfully', data: taskCreated })

    } else if (type == 'list') {
        const taskCreated = await Task.create( {title,categoryId, body:undefined, type, Status,listItems,userId: _id})
        res.status(201).json({ success: true, message: 'task created successfully', data: taskCreated })
    }
 
    //  check if the category is exist by using categoryId
    const category = await Category.findById(categoryId)
    if (!category) return next({ cause: 404, message: 'Category not found' })
    if (!_id==(category.categoryId) ) {
        throw new Error('Category not found or unauthorized');
    } 


}

//=========================== Updatetask ====================/

export const Updatetask = async (req, res, next) => {
    //  destructuring the request body
    const { title, body, type, Status ,listItems} = req.body
    //  destructuring the request params 
    const { taskId,categoryId } = req.query
    //  destructuring _id from the request authUser
    const { _id } = req.authUser
    
    // check if the category is exist bu using task
    const category = await Category.findById(categoryId);
    if (!category) return next({cause: 400, message:"category not exist !"});
    
    // check if the task is exist bu using categoryId
    const checktask = await Task.findByIdAndUpdate(taskId,{body, type, Status,listItems}, 
    {new: true}
    )
    // check if the use want to update the name field
    if (title) {
        //  check if the new task name different from the old name
        if (title == checktask.title) {
            return next({ cause: 400, message: 'Please enter different task name from the existing one.' })
        }

        //  check if the new task name is already exist
        const isNameDuplicated = await Task.findOne({ title })
        if (isNameDuplicated) {
            return next({ cause: 409, message: 'task name is already exist' })
        }

        //  update the task name and the task slug
        checktask.title = title
    }
    if (type === 'text') {
        checktask.listItems = undefined;
    } else if (type === 'list') {
        checktask.body = undefined;

    }

  const Update_task= await checktask.save()
    res.status(200).json({ success: true, message: 'task updated successfully', data: Update_task })
}
//====================== delete task ======================//
export const deleteTask = async (req, res, next) => {
const { taskId } = req.query
// 2-delete the related Task
const task = await Task.findByIdAndDelete(taskId)
if (!task) return next({ status: 404, message: "Task not found" });

}

//=========================== Apply the API features in Task===========================
//To use the feature filter, use the key Status[regex], Value:[Public||Private]
export const featuresTask= async (req, res, next) => {
    const { page, size, sort, ...search } = req.query;

    const features = new APIFeatures(req.query, Task.find())
      .sort(sort)
      .pagination({ page, size })
      .search(search)
      .filters(search)
    const task = await features.mongooseQuery;
    res.status(200).json({ success: true, data: task });
};
//=========================== get one task===========================
export const getOneTask=async(req,res,next)=>{
    const {taskId}=req.query
    const task=await Task.findById(taskId)
    if(!task)return next({status:404,message:"Task not found"})
    
    res.status(200).json({success:true,data:task})

}  
