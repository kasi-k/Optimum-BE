import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    time: { type: String, required: true },
    commented_by: { type: String, required: true },
    commments: { type: String, required: true },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    task_title: { type: String, unique: true },
    start_date: { type: String, required: true },
    due_date: { type: String, required: true },
    assigned_to: { type: String },
    attachments: [
      {
        fileName: String,
        filePath: String,
      },
    ],
    note: { type: String },
    status: {
      type: String,
      enum: ["doing", "completed", "incomplete"],
      default: "doing",
    },

    comment: [CommentSchema],
  },

  { timestamps: true }
);

const TaskModel = mongoose.model("Tasks", taskSchema);

export default TaskModel;
