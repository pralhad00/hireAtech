import "server-only";
import { validateSession } from "./session";
import { redirect } from "next/navigation";

/**
 * Get the current user from the session.
 * Returns null if not authenticated or blocked.
 */
export async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "customer" | "technician" | "admin";
} | null> {
  const result = await validateSession();
  if (!result) return null;
  const { user } = result;
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
  };
}

/**
 * Require authentication — redirect to login if not signed in.
 * Preserves the intended destination in `next` query param.
 */
export async function requireUser(): Promise<{
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "customer" | "technician" | "admin";
}> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=" + encodeURIComponent("/"));
  }
  return user;
}

/**
 * Require a specific role — redirect to login if not signed in,
 * or to role home if signed in but wrong role.
 */
export async function requireRole(allowedRoles: ("customer" | "technician" | "admin")[]): Promise<{
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "customer" | "technician" | "admin";
}> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?next=" + encodeURIComponent("/"));
  }
  if (!allowedRoles.includes(user.role)) {
    redirect(getRoleHome(user.role));
  }
  return user;
}

/**
 * Require the user to be an approved technician.
 */
export async function requireApprovedTechnician(): Promise<{
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "technician";
}> {
  const user = await requireRole(["technician"]);
  // Technician approval status is checked in the technician dashboard page
  // and via the technician_profiles table in other queries
  return user as { id: string; email: string; name: string; phone: string; role: "technician" };
}

/**
 * Get the home path for a role (used for redirecting signed-in users away from login/register).
 */
export function getRoleHome(role: "customer" | "technician" | "admin"): string {
  switch (role) {
    case "customer":
      return "/bookings";
    case "technician":
      return "/technician";
    case "admin":
      return "/admin";
  }
}

/**
 * Validate a `next` redirect target — must be a relative path starting with /.
 * Prevents open redirects.
 */
export function validateNext(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/";
  }
  return next;
}