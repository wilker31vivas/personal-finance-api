import { CategoriesModel } from "../models/categories.js";
import { validateCategory } from "../schemas/categories.js";
import { getCategoryNames } from "../utils.js";

export class CategoriesController {
  static async getAll(req, res) {
    const categories = await CategoriesModel.getAll();
    return res.status(200).json(categories);
  }

  static async geyById(req, res) {
    const { id } = req.params;

    const categoriesById = await CategoriesModel.getById({ id });

    if (!categoriesById) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json(categoriesById);
  }

  static async create(req, res) {
    const input = req.body;
    const response = validateCategory(input);
    if (response.error) {
      return res
        .status(400)
        .json({ message: JSON.parse(response.error.message) });
    }

    const categoryNormalized = response.data.name.toLowerCase();
    const existingCategories = getCategoryNames();

    if (existingCategories.includes(categoryNormalized)) {
      return res.status(409).json({ message: "The category already exists" });
    }

    const newCategory = await CategoriesModel.create(response.data);
    return res.status(201).json(newCategory);
  }

  static async update(req, res) {
    const { id } = req.params;
    const response = validateCategory(req.body);

    if (response.error) {
      return res
        .status(400)
        .json({ message: JSON.parse(response.error.message) });
    }

    const updateCategory = await CategoriesModel.update(id, response.data);

    if (!updateCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    return res.status(200).json(updateCategory);
  }

  static async delete(req, res) {
    const { id } = req.params;
    const result = await CategoriesModel.delete(id);

    if (!result.isExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (result.isUsed) {
      return res.status(409).json({
        message:
          "Cannot delete category. It is currently in use by existing transactions",
      });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  }
}
