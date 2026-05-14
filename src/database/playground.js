import db from "../config/database.js";

export async function insertTransactionFull(
  description,
  amount,
  category,
  type_transaction,
) {
  const firstInsert = await db.execute({
    sql: "INSERT INTO transactions (description, amount) values (:description, :amount)",
    args: { description, amount },
  });

  const transactionId = firstInsert.lastInsertRowid;

  const result = await db.execute({
    sql: `insert into transaction_full (transaction_id, category_id, type_id) 
            values (:transaction_id, 
            (select id from categories where name = :category), 
            (select id from type_transaction where name = :type_transaction)
        )`,
    args: { transaction_id: transactionId, category, type_transaction },
  });

  return result;
}

export async function getTransactions() {
  const result = await db.execute(
    "SELECT id, description, amount, created_at from transactions",
  );
  const transaction = result.rows;
  return transaction;
}

export async function getTransactionsWithDetails() {
  const result = await db.execute(`SELECT
          t.id as id, 
          t.description, 
          t.amount, 
          t.created_at,
          c.name AS category,
          tt.name AS type
        FROM transaction_full tf
        INNER JOIN transactions t ON tf.transaction_id = t.id
        INNER JOIN categories c ON tf.category_id = c.id
        INNER JOIN type_transaction tt ON tf.type_id = tt.id`);
  const transaction = result.rows;
  return transaction;
}
