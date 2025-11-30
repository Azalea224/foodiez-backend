import express from "express";
import {
  getAllIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "../controllers/ingredientController";
import { asyncHandler } from "../middleware/errorHandler";

const router = express.Router();

router
  .route("/")
  .get(asyncHandler(getAllIngredients))
  .post(asyncHandler(createIngredient));

router
  .route("/:id")
  .get(asyncHandler(getIngredientById))
  .put(asyncHandler(updateIngredient))
  .delete(asyncHandler(deleteIngredient));

export default router;

