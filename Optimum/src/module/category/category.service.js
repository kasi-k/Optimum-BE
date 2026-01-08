import CategoryModel from "./category.model.js";
import logger from "../../config/logger.js";

class CategoryService {
  // ➕ Add Category
  static async addCategory(categoryData) {
    try {
      const category = new CategoryModel({
        ...categoryData,
      });

      return await category.save();
    } catch (error) {
      logger.error("Error while adding category: " + error);
      throw error;
    }
  }

  // 📄 Get Category by ID
  static async getCategoryById(categoryId) {
    try {
      return await CategoryModel.findOne({ category_id: categoryId });
    } catch (error) {
      logger.error("Error while getting category by id: " + error);
      throw error;
    }
  }

  // 📄 Get All Categories
  static async getAllCategories() {
    try {
      return await CategoryModel.find().populate(
        "department_id",
        "department_name"
      );
    } catch (error) {
      logger.error("Error while getting all categories: " + error);
      throw error;
    }
  }

  // 📄 Get Active Categories
  static async getAllActiveCategories() {
    try {
      return await CategoryModel.find();
    } catch (error) {
      logger.error("Error while getting active categories: " + error);
      throw error;
    }
  }

  // 📄 Get Categories by Department
  static async getCategoriesByDepartment(department_id) {
    try {
      return await CategoryModel.find({
        department_id,
      });
    } catch (error) {
      logger.error("Error while getting categories by department: " + error);
      throw error;
    }
  }

  // ✏️ Update Category
  static async updateCategory(category_id, updatedData) {
    try {
      return await CategoryModel.findOneAndUpdate(
        { category_id },
        { $set: updatedData },
        { new: true }
      );
    } catch (error) {
      logger.error("Error while updating category: " + error);
      throw error;
    }
  }

  // ❌ Delete Category
  static async deleteCategory(category_id) {
    try {
      return await CategoryModel.findOneAndDelete({ category_id });
    } catch (error) {
      logger.error("Error while deleting category: " + error);
      throw error;
    }
  }
}

export default CategoryService;
