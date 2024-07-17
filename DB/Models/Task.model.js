import mongoose, { Schema, model } from "mongoose";

//============================== Create the Task schema ==============================//

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String },
    type: { type: String, enum: ['text', 'list'], required: true },
    listItems: [
      {
        type: String,
      },
    ],
    Status: { type: String, enum: ['Public', 'Private'], required: true },
    categoryId: {type: Schema.Types.ObjectId,ref: "Category",required: true},
    userId: { type:Schema.Types.ObjectId, ref: 'User', required: true }      
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.models.Task || model("Task", taskSchema);
