import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, getRoleHome, validateNext } from "@/lib/auth/guards";
import { AdminLoginForm } from "./Form";
import { Suspense } from "react";

export const instant = false;

export const metadata: Metadata = {
  title: "Admin sign in | HireATech",
  description: "Sign in to your HireATech admin account",
};

function AdminFormWrapper({ next }: { next: string }) {
  return <AdminLoginForm next={next} />;
}

/**
 * Admin sign-in page.
 *
 * Visual profile is intentionally very different from the customer/technician
 * login pages: dark charcoal background, amber accent, off-white text — so an
 * admin can instantly tell they're on the admin side.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = validateNext(params.next ?? "/");

  const user = await getCurrentUser();
  if (user) {
    if (user.role === "admin") {
      redirect(next === "/" ? "/admin" : next);
    }
    // Signed in as a different role — send them to their own home.
    redirect(getRoleHome(user.role));
  }

  return (
    <main className="min-h-screen bg-[#0f100d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1b16] border border-[#3a3b33] rounded-[4px] p-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-[#f2f0e8] font-display">Admin sign in</h1>
            <p className="text-[#77786f] mt-2">Sign in to your HireATech admin account</p>
          </header>
          <Suspense fallback={<div className="space-y-6">Loading...</div>}>
            <AdminFormWrapper next={next} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
