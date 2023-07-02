import { Router } from "express";
import { Types } from "mongoose";
import jwtpkg from "jsonwebtoken";
const { sign, decode, verify } = jwtpkg;
import pkg from "bcryptjs";
import { User } from "../models/userModel.js";

const { hash, compare } = pkg;

const userRegister = async (req, res) => {
  try {
    const { name, email, password, role, address, phone } = req.body;

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
      res.status(200).json({ success: true, user: savedUser });
    } else {
      res.status(500).json({ success: false, error: "Error creating user" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Error creating user" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user === null) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (user._id) {
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (user && isPasswordValid) {
        // console.log("--------------------->", user);
        const token = sign(
          {
            email: email,
            userRole: user.role,
          },
          process.env.JWT_KEY,
          {
            expiresIn: "1H",
          }
        );

        res.status(200).json({
          message: "User logged in successfully",
          token,
          data: user,
        });
        res.end();
      }
    }
  } catch (err) {
    console.error("Error during user login:", err);
    return res.status(500).json({ message: "Error during user login" });
  }
};

const userDelete = async (req, res) => {
  try {
    const _id = req.params.id;
    const objectId = new Types.ObjectId(_id);
    if (req.userRole !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    const result = await User.findByIdAndDelete({ _id: objectId });
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    } else {
      return res.status(200).json({ message: "User deleted successfully" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error during user deletion", error });
  }
};

const updateUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const updateData = req.body;
    const objectId = new Types.ObjectId(_id);

    if (req.userRole !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findByIdAndUpdate({ _id: objectId }, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User update successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error during user update" });
  }
};

export const routesFunction = {
  userLogin,
  userRegister,
  userDelete,
  updateUser,
};
