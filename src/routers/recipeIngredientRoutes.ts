import express from "express";
import {
  getAllRecipeIngredients,
  getRecipeIngredientById,
  createRecipeIngredient,
  updateRecipeIngredient,
  deleteRecipeIngredient,
  getIngredientsByRecipe,
} from "../controllers/recipeIngredientController";
import { asyncHandler } from "../middleware/errorHandler";

const router = express.Router();

router
  .route("/")
  .get(asyncHandler(getAllRecipeIngredients))
  .post(asyncHandler(createRecipeIngredient));

router
  .route("/:id")
  .get(asyncHandler(getRecipeIngredientById))
  .put(asyncHandler(updateRecipeIngredient))
  .delete(asyncHandler(deleteRecipeIngredient));

// Get all ingredients for a specific recipe
router.route("/recipe/:recipe_id").get(asyncHandler(getIngredientsByRecipe));

export default router;

