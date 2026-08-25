import User from "../models/User.js";

/**
 * Register a new user.
 * Throws descriptive errors so the controller can map them to proper status codes.
 */
export const registerUser = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    const field = existingUser.email === email ? "Email" : "Username";
    const error = new Error(`${field} already exists`);
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ username, email, password });
  return user;
};

/**
 * Authenticate user by email and password.
 * Returns the user document if valid, throws if invalid.
 */
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  return user;
};
