import { Request, Response } from "express";
import { User } from "../models";
import { AppError } from "../middleware/errorHandler";

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const users = await User.find().select("-__v");
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const user = await User.findById(id).select("-__v");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email } = req.body;

  if (!username || !email) {
    throw new AppError("Username and email are required", 400);
  }

  const user = await User.create({ username, email });
  res.status(201).json({
    success: true,
    data: user,
  });
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { username, email } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { username, email },
    { new: true, runValidators: true }
  ).select("-__v");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
};
