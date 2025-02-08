import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import proxyRoutes from "./routes/proxyRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Agregar log para verificar que el Gateway recibe la solicitud
app.use((req, res, next) => {
    console.log(`📌 Petición recibida en Gateway: ${req.method} ${req.url}`);
    next();
});

// Configurar rutas del gateway
app.use(proxyRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 API Gateway corriendo en el puerto ${PORT}`);
});
