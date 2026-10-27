import { Router } from "express";
import * as categoryController from "../../controllers/categoryController.ts";

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getAll);

export default categoryRouter;
