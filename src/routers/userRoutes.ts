import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { asyncHandler } from "../middleware/errorHandler";

const router = express.Router();

router.route("/").get(asyncHandler(getAllUsers)).post(asyncHandler(createUser));

router
  .route("/:id")
  .get(asyncHandler(getUserById))
  .put(asyncHandler(updateUser))
  .delete(asyncHandler(deleteUser));

export default router;

