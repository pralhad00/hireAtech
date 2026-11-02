import Link from "next/link";
import type { Metadata } from "next";
import { IconSquare } from "@/components/ui/icon-square";
import { ArrowRight } from "lucide-react";
import { listCategories } from "@/lib/queries/categories";

/*
 * /services — all active categories (spec route table). Rendered as bordered
 * rows (DESIGN.md §6: occupied rows, not card piles) because each row must
 * carry name, tagline and a real link.
 *
 * The home search box submits here as /services?q=… — Step 8 (search) will
 * read `searchParams` inside a <Suspense> boundary to render real results;
 * until then this page stays fully prerenderable and simply ignores `q`.
 */

export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse every trade on HireATech: electricians, plumbers, carpenters, appliance repair, painting and general maintenance in Birtamod, Jhapa.",
};

export default async function ServicesPage() {
  const categories = await listCategories();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">Services</h1>
      <p className="mt-3 max-w-prose text-muted-strong">
        Every trade that has joined HireATech, updated as technicians are
        approved. Choose one to see who is available.
      </p>

      {categories.length === 0 ? (
        <p className="mt-8 rounded-lg border border-border bg-surface p-6 text-muted-strong">
          No service categories have been set up yet. Check back soon.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-border rounded-lg border border-border bg-surface">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/services/${category.slug}`}
                className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-bg sm:px-6"
              >
                <IconSquare icon={category.icon} size="sm" tone="surface" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{category.name}</span>
                  <span className="mt-0.5 block text-sm text-muted-strong">
                    {category.tagline}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-strong" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
