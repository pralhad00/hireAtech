"use client";

import { useActionState } from "react";
import { updateTechnicianProfileAction } from "@/lib/actions/technician";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface FormState {
  error?: { message: string; fieldErrors?: Record<string, string[]> };
  success?: boolean;
}

interface TechnicianProfile {
  full_name: string;
  email: string;
  phone: string;
  headline: string | null;
  bio: string | null;
  experience_years: number;
  category_id: string;
}

export function ProfileForm({
  initial,
  categories,
}: {
  initial: TechnicianProfile;
  categories: Array<{ id: string; name: string }>;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(
    async (_, formData: FormData) => {
      const result = await updateTechnicianProfileAction({
        phone: formData.get("phone") as string,
        headline: formData.get("headline") as string,
        bio: formData.get("bio") as string,
        experienceYears: Number(formData.get("experienceYears")),
        categoryId: formData.get("categoryId") as string,
      });
      if (!result.ok) {
        return { error: result.error, success: false };
      }
      return { success: true, error: undefined };
    },
    { error: undefined, success: false },
  );

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">Edit profile</h1>
        <p className="text-muted-strong">Your name and email cannot be changed after signup.</p>
      </header>

      {state.error && (
        <div className="mb-6 p-3 border border-error text-error text-sm rounded-[2px]" role="alert">
          {state.error.message}
          {state.error.fieldErrors && Object.entries(state.error.fieldErrors).map(([field, msgs]) => (
            <p key={field} className="mt-1 text-xs text-error">{field}: {msgs.join(", ")}</p>
          ))}
        </div>
      )}
      {state.success && (
        <div className="mb-6 p-3 border border-success bg-success/10 text-success rounded-[2px]" role="status">
          Profile updated successfully.
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-muted-strong uppercase tracking-wider mb-5">Personal details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="fullName" className="block text-sm font-medium text-ink mb-1">
                Full name
              </Label>
              <Input
                id="fullName"
                defaultValue={initial.full_name}
                readOnly
                className="w-full bg-bg-strong"
              />
              <p className="text-xs text-muted-strong mt-1">Cannot be changed after signup.</p>
            </div>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-ink mb-1">
                Email
              </Label>
              <Input
                id="email"
                defaultValue={initial.email}
                readOnly
                className="w-full bg-bg-strong"
              />
              <p className="text-xs text-muted-strong mt-1">Cannot be changed after signup.</p>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="phone" className="block text-sm font-medium text-ink mb-1">
                Mobile number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                defaultValue={initial.phone}
                className="w-full"
                placeholder="98XXXXXXXX"
                aria-invalid={!!state.error?.fieldErrors?.phone}
              />
              {state.error?.fieldErrors?.phone && (
                <p className="text-error text-sm mt-1" role="alert">{state.error.fieldErrors.phone[0]}</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold text-muted-strong uppercase tracking-wider mb-5">Trade details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="headline" className="block text-sm font-medium text-ink mb-1">
                Headline
              </Label>
              <Input
                id="headline"
                name="headline"
                type="text"
                autoComplete="off"
                defaultValue={initial.headline ?? ""}
                className="w-full"
                placeholder="e.g. Expert plumber with 8 years experience"
                maxLength={160}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="bio" className="block text-sm font-medium text-ink mb-1">
                Bio
              </Label>
              <textarea
                id="bio"
                name="bio"
                autoComplete="off"
                defaultValue={initial.bio ?? ""}
                className="w-full h-24 rounded-md border border-input bg-transparent px-3 py-1 text-base transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                placeholder="Tell customers about your work..."
                maxLength={1000}
              ></textarea>
            </div>
            <div>
              <Label htmlFor="experienceYears" className="block text-sm font-medium text-ink mb-1">
                Years of experience
              </Label>
              <Input
                id="experienceYears"
                name="experienceYears"
                type="number"
                min="0"
                max="60"
                required
                defaultValue={String(initial.experience_years)}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="categoryId" className="block text-sm font-medium text-ink mb-1">
                Primary category
              </Label>
              <select
                id="categoryId"
                name="categoryId"
                required
                className="w-full h-10 rounded-md border border-input bg-transparent px-3 py-1 text-base focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} selected={initial.category_id === c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {state.error?.fieldErrors?.categoryId && (
                <p className="text-error text-sm mt-1" role="alert">{state.error.fieldErrors.categoryId[0]}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={state.success}>
            {state.success ? "Saved" : "Save changes"}
          </Button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-muted-strong">
        <Link href="/technician" className="text-primary underline hover:no-underline">
          &larr; Back to dashboard
        </Link>
      </p>
    </main>
  );
}
