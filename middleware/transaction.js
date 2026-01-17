import { number } from "zod";
import {
  getCategoryNames,
  transactionType,
  getTransactions,
} from "../utils.js";
const transaction = getTransactions();
const categoryNames = getCategoryNames()


export function validateType(req, res, next) {
  const { type } = req.query;

  if (type) {
    const typeNormalized = type.toLowerCase();

    if (!transactionType.includes(typeNormalized)) {
      return res.status(404).json({ message: "Type not found" });
    }
  }
  next();
}

export function validateCategory(req, res, next) {
  const { category } = req.query;

  if (category) {
    const categoryNormalized = category.toLowerCase();

    if (!categoryNames.includes(categoryNormalized)) {
      return res.status(404).json({ message: "Category not found" });
    }
  }
  next();
}

export function vaildateMonth(req, res, next) {
  const { month } = req.query;

  if (month) {
    const monthNormalized = Number(month);

    if (isNaN(monthNormalized)) {
      return res.status(400).json({ message: "The month must be a number" });
    }

    if (monthNormalized > 12 || monthNormalized < 1) {
      return res.status(404).json({ message: "Invalid month. Range: 1–12" });
    }
  }
  next();
}

export function validateYear(req, res, next) {
  const { year } = req.query;

  if (year) {
    const yearNormalized = Number(year);

    if (isNaN(yearNormalized)) {
      return res.status(400).json({ message: "The year must be a number" });
    }

    const years = transaction.map((item) => {
      const dateFilter = new Date(item.date);
      return dateFilter.getFullYear();
    });

    const yearMin = Math.min(...years);
    const yearMax = Math.max(...years);

    if (yearNormalized > yearMax || yearNormalized < yearMin) {
      return res
        .status(400)
        .json({
          message: `Invalid year. Available range: ${yearMin}–${yearMax}`
        });
    }
  }

  next();
}
