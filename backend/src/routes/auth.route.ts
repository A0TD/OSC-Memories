import { Router } from "express";
import {
  login,
  register,
  resendOtp,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller";
import { loginSchema, registerSchema } from "../models/user.model";
import validate from "../middlewares/zod.validation";

const authRouter = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - inviteCode
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: P@ssword123
 *               inviteCode:
 *                 type: string
 *                 example: IH1UI2HU3I2H4I23IB2
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User created successfully, verification OTP sent to email
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request - Missing required fields, invalid invite code, or email already exists
 *       500:
 *         description: Internal Server Error
 */
authRouter.post("/register", validate(registerSchema), register);
/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify a user's email address using an OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: "482910"
 *     responses:
 *       200:
 *         description: Email verified successfully (sets HTTP-only cookie)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *       400:
 *         description: Bad Request - User not found, already verified, or invalid/expired OTP
 *       500:
 *         description: Internal Server Error
 */
authRouter.post("/verify-email", verifyEmail);
/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend verification OTP to the user's email
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Verification OTP sent to email
 *       400:
 *         description: Bad Request - User not found or already verified
 *       500:
 *         description: Internal Server Error
 */
authRouter.post("/resend-otp", resendOtp);
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Reset password OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Reset password OTP sent to email
 *       400:
 *         description: Bad Request - User not found
 *       500:
 *         description: Internal Server Error
 */
authRouter.post("/forgot-password", forgotPassword);
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using OTP
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - newPassword
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               otp:
 *                 type: string
 *                 example: "193847"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: N3wP@ssw0rd!
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Bad Request - Invalid/expired OTP or User not found
 *       500:
 *         description: Internal Server Error
 */
authRouter.post("/reset-password", resetPassword);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in to an existing account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: P@ssword123
 *     responses:
 *       200:
 *         description: Login successful (sets HTTP-only cookie)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request - Invalid credentials or email not verified
 *       500:
 *         description: Internal Server Error
 */
authRouter.post("/login", validate(loginSchema), login);

export default authRouter;
