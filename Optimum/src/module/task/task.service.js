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
  // static async addComments(_id,data) {
  //   const comments = new TaskModel({
  //     ...data,
  //   });
  //   return await comments.save();
  // }
  static async updateTaskStatus(id, status) {
    return await TaskModel.findByIdAndUpdate(id, { status }, { new: true });
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
    static async deletetask(id) {
    const task = await TaskModel.findById(id);
    if (!task) {
      throw new Error("Task not found");
    }
    await TaskModel.findByIdAndDelete(id);
    return { message: "Task deleted successfully" };
  }
}

export default TaskService;
