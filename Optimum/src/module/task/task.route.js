import { Router } from "express";
import { createTask, getAllTasks, updateTaskStatus } from "./task.controller.js";
import { upload } from "../../config/multer.js";

const taskRoute = Router();

taskRoute.post("/add", upload.array("attachments"), createTask);
taskRoute.patch("/updatetask/:id/status", updateTaskStatus);


taskRoute.get("/getalltasks", getAllTasks);

// appointmentRoute.put("/updateappointment/:token_id", updateAppointment);

export default taskRoute;