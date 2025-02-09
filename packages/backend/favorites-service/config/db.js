import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    options: {
        encrypt: false, // Poner true si usas Azure
        trustServerCertificate: true
    },
    pool: {
        max: 10, // Máximo de conexiones simultáneas
        min: 0,   // Mínimo de conexiones
        idleTimeoutMillis: 30000 // Cerrar conexiones inactivas después de 30s
    }
};

let pool;

export const connectDB = async () => {
    try {
        if (!pool) {
            pool = await sql.connect(dbConfig);
            console.log("✅ Conectado a SQL Server en", dbConfig.server);
        }
        return pool;
    } catch (error) {
        console.error("❌ Error al conectar con la base de datos:", error.message);
        throw new Error("Error en la conexión a la base de datos.");
    }
};

export const queryDB = async (query, params = {}) => {
    try {
        const pool = await connectDB();
        const request = pool.request();

        Object.keys(params).forEach(key => {
            request.input(key, params[key]);
        });

        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error("❌ Error en la consulta SQL:", error.message);
        throw new Error("Error en la ejecución de la consulta.");
    }
};

// Cerrar la conexión cuando el proceso finaliza
process.on("exit", async () => {
    if (pool) {
        await pool.close();
        console.log("🔴 Conexión con la base de datos cerrada.");
    }
});
