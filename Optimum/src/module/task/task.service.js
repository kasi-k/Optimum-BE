
import TaskModel from "./task.model.js";

class TaskService {
  static async createTask(taskData) {
  const attachments = (taskData.files || []).map((file) => ({
      fileName: file.originalname,
      filePath: `/uploads/${file.filename}`,
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

//   static async updateAppointment(token_id, updateData) {
//     return await AppointmentModel.findOneAndUpdate(
//       { token_id },
//       { $set: updateData },
//       { new: true }
//     );
//   }
}

export default TaskService;
