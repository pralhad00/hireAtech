import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser, getRoleHome, validateNext } from "@/lib/auth/guards";
import { listCategoryOptions } from "@/lib/queries/categories";
import { TechnicianRegisterForm } from "./Form";
import { Suspense } from "react";

export const instant = false;

export const metadata: Metadata = {
  title: "Create technician account | HireATech",
  description: "Register as a technician on HireATech",
};

async function getCategoryOptions() {
  return listCategoryOptions();
}

function TechnicianFormWrapper({
  next,
  categories,
}: {
  next: string;
  categories: { id: string; name: string }[];
}) {
  return <TechnicianRegisterForm next={next} categories={categories} />;
}

export default async function TechnicianRegisterPage({
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

  const categories = await getCategoryOptions();

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="surface border border-border rounded-[4px] p-8 border-tech">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-ink font-display">
              Create technician account
            </h1>
            <p className="text-muted-strong mt-2">Join HireATech as a technician</p>
          </header>
          <Suspense fallback={<div className="space-y-6">Loading...</div>}>
            <TechnicianFormWrapper next={next} categories={categories} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
