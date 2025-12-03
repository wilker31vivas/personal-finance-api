import expresss from "express";
const app = expresss();
import { routerTransaction } from "./routes/transaction.js";
import { routerStats } from "./routes/stats.js";

app.use(expresss.json());

app.use("/api/transactions", routerTransaction);
app.use('/api/stats', routerStats)

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log("Servidor ejecutandose");
});
