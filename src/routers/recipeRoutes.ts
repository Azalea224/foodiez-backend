import express from "express";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController";
import { asyncHandler } from "../middleware/errorHandler";

const router = express.Router();

router.route("/").get(asyncHandler(getAllRecipes)).post(asyncHandler(createRecipe));

router
  .route("/:id")
  .get(asyncHandler(getRecipeById))
  .put(asyncHandler(updateRecipe))
  .delete(asyncHandler(deleteRecipe));

export default router;

