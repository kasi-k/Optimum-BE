
import TaskService from "./task.service.js";
export const createTask = async (req, res) => {
  try {
    const files = req.files || [];
    const data = { ...req.body, files };
    const task = await TaskService.createTask(data);
    res.status(201).json({ status: true, message: "Task created", data: task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
};
// export const addComments = async (req, res) => {
//   try {
//     const data = await TaskService.addComments(req.params._id,req.body);
//     res.status(201).json({ status: true, message: "Comment created", data });
//   } catch (err) {
//     res.status(500).json({ status: false, message: err.message });
//   }
// };

// task.controller.js
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "completed" or "doing"

    const updatedTask = await TaskService.updateTaskStatus(id, status);
    if (!updatedTask) {
      return res.status(404).json({ status: false, message: "Task not found" });
    }

    res.status(200).json({ status: true, message: "Task status updated", data: updatedTask });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const { role_name, employee_id } = req.query; // coming from frontend query params

    let data;

    if (role_name === "admin") {
      // 👨‍💼 Admin sees all tasks
      data = await TaskService.getAllTasks();
    } else {
      // 👷 Employee sees only tasks assigned to them
      data = await TaskService.getTasksByEmployee(employee_id);
    }

    res.status(200).json({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};




export const updateTask = async (req, res) => {
  try {
    const data = await TaskService.updateTask(req.params._id, req.body);
    if (!data) return res.status(404).json({ status: false, message: "Task not found" });
    res.status(200).json({ status: true, message: "Task updated", data });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const deletetask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TaskService.deletetask(id);
    res.status(200).json(result);
  } catch (err) {
    console.error("Delete task error:", err);
    res
      .status(400)
      .json({ message: err.message || "Failed to delete task" });
  }
};