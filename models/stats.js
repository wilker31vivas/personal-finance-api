import { TransactionModel } from "./transaction.js";
import {
  calculateBalance,
  splitType,
  calculateAmount,
  getTopCategoriesByExpense
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

    const response = getTopCategoriesByExpense(transactions)
    

    return {
      totalGeneral: response.totalGeneral,
      categories: response.categories,
    };
  }

  static async getSummaryMonthly() {
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();
    const previousMonth = currentMonth === 1 ? 12 - 1 : currentMonth - 1;
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

    function calculateChange(actual, anterior) {
      if (anterior === 0) {
        return null;
      }
      const porcentaje = ((actual - anterior) / anterior) * 100;
      return porcentaje;
    }

    const transactionsAmount = {
      current: {
        income: calculateAmount(transactionsIncomeCurrent),
        expense: calculateAmount(transactionsExpenseCurrent),
      },
      previous: {
        income: calculateAmount(transactionsIncomePrevious),
        expense: calculateAmount(transactionsExpensePrevious),
      },
    };

    const change = {
      income: calculateChange(
        transactionsAmount.current.income,
        transactionsAmount.previous.income
      ),
      expense: calculateChange(
        transactionsAmount.current.expense,
        transactionsAmount.previous.expense
      ),
    };

    return {
      transactionsAmount,
      change,
    };
  }

  static async getTopCategories(){
    const transactions = await TransactionModel.getAll({
      type: "expense",
    });

    if (transactions.length === 0) {
      return { total: 0, categories: [] };
    }

    const response = getTopCategoriesByExpense(transactions)

    const sortCategories = response.categories.sort((a,b) => b.total- a.total).slice(0, 5)

    return {
      topCategories: sortCategories
    }
  }
}
