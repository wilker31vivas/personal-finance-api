import { getTransactions } from "../utils.js";
const transaction = getTransactions();

export class TransactionModel {
  static async getAll({ type, category, month, year }) {
    let filterTransaction = transaction;

    if (type) {
      const typeNormalized = type.toLowerCase();

      const filterByType = filterTransaction.filter(
        (t) => t.type === typeNormalized
      );

      filterTransaction = filterByType;
    }

    if (category) {
      const categoryNormalized = category.toLowerCase();

      const filterByCategory = filterTransaction.filter(
        (t) => t.category === categoryNormalized
      );

      filterTransaction = filterByCategory;
    }

    if (month) {
      const monthNormalized = Number(month);

      const filterByMonth = filterTransaction.filter((t) => {
        const dateFilter = new Date(t.date);
        return dateFilter.getMonth() === monthNormalized - 1;
      });

      filterTransaction = filterByMonth;
    }

    if (year) {
      const yearNormalized = Number(year);

      const filterByYear = filterTransaction.filter((t) => {
        const dateYear = new Date(t.date);
        return dateYear.getFullYear() === yearNormalized;
      });

      filterTransaction = filterByYear;
    }

    return filterTransaction;
  }

  static async getById({ id }) {
    return transaction.find((t) => t.id === id);
  }

  static async update(id, input) {
    const transactionIndex = transaction.findIndex((t) => t.id === id);

    if (transactionIndex === -1) return false;

    const partialTransaction = {
      ...transaction[transactionIndex],
      ...input,
    };

    transaction[transactionIndex] = partialTransaction;

    return partialTransaction;
  }

  static async create(input) {
    const newTransaction = {
      id: crypto.randomUUID(),
      ...input,
      date: new Date(),
    };

    transaction.push(newTransaction);

    return newTransaction;
  }

  static async delete({ id }) {
    const transactionIndex = transaction.findIndex((t) => t.id === id);

    if (transactionIndex === -1) return false;

    transaction.splice(transactionIndex, 1);

    return true;
  }
}
