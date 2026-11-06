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

export function LoginForm({ next }: { next: string }) {
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
      window.location.href = next;
    }
  }, [state.success, next]);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="p-3 border border-error text-error text-sm rounded-[2px]" role="alert">
          {state.error.message}
        </div>
      )}
      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full"
          placeholder="you@example.com"
          aria-invalid={!!state.error?.fieldErrors?.email}
          aria-describedby={state.error?.fieldErrors?.email ? "email-error" : undefined}
        />
        {state.error?.fieldErrors?.email && (
          <p id="email-error" className="text-error text-sm mt-1" role="alert">
            {state.error.fieldErrors.email[0]}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="password" className="block text-sm font-medium text-ink mb-1">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full"
          aria-invalid={!!state.error?.fieldErrors?.password}
          aria-describedby={state.error?.fieldErrors?.password ? "password-error" : undefined}
        />
        {state.error?.fieldErrors?.password && (
          <p id="password-error" className="text-error text-sm mt-1" role="alert">
            {state.error.fieldErrors.password[0]}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={state.success}>
        {state.success ? "Signing in..." : "Sign in"}
      </Button>
      <p className="text-center text-sm text-muted-strong">
        Don&apos;t have an account?{" "}
        <Link href={"/register?next=" + encodeURIComponent(next)} className="text-primary underline hover:no-underline">
          Register as customer
        </Link>
      </p>
      <p className="text-center text-sm text-muted-strong">
        Technician?{" "}
        <Link href={"/register/technician?next=" + encodeURIComponent(next)} className="text-primary underline hover:no-underline">
          Register as technician
        </Link>
      </p>
    </form>
  );
}