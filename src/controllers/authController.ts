import { Request, Response } from "express";
import { User } from "../models";
import { AppError } from "../middleware/errorHandler";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (userId: string): string => {
  const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
  const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";
  
  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRE,
    } as jwt.SignOptions
  );
};

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new AppError("Username, email, and password are required", 400);
  }

  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters long", 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new AppError("User with this email already exists", 400);
    }
    if (existingUser.username === username) {
      throw new AppError("Username already taken", 400);
    }
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
  });

  // Generate token
  const token = generateToken(user._id.toString());

  const userObj = user.toObject() as any;
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        _id: userObj._id,
        username: userObj.username,
        email: userObj.email,
        profileImage: userObj.profileImage,
        profileImageContentType: userObj.profileImageContentType,
        createdAt: userObj.createdAt,
      },
      token,
    },
  });
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  // Find user and include password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  // Generate token
  const token = generateToken(user._id.toString());

  const userObj = user.toObject() as any;
  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: {
        _id: userObj._id,
        username: userObj.username,
        email: userObj.email,
        profileImage: userObj.profileImage,
        profileImageContentType: userObj.profileImageContentType,
        createdAt: userObj.createdAt,
      },
      token,
    },
  });
};

// Get current user (protected route)
export const getMe = async (req: Request, res: Response): Promise<void> => {
  // req.user is set by the auth middleware
  const userId = (req as any).user?.id;

  if (!userId) {
    throw new AppError("User not authenticated", 401);
  }

  const user = await User.findById(userId).select("-__v");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

// Logout (client-side token removal, but we can add token blacklisting here if needed)
export const logout = async (req: Request, res: Response): Promise<void> => {
  // In a stateless JWT system, logout is typically handled client-side
  // by removing the token. However, we can add token blacklisting here
  // if you want to implement server-side logout.
  
  res.status(200).json({
    success: true,
    message: "Logged out successfully. Please remove the token from client storage.",
  });
};

