import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import AppError from "../utils/appError.util";

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allUsers = await User.find().sort({ date: -1 });

    res.status(200).send({
      success: true,
      message: "Users fetched successfully!",
      data: {
        allUsers,
      },
    });
  } catch (err) {
    next(err);
  }
};

const makeAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role: "Admin",
      },
      { new: true },
    );

    res.status(200).send({
      success: true,
      message: "User has been promoted!",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if(!deletedUser)
      throw new AppError(404, "User not found");

    res.status(200).send({
      success: true,
      message: "User deleted successfully!",
      data: {
        deletedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

export {getAllUsers,makeAdmin,deleteUser}