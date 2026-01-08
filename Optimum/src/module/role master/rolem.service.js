import Role from "./role.model.js";

class RoleService {
  static async getRolesByCategory(categoryId) {
    return await Role.find({
      category_id: categoryId,
    }).sort({ role_name: 1 });
  }

  static async createRole(data) {
    return await Role.create(data);
  }

    static async getAllRoles() {
    return await Role.find();
  }
}


export default RoleService;
