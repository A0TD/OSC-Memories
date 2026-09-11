import { Request, Response, NextFunction } from "express";
import Media from "../models/media.model";
import AppError from "../utils/appError.util";
import User from "../models/user.model";

export const getOwnUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const foundUser = await User.findById((req as any).user.id);

    if (!foundUser) throw new AppError(404, "User not found!");

    return res.status(200).send({
      success: true,
      message: "User retrieved successfully",
      data: { user: foundUser },
    });
  } catch (err) {
    next(err);
  }
};

export const getOwnMedia = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const foundMedia = await Media.find({ ownerId: (req as any).user.id });

    if (!foundMedia) throw new AppError(404, "Media not found!");

    return res.status(200).send({
      success: true,
      message: "Successfully retrieved media!",
      data: { media: foundMedia },
    });
  } catch (err) {
    next(err);
  }
};
