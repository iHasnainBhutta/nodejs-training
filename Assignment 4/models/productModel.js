import { Schema, model } from "mongoose";

// Product Schema
const productSchema = new Schema(
  {
    sku: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category" },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
  { collection: "products" },
);

const Products = model("Products", productSchema);
export default Products;
