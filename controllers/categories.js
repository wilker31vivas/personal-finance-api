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
}
