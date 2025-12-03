import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import { errorHandler, notFound } from "./middleware/errorHandler";

// Import routes
import authRoutes from "./routers/authRoutes";
import userRoutes from "./routers/userRoutes";
import categoryRoutes from "./routers/categoryRoutes";
import ingredientRoutes from "./routers/ingredientRoutes";
import recipeRoutes from "./routers/recipeRoutes";
import recipeIngredientRoutes from "./routers/recipeIngredientRoutes";

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/foodiez";

// Debug: Log MongoDB URI (without password for security)
if (process.env.NODE_ENV !== 'production') {
  console.log("MongoDB URI:", mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
}

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Foodiez API is running!",
  });
});

// Auth routes (public)
app.use("/api/auth", authRoutes);

// API routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/recipe-ingredients", recipeIngredientRoutes);

// 404 handler (must be before error handler)
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
