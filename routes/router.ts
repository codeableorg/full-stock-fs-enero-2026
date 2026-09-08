import { Router } from "express";
import { setupRouter } from "./setupRouter.ts";

const router = Router();

// función setup o configuración
setupRouter(router);

export default router;
