import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  description: string;
  user_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
}

const RecipeSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRecipe>("Recipe", RecipeSchema);

