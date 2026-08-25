import Message from "../models/Message.js";
import User from "../models/User.js";

/**
 * Save a new message to the database.
 * Populates sender info so the response includes username.
 */
export const createMessage = async ({ senderId, content }) => {
  const message = await Message.create({ sender: senderId, content });
  const populated = await message.populate("sender", "username");
  return populated;
};

/**
 * Fetch paginated chat history, newest messages last.
 * Defaults to the 50 most recent messages.
 */
export const getChatHistory = async ({ limit = 50, skip = 0 } = {}) => {
  const messages = await Message.find()
    .populate("sender", "username")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);

  return messages;
};

/**
 * Aggregate stats: total users and total messages in the system.
 */
export const getChatStats = async () => {
  const [totalMessages] = await Message.aggregate([
    { $count: "count" },
  ]);

  const totalUsers = await User.countDocuments();

  return {
    totalUsers,
    totalMessages: totalMessages ? totalMessages.count : 0,
  };
};
