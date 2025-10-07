
import TaskModel from "./task.model.js";

class TaskService {
  static async createTask(taskData) {
  const attachments = (taskData.files || []).map((file) => ({
    fileName: file.originalname,
    filePath: file.location, // multer-s3 provides `location` property
  }));

  const { files, ...rest } = taskData;
  const task = new TaskModel({
    ...rest,
    attachments,
  });

  return await task.save();
}



static async updateTaskStatus(id, status) {
  return await TaskModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
}



  static async getAllTasks() {
    return await TaskModel.find();
  }

  static async updateTask(_id, updateData) {
    return await TaskModel.findOneAndUpdate(
      { _id },
      { $set: updateData },
      { new: true }
    );
  }
}

export default TaskService;
