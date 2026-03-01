import { getCategories } from "../utils.js";
const categories = getCategories();
import { TransactionsModel } from "../models/transaction.js";
import { capitalizeFirstLetter } from "../utils.js";
import { getTransactions } from "../utils.js";
const transactions = getTransactions();

export class CategoriesModel {
  static async getAll() {
    return categories;
  }

  static async getById({ id }) {
    return categories.find((c) => c.id === id);
  }

  static async create(input) {
    const newCategory = {
      id: crypto.randomUUID(),
      name: capitalizeFirstLetter(input.name),
    };

    const exists = categories.some(
      (c) => c.name.toLowerCase() === input.name.trim().toLowerCase(),
    );
    if (exists) return null;

    categories.push(newCategory);

    return newCategory;
  }

  static async update(id, input) {
    const categoryIndex = categories.findIndex((c) => c.id === id);
    if (categoryIndex === -1) return false;

    const oldCategoryName = categories[categoryIndex].name;

    const partialCategory = {
      ...categories[categoryIndex],
      ...input,
    };

    categories[categoryIndex] = partialCategory;

    if (oldCategoryName !== input.name) {
      await TransactionsModel.updateCategory(oldCategoryName, input.name);
    }

    return partialCategory;
  }

  static async delete(id) {
    const categoryIndex = categories.findIndex((c) => c.id === id);
    if (categoryIndex === -1) return { isExists: false, isUsed: false };

    const isUsed = transactions.some(
      (t) =>
        t.category.toLowerCase() ===
        categories[categoryIndex].name.toLowerCase(),
    );
    if (isUsed) return { isExists: true, isUsed: true };

    categories.splice(categoryIndex, 1);

    return { isExists: true, isUsed: false };
  }
}
