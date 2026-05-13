import "dotenv/config";
import db from "./database.js";

async function testConnection() {
  try {
    console.log("Intentando conectar a turso...");

    const result = await db.execute("SELECT sqlite_version() as version");

    console.log("✅ Conexión exitosa");
    console.log("Versión de SQLite:", result.rows[0].version);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
  }
}

testConnection()
