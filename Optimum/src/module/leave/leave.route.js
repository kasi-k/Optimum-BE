import { Router } from "express";
import {
  applyLeave,
  getLeavesByEmployee,
  getLeavesByReportingPerson,
  respondLeave,
} from "./leave.controller.js";

const LeaveRoute = Router();

LeaveRoute.post("/apply", applyLeave);
LeaveRoute.patch("/respond/:id", respondLeave);
LeaveRoute.get("/reporting/:reportingPerson", getLeavesByReportingPerson);
LeaveRoute.get("/:employee_id", getLeavesByEmployee);

export default LeaveRoute;
