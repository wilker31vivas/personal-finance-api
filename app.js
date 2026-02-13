import expresss from "express";
const app = expresss();
import { routerTransaction } from "./routes/transaction.js";
import { routerStats } from "./routes/stats.js";
import cors from "cors";
import { categoriesRouter } from "./routes/categories.js";

app.use(expresss.json());
app.disable('x-powered-by')
app.use(cors({
  origin: [
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use("/api/transactions", routerTransaction);
app.use("/api/stats", routerStats);
app.use("/api/categories", categoriesRouter);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log("Servidor ejecutandose", PORT);
});
