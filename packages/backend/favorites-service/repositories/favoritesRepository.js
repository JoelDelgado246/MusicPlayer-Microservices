import Favorite from "../models/Favorite.js";

// 🔹 Guardar una nueva canción como favorita
export const saveFavorite = async (usuario, cancion) => {
    try {
        const newFavorite = await Favorite.create({
            usuario,
            cancion
            // 🔥 No enviamos `fecha_agregado`, SQL Server lo genera automáticamente
        });

        return newFavorite;
    } catch (error) {
        console.error("❌ Error en saveFavorite:", error);
        throw error;
    }
};

// 🔹 Obtener todos los favoritos de un usuario
export const getUserFavorites = async (usuario) => {
    try {
        return await Favorite.findAll({
            where: { usuario },
            order: [["fecha_agregado", "DESC"]]
        });
    } catch (error) {
        console.error("❌ Error en getUserFavorites:", error);
        throw error;
    }
};

// 🔹 Eliminar una canción de los favoritos de un usuario
export const removeFavorite = async (usuario, cancion) => {
    try {
        const deleted = await Favorite.destroy({
            where: { usuario, cancion }
        });

        return deleted > 0; // Retorna `true` si se eliminó, `false` si no existía
    } catch (error) {
        console.error("❌ Error en removeFavorite:", error);
        throw error;
    }
};
