import { Types } from "mongoose";
import Products from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Order from "../models/orderModels.js";
import User from "../models/userModel.js";
import sendEmail from "../services/email.js";

const addProduct = async (req, res) => {
  try {
    const {
      sku,
      title,
      description,
      price,
      stock,
      brand,
      category,
    } = req.body;

    if (req.userRole !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    const existingProduct = await Products.findOne({ sku });
    if (existingProduct) {
      return res
        .status(400)
        .json({ error: "Product with this SKU already exists" });
    }

    const newProduct = new Products({
      sku,
      title,
      description,
      price,
      stock,
      brand,
      category,
    });
    const savedProduct = await newProduct.save();

    if (savedProduct) {
      return res.status(200).json({ success: true, product: savedProduct });
    } return res.status(500).json({ success: false, error: "Error inserting product" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Error inserting product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const objectId = new Types.ObjectId(id);
    if (req.userRole !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    const updatedProduct = await Products.findByIdAndUpdate(
      objectId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product update successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error during product update", error });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const objectId = new Types.ObjectId(id);
    if (req.userRole !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }
    const result = await Products.findByIdAndDelete(objectId);
    if (!result) {
      return res.status(404).json({ error: "Product not found" });
    } return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error during user deletion", error });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (req.userRole !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const newCategory = new Category({
      name,
    });
    const savedProduct = await newCategory.save();

    if (savedProduct) {
      return res.status(200).json({ success: true, product: savedProduct });
    } return res.status(500).json({ success: false, error: "Error inserting category" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Error inserting product" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find().populate("category", "-_id name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const objectId = new Types.ObjectId(id);
    const product = await Products.findById(objectId).populate(
      "category",
      "-_id name",
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getProductByKeyword = async (req, res) => {
  console.log(">>", req.query.keyword);
  try {
    const { keyword } = req.query;
    const products = await Products.find({
      $or: [
        { title: { $regex: new RegExp(keyword, "i") } },
        { description: { $regex: new RegExp(keyword, "i") } },
      ],
    }).populate("category", "-_id name");
    return res.json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const checkoutOrder = async (req, res) => {
  const {
    customer,
    products,
    shippingAddress,
    city,
    totalAmount,
    orderStatus,
    country,
  } = req.body;

  console.log("--->", products);
  try {
    const result = await User.findById(customer);
    if (!result) {
      return res.status(404).json({ error: "Customer not register" });
    }

    await Promise.all(
      products.map(async ({ product, quantity }) => {
        const productResult = await Products.findById(product);

        if (!productResult) {
          return res.status(404).json({ error: "Product not found" });
        }

        if (productResult.stock >= quantity) {
          const stockQuantity = productResult.stock - quantity;

          const updatedStock = await Products.findByIdAndUpdate(product, { stock: stockQuantity });
          return updatedStock;
        } return res.status(400).json({ error: "Insufficient stock" });
      }),
    );

    const { email } = result;
    const newOrder = new Order({
      customer,
      products,
      shippingAddress,
      city,
      totalAmount,
      orderStatus,
      country,
    });

    const savedOrder = await newOrder.save();
    const message = "Thank you for your order. Your order has been placed successfully.";

    await sendEmail(email, "Order Confirmation", message);

    return res
      .status(200)
      .json({ message: "Order placed successfully", savedOrder });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const productRoutesFunction = {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  addCategory,
  getProductByKeyword,
  checkoutOrder,
};

export default productRoutesFunction;
