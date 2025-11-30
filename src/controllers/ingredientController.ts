import { Request, Response } from "express";
import { Ingredient } from "../models";
import { AppError } from "../middleware/errorHandler";

export const getAllIngredients = async (req: Request, res: Response): Promise<void> => {
  const ingredients = await Ingredient.find().select("-__v").sort({ name: 1 });
  res.status(200).json({
    success: true,
    count: ingredients.length,
    data: ingredients,
  });
};

export const getIngredientById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const ingredient = await Ingredient.findById(id).select("-__v");

  if (!ingredient) {
    throw new AppError("Ingredient not found", 404);
  }

  res.status(200).json({
    success: true,
    data: ingredient,
  });
};

export const createIngredient = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;

  if (!name) {
    throw new AppError("Ingredient name is required", 400);
  }

  const ingredient = await Ingredient.create({ name });
  res.status(201).json({
    success: true,
    data: ingredient,
  });
};

export const updateIngredient = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name } = req.body;

  const ingredient = await Ingredient.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true }
  ).select("-__v");

  if (!ingredient) {
    throw new AppError("Ingredient not found", 404);
  }

  res.status(200).json({
    success: true,
    data: ingredient,
  });
};

export const deleteIngredient = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const ingredient = await Ingredient.findByIdAndDelete(id);

  if (!ingredient) {
    throw new AppError("Ingredient not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Ingredient deleted successfully",
  });
};

