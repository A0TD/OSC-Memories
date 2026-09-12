import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import AppError from "../utils/appError.util";
import Media from "../models/media.model";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allUsers = await User.find().sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Users fetched successfully!",
      users: allUsers,
    });
  } catch (err) {
    next(err);
  }
};
export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params.userId;
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      throw new AppError(404, "User not found");
    }
    res.status(200).send({
      success: true,
      message: "User fetched successfully!",
      user: foundUser,
    });
  } catch (err) {
    next(err);
  }
};

export const changeRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;

    const foundUser = await User.findById(userId);

    if (!foundUser) {
      throw new AppError(404, "User not found");
    }
    foundUser.role = foundUser.role === "Admin" ? "Member" : "Admin";
    await foundUser.save();

    res.status(200).send({
      success: true,
      message: "User role has been changed!",
      user: foundUser,
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
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) throw new AppError(404, "User not found");

    res.status(200).send({
      success: true,
      message: "User deleted successfully!",
      user: deletedUser,
    });
  } catch (err) {
    next(err);
  }
};

export const getOwnUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const foundUser = await User.findById((req as any).user.id);

    if (!foundUser) {
      throw new AppError(404, "User not found!");
    }

    return res.status(200).send({
      success: true,
      message: "User retrieved successfully",
      user: foundUser,
    });
  } catch (err) {
    next(err);
  }
};

export const updateOwnUser = async (
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
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteOwnUser = async (
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
      user: deletedUser,
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
      media: foundMedia,
    });
  } catch (err) {
    next(err);
  }
};
