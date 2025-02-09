import { saveFavorite, getUserFavorites, removeFavorite } from "../repositories/favoritesRepository.js";

// 🔹 Agregar una canción a favoritos
export const addFavorite = async (req, res) => {
    const { cancion } = req.body;
    const usuario = req.user.email; // 📌 Extraído desde el token JWT

    if (!cancion) {
        return res.status(400).json({ error: "Debe proporcionar una canción." });
    }

    try {
        const favorite = await saveFavorite(usuario, cancion);
        res.status(201).json({ message: "Canción agregada a favoritos.", favorite });
    } catch (error) {
        console.error("❌ Error en addFavorite:", error.message);
        res.status(500).json({ error: "Error al agregar a favoritos." });
    }
};

// 🔹 Obtener favoritos de un usuario
export const getFavorites = async (req, res) => {
    const usuario = req.user.email; // 📌 Extraído desde el token JWT

    try {
        const favorites = await getUserFavorites(usuario);
        res.status(200).json(favorites);
    } catch (error) {
        console.error("❌ Error en getFavorites:", error.message);
        res.status(500).json({ error: "Error al obtener favoritos." });
    }
};

// 🔹 Eliminar una canción de los favoritos
export const deleteFavorite = async (req, res) => {
    const { cancion } = req.params;
    const usuario = req.user.email; // 📌 Extraído desde el token JWT

    try {
        const deleted = await removeFavorite(usuario, cancion);
        if (deleted) {
            return res.status(200).json({ message: "Canción eliminada de favoritos." });
        } else {
            return res.status(404).json({ error: "Canción no encontrada en favoritos." });
        }
    } catch (error) {
        console.error("❌ Error en deleteFavorite:", error.message);
        res.status(500).json({ error: "Error al eliminar de favoritos." });
    }
};
