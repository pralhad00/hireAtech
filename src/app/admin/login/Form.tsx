"use client";

import { useActionState, useEffect } from "react";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface FormState {
  error?: { message: string; fieldErrors?: Record<string, string[]> };
  success?: boolean;
}

/**
 * Admin login form — same loginAction as customer/technician, but styled with
 * the admin dark profile (amber accent, dark surfaces, off-white text).
 * On success redirects to /admin (or the `next` URL).
 */
const adminButton = (className: string) =>
  `bg-[#B77A35] text-[#111418] hover:bg-[#D97706] ${className}`;

export function AdminLoginForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(
    async (_, formData: FormData) => {
      const result = await loginAction({
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      });
      if (!result.ok) {
        return { error: result.error, success: false };
      }
      return { success: true, error: undefined };
    },
    { error: undefined, success: false },
  );

  useEffect(() => {
    if (state.success) {
      window.location.href = next === "/" ? "/admin" : next;
    }
  }, [state.success, next]);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="p-3 border border-[#B7443D] text-[#B7443D] text-sm rounded-[2px]" role="alert">
          {state.error.message}
        </div>
      )}
      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-[#f2f0e8] mb-1">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full bg-[#1a1b16] border-[#3a3b33] text-[#f2f0e8] placeholder:text-[#77786f]"
          placeholder="admin@example.com"
          aria-invalid={!!state.error?.fieldErrors?.email}
          aria-describedby={state.error?.fieldErrors?.email ? "email-error" : undefined}
        />
        {state.error?.fieldErrors?.email && (
          <p id="email-error" className="text-[#B7443D] text-sm mt-1" role="alert">
            {state.error.fieldErrors.email[0]}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="password" className="block text-sm font-medium text-[#f2f0e8] mb-1">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full bg-[#1a1b16] border-[#3a3b33] text-[#f2f0e8]"
          aria-invalid={!!state.error?.fieldErrors?.password}
          aria-describedby={state.error?.fieldErrors?.password ? "password-error" : undefined}
        />
        {state.error?.fieldErrors?.password && (
          <p id="password-error" className="text-[#B7443D] text-sm mt-1" role="alert">
            {state.error.fieldErrors.password[0]}
          </p>
        )}
      </div>
      <Button type="submit" className={adminButton("w-full size-lg")} disabled={state.success}>
        {state.success ? "Signing in..." : "Sign in as admin"}
      </Button>
      <p className="text-center text-sm text-[#77786f]">
        Not an admin?{" "}
        <Link href={"/login?next=" + encodeURIComponent(next)} className="text-[#f2f0e8] underline hover:no-underline">
          Log in as customer
        </Link>
      </p>
    </form>
  );
}
