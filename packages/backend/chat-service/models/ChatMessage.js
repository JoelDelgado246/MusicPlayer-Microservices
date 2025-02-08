import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ChatMessage = sequelize.define("ChatMessage", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mensaje: {
        type: DataTypes.STRING,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "ChatMensajes",
    timestamps: false
});

export default ChatMessage;
