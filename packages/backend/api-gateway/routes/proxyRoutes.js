import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Proxy al Microservicio de Usuarios
router.use("/api/auth", createProxyMiddleware({ 
    target: process.env.USER_SERVICE_URL, 
    changeOrigin: true,
    selfHandleResponse: false,  // ⬅️ Asegura que la respuesta no se modifique
    onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 Redirigiendo solicitud de Gateway → ${process.env.USER_SERVICE_URL}${req.url}`);
        
        // Verificar que Content-Type sea JSON
        if (!proxyReq.getHeader('Content-Type')) {
            proxyReq.setHeader('Content-Type', 'application/json');
        }
    },
    onError: (err, req, res) => {
        console.error(`❌ Error en proxy hacia Usuarios:`, err.message);
        res.status(500).json({ error: "Error en el API Gateway" });
    }
}));

export default router;
