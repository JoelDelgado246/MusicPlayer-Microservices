import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js"; // Asegúrate de importar la conexión a la BD

const Favorite = sequelize.define("Favorite", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    usuario: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    cancion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    fecha_agregado: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: "Favorites",
    timestamps: false // Desactiva las columnas `createdAt` y `updatedAt`
});

export default Favorite;
