import { Schema, model } from "mongoose";

const OrderSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    shippingAddress: { type: String, required: true },
    city: {
      type: String,
      required: true,
    },
    totalAmount: { type: Number, required: true },
    orderStatus: { type: String, required: true },
    country: {
      type: String,
      required: true,
    },
  },
  { collection: "orders", versionKey: false }
);

export const Order = model("Order", OrderSchema);
