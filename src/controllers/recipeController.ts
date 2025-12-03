import { Request, Response } from "express";
import { Recipe, User, Category } from "../models";
import { AppError } from "../middleware/errorHandler";
import { RequestWithFile } from "../type/http";

export const getAllRecipes = async (req: Request, res: Response): Promise<void> => {
  const { user_id, category_id } = req.query;
  const filter: any = {};

  if (user_id) filter.user_id = user_id;
  if (category_id) filter.category_id = category_id;

  const recipes = await Recipe.find(filter)
    .populate("user_id", "username email")
    .populate("category_id", "name description")
    .select("-__v")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: recipes.length,
    data: recipes,
  });
};

export const getRecipeById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const recipe = await Recipe.findById(id)
    .populate("user_id", "username email")
    .populate("category_id", "name description")
    .select("-__v");

  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  res.status(200).json({
    success: true,
    data: recipe,
  });
};

export const createRecipe = async (req: Request, res: Response): Promise<void> => {
  if (!req.body) {
    throw new AppError("Request body is missing. Ensure Content-Type is application/json", 400);
  }

  const { title, description, user_id, category_id } = req.body;

  if (!title || !user_id || !category_id) {
    throw new AppError("Title, user_id, and category_id are required", 400);
  }

  // Verify user exists
  const user = await User.findById(user_id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Verify category exists
  const category = await Category.findById(category_id);
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  const recipe = await Recipe.create({ title, description, user_id, category_id });
  const populatedRecipe = await Recipe.findById(recipe._id)
    .populate("user_id", "username email")
    .populate("category_id", "name description")
    .select("-__v");

  res.status(201).json({
    success: true,
    data: populatedRecipe,
  });
};

export const updateRecipe = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, description, user_id, category_id } = req.body;

  // Verify user exists if provided
  if (user_id) {
    const user = await User.findById(user_id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
  }

  // Verify category exists if provided
  if (category_id) {
    const category = await Category.findById(category_id);
    if (!category) {
      throw new AppError("Category not found", 404);
    }
  }

  const updateData: any = {};
  if (title) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (user_id) updateData.user_id = user_id;
  if (category_id) updateData.category_id = category_id;

  const recipe = await Recipe.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("user_id", "username email")
    .populate("category_id", "name description")
    .select("-__v");

  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  res.status(200).json({
    success: true,
    data: recipe,
  });
};

export const deleteRecipe = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const recipe = await Recipe.findByIdAndDelete(id);

  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Recipe deleted successfully",
  });
};

export const uploadRecipeImage = async (
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

  // Verify recipe exists
  const recipe = await Recipe.findById(id);
  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  // Convert buffer to base64
  const base64Image = req.file.buffer.toString("base64");
  const imageDataUri = `data:${req.file.mimetype};base64,${base64Image}`;

  // Update recipe with image
  const updatedRecipe = await Recipe.findByIdAndUpdate(
    id,
    {
      image: imageDataUri,
      imageContentType: req.file.mimetype,
    },
    { new: true, runValidators: true }
  )
    .populate("user_id", "username email")
    .populate("category_id", "name description")
    .select("-__v");

  res.status(200).json({
    success: true,
    message: "Recipe image uploaded successfully",
    data: updatedRecipe,
  });
};

export const deleteRecipeImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  // Verify recipe exists
  const recipe = await Recipe.findById(id);
  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  const updatedRecipe = await Recipe.findByIdAndUpdate(
    id,
    {
      image: null,
      imageContentType: null,
    },
    { new: true, runValidators: true }
  )
    .populate("user_id", "username email")
    .populate("category_id", "name description")
    .select("-__v");

  res.status(200).json({
    success: true,
    message: "Recipe image deleted successfully",
    data: updatedRecipe,
  });
};

