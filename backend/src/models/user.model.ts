import mongoose from "mongoose";
import {z} from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *           example: 60d5ecb8b5c9c22b1c8e4011
 *         username:
 *           type: string
 *           description: The user's name.
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           description: email address of the user
 *           example: johndoe123@example.com
 *         password:
 *           type: string
 *           format: password
 *           writeOnly: true
 *           description: Encrypted account password
 *           example: P@ssword123
 *         role:
 *           type: string
 *           enum: [Member, Admin]
 *           default: Member
 *           description: Access control role
 *           example: Member
 *         isVerified:
 *           type: boolean
 *           default: false
 *           description: Indicates if the email address has been verified
 *           example: false
 *         verificationOtp:
 *           type: string
 *           nullable: true
 *           description: One-time password sent for account verification
 *           example: "482910"
 *         verificationOtpExpiry:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Expiration timestamp for the verification OTP
 *           example: "2026-09-05T19:00:00.000Z"
 *         resetPasswordOtp:
 *           type: string
 *           nullable: true
 *           description: One-time password sent for resetting forgotten password
 *           example: "193847"
 *         resetPasswordOtpExpiry:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Expiration timestamp for the reset OTP
 *           example: "2026-09-05T19:15:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: Auto-generated creation timestamp
 *           example: "2026-09-05T18:45:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *           description: Auto-generated last update timestamp
 *           example: "2026-09-05T18:45:00.000Z"
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["Member", "Admin"],
      default: "Member",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationOtp: {
      type: String,
    },
    verificationOtpExpiry: {
      type: Date,
    },
    resetPasswordOtp: {
      type: String,
    },
    resetPasswordOtpExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
