import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
  },

  { collection: "users", versionKey: false },
);

const User = model("Users", userSchema);
export default User;
