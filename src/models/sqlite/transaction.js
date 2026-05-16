import db from "../../config/database.js";

export class TransactionsModel {
  static async getAll({ type, category, month, year }) {
    let query = `
      SELECT 
          t.id, 
          t.description, 
          t.amount, 
          t.created_at,
          c.name AS category,
          tt.name AS type
        FROM transactions t
        INNER JOIN categories c ON t.category_id = c.id
        INNER JOIN type_transaction tt ON t.type_id = tt.id
    `;

    const whereConditions = [];
    const args = {};

    if (category) {
      whereConditions.push(`LOWER(c.name) = :category`);
      args.category = category;
    }

    if (type) {
      whereConditions.push(`LOWER(tt.name) = :type`);
      args.type = type;
    }

    if (month) {
      whereConditions.push(`EXTRACT(MONTH FROM t.created_at) = :month`);
      args.month = month;
    }

    if (year) {
      whereConditions.push(`EXTRACT(YEAR FROM t.created_at) = :year`);
      args.year = year;
    }

    if (whereConditions.length > 0) {
      query += `WHERE ${whereConditions.join(" AND ")}`;
    }

    query += ` ORDER BY t.created_at DESC;`;

    const result = await db.execute({
      sql: query,
      args: { ...args },
    });
    return result.rows;
  }

  static async getById({ id }) {
    const result = await db.execute({
      sql: `
      SELECT 
          t.id, 
          t.description, 
          t.amount, 
          t.created_at,
          c.name AS category,
          tt.name AS type
        FROM transactions t
        INNER JOIN categories c ON t.category_id = c.id
        INNER JOIN type_transaction tt ON t.type_id = tt.id
        WHERE t.id = :id
    `,
      args: { id },
    });

    const transaction = result.rows[0];

    return transaction;
  }

  static async create(input) {
    const { category, amount, description, type } = input;

    const result = await db.execute({
      sql: `insert into transactions (description, amount, category_id, type_id) 
            values (:description, :amount, 
            (select id from categories where name = :category), 
            (select id from type_transaction where name = :type_transaction)
        )`,
      args: { description, amount, category, type_transaction: type },
    });

    const transaction = await this.getById({ id: Number(result.lastInsertRowid) });
    return transaction;
  }

  static async update(id, input) {
    const transactionIndex = transactions.findIndex((t) => t.id === id);

    if (transactionIndex === -1) return false;

    const partialTransaction = {
      ...transactions[transactionIndex],
      ...input,
    };

    transactions[transactionIndex] = partialTransaction;

    return partialTransaction;
  }

  static async updateCategory(oldCategory, newCategory) {
    const updatedTransactions = transactions.map((t) =>
      t.category === oldCategory ? { ...t, category: newCategory } : t,
    );

    transactions.splice(0, transactions.length, ...updatedTransactions);
    return updatedTransactions.filter((t) => t.category === newCategory).length;
  }

  static async delete({ id }) {
    const transactionIndex = transactions.findIndex((t) => t.id === id);

    if (transactionIndex === -1) return false;

    transactions.splice(transactionIndex, 1);

    return true;
  }
}
