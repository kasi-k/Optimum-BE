import TaskModel from "./task.model.js";
import EmployeeModel from "../employee/employee.model.js";

class TaskService {
  // Create a task
  static async createTask(taskData) {
    const attachments = (taskData.files || []).map((file) => ({
      fileName: file.originalname,
      filePath: file.location, // multer-s3 provides `location` property
    }));

    let assignedUsers = taskData.assigned_to;
    if (typeof assignedUsers === "string")
      assignedUsers = assignedUsers.split(",");
    if (!Array.isArray(assignedUsers)) assignedUsers = [assignedUsers];

    const { files, ...rest } = taskData;
    const task = new TaskModel({
      ...rest,
      attachments,
      assigned_to: assignedUsers,
    });

    return await task.save();
  }

  // Update task status
  static async updateTaskStatus(id, status) {
    return await TaskModel.findByIdAndUpdate(id, { status }, { new: true });
  }

  // Get all tasks (for Admin)
  static async getAllTasks() {
    const tasks = await TaskModel.find();

    // Map employee IDs to names
    const empIds = tasks.flatMap((t) => t.assigned_to);
    const employees = await EmployeeModel.find({
      employee_id: { $in: empIds },
    });
    const empMap = {};
    employees.forEach((emp) => {
      empMap[emp.employee_id] = emp.name;
    });

    return tasks.map((task) => ({
      ...task.toObject(),
      assigned_to_name: task.assigned_to
        .map((id) => empMap[id] || id)
        .join(", "),
    }));
  }

  // Get tasks for a specific employee
  static async getTasksByEmployee(employee_id) {
    const tasks = await TaskModel.find({ assigned_to: employee_id });

    // Map employee IDs to names
    const empIds = tasks.flatMap((t) => t.assigned_to);
    const employees = await EmployeeModel.find({
      employee_id: { $in: empIds },
    });
    const empMap = {};
    employees.forEach((emp) => {
      empMap[emp.employee_id] = emp.name;
    });

    return tasks.map((task) => ({
      ...task.toObject(),
      assigned_to_name: task.assigned_to
        .map((id) => empMap[id] || id)
        .join(", "),
    }));
  }



  // Update task
  static async updateTask(_id, updateData) {
    if (updateData.assigned_to && typeof updateData.assigned_to === "string") {
      updateData.assigned_to = updateData.assigned_to.split(",");
    }
    return await TaskModel.findOneAndUpdate(
      { _id },
      { $set: updateData },
      { new: true }
    );
  }

  // Delete task
  static async deletetask(id) {
    const task = await TaskModel.findById(id);
    if (!task) throw new Error("Task not found");
    await TaskModel.findByIdAndDelete(id);
    return { message: "Task deleted successfully" };
  }
}

export default TaskService;
