import RoleService from "./rolem.service.js";

export const getRolesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!categoryId) {
      return res.status(400).json({
        status: false,
        message: "Category ID is required",
      });
    }

    const roles = await RoleService.getRolesByCategory(categoryId);

    res.status(200).json({
      status: true,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const createRole = async (req, res) => {
  try {
    const { department_id, category_id, role_name } = req.body;

    if (!department_id || !category_id || !role_name) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      });
    }

    const role = await RoleService.createRole({
      department_id,
      category_id,
      role_name,
    });

    res.status(201).json({
      status: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};


export const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleService.getAllRoles(); // Make sure this exists in RoleService

    res.status(200).json({
      status: true,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};