import express from "express";
import { createRole, getAllRoles, getRolesByCategory } from "./rolem.controller.js";


const masterroleRoute = express.Router();

masterroleRoute.get("/by-category/:categoryId", getRolesByCategory);
masterroleRoute.get("/getallroles", getAllRoles);
masterroleRoute.post("/create", createRole);

export default masterroleRoute;