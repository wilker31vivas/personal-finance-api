import { TransactionModel } from "./transaction.js";
import {
  calculateBalance,
  splitType,
  getTopCategoriesByExpense,
} from "../utils.js";

export class StatsModel {
  static async getBalance({ month, year }) {
    const transactions = await TransactionModel.getAll({
      type: null,
      category: null,
      month: month,
      year: year,
    });

    if (transactions.length == 0) return 0;

    if (transactions.length == 1) {
      const t = transactions[0];
      return t.type === "expense" ? -t.amount : t.amount;
    }

    const { expenseType, incomeType } = splitType(transactions);

    const totalBalance = calculateBalance(expenseType, incomeType);

    return totalBalance;
  }

  static async getByCategory({ month, year }) {
    const transactions = await TransactionModel.getAll({
      type: "expense",
      category: null,
      month: month,
      year: year,
    });

    if (transactions.length === 0) {
      return { total: 0, categories: [] };
    }

    const response = getTopCategoriesByExpense(transactions);

    return {
      totalGeneral: response.totalGeneral,
      categories: response.categories,
    };
  }

  static async getSummaryMonthly() {
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const transactionsExpenseCurrent = await TransactionModel.getAll({
      type: "expense",
      category: null,
      month: currentMonth,
      year: currentYear,
    });

    const transactionsIncomeCurrent = await TransactionModel.getAll({
      type: "income",
      category: null,
      month: currentMonth,
      year: currentYear,
    });

    const transactionsExpensePrevious = await TransactionModel.getAll({
      type: "expense",
      category: null,
      month: previousMonth,
      year: previousYear,
    });

    const transactionsIncomePrevious = await TransactionModel.getAll({
      type: "income",
      category: null,
      month: previousMonth,
      year: previousYear,
    });

    function calculateChange(current, previous) {
      if (previous === 0) return null;
      return Number((((current - previous) / previous) * 100).toFixed(2));
    }

    const transactionsAmount = {
      current: calculateBalance(
        transactionsExpenseCurrent,
        transactionsIncomeCurrent
      ),
      previous: calculateBalance(
        transactionsExpensePrevious,
        transactionsIncomePrevious
      ),
    };

    const change = {
      income:
        transactionsIncomePrevious.length > 0
          ? calculateChange(
              transactionsAmount.current.income,
              transactionsAmount.previous.income
            )
          : null,
      expense:
        transactionsExpensePrevious.length > 0
          ? calculateChange(
              transactionsAmount.current.expense,
              transactionsAmount.previous.expense
            )
          : null,
    };

    return {
      transactionsAmount,
      change,
    };
  }

  static async getTopCategories() {
    const transactions = await TransactionModel.getAll({
      type: "expense",
    });

    if (transactions.length === 0) {
      return { total: 0, categories: [] };
    }

    const response = getTopCategoriesByExpense(transactions);

    const sortCategories = response.categories
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      topCategories: sortCategories,
    };
  }
}
