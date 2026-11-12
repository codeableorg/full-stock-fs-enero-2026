import { Router } from "express";
import * as categoryController from "../../controllers/categoryController.ts";

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getAll);
categoryRouter.get("/:slug", categoryController.getOneBySlug);

export default categoryRouter;
