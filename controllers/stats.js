import { StatsModel } from "../models/stats.js";

export class StatsController {
  static async getBalance(req, res) {
    const { month, year } = req.query;
    const totalBalance = await StatsModel.getBalance({ month, year });
    return res.json(totalBalance);
  }

  static async getByCategory(req, res) {
    const { month, year } = req.query;
    const totalExpense = await StatsModel.getByCategory({ month, year });
    return res.json(totalExpense);
  }

  static async getSummaryMonthly(req, res) {
    const response = await StatsModel.getSummaryMonthly();
    return res.json(response)
  }

  static async getTopCategories(req, res){
    const { month, year } = req.query;
    const response = await StatsModel.getTopCategories({ month, year });
    return res.json(response)
  }
}
