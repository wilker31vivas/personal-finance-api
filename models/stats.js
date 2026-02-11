import { TransactionModel } from "./transaction.js";
import {
  calculateBalance,
  splitType,
  getTopCategoriesByExpense,
} from "../utils.js";

export class StatsModel {
  static async getBalance({ month, year }) {
    const transactions = await TransactionModel.getAll({
      month,
      year,
    });

    if (transactions.length == 0) return null;

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
    const hasMonth = !!month;
    const hasYear = !!year;

    function calculateChange(current, previous) {
      if (previous === 0 && current === 0) return null;
      if (previous === 0) return null;
      return Number((((current - previous) / previous) * 100).toFixed(2));
    }

    if (hasMonth && hasYear) {
      const date = new Date();
      const currentMonth = month ? Number(month) : date.getMonth() + 1;
      const currentYear = year ? Number(year) : date.getFullYear();
      const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
      const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

      const [
        transactionsExpenseCurrent,
        transactionsIncomeCurrent,
        transactionsExpensePrevious,
        transactionsIncomePrevious,
      ] = await Promise.all([
        TransactionModel.getAll({
          type: "expense",
          category: null,
          month: currentMonth,
          year: currentYear,
        }),
        TransactionModel.getAll({
          type: "income",
          category: null,
          month: currentMonth,
          year: currentYear,
        }),
        TransactionModel.getAll({
          type: "expense",
          category: null,
          month: previousMonth,
          year: previousYear,
        }),
        TransactionModel.getAll({
          type: "income",
          category: null,
          month: previousMonth,
          year: previousYear,
        }),
      ]);

      const transactionsAmount = {
        current: calculateBalance(
          transactionsExpenseCurrent,
          transactionsIncomeCurrent,
        ),
        previous: calculateBalance(
          transactionsExpensePrevious,
          transactionsIncomePrevious,
        ),
      };

      const change = {
        expense: transactionsAmount.previous
          ? calculateChange(
              transactionsAmount.current.expense,
              transactionsAmount.previous.expense,
            )
          : null,
        income: transactionsAmount.previous
          ? calculateChange(
              transactionsAmount.current.income,
              transactionsAmount.previous.income,
            )
          : null,
        balance: transactionsAmount.previous
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

    const filters = {
      month: hasMonth ? Number(month) : null,
      year: hasYear ? Number(year) : null,
    };

    const [expenses, incomes] = await Promise.all([
      TransactionModel.getAll({ type: "expense", ...filters }),
      TransactionModel.getAll({ type: "income", ...filters }),
    ]);

    const current = calculateBalance(expenses, incomes);

    return {
      transactionsAmount: {
        current,
        previous: { income: null, expense: null, balance: null },
      },
      change: { income: null, expense: null, balance: null },
    };
  }

  static async getTopCategories({ month, year }) {
    const transactions = await TransactionModel.getAll({
      type: "expense",
      month,
      year,
    });

    if (transactions.length === 0) {
      return [];
    }

    const response = getTopCategoriesByExpense(transactions) || [];

    return response.sort((a, b) => b.value - a.value).slice(0, 5);
  }
}
