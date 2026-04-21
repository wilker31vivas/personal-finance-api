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
    if (category) {
      try {
        const lowerCaseCategory = category.toLowerCase();

        const [transactions] = await connection.query(
          `SELECT 
                bin_to_uuid(tf.transaction_id) as id, 
                tf.description, 
                tf.amount, 
                tf.date 
             FROM transaction_full tf
             INNER JOIN transactions t ON tf.transaction_id = t.id
             INNER JOIN category c ON tf.category_id = c.id
             WHERE LOWER(c.name) = ?;`,
          [lowerCaseCategory],
        );

        return transactions ?? [];
      } catch (error) {
        console.error("Error fetching transactions by category:", error);
        throw error;
      }
    }

    const [transactions] = await connection.query(
      "SELECT bin_to_uuid(id) id, amount, description, date FROM financesdb.transactions;",
    );

    return transactions;
  }

  static async getById({ id }) {
     const [transactions] = await connection.query(
      "SELECT bin_to_uuid(id) id, amount, description, date FROM financesdb.transactions where id = uuid_to_bin(?);", [id],
    );

    if (transactions.length === 0) return null

    return transactions[0];
  }

  static async update(id, input) {}

  static async create(input) {}

  static async updateCategory(oldCategory, newCategory) {}

  static async delete({ id }) {}
}
