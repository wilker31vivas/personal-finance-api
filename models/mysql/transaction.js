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
      console.log("Query ejecutada:", query, "Parámetros:", params);

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
    } catch (e) {
        throw new Error('Error creating transaction')
    }

    const [transaction] = await connection.query(
        `SELECT 
                bin_to_uuid(id) as id, 
                description, 
                amount, 
                date 
             FROM transactions
             where id = uuid_to_bin(?);
        `, [uuid]
    )

    return transaction[0]
  }

  static async update(id, input) {}

  static async updateCategory(oldCategory, newCategory) {}

  static async delete({ id }) {}
}
