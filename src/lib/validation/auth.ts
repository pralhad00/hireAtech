import { z } from "zod";

/**
 * Password rules per spec §6: 8–64 chars, at least one letter and one number.
 * bcrypt only uses first 72 bytes — 64 char cap is safe.
 */
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,64}$/;

/**
 * Plain mobile number — 10 digits, no country-code prefix rule.
 * Used for both customer and technician signup.
 */
const mobileRegex = /^\d{10}$/;

export const registerSchema = z.object({
  name: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  phone: z.string().trim().regex(mobileRegex, "Mobile number must be 10 digits"),
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

export const technicianRegisterSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  phone: z.string().trim().regex(mobileRegex, "Mobile number must be 10 digits"),
  experienceYears: z.coerce.number().int().min(0, "Experience must be 0 or more").max(60, "Experience cannot exceed 60 years"),
  categoryIds: z.array(z.string().uuid("Invalid category")).min(1, "Choose at least one category").max(3, "Choose up to three categories"),
  password: z.string().regex(passwordRegex, "Password must be 8–64 characters with at least one letter and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const logoutSchema = z.object({});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TechnicianRegisterInput = z.infer<typeof technicianRegisterSchema>;
