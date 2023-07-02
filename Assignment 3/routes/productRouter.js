import { Router } from "express";
import { productRoutesFunction } from "../controllers/productController.js";
import { jwtMiddleware } from "../middlewares/auth.js";

const productRouter = Router();

productRouter.get("/all-products", productRoutesFunction.getAllProducts);
productRouter.get(
  "/get-product-by-id/:id",
  productRoutesFunction.getProductById
);
productRouter.post("/add-product", productRoutesFunction.addProduct);
productRouter.post(
  "/checkout",
  jwtMiddleware,
  productRoutesFunction.checkoutOrder
);
productRouter.post(
  "/add-category",
  jwtMiddleware,
  productRoutesFunction.addCategory
);
productRouter.put("/update-product/:id", productRoutesFunction.updateProduct);
productRouter.delete(
  "/delete-product/:id",
  jwtMiddleware,
  productRoutesFunction.deleteProduct
);
productRouter.get(
  "/products-search",
  productRoutesFunction.getProductByKeyword
);

export default productRouter;
