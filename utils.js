export const transactionType = ["expense", "income"];

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const transaction = require("./transaction.json");
const categories = require('./categories.json')

export function getCategoryNames(){
  return categories.map((item) => item.name.toLowerCase())
}

export function getCategories(){
  return categories
}

export function getTransactions() {
  return transaction;
}

export function calculateBalance(arr1, arr2) {
  let expenseTotal = arr1.length > 0 ? arr1.map((item) => item.amount).reduce((a, b) => a + b) : null;
  let incomeTotal = arr2.length > 0 ? arr2.map((item) => item.amount).reduce((a, b) => a + b) : null;
  let totalBalance = incomeTotal - expenseTotal;
  return  {
    expense: expenseTotal,
    income: incomeTotal,
    balance: totalBalance
    };
}

export function splitType(arr) {
  const expenseType = arr.filter((t) => t.type === "expense");
  const incomeType = arr.filter((t) => t.type === "income");

  return { expenseType, incomeType };
}

export function calculateAmount(arr) {
  if (arr.length === 0) return 0

  let expenseTotal = arr.map((item) => item.amount).reduce((a, b) => a + b);
  return expenseTotal;
}

export function getTopCategoriesByExpense(transactions){
  const transactionByCategory = {};
    let totalGeneral = 0;

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

      totalGeneral += amount;
    });

    const categories = Object.entries(transactionByCategory).map(
      ([name, data]) => {
        return {
          name,
          total: data.total,
          percentage: Number(((data.total / totalGeneral) * 100).toFixed(2)),
        };
      }
    );

    return {
      categories,
      totalGeneral,
    }
}
