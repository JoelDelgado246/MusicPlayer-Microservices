import express from "express";
import { addFavorite, getFavorites, deleteFavorite } from "../controllers/favoritesController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js"; // Middleware de autenticación

const router = express.Router();

router.post("/new", authenticateToken, addFavorite);
router.get("/all", authenticateToken, getFavorites);
router.delete("/:cancion", authenticateToken, deleteFavorite);

export default router;
