import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log("🔍 Token recibido:", token); // 🔥 Verifica si el token está llegando

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. Token requerido." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token decodificado:", decoded); // 🔥 Verifica si el token es válido
        req.user = decoded;
        next();
    } catch (error) {
        console.error("❌ Error de autenticación:", error.message);
        return res.status(403).json({ error: "Token inválido o expirado." });
    }
};
