import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { createMessage } from "./chatService.js";

/**
 * Initialize Socket.IO on the existing HTTP server.
 * Uses a middleware to authenticate every incoming socket connection via JWT.
 */
export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  // --------------- Authentication Middleware ---------------
  // Runs once per connection — rejects unauthenticated sockets early.
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("username");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = { id: user._id, username: user.username };
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  // --------------- Connection Handler ---------------
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.id})`);

    // Broadcast to all other clients that a user joined
    socket.broadcast.emit("user_joined", {
      username: socket.user.username,
      message: `${socket.user.username} has joined the chat`,
    });

    // --------------- Send Message ---------------
    socket.on("send_message", async (data, ackCallback) => {
      try {
        const message = await createMessage({
          senderId: socket.user.id,
          content: data.content,
        });

        // Broadcast the saved message to ALL connected clients
        io.emit("new_message", message);

        // Acknowledge back to the sender that the message was saved
        if (typeof ackCallback === "function") {
          ackCallback({ success: true });
        }
      } catch (error) {
        console.error("Error saving message:", error.message);

        if (typeof ackCallback === "function") {
          ackCallback({ success: false, error: error.message });
        }
      }
    });

    // --------------- Disconnect ---------------
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.username} (${socket.id})`);
    });
  });

  return io;
};
