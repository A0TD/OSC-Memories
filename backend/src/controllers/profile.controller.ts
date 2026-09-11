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

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.id;
    const { username } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,

      {
        username,
      },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new AppError(404, "User not found!");
    }

    return res.status(200).send({
      success: true,
      message: "User updated successfully",
      data: { user: updatedUser },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new AppError(404, "User not found!");
    }
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return res.status(200).send({
      success: true,
      message: "User deleted successfully",
      data: { user: deletedUser },
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
