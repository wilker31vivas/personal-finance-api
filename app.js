import "dotenv/config";
import express from "express";
const app = express();
import { routerTransaction } from "./routes/transaction.js";
import { routerStats } from "./routes/stats.js";
import cors from "cors";
import { categoriesRouter } from "./routes/categories.js";

app.use(express.json());
app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN.includes(",") 
      ? process.env.CORS_ORIGIN.split(",")
      : process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use("/api/transactions", routerTransaction);
app.use("/api/stats", routerStats);
app.use("/api/categories", categoriesRouter);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
   console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
