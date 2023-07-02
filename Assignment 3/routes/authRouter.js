import { Router } from "express";
import { routesFunction } from "../controllers/authController.js";
import { jwtMiddleware } from "../middlewares/auth.js";
const authRouter = Router();

authRouter.post("/user-register", routesFunction.userRegister);
authRouter.post("/user-login", routesFunction.userLogin);
authRouter.put("/user-update/:id", jwtMiddleware, routesFunction.updateUser);
authRouter.delete("/user-delete/:id", jwtMiddleware, routesFunction.userDelete);

export default authRouter;
