import { Types } from "mongoose";
import Products from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Order from "../models/orderModels.js";
import User from "../models/userModel.js";
import Review from "../models/reviewModel.js";
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

const priceFilter = async (req, res) => {
  const { minPrice, maxPrice } = req.query;

  try {
    let query = {};
    if (minPrice !== undefined && maxPrice !== undefined) {
      query = {
        price: {
          $gte: parseInt(minPrice, 10),
          $lte: parseInt(maxPrice, 10),
        },
      };
    }

    const filteredProducts = await Products.find(query);
    return res.json({ filteredProducts });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const checkoutOrder = async (req, res) => {
  const {
    customer,
    products: productsArray,
    shippingAddress,
    city,
    totalAmount,
    orderStatus,
    country,
  } = req.body;

  try {
    const result = await User.findById(customer);
    if (!result) {
      return res.status(404).json({ error: "Customer not register" });
    }

    const products = [];

    await Promise.all(
      productsArray.map(async ({ product, quantity }) => {
        const productResult = await Products.findById(product);
        console.log(">>>>>>>>>>", productResult);
        if (!productResult) {
          return res.status(404).json({ error: "Product not found" });
        }

        if (productResult.stock >= quantity) {
          const stockQuantity = productResult.stock - quantity;

          const updatedStock = await Products.findByIdAndUpdate(product, { stock: stockQuantity });
          products.push({
            product: {
              // eslint-disable-next-line no-underscore-dangle
              _id: productResult._id,
              title: productResult.title,
              price: productResult.price,
            },
            quantity,
          });
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

const getOrderHistory = async (req, res) => {
  const { id } = req;
  try {
    const orders = await Order.find({ customer: id }).populate({
      path: "products.product",
      select: "title price",
    }).select("-customer -shippingAddress -city -country").sort({ createdAt: -1 });
    if (orders.length === 0) {
      return res.json({ orders: [] });
    }
    return res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const productsReview = async (req, res) => {
  const {
    productId,
    userId,
    rating,
    comment,
  } = req.body;

  try {
    // Check if the user has purchased the product
    const hasPurchased = await Order.exists({ user: userId, product: productId });
    if (!hasPurchased) {
      return res.status(403).json({ message: "You must purchase the product to leave a review." });
    }

    // Create the review
    const review = new Review({
      user: userId,
      product: productId,
      purchased: true,
      rating,
      comment,
    });

    await review.save();
    return res.status(201).json({ message: "Review created successfully." });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({ message: "Server error" });
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
  getOrderHistory,
  priceFilter,
  productsReview,
};

export default productRoutesFunction;
