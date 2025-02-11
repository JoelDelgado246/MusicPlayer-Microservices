import express from "express";
import cors from "cors";
import morgan from "morgan";
import musicRoutes from "./routes/musicRoutes.js";

const app = express();

// Middlewares
app.use(cors()); // Habilita CORS
app.use(morgan("dev")); // Registra las peticiones en consola
app.use(express.json()); // Permite parsear JSON en el body de las solicitudes

// Rutas
app.use("/api/music", musicRoutes);

// Puerto y arranque del servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🎵 Music Service running on http://localhost:${PORT}`);
});
