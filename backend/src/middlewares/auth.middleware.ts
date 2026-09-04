import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthenticated",
      });
    }
    (req as any).user = jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const authorize = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = (req as any).user.role;
      if (userRole !== role) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized",
        });
      }
      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
};
