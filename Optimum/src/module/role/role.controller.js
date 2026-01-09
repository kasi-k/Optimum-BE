import logger from "../../config/logger.js";
import IdcodeServices from "../idcode/idcode.service.js";
import RoleService from "./role.service.js";

// Create Role
export const createRole = async (req, res) => {
  try {
    const {
      role_id,
      role_name,
      department_id,
      department_name,
      category_id,
      category_name,
      accessLevels,
      created_by_user,
      status,
    } = req.body;



    const roleData = {
      role_id,
      role_name,
      department_id,
      department_name,
      category_id,
      category_name,
      accessLevels,
      status: status || "ACTIVE",
      created_by_user,
    };

    const result = await RoleService.addRole(roleData);

    res.status(200).json({
      status: true,
      message: "Role created successfully",
      data: result,
    });
  } catch (error) {
    logger.error("Error creating role: " + error.message);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// Get Role by ID
export const getRoleById = async (req, res) => {
  const { roleId } = req.query;
  try {
    const role = await RoleService.getRolesById(roleId);
    res.status(200).json({
      status: true,
      message: "Role fetched successfully",
      data: role,
    });
  } catch (error) {
    logger.error(`Error while getting the role: ${error.message}`);
    res.status(500).json({ message: "Error while getting the Role by ID" + error });
  }
};

// Get all roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleService.getAllRoles();
    res.status(200).json({
      status: true,
      data: roles,
    });
  } catch (error) {
    logger.error("Error fetching roles: " + error);
    res.status(500).json({ message: "Error fetching roles" });
  }
};

// Get roles by department & category
export const getRolesByDeptCat = async (req, res) => {
  const { department_id, category_id } = req.query;
  try {
    const roles = await RoleService.getRolesByDeptCat(department_id, category_id);
    res.status(200).json({
      status: true,
      data: roles,
    });
  } catch (error) {
    logger.error("Error fetching roles by dept & category: " + error);
    res.status(500).json({ message: "Error fetching roles" });
  }
};

// Update role
export const updateRoleById = async (req, res) => {
  const { roleId } = req.query;
  try {
    const updated = await RoleService.updateRole(roleId, req.body);
    res.status(200).json({
      status: true,
      message: "Role updated successfully",
      data: updated,
    });
  } catch (error) {
    logger.error(`Error updating role: ${error.message}`);
    res.status(500).json({ message: "Error updating role" + error });
  }
};

// Delete role
export const deleteRoleById = async (req, res) => {
  const { roleId } = req.query;
  try {
    const deleted = await RoleService.deleteRole(roleId);
    res.status(200).json({
      status: true,
      message: "Role deleted successfully",
      data: deleted,
    });
  } catch (error) {
    logger.error(`Error deleting role: ${error.message}`);
    res.status(500).json({ message: "Error deleting role" + error });
  }
};
