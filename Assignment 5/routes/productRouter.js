import { Router } from "express";
import productRoutesFunction from "../controllers/productController.js";
import jwtMiddleware from "../middlewares/jwtAuthMiddleware.js";

const productRouter = Router();

const {
  getAllProducts,
  getProductById,
  addProduct,
  checkoutOrder,
  addCategory,
  updateProduct,
  deleteProduct,
  getProductByKeyword,
  getOrderHistory,
  priceFilter,
} = productRoutesFunction;

productRouter.get("/all-products", getAllProducts);
productRouter.get("/get-product-by-id/:id", getProductById);
productRouter.post("/add-product", jwtMiddleware, addProduct);
productRouter.put("/update-product/:id", jwtMiddleware, updateProduct);
productRouter.delete("/delete-product/:id", jwtMiddleware, deleteProduct);
productRouter.get("/products-search", getProductByKeyword);
productRouter.post("/add-category", jwtMiddleware, addCategory);
productRouter.get("/order-history", jwtMiddleware, getOrderHistory);
productRouter.post("/checkout", jwtMiddleware, checkoutOrder);
productRouter.get("/filter-by-price", priceFilter);

export default productRouter;
