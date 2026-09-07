import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    inviteCode: z.string().min(1, "Invite code is required"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    otp: z.string().min(1, "OTP is required"),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    otp: z.string().min(1, "OTP is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
  }),
});
