import { Router } from "express";
import { createDepartment, getAllDepartments } from "./department.controller.js";


const departmentRoute = Router();

departmentRoute.post("/department/add", createDepartment);
departmentRoute.get("/department", getAllDepartments);



export default departmentRoute;