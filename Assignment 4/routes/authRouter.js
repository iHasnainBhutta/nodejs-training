import { Router } from "express";
import authRoutesFunction from "../controllers/authController.js";
import jwtMiddleware from "../middlewares/auth.js";

const authRouter = Router();

const {
  userLogin,
  userRegister,
  userDelete,
  updateUser,
} = authRoutesFunction;

authRouter.post("/user-register", userRegister);
authRouter.post("/user-login", userLogin);
authRouter.put("/user-update/:id", jwtMiddleware, updateUser);
authRouter.delete("/user-delete/:id", jwtMiddleware, userDelete);

export default authRouter;
