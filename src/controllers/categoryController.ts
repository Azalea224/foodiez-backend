import { Request, Response } from "express";
import { Category } from "../models";
import { AppError } from "../middleware/errorHandler";

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  const categories = await Category.find().select("-__v");
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const category = await Category.findById(id).select("-__v");

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.status(200).json({
    success: true,
    data: category,
  });
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  const { name, description } = req.body;

  if (!name) {
    throw new AppError("Category name is required", 400);
  }

  const category = await Category.create({ name, description });
  res.status(201).json({
    success: true,
    data: category,
  });
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    { name, description },
    { new: true, runValidators: true }
  ).select("-__v");

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.status(200).json({
    success: true,
    data: category,
  });
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
};

