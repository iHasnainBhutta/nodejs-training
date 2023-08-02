import { Router } from "express";
import authRoutesFunction from "../controllers/authController.js";
import jwtMiddleware from "../middlewares/jwtAuthMiddleware.js";

const authRouter = Router();

const {
  userLogin,
  userRegister,
  userDelete,
  updateUser,
  getAllUsers,
} = authRoutesFunction;

authRouter.post("/user-register", userRegister);
authRouter.post("/user-login", userLogin);
authRouter.put("/user-update/:id", jwtMiddleware, updateUser);
authRouter.delete("/user-delete/:id", jwtMiddleware, userDelete);
authRouter.get("/all-users", jwtMiddleware, getAllUsers);

export default authRouter;
