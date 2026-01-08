import IdcodeServices from "../idcode/idcode.service.js";
import DepartmentService from "./department.service.js";
import logger from "../../config/logger.js";

export const createDepartment = async (req, res) => {
  try {
    const idname = "Department";
    const idcode = "DEP";

    await IdcodeServices.addIdCode(idname, idcode);
    const department_id = await IdcodeServices.generateCode(idname);

    const result = await DepartmentService.addDepartment({
      department_id,
      department_name: req.body.department_name,
      created_by_user: req.body.created_by_user,
    });

    res.status(200).json({ status: true, data: result });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ status: false, message: err.message });
  }
};

export const getAllDepartments = async (req, res) => {
  const data = await DepartmentService.getAll();
  res.status(200).json({  data });
};
