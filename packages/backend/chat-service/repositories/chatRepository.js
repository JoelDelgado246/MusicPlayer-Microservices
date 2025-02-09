import ChatMessage from "../models/ChatMessage.js";

export const saveMessage = async (usuario, mensaje) => {
    try {
        const newMessage = await ChatMessage.create({
            usuario,
            mensaje
            // 🔥 No enviamos `timestamp`, SQL Server lo genera automáticamente
        });

        return newMessage;
    } catch (error) {
        console.error("❌ Error en saveMessage:", error);
        throw error;
    }
};



// Obtener los últimos mensajes del chat
export const getRecentMessages = async (limit = 20) => {
    return await ChatMessage.findAll({
        order: [["timestamp", "DESC"]],
        limit
    });
};
