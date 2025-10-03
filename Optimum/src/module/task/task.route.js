import { Router } from "express";
import { createTask, getAllTasks, updateTask, updateTaskStatus } from "./task.controller.js";
import { upload } from "../../config/multer.js";

const taskRoute = Router();

taskRoute.post("/add", upload.array("files"), createTask);
taskRoute.patch("/updatetask/:id/status", updateTaskStatus);


taskRoute.get("/getalltasks", getAllTasks);

taskRoute.put("/updatetasks/:_id", updateTask);

export default taskRoute;