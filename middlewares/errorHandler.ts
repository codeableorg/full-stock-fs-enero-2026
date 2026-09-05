import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errorUtils.ts";

const ERROR_TITLES: Record<number, string> = {
  400: "Solicitud incorrecta",
  401: "No autorizado",
  403: "Prohibido",
  404: "No encontrado",
  500: "Error interno del servidor",
};

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Algo salió mal...";

  res.status(statusCode).render("error", {
    errorTitle: `${statusCode} - ${ERROR_TITLES[statusCode] || "Error"}`,
    errorMessage: message,
  });
}
