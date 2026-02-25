import { TransactionsModel } from "../models/transaction.js";
import {
  validateTransactionPartial,
  validateTransaction,
} from "../schemas/transaction.js";

export class TransactionController {
  static async getAll(req, res) {
    const { type, category, month, year } = req.query;
    const response = await TransactionsModel.getAll({type, category, month, year});
    return res.status(200).json(response);
  }

  static async getById(req, res) {
    const { id } = req.params;

    const transactionById = await TransactionsModel.getById({ id });

    if (!transactionById) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    return res.status(200).json(transactionById);
  }

  static async update(req, res) {
    const { id } = req.params;
    const response = validateTransactionPartial(req.body);

    if (response.error) {
      return res
        .status(400)
        .json({ message: JSON.parse(response.error.message) });
    }

    const updateTransaction = await TransactionsModel.update(id, response.data);

    if (!updateTransaction) {
      return res.status(404).json({ message: "transaction not found" });
    }

    return res.status(200).json(updateTransaction);
  }

  static async create(req, res) {
    const response = validateTransaction(req.body);
    if (response.error) {
      return res.status(400).json({ message: JSON.parse(response.error.message) });
    }

    const createTransaction = await TransactionsModel.create(response.data);

    return res.status(201).json(createTransaction);
  }

  static async delete(req, res) {
    const { id } = req.params;
    const deleteTransaction = await TransactionsModel.delete({ id });
    if (!deleteTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted done" });
  }

  static async getYears(req, res){
    const transactions = await TransactionsModel.getAll({});
    const response = [...new Set(
    transactions.map(t => new Date(t.date).getFullYear())
  )].sort((a, b) => b - a)
    return res.status(200).json(response)
  }
}
