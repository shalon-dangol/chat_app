import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";

import connectDB from "./utils/db.js";
import errorHandler from "./middleware/errorHandler.js";
import { initializeSocket } from "./services/socketService.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// --------------- Middleware ---------------
app.use(cors());
app.use(express.json());

// --------------- Health Check ---------------
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Server is running", data: null });
});

// --------------- Routes ---------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// --------------- Error Handling ---------------
app.use(errorHandler);

// --------------- Socket.IO ---------------
const io = initializeSocket(server);

// --------------- Start Server ---------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

export { app, server };
