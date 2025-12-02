import { Request, Response } from "express";
import { User } from "../models";
import { AppError } from "../middleware/errorHandler";
import { RequestWithFile } from "../type/http";

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
  const { username, email, password } = req.body;

  if (!username || !email) {
    throw new AppError("Username and email are required", 400);
  }

  // If password is provided, use it; otherwise create user without password (for admin use)
  const userData: any = { username, email };
  if (password) {
    userData.password = password;
  }

  const user = await User.create(userData);
  const userObj = (user as any).toObject();
  res.status(201).json({
    success: true,
    data: {
      _id: userObj._id,
      username: userObj.username,
      email: userObj.email,
      profileImage: userObj.profileImage,
      profileImageContentType: userObj.profileImageContentType,
      createdAt: userObj.createdAt,
      updatedAt: userObj.updatedAt,
    },
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

export const uploadProfileImage = async (
  req: RequestWithFile,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  if (!req.file) {
    throw new AppError("No image file provided", 400);
  }

  // Check if file is an image
  if (!req.file.mimetype.startsWith("image/")) {
    throw new AppError("File must be an image", 400);
  }

  // Convert buffer to base64
  const base64Image = req.file.buffer.toString("base64");
  const imageDataUri = `data:${req.file.mimetype};base64,${base64Image}`;

  // Update user with profile image
  const user = await User.findByIdAndUpdate(
    id,
    {
      profileImage: imageDataUri,
      profileImageContentType: req.file.mimetype,
    },
    { new: true, runValidators: true }
  ).select("-__v");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Profile image uploaded successfully",
    data: user,
  });
};

export const deleteProfileImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(
    id,
    {
      profileImage: null,
      profileImageContentType: null,
    },
    { new: true, runValidators: true }
  ).select("-__v");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Profile image deleted successfully",
    data: user,
  });
};