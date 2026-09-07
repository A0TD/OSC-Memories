import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import transporter from "../config/nodemailer.config";
import mongoose from "mongoose";

const sendOtp = async (
  userId: mongoose.Types.ObjectId,
  email: string,
  type: "verification" | "resetPassword" = "verification",
) => {
  try {
    const otp = crypto.randomInt(100000, 1000000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); //5 mins
    await User.findByIdAndUpdate(userId, {
      [`${type}Otp`]: hashedOtp,
      [`${type}OtpExpiry`]: otpExpiry,
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `${type === "verification" ? "Verification" : "Reset Password"} OTP`,
      html: `
      <h2>${type === "verification" ? "Verification" : "Reset Password"} OTP</h2>
      <p>Your one-time passcode is:</p>
      <h1 style="letter-spacing: 5px; color: #4F46E5;">${otp}</h1>
      <p>This code expires in 5 minutes.</p>
    `,
    });
  } catch (err) {
    throw err;
  }
};

export default sendOtp;
