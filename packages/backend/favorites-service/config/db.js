import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mssql",
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    logging: false,
    dialectOptions: {
        encrypt: false,
        trustServerCertificate: true
    }
});

// Conectar a la base de datos
export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Conectado a SQL Server con Sequelize");
        await sequelize.sync(); // Crear tablas si no existen
        console.log("✅ Tablas sincronizadas");
    } catch (error) {
        console.error("❌ Error al conectar con la base de datos:", error.message);
    }
};
