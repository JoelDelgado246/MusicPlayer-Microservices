import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configurar rutas del usuario
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Microservicio de Usuarios corriendo en el puerto ${PORT}`);
    });
});
