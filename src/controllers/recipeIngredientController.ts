import { Request, Response } from "express";
import { RecipeIngredient, Recipe, Ingredient } from "../models";
import { AppError } from "../middleware/errorHandler";

export const getAllRecipeIngredients = async (req: Request, res: Response): Promise<void> => {
  const { recipe_id, ingredient_id } = req.query;
  const filter: any = {};

  if (recipe_id) filter.recipe_id = recipe_id;
  if (ingredient_id) filter.ingredient_id = ingredient_id;

  const recipeIngredients = await RecipeIngredient.find(filter)
    .populate("recipe_id", "title description")
    .populate("ingredient_id", "name")
    .select("-__v")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: recipeIngredients.length,
    data: recipeIngredients,
  });
};

export const getRecipeIngredientById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const recipeIngredient = await RecipeIngredient.findById(id)
    .populate("recipe_id", "title description")
    .populate("ingredient_id", "name")
    .select("-__v");

  if (!recipeIngredient) {
    throw new AppError("Recipe ingredient not found", 404);
  }

  res.status(200).json({
    success: true,
    data: recipeIngredient,
  });
};

export const createRecipeIngredient = async (req: Request, res: Response): Promise<void> => {
  const { recipe_id, ingredient_id, quantity, unit } = req.body;

  if (!recipe_id || !ingredient_id || !quantity || !unit) {
    throw new AppError("recipe_id, ingredient_id, quantity, and unit are required", 400);
  }

  // Verify recipe exists
  const recipe = await Recipe.findById(recipe_id);
  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  // Verify ingredient exists
  const ingredient = await Ingredient.findById(ingredient_id);
  if (!ingredient) {
    throw new AppError("Ingredient not found", 404);
  }

  const recipeIngredient = await RecipeIngredient.create({
    recipe_id,
    ingredient_id,
    quantity,
    unit,
  });

  const populatedRecipeIngredient = await RecipeIngredient.findById(recipeIngredient._id)
    .populate("recipe_id", "title description")
    .populate("ingredient_id", "name")
    .select("-__v");

  res.status(201).json({
    success: true,
    data: populatedRecipeIngredient,
  });
};

export const updateRecipeIngredient = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { recipe_id, ingredient_id, quantity, unit } = req.body;

  // Verify recipe exists if provided
  if (recipe_id) {
    const recipe = await Recipe.findById(recipe_id);
    if (!recipe) {
      throw new AppError("Recipe not found", 404);
    }
  }

  // Verify ingredient exists if provided
  if (ingredient_id) {
    const ingredient = await Ingredient.findById(ingredient_id);
    if (!ingredient) {
      throw new AppError("Ingredient not found", 404);
    }
  }

  const updateData: any = {};
  if (recipe_id) updateData.recipe_id = recipe_id;
  if (ingredient_id) updateData.ingredient_id = ingredient_id;
  if (quantity) updateData.quantity = quantity;
  if (unit) updateData.unit = unit;

  const recipeIngredient = await RecipeIngredient.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("recipe_id", "title description")
    .populate("ingredient_id", "name")
    .select("-__v");

  if (!recipeIngredient) {
    throw new AppError("Recipe ingredient not found", 404);
  }

  res.status(200).json({
    success: true,
    data: recipeIngredient,
  });
};

export const deleteRecipeIngredient = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const recipeIngredient = await RecipeIngredient.findByIdAndDelete(id);

  if (!recipeIngredient) {
    throw new AppError("Recipe ingredient not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Recipe ingredient deleted successfully",
  });
};

// Get all ingredients for a specific recipe
export const getIngredientsByRecipe = async (req: Request, res: Response): Promise<void> => {
  const { recipe_id } = req.params;
  const recipeIngredients = await RecipeIngredient.find({ recipe_id })
    .populate("ingredient_id", "name")
    .select("-__v -recipe_id");

  res.status(200).json({
    success: true,
    count: recipeIngredients.length,
    data: recipeIngredients,
  });
};

