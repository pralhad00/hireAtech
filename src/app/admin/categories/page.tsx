import { Metadata } from "next";
import { requireRole } from "@/lib/auth/guards";
import { listAllCategories } from "@/lib/queries/categories";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { CategoryTable } from "./CategoryTable";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Categories | HireATech Admin",
  description: "Manage service categories and search aliases",
};

export default async function AdminCategoriesPage() {
  const user = await requireRole(["admin"]);
  const categories = await listAllCategories();

  return (
    <div className="flex h-screen">
      <AdminSidebar user={user} />

      <main className="flex-1 overflow-y-auto bg-bg lg:ml-64">
        <div className="max-w-7xl mx-auto p-6">
          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-ink font-display">
                Categories
              </h1>
              <p className="text-muted-strong mt-1">
                Add, edit, or deactivate service categories. Search aliases
                help customers find the right trade (e.g. &ldquo;bijuli&rdquo; &rarr;
                Electrician).
              </p>
            </div>
            <Link
              href="/admin"
              className="text-sm font-medium text-primary underline hover:no-underline"
            >
              ← Back to dashboard
            </Link>
          </header>

          <div className="surface border border-border rounded-[4px] p-6 mb-8">
            <CategoryTable categories={categories} />
          </div>
        </div>
      </main>
    </div>
  );
}
