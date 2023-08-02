import { Schema, model } from "mongoose";

const OrderSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    products: [
      {
        product: {
          type: {
            _id: { type: Schema.Types.ObjectId },
            title: { type: String },
            price: { type: Number },
          },
          ref: "Products",
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
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "orders", versionKey: false },
);

const Order = model("Order", OrderSchema);

export default Order;
