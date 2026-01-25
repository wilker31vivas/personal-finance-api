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
      return [];
    }

    const response = getTopCategoriesByExpense(transactions);

    return response;
  }

  static async getSummaryMonthly({ month, year }) {
    const date = new Date();
    const currentMonth = month ? month : date.getMonth() + 1;
    const currentYear = year ? year : date.getFullYear();
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
        transactionsIncomeCurrent,
      ),
      previous:
        transactionsIncomePrevious.length > 0 &&
        transactionsExpensePrevious.length > 0
          ? calculateBalance(
              transactionsExpensePrevious,
              transactionsIncomePrevious,
            )
          : [],
    };

    const change = {
      income:
        transactionsIncomePrevious.length > 0
          ? calculateChange(
              transactionsAmount.current.income,
              transactionsAmount.previous.income,
            )
          : null,
      expense:
        transactionsExpensePrevious.length > 0
          ? calculateChange(
              transactionsAmount.current.expense,
              transactionsAmount.previous.expense,
            )
          : null,
      balance:
        transactionsIncomePrevious.length > 0
          ? calculateChange(
              transactionsAmount.current.balance,
              transactionsAmount.previous.balance,
            )
          : null,
    };

    return {
      transactionsAmount,
      change,
    };
  }

  static async getTopCategories({ month, year }) {
    const transactions = await TransactionModel.getAll({
      type: "expense",
      category: null,
      month: month,
      year: year,
    });

    if (transactions.length === 0) {
      return [];
    }

    const response = getTopCategoriesByExpense(transactions) || [];

    return response.sort((a, b) => b.value - a.value).slice(0, 5);
  }
}
