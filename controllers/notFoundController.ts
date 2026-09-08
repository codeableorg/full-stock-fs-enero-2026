import type { NextFunction, Request, Response } from "express";

export function notFoundHandler(
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  res.status(404).render("error", {
    errorTitle: "404 - No encontrado",
    errorMessage: "La página que estás buscando no existe o ha sido movida",
  });

  // Otra forma de hacerlo es lanzar un error y dejar que el errorHandler lo maneje:
  // throw new AppError("La página que estás buscando no existe o ha sido movida", 404);
}
