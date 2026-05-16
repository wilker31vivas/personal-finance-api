import db from "../config/database.js";

export async function insertTransaction(
  description,
  amount,
  category,
  type_transaction,
) {
  const result = await db.execute({
    sql: `insert into transactions (description, amount, category_id, type_id) 
            values (:description, :amount, 
            (select id from categories where name = :category), 
            (select id from type_transaction where name = :type_transaction)
        )`,
    args: { description, amount, category, type_transaction },
  });

  return result;
}

export async function getTransactions() {
  const result = await db.execute(`SELECT
          t.id as id, 
          t.description, 
          t.amount, 
          t.created_at,
          c.name AS category,
          tt.name AS type
        FROM transactions t
        INNER JOIN categories c ON t.category_id = c.id
        INNER JOIN type_transaction tt ON t.type_id = tt.id`);
  const transaction = result.rows;
  return transaction;
}
