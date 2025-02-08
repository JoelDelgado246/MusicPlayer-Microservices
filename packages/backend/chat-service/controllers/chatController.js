import { saveMessage, getRecentMessages } from "../repositories/chatRepository.js";

export const sendMessage = async (req, res) => {
    const { mensaje } = req.body;
    const usuario = req.user.username;  // Extraído desde JWT

    if (!mensaje || mensaje.length > 500) {
        return res.status(400).json({ error: "Mensaje inválido o demasiado largo." });
    }

    try {
        const newMessage = await saveMessage(usuario, mensaje);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error en sendMessage:", error.message);
        res.status(500).json({ error: "Error al enviar el mensaje." });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        const messages = await getRecentMessages();
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error en getChatHistory:", error.message);
        res.status(500).json({ error: "Error al obtener el historial de chat." });
    }
};
