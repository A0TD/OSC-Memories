import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod/v3";

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = (err as any)?.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(", ");
  }

  res.status(statusCode).send({
    success: "false",
    message,
  });
};
