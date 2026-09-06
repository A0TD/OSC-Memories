import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import transporter from "../config/nodemailer.config";
import mongoose from "mongoose";

export const sendVerificationOtp = async (
  userId: mongoose.Types.ObjectId,
  email: string,
) => {
  try {
    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); //5 mins
    await User.findByIdAndUpdate(userId, {
      verificationOtp: hashedOtp,
      verificationOtpExpiry: otpExpiry,
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verification OTP",
      html: `
      <h2>Verification OTP</h2>
      <p>Your one-time passcode is:</p>
      <h1 style="letter-spacing: 5px; color: #4F46E5;">${otp}</h1>
      <p>This code expires in 5 minutes.</p>
    `,
    });
  } catch (err) {
    throw err;
  }
};

export const sendResetPasswordOtp = async (
  userId: mongoose.Types.ObjectId,
  email: string,
) => {
  try {
    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); //5 mins
    await User.findByIdAndUpdate(userId, {
      resetPasswordOtp: hashedOtp,
      resetPasswordOtpExpiry: otpExpiry,
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Reset Password OTP",
      html: `
      <h2>Reset Password OTP</h2>
      <p>Your one-time passcode is:</p>
      <h1 style="letter-spacing: 5px; color: #4F46E5;">${otp}</h1>
      <p>This code expires in 5 minutes.</p>
    `,
    });
  } catch (err) {
    throw err;
  }
};
