import { connectDB } from "./config/db.js";

(async () => {
    try {
        console.log("🔍 Intentando conectar a la base de datos...");
        const pool = await connectDB();
        console.log("✅ Conexión exitosa a la base de datos!");

        const resultado = await pool.request().query("SELECT name FROM sys.databases");
        console.log("Bases de Datos:", resultado.recordset);
    } catch (error) {
        console.error("❌ Error al probar la conexión:", error.message);
    }
})();
