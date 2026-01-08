import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    role_name: {
      type: String,
      required: true,
      trim: true,
    },
},
  { timestamps: true }
);

// Prevent duplicate role under same category
roleSchema.index(
  { role_name: 1, category_id: 1 },
  { unique: true }
);

export default mongoose.model("RoleMaster", roleSchema);
