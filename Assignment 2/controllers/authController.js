const express = require("express");
const bcrypt = require("bcryptjs");
const {
  loginUser,
  registerUser,
  deleteUser,
  getUserById,
  updateUserById,
} = require("../models/userModel");
const jwt = require("jsonwebtoken");

const router = express.Router();

const userRegister = async (req, res) => {
  try {
    const body = req.body;

    const result = await registerUser(body, res);
    console.log(">>>", result);
    if (result.success == false) {
      res.status(500).json({ message: "Email already exist!" });
    }
    if (result.success == true) {
      res
        .status(200)
        .json({ message: "Registration successfully", result: result.data });
    }
  } catch (err) {
    console.error(err);
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);

    if (user === "userNotFound") {
      res.status(400).json({
        error: "User is not registered, Sign Up first",
      });
    }
    if (user === "invalidPassword") {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (user.success == true) {
      const token = jwt.sign(
        {
          email: email,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1H",
        }
      );

      if (token) {
        res.setHeader("Authorization", token);
        res.status(200).json({
          message: "User logged in successfully",
          token,
          data: user.DATA,
        });
        res.end();
      }
    }
  } catch (err) {
    console.error("Error during user login:", err);
    res.end();
    return res.status(500).json({ message: "Error during user login" });
  }
};

const userDelete = async (req, res) => {
  try {
    const id = req.params.id;

    const result = deleteUser(id);
    if (!result) {
      res.status(500).json({ message: "Failed to delete: Invalid ID" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error during user deletion:", error);
    return res.status(500).json({ message: "Error during user deletion" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await updateUserById(id, email);
    return res.status(200).json({ message: "User update successfully" });
  } catch (error) {
    console.error("Error during user update:", error);
    return res.status(500).json({ message: "Error during user update" });
  }
};

module.exports = { userLogin, userRegister, userDelete, updateUser };
