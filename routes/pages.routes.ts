import { Router } from "express";
import * as pagesController from "../controllers/pagesController.ts";
const pagesRouter = Router();

pagesRouter.get("/", pagesController.renderHome);
pagesRouter.get("/about", pagesController.renderAbout);
pagesRouter.get("/terms", pagesController.renderTerms);
pagesRouter.get("/privacy", pagesController.renderPrivacy);

export default pagesRouter;
