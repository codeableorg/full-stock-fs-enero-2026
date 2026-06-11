import { Router } from "express";
import * as authController from "../controllers/authController.js";
const authRouter = Router();

authRouter.get("/signup", authController.renderSignup);
authRouter.post("/signup", authController.handleSignup);
authRouter.get("/login", authController.renderLogin);
authRouter.post("/login", authController.handleLogin);
authRouter.post("/logout", authController.handleLogout);

export default authRouter;
