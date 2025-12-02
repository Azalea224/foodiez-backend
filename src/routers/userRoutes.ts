import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadProfileImage,
  deleteProfileImage,
} from "../controllers/userController";
import { asyncHandler } from "../middleware/errorHandler";
import { uploadProfileImage as uploadMiddleware } from "../middleware/upload";

const router = express.Router();

router.route("/").get(asyncHandler(getAllUsers)).post(asyncHandler(createUser));

router
  .route("/:id")
  .get(asyncHandler(getUserById))
  .put(asyncHandler(updateUser))
  .delete(asyncHandler(deleteUser));

// Profile image routes
router
  .route("/:id/profile-image")
  .post(
    uploadMiddleware.single("profileImage"),
    asyncHandler(uploadProfileImage)
  )
  .delete(asyncHandler(deleteProfileImage));

export default router;

