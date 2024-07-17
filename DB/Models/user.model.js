import mongoose, { Schema, model } from "mongoose";
import { systemRoles } from "../../src/utils/system-roles.js";

const userSchema = new Schema(
  {
    username: {type: String,required: true},
    email: {type: String,required: true,unique: true},
    password: {type: String,required: true},
    role: {type: String,enum: Object.values(systemRoles),default: systemRoles.USER},
  },
  { timestamps: true }
);

export default mongoose.models.User || model("User", userSchema);
