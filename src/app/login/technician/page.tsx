import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, getRoleHome, validateNext } from "@/lib/auth/guards";
import { TechnicianLoginForm } from "./Form";
import { Suspense } from "react";

export const instant = false;

export const metadata: Metadata = {
  title: "Technician sign in | HireATech",
  description: "Sign in to your HireATech technician account",
};

function TechnicianFormWrapper({ next }: { next: string }) {
  return <TechnicianLoginForm next={next} />;
}

export default async function TechnicianLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = validateNext(params.next ?? "/");

  const user = await getCurrentUser();
  if (user) {
    redirect(getRoleHome(user.role));
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="surface border border-border rounded-[4px] p-8 border-tech">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-ink font-display">Technician sign in</h1>
            <p className="text-muted-strong mt-2">Sign in to your HireATech technician account</p>
          </header>
          <Suspense fallback={<div className="space-y-6">Loading...</div>}>
            <TechnicianFormWrapper next={next} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
