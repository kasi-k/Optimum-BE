import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    department_id: { type: String, unique: true },
    department_name: { type: String, required: true },
    created_by_user: String,
  },
  { timestamps: true }
);

export default mongoose.model("Department", DepartmentSchema);
