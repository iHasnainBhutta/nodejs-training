import { Router } from "express";
import productRoutesFunction from "../controllers/productController.js";
import jwtMiddleware from "../middlewares/auth.js";

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
} = productRoutesFunction;

productRouter.get("/all-products", getAllProducts);
productRouter.get("/get-product-by-id/:id", getProductById);
productRouter.post("/add-product", jwtMiddleware, addProduct);
productRouter.post("/checkout", jwtMiddleware, checkoutOrder);
productRouter.post("/add-category", jwtMiddleware, addCategory);
productRouter.put("/update-product/:id", jwtMiddleware, updateProduct);
productRouter.delete("/delete-product/:id", jwtMiddleware, deleteProduct);
productRouter.get("/products-search", getProductByKeyword);

export default productRouter;
