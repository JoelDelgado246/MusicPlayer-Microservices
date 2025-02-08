import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { connectDB } from "./config/db.js";
import chatRoutes from "./routes/chatRoutes.js";
import { saveMessage, getRecentMessages } from "./repositories/chatRepository.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors());
app.use("/api/chat", chatRoutes);

// Middleware de autenticación en WebSockets
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Token requerido"));

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.username = decoded.username;
        next();
    } catch (error) {
        next(new Error("Token inválido"));
    }
});

// Manejo de conexiones y eventos de chat
io.on("connection", async (socket) => {
    console.log(`✅ Usuario conectado: ${socket.username}`);

    const messages = await getRecentMessages();
    socket.emit("chatHistory", messages.reverse());

    socket.on("chatMessage", async (msg) => {
        if (!msg || msg.length > 500) return;

        await saveMessage(socket.username, msg);

        const chatMessage = {
            usuario: socket.username,
            mensaje: msg,
            timestamp: new Date().toISOString()
        };

        io.emit("chatMessage", chatMessage);
    });

    socket.on("disconnect", () => {
        console.log(`❌ Usuario desconectado: ${socket.username}`);
    });
});

const PORT = process.env.PORT || 5002;
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Microservicio de Chat corriendo en el puerto ${PORT}`);
    });
});
