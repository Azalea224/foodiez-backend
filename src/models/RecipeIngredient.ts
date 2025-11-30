import mongoose, { Schema, Document } from "mongoose";

export interface IRecipeIngredient extends Document {
  recipe_id: mongoose.Types.ObjectId;
  ingredient_id: mongoose.Types.ObjectId;
  quantity: string;
  unit: string;
}

const RecipeIngredientSchema: Schema = new Schema(
  {
    recipe_id: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
    ingredient_id: {
      type: Schema.Types.ObjectId,
      ref: "Ingredient",
      required: true,
    },
    quantity: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique combination of recipe_id and ingredient_id
RecipeIngredientSchema.index({ recipe_id: 1, ingredient_id: 1 }, { unique: true });

export default mongoose.model<IRecipeIngredient>("RecipeIngredient", RecipeIngredientSchema);

