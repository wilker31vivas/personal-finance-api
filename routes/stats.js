import { Router } from "express";
export const routerStats = Router();
import {vaildateMonth, validateYear } from "../middleware/transaction.js";
import { StatsController } from "../controllers/stats.js";

routerStats.get("/balance", vaildateMonth, validateYear, StatsController.getBalance);
routerStats.get("/by-category",vaildateMonth, validateYear, StatsController.getByCategory);
routerStats.get('/monthly', StatsController.getSummaryMonthly)
routerStats.get('/top-categories', StatsController.getTopCategories)

