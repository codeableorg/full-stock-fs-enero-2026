import { Router } from "express";
import * as authController from "../controllers/authController.js";
const authRouter = Router();

authRouter.get("/", authController.renderSignup);
authRouter.post("/", authController.handleSignup);

export default authRouter;
