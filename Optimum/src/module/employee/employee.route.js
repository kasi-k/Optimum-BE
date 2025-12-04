import { Router } from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  getEmployeesPaginated,
  markAttendance,
  updateAttendance,
  getAttendance,
  loginEmployee,
  changePasswordController,
  removeEmployeeRole,
} from "./employee.controller.js";

const employeeRoute = Router();

// Create
employeeRoute.post("/add", createEmployee);
employeeRoute.post("/login", loginEmployee);
employeeRoute.put("/changepassword", changePasswordController);

// Read
employeeRoute.get("/getallemployees", getAllEmployees);
employeeRoute.get("/getemployee/:employee_id", getEmployeeById);
// employeeRoute.get("/getactiveemployees", getActiveEmployees);

employeeRoute.get("/searchemployees", searchEmployees);

// Update
employeeRoute.put("/updateemployee/:employee_id", updateEmployee);

// Delete
employeeRoute.put("/removeuser/:employee_id", removeEmployeeRole);
employeeRoute.delete("/deleteemployee/:employee_id", deleteEmployee);

// Paginated, Search, Date filtered
employeeRoute.get("/getemployees", getEmployeesPaginated);

employeeRoute.post("/markattendance/:employee_id", markAttendance);
employeeRoute.put("/updateattendance/:employee_id", updateAttendance);
employeeRoute.get("/getattendance", getAttendance);

export default employeeRoute;
