import express from "express";
import {
  register,
  login,
  getMe,
  logout,
} from "../controllers/authController";
import { asyncHandler } from "../middleware/errorHandler";
import { protect } from "../middleware/authorize";

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/logout", asyncHandler(logout));
router.get("/me", protect, asyncHandler(getMe));

export default router;

