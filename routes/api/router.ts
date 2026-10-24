import { Router } from "express";
import categoryRouter from "./category.routes.ts";

const apiRouter = Router();

apiRouter.use("/category", categoryRouter);

export default apiRouter;
