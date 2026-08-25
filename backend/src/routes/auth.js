import express from "express";
import { register, login } from "../controllers/authController.js";
import inputValidator from "../middleware/validate.js";

const router = express.Router();

router.post("/register", inputValidator(["username", "email", "password"]), register);
router.post("/login", inputValidator(["email", "password"]), login);

export default router;
