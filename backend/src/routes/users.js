import express from "express";
import { getAllUsersHandler, getUserByIdHandler, updateUserHandler, deleteUserHandler } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getAllUsersHandler);
router.get("/:id", getUserByIdHandler);
router.put("/:id", updateUserHandler);
router.delete("/:id", deleteUserHandler);

export default router;
