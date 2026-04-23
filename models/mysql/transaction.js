import mysql from "mysql2/promise";

const config = {
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "",
  database: "financesdb",
};

const connection = await mysql.createConnection(config);

export class TransactionsModel {
  static async getAll({ type, category, month, year }) {
    try {
      let query = ` 
            SELECT 
                bin_to_uuid(tf.transaction_id) as id, 
                t.description, 
                t.amount, 
                t.date 
             FROM transaction_full tf
             INNER JOIN transactions t ON tf.transaction_id = t.id
        `;

      const params = [];

      if (category) {
        query += `INNER JOIN category c ON tf.category_id = c.id`;
      }

      if (type) {
        query += `INNER JOIN type_transaction tt ON tf.type_id = tt.id`;
      }

      const whereConditions = [];

      if (category) {
        whereConditions.push(`LOWER(c.name) = ?`);
        params.push(category.toLowerCase());
      }

      if (type) {
        whereConditions.push(`LOWER(tt.name) = ?`);
        params.push(type.toLowerCase());
      }

      if (month) {
        whereConditions.push(`MONTH(t.date) = ?`);
        params.push(Number(month));
      }

      if (year) {
        whereConditions.push(`YEAR(t.date) = ?`);
        params.push(Number(year));
      }

      if (whereConditions.length > 0) {
        query += ` WHERE ${whereConditions.join(" AND ")}`;
      }

      query += `;`;

      const [transactions] = await connection.query(query, params);
      return transactions ?? [];
    } catch (error) {
      throw new Error("Error fetching transactions:");
    }
  }

  static async getById({ id }) {
    const [transactions] = await connection.query(
      "SELECT bin_to_uuid(id) id, amount, description, date FROM financesdb.transactions where id = uuid_to_bin(?);",
      [id],
    );

    if (transactions.length === 0) return null;

    return transactions[0];
  }

  static async create(input) {
    const { type, amount, category, description, date } = input;

    const [uuidResult] = await connection.query("SELECT UUID() uuid;");
    const [{ uuid }] = uuidResult;

    try {
      await connection.query(
        `insert into transactions (id, description, amount, date) 
        values (uuid_to_bin("${uuid}"), ?,?,?);`,
        [description, amount, date],
      );

      await connection.query(
        `insert into transaction_full (transaction_id, category_id, type_id)
        values (uuid_to_bin("${uuid}"), (select id from category where name = LOWER(?)), (select id from type_transaction where name = LOWER(?)));
        `,
        [category, type],
      );
    } catch (e) {
      throw new Error("Error creating transaction");
    }

    const [transaction] = await connection.query(
      `SELECT 
                bin_to_uuid(t.id) as id, 
                t.description, 
                t.amount, 
                t.date,
                c.name AS category,
                tt.name AS type
             FROM transaction_full tf
             INNER JOIN transactions t ON tf.transaction_id = t.id
             INNER JOIN category c ON tf.category_id = c.id
             INNER JOIN type_transaction tt ON tf.type_id = tt.id
             WHERE t.id = uuid_to_bin(?)
        `,
      [uuid],
    );

    return transaction[0];
  }

  static async update(id, input) {
    const { type, amount, category, description, date } = input;

    try {
      const params = [];
      const values = [];

      if (amount) {
        values.push(`amount = ?`);
        params.push(Number(amount));
      }

      if (description) {
        values.push(`description = ?`);
        params.push(description);
      }

      if (date) {
        values.push(`date = ?`);
        params.push(date);
      }

      if (values.length > 0) {
        const queryTransactions = `UPDATE transactions SET ${values.join(", ")} WHERE id = uuid_to_bin(?);`;
        params.push(id);
        const result = await connection.query(queryTransactions, params);
        if (result.affectedRows === 0) {
          return false;
        }
      }

      if (type) {
        const queryType = `UPDATE transaction_full SET type_id = (SELECT id FROM type_transaction WHERE LOWER(name) = ?) WHERE transaction_id = uuid_to_bin(?);`;
        await connection.query(queryType, [type.toLowerCase(), id]);
      }

      if (category) {
        const queryCategory = `UPDATE transaction_full SET category_id = (SELECT id FROM category WHERE LOWER(name) = ?) WHERE transaction_id = uuid_to_bin(?);`;
        await connection.query(queryCategory, [category.toLowerCase(), id]);
      }

      const [transaction] = await connection.query(
        `SELECT 
          bin_to_uuid(t.id) as id, 
          t.description, 
          t.amount, 
          t.date,
          c.name AS category,
          tt.name AS type
        FROM transaction_full tf
        INNER JOIN transactions t ON tf.transaction_id = t.id
        INNER JOIN category c ON tf.category_id = c.id
        INNER JOIN type_transaction tt ON tf.type_id = tt.id
        WHERE t.id = uuid_to_bin(?);`,
        [id]
      );

      return transaction[0] || null;
    } catch (error) {
      throw new Error("Error updating transaction");
    }
  }

  static async updateCategory(oldCategory, newCategory) {}

  static async delete({ id }) {
    try {
      await connection.query(
        `
          delete from transactions where id = uuid_to_bin(?);
        `,
        [id],
      );

      return true;
    } catch (e) {
      return false;
      throw new Error("Error delete transaction");
    }
  }
}
