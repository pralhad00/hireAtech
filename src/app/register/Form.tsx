"use client";

import { useActionState, useEffect } from "react";
import { registerAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface FormState {
  error?: { message: string; fieldErrors?: Record<string, string[]> };
  success?: boolean;
}

export function RegisterForm({ next }: { next: string }) {
  const [state, formAction] = useActionState<FormState, FormData>(
    async (_, formData: FormData) => {
      const result = await registerAction({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        password: formData.get("password") as string,
        confirmPassword: formData.get("confirmPassword") as string,
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
        <Label htmlFor="name" className="block text-sm font-medium text-ink mb-1">
          Full name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="w-full"
          placeholder="Your full name"
          aria-invalid={!!state.error?.fieldErrors?.name}
          aria-describedby={state.error?.fieldErrors?.name ? "name-error" : undefined}
        />
        {state.error?.fieldErrors?.name && (
          <p id="name-error" className="text-error text-sm mt-1" role="alert">
            {state.error.fieldErrors.name[0]}
          </p>
        )}
      </div>
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
        <Label htmlFor="phone" className="block text-sm font-medium text-ink mb-1">
          Phone number
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          className="w-full"
          placeholder="98XXXXXXXX"
          aria-invalid={!!state.error?.fieldErrors?.phone}
          aria-describedby={state.error?.fieldErrors?.phone ? "phone-error" : undefined}
        />
        {state.error?.fieldErrors?.phone && (
          <p id="phone-error" className="text-error text-sm mt-1" role="alert">
            {state.error.fieldErrors.phone[0]}
          </p>
        )}
        <p className="text-xs text-muted-strong mt-1">
          Nepali mobile (10 digits, starts with 96/97/98)
        </p>
      </div>
      <div>
        <Label htmlFor="password" className="block text-sm font-medium text-ink mb-1">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
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
        <p className="text-xs text-muted-strong mt-1">
          8–64 characters, at least one letter and one number
        </p>
      </div>
      <div>
        <Label htmlFor="confirmPassword" className="block text-sm font-medium text-ink mb-1">
          Confirm password
        </Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          className="w-full"
          aria-invalid={!!state.error?.fieldErrors?.confirmPassword}
          aria-describedby={state.error?.fieldErrors?.confirmPassword ? "confirm-error" : undefined}
        />
        {state.error?.fieldErrors?.confirmPassword && (
          <p id="confirm-error" className="text-error text-sm mt-1" role="alert">
            {state.error.fieldErrors.confirmPassword[0]}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={state.success}>
        {state.success ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-muted-strong">
        Already have an account?{" "}
        <Link href={"/login?next=" + encodeURIComponent(next)} className="text-primary underline hover:no-underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}