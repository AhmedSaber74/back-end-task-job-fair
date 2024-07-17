import mongoose, { Schema, model } from "mongoose";
//============================== create the category schema ==============================//
const categorySchema = new Schema(
{
    name: { type: String, required: true, unique: true, trim: true },
    userId: { type:Schema.Types.ObjectId, ref: 'User', required: true }      
}, 
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

// virtual populate for Task model
categorySchema.virtual('Task', {
    ref: 'Task',
    foreignField: 'categoryId',
    localField: '_id',
    // justOne: true
})

export default mongoose.models.Category || model('Category', categorySchema)

