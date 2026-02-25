import { getTransactions, capitalizeFirstLetter } from "../utils.js";
const transactions = getTransactions();

export class TransactionsModel {
  static async getAll({ type, category, month, year }) {
    let filterTransaction = transactions;

    if (type) {
      const typeNormalized = type.toLowerCase();
      filterTransaction = filterTransaction.filter(
        (t) => t.type === typeNormalized,
      );
    }

    if (category) {
      const categoryNormalized = category.toLowerCase();
      filterTransaction = filterTransaction.filter(
        (t) => t.category.toLowerCase() === categoryNormalized,
      );
    }

    if (month) {
      const monthNormalized = Number(month);
      filterTransaction = filterTransaction.filter((t) => {
        const dateFilter = new Date(t.date);
        return dateFilter.getMonth() === monthNormalized - 1;
      });
    }

    if (year) {
      const yearNormalized = Number(year);
      filterTransaction = filterTransaction.filter((t) => {
        const dateYear = new Date(t.date);
        return dateYear.getFullYear() === yearNormalized;
      });
    }

    return filterTransaction.sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  }

  static async getById({ id }) {
    return transactions.find((t) => t.id === id);
  }

  static async update(id, input) {
    const transactionIndex = transactions.findIndex((t) => t.id === id);

    if (transactionIndex === -1) return false;

    const partialTransaction = {
      ...transactions[transactionIndex],
      ...input,
    };

    transactions[transactionIndex] = partialTransaction;

    return partialTransaction;
  }

  static async create(input) {
    const newTransaction = {
      id: crypto.randomUUID(),
      category: capitalizeFirstLetter(input.category),
      amount: input.amount,
      date: input.date || new Date().toISOString().split("T")[0],
      description: input.description,
      type: input.type,
    };

    transactions.push(newTransaction);

    return newTransaction;
  }

  static async updateCategory(oldCategory, newCategory) {
    const updatedTransactions = transactions.map((t) =>
      t.category === oldCategory ? { ...t, category: newCategory } : t,
    );

    transactions.splice(0, transactions.length, ...updatedTransactions);
    return updatedTransactions.filter((t) => t.category === newCategory).length;
  }

  static async delete({ id }) {
    const transactionIndex = transactions.findIndex((t) => t.id === id);

    if (transactionIndex === -1) return false;

    transactions.splice(transactionIndex, 1);

    return true;
  }
}
