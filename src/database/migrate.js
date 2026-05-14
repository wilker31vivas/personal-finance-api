import "dotenv/config";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import db from "../config/database.js";
import { insertTransactionFull, getTransactions, getTransactionsWithDetails } from "./playground.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
  try {
    const schemaPath = join(__dirname, "schema.sql");
    const schema = readFileSync(schemaPath, "utf-8");

    await db.executeMultiple(schema);

    console.log("✅ Table created successfully");
  } catch (error) {
    console.error("❌ Migration error:", error.message);
    process.exit(1);
  }
}

// insertTransactionFull("Monthly salary payment", 3500, 'salary', 'income');
async function getTransactionsAsync() {
  const result = await getTransactions()
  console.log(result)
}

async function getTransactionsFullAsync() {
  const result = await getTransactionsWithDetails()
  console.log(result)
}

getTransactionsAsync()
getTransactionsFullAsync()