import { getAllUsers, getUserById, updateUser, deleteUser } from "../services/userService.js";
import { sendSuccess } from "../utils/response.js";

export const getAllUsersHandler = async (_req, res, next) => {
  try {
    const users = await getAllUsers();
    return sendSuccess(res, 200, users, "Users retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const getUserByIdHandler = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    return sendSuccess(res, 200, user, "User retrieved successfully");
  } catch (error) {
    next(error);
  }
};

export const updateUserHandler = async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    return sendSuccess(res, 200, user, "User updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteUserHandler = async (req, res, next) => {
  try {
    await deleteUser(req.params.id);
    return sendSuccess(res, 200, null, "User deleted successfully");
  } catch (error) {
    next(error);
  }
};
