"use client";

import { useActionState, useEffect, useState } from "react";
import { registerAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface FormState {
  error?: { message: string; fieldErrors?: Record<string, string[]> };
  success?: boolean;
}

interface AddressForm {
  areaId: string;
  label: "home" | "office";
}

interface WizardData {
  email: string;
  name: string;
  phone: string;
  address?: AddressForm;
  password: string;
  confirmPassword: string;
}

const LABEL_OPTIONS: { value: "home" | "office"; label: string }[] = [
  { value: "home", label: "Home" },
  { value: "office", label: "Office" },
];

export function RegisterForm({
  next,
  areas,
}: {
  next: string;
  areas: { value: string; label: string }[];
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

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

  const totalSteps = 5;

  const goNext = () => setStep((s) => (s < totalSteps ? s + 1 : s));
  const goBack = () => setStep((s) => (s > 1 ? s - 1 : s));

  const setField = (key: string, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  const setAddress = (areaId: string, label: "home" | "office") => {
    setData((d) => ({ ...d, address: { areaId, label } }));
  };

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="p-3 border border-error text-error text-sm rounded-[2px]" role="alert">
          {state.error.message}
        </div>
      )}

      {/* Step 1: Email */}
      {step === 1 && (
        <>
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full"
              defaultValue={data.email}
              placeholder="you@example.com"
              onChange={(e) => setField("email", e.target.value)}
              aria-invalid={!!state.error?.fieldErrors?.email}
              aria-describedby={state.error?.fieldErrors?.email ? "email-error" : undefined}
            />
            {state.error?.fieldErrors?.email && (
              <p id="email-error" className="text-error text-sm mt-1" role="alert">
                {state.error.fieldErrors.email[0]}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-strong text-center">
            Step {step} of {totalSteps} &mdash; your email is your account ID
          </p>
        </>
      )}

      {/* Step 2: Full name */}
      {step === 2 && (
        <>
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
              defaultValue={data.name}
              placeholder="Your full name"
              onChange={(e) => setField("name", e.target.value)}
              aria-invalid={!!state.error?.fieldErrors?.name}
              aria-describedby={state.error?.fieldErrors?.name ? "name-error" : undefined}
            />
            {state.error?.fieldErrors?.name && (
              <p id="name-error" className="text-error text-sm mt-1" role="alert">
                {state.error.fieldErrors.name[0]}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-strong text-center">
            Step {step} of {totalSteps} &mdash; your name as it should appear
          </p>
        </>
      )}

      {/* Step 3: Mobile number */}
      {step === 3 && (
        <>
          <div>
            <Label htmlFor="phone" className="block text-sm font-medium text-ink mb-1">
              Mobile number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              className="w-full"
              defaultValue={data.phone}
              placeholder="98XXXXXXXX"
              onChange={(e) => setField("phone", e.target.value)}
              aria-invalid={!!state.error?.fieldErrors?.phone}
              aria-describedby={state.error?.fieldErrors?.phone ? "phone-error" : undefined}
            />
            {state.error?.fieldErrors?.phone && (
              <p id="phone-error" className="text-error text-sm mt-1" role="alert">
                {state.error.fieldErrors.phone[0]}
              </p>
            )}
          </div>
          <p className="text-xs text-muted-strong text-center">
            Step {step} of {totalSteps} &mdash; 10-digit mobile number
          </p>
        </>
      )}

      {/* Step 4: Address (area + label) */}
      {step === 4 && (
        <>
          <div>
            <Label htmlFor="area" className="block text-sm font-medium text-ink mb-1">
              Area
            </Label>
            <select
              id="area"
              className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-1 text-base focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              defaultValue={data.address?.areaId || ""}
              onChange={(e) => setAddress(e.target.value, data.address?.label || "home")}
            >
              <option value="">Select your area</option>
              {areas.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="label" className="block text-sm font-medium text-ink mb-1">
              This address is your
            </Label>
            <div className="flex gap-3">
              {LABEL_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="radio"
                    name="addressLabel"
                    value={opt.value}
                    defaultChecked={data.address?.label === opt.value}
                    onChange={(e) => setAddress(data.address?.areaId || "", e.target.value as "home" | "office")}
                    className="rounded border-input text-primary focus-visible:ring-ring focus-visible:ring-3"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-strong text-center">
            Step {step} of {totalSteps} &mdash; where we&rsquo;ll send your technician
          </p>
        </>
      )}

      {/* Step 5: Preview + Password + Submit */}
      {step === 5 && (
        <>
          <div className="border border-border rounded-[2px] p-4 bg-bg-subtle">
            <p className="text-xs font-semibold text-muted-strong uppercase tracking-wider mb-3">
              Review your details
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-strong">Email</span>
                <span className="text-ink">{data.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-strong">Full name</span>
                <span className="text-ink">{data.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-strong">Mobile</span>
                <span className="text-ink">{data.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-strong">Area</span>
                <span className="text-ink">
                  {data.address
                    ? areas.find((a) => a.value === data.address?.areaId)?.label || data.address.areaId
                    : "&mdash;"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-strong">Address label</span>
                <span className="text-ink">
                  {data.address
                    ? data.address.label.charAt(0).toUpperCase() + data.address.label.slice(1)
                    : "&mdash;"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs text-muted-strong text-center mb-4">
              {data.email}
            </p>
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
                defaultValue={data.password}
                onChange={(e) => setField("password", e.target.value)}
                aria-invalid={!!state.error?.fieldErrors?.password}
                aria-describedby={state.error?.fieldErrors?.password ? "password-error" : undefined}
              />
              {state.error?.fieldErrors?.password && (
                <p id="password-error" className="text-error text-sm mt-1" role="alert">
                  {state.error.fieldErrors.password[0]}
                </p>
              )}
              <p className="text-xs text-muted-strong mt-1">
                8&ndash;64 characters, at least one letter and one number
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button type="button" variant="outline" onClick={goBack} disabled={state.success}>
              Back
            </Button>
            <Button type="submit" className="w-auto" disabled={state.success}>
              {state.success ? "Creating account..." : "Create account"}
            </Button>
          </div>

          <input
            type="hidden"
            name="name"
            defaultValue={data.name}
          />
          <input
            type="hidden"
            name="email"
            defaultValue={data.email}
          />
          <input
            type="hidden"
            name="phone"
            defaultValue={data.phone}
          />
        </>
      )}

      {/* Navigation on steps 1-4 */}
      {step < totalSteps && (
        <div className="flex justify-between items-center pt-4 border-t border-border">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={goBack} disabled={state.success}>
              Back
            </Button>
          )}
          <Button type="button" onClick={goNext} disabled={state.success}>
            Next
          </Button>
        </div>
      )}

      <p className="text-center text-sm text-muted-strong mt-6">
        Already have an account?{" "}
        <Link href={"/login?next=" + encodeURIComponent(next)} className="text-primary underline hover:no-underline">
          Sign in
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
