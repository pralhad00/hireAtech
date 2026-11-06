import { z } from "zod";

/**
 * Password rules per spec §6: 8–64 chars, at least one letter and one number.
 * bcrypt only uses first 72 bytes — 64 char cap is safe.
 */
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  phone: z.string().trim().regex(/^9[6-8]\d{8}$/, "Nepali mobile number required (10 digits, starts with 96/97/98)"),
  password: z.string().regex(passwordRegex, "Password must be 8–64 characters with at least one letter and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const logoutSchema = z.object({});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;