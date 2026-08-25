import express from "express";
import { getChatHistoryHandler, getChatStatsHandler } from "../controllers/chatController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getChatHistoryHandler);
router.get("/stats", getChatStatsHandler);

export default router;
