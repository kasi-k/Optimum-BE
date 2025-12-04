import {Router} from "express";
import { applyWFH, respondWFH, getWFHForEmployee, getWFHForReportingPerson } from "./wfh.controller.js";

const WFHRoute = Router();

WFHRoute.post("/apply", applyWFH); // employee applies
WFHRoute.patch("/respond/:id", respondWFH); // reporting person approves/declines
WFHRoute.get("/:employeeId", getWFHForEmployee);
WFHRoute.get("/reporting/:reportingPersonId", getWFHForReportingPerson);

export default WFHRoute;
