import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { asyncHandler } from "../middleware/errorHandler";

const router = express.Router();

router
  .route("/")
  .get(asyncHandler(getAllCategories))
  .post(asyncHandler(createCategory));

router
  .route("/:id")
  .get(asyncHandler(getCategoryById))
  .put(asyncHandler(updateCategory))
  .delete(asyncHandler(deleteCategory));

export default router;

