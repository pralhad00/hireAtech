"use server";

import { registerSchema, loginSchema, RegisterInput, LoginInput } from "@/lib/validation/auth";
import { hashPassword, verifyPassword, dummyVerify } from "@/lib/auth/password";
import { findUserByEmail, createUser, incrementFailedLogin, resetFailedLogin, isUserLocked, isUserBlocked } from "@/lib/queries/users";
import { createUserSession, logout, logoutAllSessions, cleanupSessions } from "@/lib/auth/session";

type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: { message: string; fieldErrors?: Record<string, string[]> } };

/**
 * Register a new customer.
 */
export async function registerAction(input: RegisterInput): Promise<ActionResult<{ userId: string }>> {
  // Validate with zod
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { ok: false, error: { message: "Validation failed", fieldErrors } };
  }

  const { name, email, phone, password } = parsed.data;

  // Check if email already exists (case-insensitive)
  const existing = await findUserByEmail(email);
  if (existing) {
    return {
      ok: false,
      error: { message: "An account with this email already exists", fieldErrors: { email: ["Email already registered"] } },
    };
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user (role = customer)
  const user = await createUser({ email, passwordHash, fullName: name, phone, role: "customer" });

  // Create session
  await createUserSession(user.id);

  return { ok: true, data: { userId: user.id } };
}

/**
 * Log in a user (customer, technician, or admin).
 */
export async function loginAction(input: LoginInput): Promise<ActionResult<{ role: string }>> {
  // Validate with zod
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { ok: false, error: { message: "Validation failed", fieldErrors } };
  }

  const { email, password } = parsed.data;

  // Clean up expired sessions opportunistically
  await cleanupSessions();

  // Check if user is locked out
  if (await isUserLocked(email)) {
    return {
      ok: false,
      error: { message: "Too many failed attempts. Try again in 15 minutes." },
    };
  }

  // Check if user is blocked
  if (await isUserBlocked(email)) {
    return {
      ok: false,
      error: { message: "This account has been blocked. Contact support." },
    };
  }

  // Find user by email
  const user = await findUserByEmail(email);

  // Equal-timing: always run bcrypt compare
  let passwordValid = false;
  if (user) {
    passwordValid = await verifyPassword(password, user.password_hash);
  } else {
    // Dummy compare to prevent timing attacks
    await dummyVerify();
  }

  if (!user || !passwordValid) {
    // Increment failed attempts (even if user doesn't exist - but only if they do)
    if (user) {
      await incrementFailedLogin(email);
    }
    return {
      ok: false,
      error: { message: "Invalid email or password" },
    };
  }

  // Success — reset failed attempts
  await resetFailedLogin(user.id);

  // Create new session (never reuse old token)
  await createUserSession(user.id);

  return { ok: true, data: { role: user.role } };
}

/**
 * Log out the current user.
 */
export async function logoutAction(): Promise<ActionResult> {
  await logout();
  return { ok: true, data: undefined };
}

/**
 * Log out all sessions for the current user (password change).
 */
export async function logoutAllAction(): Promise<ActionResult> {
  const user = await (await import("@/lib/auth/guards")).getCurrentUser();
  if (user) {
    await logoutAllSessions(user.id);
  }
  return { ok: true, data: undefined };
}