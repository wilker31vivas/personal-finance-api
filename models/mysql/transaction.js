import mysql from 'mysql2/promise'

const config = {
    host: '127.0.0.1',
    user: 'root',
    port: 3306,
    password: '',
    database: 'finances'
}

const connection = await mysql.createConnection(config)

export class TransactionsModel {
  static async getAll({ type, category, month, year }) {
        const [transactions] = await connection.query(
            'SELECT bin_to_uuid(id) id, amount, description, date FROM finances.transactions;'
        )
        
        return(transactions)
  }

  static async getById({ id }) {
  }

  static async update(id, input) {
   
  }

  static async create(input) {
   
  }

  static async updateCategory(oldCategory, newCategory) {

  }

  static async delete({ id }) {
   
  }
}
