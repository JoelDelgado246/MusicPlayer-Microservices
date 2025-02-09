import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { connectDB } from "./config/db.js";
import favoritesRoutes from "./routes/favoritesRoutes.js";
import { saveFavorite, getUserFavorites, removeFavorite } from "./repositories/favoritesRepository.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE"]
    }
});

app.use(express.json());
app.use(cors());
app.use("/api/favorites", favoritesRoutes);

// 🔹 Middleware de autenticación en WebSockets
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Token requerido"));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.username = decoded.email; // 📌 Usamos `email` en lugar de `username`
        next();
    } catch (error) {
        next(new Error("Token inválido"));
    }
});

// 🔹 Manejo de conexiones y eventos de favoritos
io.on("connection", async (socket) => {
    console.log(`✅ Usuario conectado: ${socket.username}`);

    // Enviar lista de favoritos del usuario al conectarse
    const favorites = await getUserFavorites(socket.username);
    socket.emit("favoritesList", favorites);

    // 📌 Agregar favorito en tiempo real
    socket.on("addFavorite", async (cancion) => {
        if (!cancion) return;

        await saveFavorite(socket.username, cancion);

        const favoriteData = { usuario: socket.username, cancion };
        io.emit("favoriteAdded", favoriteData); // 📌 Notifica a todos los clientes
    });

    // 📌 Eliminar favorito en tiempo real
    socket.on("removeFavorite", async (cancion) => {
        if (!cancion) return;

        const deleted = await removeFavorite(socket.username, cancion);
        if (deleted) {
            io.emit("favoriteRemoved", { usuario: socket.username, cancion }); // 📌 Notifica a todos los clientes
        }
    });

    socket.on("disconnect", () => {
        console.log(`❌ Usuario desconectado: ${socket.username}`);
    });
});

const PORT = process.env.PORT || 5003;
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Microservicio de Favoritos corriendo en el puerto ${PORT}`);
    });
});
