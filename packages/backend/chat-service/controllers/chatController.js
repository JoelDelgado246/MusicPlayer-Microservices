import { saveMessage, getRecentMessages } from "../repositories/chatRepository.js";
import xss from "xss";

export const sendMessage = async (req, res) => {
    const { mensaje } = req.body;
    const usuario = req.user.email;  // Extraído desde JWT

    if (!mensaje || mensaje.length > 500) {
        return res.status(400).json({ error: "Mensaje inválido o demasiado largo." });
    }

    try {
        console.log("📨 Guardando mensaje de:", usuario); // Debug
        console.log("📨 Mensaje recibido:", mensaje);

        const newMessage = await saveMessage(usuario, mensaje);
        
        console.log("✅ Mensaje guardado:", newMessage);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("❌ Error en sendMessage:", error);  // <-- Imprime el error exacto
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

/**
* Maneja los mensajes de chat, sanitizando y validando los datos.
* @param {Object} io - Instancia de Socket.IO.
* @param {Object} socket - Conexión de socket del cliente.
*/
const handleChatMessage = (io, socket) => {
 socket.on("chatMessage", (msg) => {
   // Sanitizar el mensaje recibido
   const sanitizedMessage = xss(msg, {
     whiteList: {}, // Permitir solo texto plano (sin HTML)
   });

   // Validar longitud del mensaje
   if (sanitizedMessage.length > 0 && sanitizedMessage.length <= 200) {
     // Emitir el mensaje a todos los clientes conectados
     io.emit("chatMessage", {
       username: socket.username || "Anonymous",
       text: sanitizedMessage,
     });
   } else {
     // Enviar error si el mensaje no cumple con las validaciones
     socket.emit("errorMessage", "Message is invalid or too long.");
   }
 });
};