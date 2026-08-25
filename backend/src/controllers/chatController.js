import { getChatHistory, getChatStats } from "../services/chatService.js";
import { sendSuccess } from "../utils/response.js";

export const getChatHistoryHandler = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = parseInt(req.query.skip, 10) || 0;

    const messages = await getChatHistory({ limit, skip });
    return sendSuccess(res, 200, messages, "Chat history retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getChatStatsHandler = async (_req, res, next) => {
  try {
    const stats = await getChatStats();
    return sendSuccess(res, 200, stats, "Stats retrieved successfully");
  } catch (error) {
    next(error);
  }
};
