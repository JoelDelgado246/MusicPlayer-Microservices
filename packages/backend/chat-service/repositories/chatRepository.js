import ChatMessage from "../models/ChatMessage.js";

// Guardar un mensaje en la base de datos
export const saveMessage = async (usuario, mensaje) => {
    return await ChatMessage.create({ usuario, mensaje });
};

// Obtener los últimos mensajes del chat
export const getRecentMessages = async (limit = 20) => {
    return await ChatMessage.findAll({
        order: [["timestamp", "DESC"]],
        limit
    });
};
