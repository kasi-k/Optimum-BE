import DepartmentModel from "./department.model.js";
import logger from "../../config/logger.js";

class DepartmentService {
  static async addDepartment(data) {
    return await DepartmentModel.create(data);
  }

  static async getAll() {
    return await DepartmentModel.find();
  }
}

export default DepartmentService;
