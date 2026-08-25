import jwt from "jsonwebtoken";
import { registerUser, loginUser } from "../services/authService.js";
import { sendSuccess } from "../utils/response.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await registerUser({ username, email, password });
    const token = generateToken(user._id);

    return sendSuccess(res, 201, { user, token }, "User registered successfully");
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser({ email, password });
    const token = generateToken(user._id);

    return sendSuccess(res, 200, { user, token }, "Login successful");
  } catch (error) {
    next(error);
  }
};
