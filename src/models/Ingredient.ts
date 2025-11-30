import mongoose, { Schema, Document } from "mongoose";

export interface IIngredient extends Document {
  name: string;
}

const IngredientSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IIngredient>("Ingredient", IngredientSchema);

