import { getCategories, getTransactions, capitalizeFirstLetter } from "../utils.js";
const categories = getCategories();
const transaction = getTransactions();


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
      name: capitalizeFirstLetter(input.name),
    };

    categories.push(newCategory);

    return newCategory;
  }

  static async update(id, input) {
    const categoryIndex = categories.findIndex((c) => c.id === id);

    if (categoryIndex === -1) return false;

    const partialCategory = {
      ...categories[categoryIndex],
      ...input,
    };

    categories[categoryIndex] = partialCategory;

    return partialCategory;
  }

  static async delete(id) {
    const categoryIndex = categories.findIndex((c) => c.id === id);
    if (categoryIndex === -1) return {isExists: false, isUsed: false};
    
    const isUsed = transaction.some((t) => t.category.toLowerCase() === categories[categoryIndex].name.toLowerCase())
    if (isUsed) return {isExists: true, isUsed: true};

    categories.splice(categoryIndex, 1);

    return {isExists: true, isUsed: false };
  }
}
