import express from "express";
import { sendMessage, getChatHistory } from "../controllers/chatController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/send", authenticateToken, sendMessage);
router.get("/history", authenticateToken, getChatHistory);

export default router;
