import { getCategories, getTransactions } from "../utils.js";
const categories = getCategories();
import { TransactionsModel } from "../models/transaction.js";
const transactions = getTransactions();
import mysql from "mysql2/promise";

const config = {
  host: "127.0.0.1",
  user: "root",
  port: 3306,
  password: "",
  database: "financesdb",
};

const connection = await mysql.createConnection(config);

export class CategoriesModel {
  static async getAll() {
    try {
      const [categories] = await connection.query("SELECT * FROM category;");

      return categories;
    } catch (error) {
      throw new Error("Error fetching categories:");
    }
  }

  static async getById({ id }) {
    try {
      const [category] = await connection.query(
        "SELECT * FROM category WHERE id = (?);",
        [id],
      );

      return category;
    } catch (error) {
      throw new Error("Error fetching category:");
    }
  }

  static async create(input) {
    try {
      await connection.query("INSERT INTO category (name) VALUES (?);", [
        input.name,
      ]);
    } catch (error) {
      throw new Error("Error creating category:", error);
    }

    const [rows] = await connection.query(
      "SELECT * FROM category WHERE id = LAST_INSERT_ID();",
    );

    return rows[0];
  }

  static async update(id, input) {
    try {
      const result = await connection.query(
        "UPDATE category set name = LOWER(?) where id = ?;",
        [input.name, id],
      );

      if (result.affectedRows === 0) {
        return false;
      }
    } catch (error) {
      throw new Error("Error updating category:", error);
    }

    const [rows] = await connection.query(
      "SELECT * FROM category WHERE id = ?;",
      [id],
    );

    return rows[0] || null;
  }

  static async delete(id) {
    try {
      const category = await connection.query(
        `SELECT * FROM Category where id = ?`,
        [id],
      );
      console.log(category[0] === [])
      if (category[0] === []) return { isExists: false, isUsed: false };

      // comprovar se esta usando a categoria
      // const isUsed = transactions.some(
      //   (t) =>
      //     t.category.toLowerCase() ===
      //     categories[categoryIndex].name.toLowerCase(),
      // );
      
      //se a categoria se esta usando : if (isUsed) return { isExists: true, isUsed: true };

      //eliminar categoria e return { isExists: true, isUsed: false };
    } catch (error) {}
    
  }
}
