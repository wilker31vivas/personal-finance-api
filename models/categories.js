import { getCategories } from "../utils.js";
const categories = getCategories();

export class CategoriesModel {
  static async getAll() {
    return categories;
  }

  static async getById({ id }) {
    return categories.find((c) => c.id === id);
  }

  static async create(input) {
    const newCategory = {
      id:
        categories.length > 0
          ? (Math.max(...categories.map((c) => c.id)) + 1).toString()
          : 1,
      ...input,
    };

    categories.push(newCategory);

    return newCategory;
  }
}
