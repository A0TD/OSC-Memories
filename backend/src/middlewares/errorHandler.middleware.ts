import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

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
    const firstIssue = err.issues[0];
    const fieldPath = firstIssue.path.join(".");
    message = `${fieldPath}: ${firstIssue.message}`;
  }

  if (statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).send({
    success: false,
    message,
  });
};
