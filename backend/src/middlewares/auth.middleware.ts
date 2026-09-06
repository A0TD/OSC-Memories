import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.util";
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new AppError(401, "Unauthenticated");
    }
    (req as any).user = jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch (err) {
    next(err);
  }
};

export const authorize = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = (req as any).user.role;
      if (userRole !== role) {
        throw new AppError(403, "Unauthorized");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
