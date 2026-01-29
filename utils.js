export const transactionType = ["expense", "income"];

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const transaction = require("./transaction.json");
const categories = require("./categories.json");

export function getCategoryNames() {
  return categories.map((item) => item.name.toLowerCase());
}

export function getCategories() {
  return categories;
}

export function getTransactions() {
  return transaction;
}

export function calculateBalance(expenses, incomes) {
  const expenseTotal = expenses.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    null,
  );
  const incomeTotal = incomes.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    null,
  );

  let totalBalance = incomeTotal && expenseTotal ?  incomeTotal - expenseTotal : null;

  return {
    expense: expenseTotal,
    income: incomeTotal,
    balance: totalBalance,
  };
}

export function splitType(arr) {
  const expenseType = arr.filter((t) => t.type === "expense");
  const incomeType = arr.filter((t) => t.type === "income");

  return { expenseType, incomeType };
}

export function calculateAmount(arr) {
  if (arr.length === 0) return 0;

  let expenseTotal = arr.map((item) => item.amount).reduce((a, b) => a + b);
  return expenseTotal;
}

export function getTopCategoriesByExpense(transactions) {
  const transactionByCategory = {};
  transactions.forEach((transation) => {
    const { amount, category } = transation;

    if (!transactionByCategory[category]) {
      transactionByCategory[category] = {
        transactions: [],
        total: 0,
      };
    }

    transactionByCategory[category].transactions.push(transation);
    transactionByCategory[category].total += amount;
  });

  const categories = Object.entries(transactionByCategory).map(
    ([name, data]) => {
      return {
        name,
        value: data.total,
      };
    },
  );

  return categories;
}
