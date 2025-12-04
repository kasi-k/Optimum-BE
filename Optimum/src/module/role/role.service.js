import RoleModel from "./role.model.js";
import logger from "../../config/logger.js";
import EmployeeModel from "../employee/employee.model.js";

class RoleService {
  static async addRole(userRole) {
    try {
      const newRoles = new RoleModel({
        ...userRole,
      });

      const role = await newRoles.save();
      return role;
    } catch (error) {
    logger.error("error while adding a role" + error);
      console.log("Error in creating Role");
    }
  }
  static async getRolesById(roleId) {
    try {
      return await RoleModel.findOne({ role_id: roleId });
    } catch (error) {
      console.log("Error in creating Role", error);
      logger.error("error while getting a role" + error);
    }
  }
  static async getAllRoles() {
    try {
      return await RoleModel.find();
    } catch (error) {
      logger.error("error while getting all roles" + error);
    }
  }
   static async getAllRolesActive() {
    try {
      return await RoleModel.find({status:'ACTIVE'});
    } catch (error) {
      logger.error("error while getting all active roles" + error);
    }
  }
  static async updateRole(role_id, updatedData) {
    try {
      return await RoleModel.findOneAndUpdate(
        { role_id: role_id },
        { $set: updatedData },
        { new: true }
      );
    } catch (error) {
      logger.error("error while updating a role" + error);
    }
  }
static async deleteRole(role_id) {
  try {
    // 1️⃣ Delete the role
    const deletedRole = await RoleModel.findOneAndDelete({ role_id });
    if (!deletedRole) {
      throw new Error("Role not found");
    }

    // 2️⃣ Unassign this role from all employees who had it
    await EmployeeModel.updateMany(
      { role_id },
      { $unset: { role_id: "", role_name: "" } }
    );

    return deletedRole;
  } catch (error) {
    logger.error("Error while deleting a role: " + error);
    throw error;
  }
}

}

export default RoleService;
