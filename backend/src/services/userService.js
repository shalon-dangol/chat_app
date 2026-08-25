import User from "../models/User.js";

export const getAllUsers = async () => {
  return User.find().sort({ createdAt: -1 });
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const updateUser = async (userId, updateData) => {
  const allowedFields = ["username", "email"];
  const sanitizedData = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      sanitizedData[field] = updateData[field];
    }
  }

  const user = await User.findByIdAndUpdate(userId, sanitizedData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};
