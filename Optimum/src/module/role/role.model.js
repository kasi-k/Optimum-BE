import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    role_id: { type: String, unique: true },
    role_name: { type: String, required: true },

    department_id: { type: String, required: true },
    department_name: { type: String, required: true },

    category_id: { type: String, required: true },
    category_name: { type: String, required: true },

    accessLevels: [
      {
        feature: String,
        permissions: [String],
      },
    ],

    status: { type: String, default: "ACTIVE" },
    created_by_user: String,
  },
  { timestamps: true }
);

export default mongoose.model("roles", RoleSchema);
