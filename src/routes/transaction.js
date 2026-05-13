import { Router } from "express";
export const routerTransaction = Router();
import { TransactionController } from "../controllers/transaction.js";
import { validateType, vaildateMonth, validateCategory, validateYear } from "../middleware/transaction.js";

routerTransaction.get("/", validateType, validateCategory, vaildateMonth, validateYear, TransactionController.getAll);
routerTransaction.get("/years", TransactionController.getYears);
routerTransaction.get("/:id", TransactionController.getById);
routerTransaction.patch("/:id", TransactionController.update);
routerTransaction.post("/", TransactionController.create);
routerTransaction.delete("/:id", TransactionController.delete);