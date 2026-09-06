import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import AppError from "../utils/appError.util";
import { sendVerificationOtp } from "../utils/sendOtp.util";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password, inviteCode } = req.body;
    if (inviteCode !== process.env.INVITE_CODE) {
      throw new AppError(400, "Invalid invite code");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(400, "User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    await sendVerificationOtp(user._id, user.email);

    return res.status(201).send({
      success: true,
      message: "User created successfully, verification OTP sent to email",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(400, "User not found");
    }
    if (user.isVerified) {
      throw new AppError(400, "Email already verified");
    }
    if (!user.verificationOtp || !user.verificationOtpExpiry) {
      throw new AppError(400, "No OTP found, please request a new one");
    }
    if (user.verificationOtpExpiry < new Date()) {
      throw new AppError(400, "OTP has expired");
    }
    const isOtpValid = await bcrypt.compare(otp, user.verificationOtp);
    if (!isOtpValid) {
      throw new AppError(400, "Invalid OTP");
    }
    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpiry = undefined;
    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1 * 60 * 60 * 1000,
    });
    res.status(200).send({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const resendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError(400, "User not found");
    }
    if (user.isVerified) {
      throw new AppError(400, "Email already verified");
    }
    await sendVerificationOtp(user._id, user.email);
    return res.status(200).send({
      success: true,
      message: "Verification OTP sent to email",
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new AppError(400, "Invalid email or password");
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      throw new AppError(400, "Invalid email or password");
    }
    if (!user.isVerified) {
      throw new AppError(400, "Email not verified");
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 1 * 60 * 60 * 1000,
    });

    return res.status(200).send({
      success: true,
      message: "Login successful",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
