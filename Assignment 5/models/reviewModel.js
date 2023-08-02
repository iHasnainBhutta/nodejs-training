import { Schema, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Products", required: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "reviews", versionKey: false },
);

const Review = model("Review", ReviewSchema);

export default Review;
