import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    category_id: { type: String, unique: true },
    category_name: String,

    department_id: String,
    department_name: String,

   
  },
  { timestamps: true }
);

export default mongoose.model("Category", CategorySchema);
