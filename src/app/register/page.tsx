import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, getRoleHome, validateNext } from "@/lib/auth/guards";
import { listAreas } from "@/lib/queries/areas";
import { RegisterForm } from "./Form";
import { Suspense } from "react";

export const instant = false;

export const metadata: Metadata = {
  title: "Create account | HireATech",
  description: "Create a customer account on HireATech",
};

async function getAreaOptions() {
  const areas = await listAreas();
  return areas.map((a) => ({ value: a.id, label: a.name }));
}

function RegisterFormWrapper({ next, areas }: { next: string; areas: { value: string; label: string }[] }) {
  return <RegisterForm next={next} areas={areas} />;
}

export default async function RegisterPage({
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

  const areas = await getAreaOptions();

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="surface border border-border rounded-[4px] p-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-ink font-display">Create account</h1>
            <p className="text-muted-strong mt-2">Join HireATech as a customer</p>
          </header>
          <Suspense fallback={<div className="space-y-6">Loading...</div>}>
            <RegisterFormWrapper next={next} areas={areas} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
