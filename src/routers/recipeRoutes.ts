import express from "express";
import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  uploadRecipeImage,
  deleteRecipeImage,
} from "../controllers/recipeController";
import { asyncHandler } from "../middleware/errorHandler";
import { uploadProfileImage as uploadMiddleware } from "../middleware/upload";

const router = express.Router();

router.route("/").get(asyncHandler(getAllRecipes)).post(asyncHandler(createRecipe));

router
  .route("/:id")
  .get(asyncHandler(getRecipeById))
  .put(asyncHandler(updateRecipe))
  .delete(asyncHandler(deleteRecipe));

// Recipe image routes
router
  .route("/:id/image")
  .post(
    uploadMiddleware.single("image"),
    asyncHandler(uploadRecipeImage)
  )
  .delete(asyncHandler(deleteRecipeImage));

export default router;

