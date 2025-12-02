import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  description: string;
  user_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
  image?: string; // Base64 encoded image data
  imageContentType?: string; // MIME type (e.g., 'image/jpeg', 'image/png')
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
    image: {
      type: String,
      default: null,
    },
    imageContentType: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRecipe>("Recipe", RecipeSchema);

