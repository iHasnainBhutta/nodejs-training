import { Types } from "mongoose";
import jwtpkg from "jsonwebtoken";
import pkg from "bcryptjs";
import User from "../models/userModel.js";

const { sign } = jwtpkg;
const { hash, compare } = pkg;

const userRegister = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      address,
      phone,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    let hashedPassword;
    try {
      hashedPassword = await hash(password, 10);
    } catch (error) {
      console.error("Error during password hashing:", error);
      throw error;
    }
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      address,
      phone,
    });
    const savedUser = await newUser.save();

    if (savedUser) {
      return res.status(200).json({ success: true, user: savedUser });
    }
    return res
      .status(500)
      .json({ success: false, error: "Error creating user" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, error: "Error creating user" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user === null) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = sign(
      {
        // eslint-disable-next-line no-underscore-dangle
        id: user._id,
        email,
        userRole: user.role,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "1H",
      },
    );
    return res
      .status(200)
      .json({ message: "User logged in successfully", token, data: user });
  } catch (err) {
    console.error("Error during user login:", err);
    return res.status(500).json({ message: "Error during user login" });
  }
};

const userDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new Types.ObjectId(id);
    if (req.userRole !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    const result = await User.findByIdAndDelete(objectId);
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error during user deletion", error });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const objectId = new Types.ObjectId(id);
    if (req.userRole !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findByIdAndUpdate(objectId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User update successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error during user update", error });
  }
};

const getAllUsers = async (req, res) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Forbidden: You do not have permission to access this endpoint." });
  }

  try {
    const users = await User.find();
    return res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const routesFunction = {
  userLogin,
  userRegister,
  userDelete,
  updateUser,
  getAllUsers,
};

export default routesFunction;
