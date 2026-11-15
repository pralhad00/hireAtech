"use client";

import { useActionState, useEffect, useState } from "react";
import { registerTechnicianAction } from "@/lib/actions/technician";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface FormState {
  error?: { message: string; fieldErrors?: Record<string, string[]> };
  success?: boolean;
}

interface WizardData {
  fullName: string;
  email: string;
  phone: string;
  experienceYears: number;
  categoryIds: string[];
  password: string;
  confirmPassword: string;
}

const TECH_COLOR = "#2563EB"; /* indigo-600 — distinct from customer orange */

interface CategoryOption {
  id: string;
  name: string;
}

export function TechnicianRegisterForm({
  next,
  categories,
}: {
  next: string;
  categories: CategoryOption[];
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    fullName: "",
    email: "",
    phone: "",
    experienceYears: 0,
    categoryIds: [],
    password: "",
    confirmPassword: "",
  });

  const [state, formAction] = useActionState<FormState, FormData>(
    async (_, formData: FormData) => {
      const result = await registerTechnicianAction({
        fullName: formData.get("fullName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        experienceYears: Number(formData.get("experienceYears")),
        categoryIds: formData.getAll("categoryIds") as string[],
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

  const totalSteps = 6;

  const goNext = () => setStep((s) => (s < totalSteps ? s + 1 : s));
  const goBack = () => setStep((s) => (s > 1 ? s - 1 : s));

  const setField = (key: string, value: string) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  const toggleCategory = (categoryId: string) => {
    setData((d) => {
      const next = d.categoryIds.includes(categoryId)
        ? d.categoryIds.filter((id) => id !== categoryId)
        : [...d.categoryIds, categoryId];
      return { ...d, categoryIds: next };
    });
  };

  const selectedCategories = categories.filter((c) => data.categoryIds.includes(c.id));

  const techButton = (className: string) =>
    `bg-[${TECH_COLOR}] text-[${TECH_COLOR === "#2563EB" ? "#111418" : "#ffffff"}] hover:bg-[color-mix(in_srgb,${TECH_COLOR}_85%,#111418)] ${className}`;

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="p-3 border border-error text-error text-sm rounded-[2px]" role="alert">
          {state.error.message}
        </div>
      )}

      {/* Step 1: Full name */}
      {step === 1 && (
        <>
          <div>
            <Label htmlFor="fullName" className="block text-sm font-medium text-ink mb-1">
              Full name
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              className="w-full"
              defaultValue={data.fullName}
              onChange={(e) => setField("fullName", e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <p className="text-xs text-muted-strong text-center">
            Step {step} of {totalSteps} &mdash; your name as it should appear
          </p>
        </>
      )}

      {/* Step 2: Email */}
      {step === 2 && (
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
              onChange={(e) => setField("email", e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <p className="text-xs text-muted-strong text-center">
            Step {step} of {totalSteps} &mdash; your email is your account ID
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
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="98XXXXXXXX"
            />
          </div>
          <p className="text-xs text-muted-strong text-center">
            Step {step} of {totalSteps} &mdash; 10-digit mobile number
          </p>
        </>
      )}

      {/* Step 4: Years of experience */}
      {step === 4 && (
        <>
          <div>
            <Label htmlFor="experienceYears" className="block text-sm font-medium text-ink mb-1">
              Years of experience
            </Label>
            <Input
              id="experienceYears"
              name="experienceYears"
              type="number"
              autoComplete="off"
              required
              min="0"
              max="60"
              className="w-full"
              defaultValue={String(data.experienceYears)}
              onChange={(e) => setField("experienceYears", e.target.value)}
              placeholder="0"
            />
            <p className="text-xs text-muted-strong mt-1">
              How many years have you been working in your trade?
            </p>
          </div>
          <p className="text-xs text-muted-strong text-center">
            Step {step} of {totalSteps} &mdash; your experience helps customers choose
          </p>
        </>
      )}

      {/* Step 5: Categories (checkboxes, max 3) */}
      {step === 5 && (
        <>
          <p className="text-sm font-semibold text-ink mb-3">
            Choose your trade categories (up to 3)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categories.map((cat) => {
              const isSelected = data.categoryIds.includes(cat.id);
              const atLimit = data.categoryIds.length >= 3 && !isSelected;
              return (
                <label
                  key={cat.id}
                  className={`block cursor-pointer select-none p-3 rounded-[2px] border border-border bg-surface ${
                    isSelected
                      ? `border-[${TECH_COLOR}] bg-[color-mix(in_srgb,${TECH_COLOR}_12%,#ffffff)]`
                      : atLimit
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-primary hover:bg-muted"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="categoryIds"
                    value={cat.id}
                    defaultChecked={isSelected}
                    onChange={() => toggleCategory(cat.id)}
                    className={`w-4 h-4 rounded text-[${TECH_COLOR}] focus-visible:ring-[${TECH_COLOR}] focus-visible:ring-3 border-input`}
                  />
                  <span className="ml-2 text-sm">{cat.name}</span>
                </label>
              );
            })}
          </div>
          {data.categoryIds.length > 3 && (
            <p className="text-error text-sm mt-2">Choose up to three categories.</p>
          )}
          <p className="text-xs text-muted-strong text-center mt-4">
            Step {step} of {totalSteps} &mdash; which trades you do
          </p>
        </>
      )}

      {/* Step 6: Preview + Password + Submit */}
      {step === 6 && (
        <>
          <div className="border border-border rounded-[2px] p-4 bg-bg-subtle">
            <p className="text-xs font-semibold text-muted-strong uppercase tracking-wider mb-3">
              Review your details
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-strong">Full name</span>
                <span className="text-ink">{data.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-strong">Email</span>
                <span className="text-ink">{data.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-strong">Mobile</span>
                <span className="text-ink">{data.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-strong">Experience</span>
                <span className="text-ink">
                  {data.experienceYears} year{data.experienceYears !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-strong">Categories</span>
                <span className="text-ink truncate max-w-[200px]">
                  {selectedCategories.map((c) => c.name).join(", ") || "&mdash;"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
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
              />
              <p className="text-xs text-muted-strong mt-1">
                8&ndash;64 characters, at least one letter and one number
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
                defaultValue={data.confirmPassword}
                onChange={(e) => setField("confirmPassword", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button type="button" variant="outline" onClick={goBack} disabled={state.success}>
              Back
            </Button>
            <Button type="submit" className={techButton("w-auto")} disabled={state.success}>
              {state.success ? "Creating account..." : "Create technician account"}
            </Button>
          </div>

          <input type="hidden" name="fullName" defaultValue={data.fullName} />
          <input type="hidden" name="email" defaultValue={data.email} />
          <input type="hidden" name="phone" defaultValue={data.phone} />
          <input
            type="hidden"
            name="experienceYears"
            defaultValue={String(data.experienceYears)}
          />
          {data.categoryIds.map((id) => (
            <input key={id} type="hidden" name="categoryIds" defaultValue={id} />
          ))}
        </>
      )}

      {/* Navigation on steps 1-5 */}
      {step < totalSteps && (
        <div className="flex justify-between items-center pt-4 border-t border-border">
          {step > 1 && (
            <Button type="button" variant="outline" onClick={goBack} disabled={state.success}>
              Back
            </Button>
          )}
          <Button type="button" className={techButton("w-auto")} onClick={goNext} disabled={state.success}>
            Next
          </Button>
        </div>
      )}

      <p className="text-center text-sm text-muted-strong mt-6">
        Already have an account?{" "}
        <Link href={"/login/technician?next=" + encodeURIComponent(next)} className="text-primary underline hover:no-underline">
          Sign in as technician
        </Link>
      </p>
      <p className="text-center text-sm text-muted-strong">
        Customer?{" "}
        <Link href={"/register?next=" + encodeURIComponent(next)} className="text-primary underline hover:no-underline">
          Register as customer
        </Link>
      </p>
    </form>
  );
}
