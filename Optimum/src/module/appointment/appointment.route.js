import { Router } from "express";
import { createAppointment, getAllAppointments, updateAppointment } from "./appointment.controller.js";

const appointmentRoute = Router();

appointmentRoute.post("/add", createAppointment);

appointmentRoute.get("/getallappointments", getAllAppointments);

appointmentRoute.put("/updateappointment/:token_id", updateAppointment);

export default appointmentRoute;