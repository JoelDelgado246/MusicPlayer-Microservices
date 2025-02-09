import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Acceso denegado. Token requerido." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "mi_clave_secreta");
        req.user = decoded; // Adjunta el usuario autenticado a la petición
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado." });
    }
};
