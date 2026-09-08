import mongoose from "mongoose";
import Media from "./media.model";

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
 *           readOnly: true
 *           description: Auto-generated MongoDB ObjectId
 *           example: 60d5ecb8b5c9c22b1c8e4011
 *         username:
 *           type: string
 *           description: The user's name
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
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
 *           description: One-time password sent for account verification
 *           example: "482910"
 *         verificationOtpExpiry:
 *           type: string
 *           format: date-time
 *           description: Expiration timestamp for the verification OTP
 *           example: "2026-09-05T19:00:00.000Z"
 *         resetPasswordOtp:
 *           type: string
 *           description: One-time password sent for resetting forgotten password
 *           example: "193847"
 *         resetPasswordOtpExpiry:
 *           type: string
 *           format: date-time
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
      select: false,
    },
    verificationOtpExpiry: {
      type: Date,
      select: false,
    },
    resetPasswordOtp: {
      type: String,
      select: false,
    },
    resetPasswordOtpExpiry: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (doc, ret: any) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    delete ret.verificationOtp;
    delete ret.verificationOtpExpiry;
    delete ret.resetPasswordOtp;
    delete ret.resetPasswordOtpExpiry;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});
//before deleting a user, delete all related media
userSchema.pre("findOneAndDelete", async function () {
  const userId = this.getQuery()._id;
  await Media.deleteMany({ ownerId: userId });
});

const User = mongoose.model("User", userSchema);

export default User;
