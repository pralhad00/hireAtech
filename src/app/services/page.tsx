import Link from "next/link";
import type { Metadata } from "next";
import { IconSquare } from "@/components/ui/icon-square";
import { ArrowRight } from "lucide-react";
import { listCategories } from "@/lib/queries/categories";

/*
 * /services — all active categories (spec route table). Occupied rows
 * (DESIGN.md §6): dotted-leader trade names, admin-approved stamp, real link.
 * No card piles.
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
      <div className="font-mono text-xs font-bold tracking-widest text-primary mb-4 sm:text-sm">
        RECORD COLUMN · ALL TRADES
      </div>
      <h1 className="font-display text-3xl font-bold text-ink tracking-tight sm:text-4xl">
        Services
      </h1>
      <p className="mt-2 max-w-prose text-muted-strong sm:text-base">
        Every trade that has joined HireATech, updated as technicians are
        approved. Choose one to see who is available.
      </p>

      {categories.length === 0 ? (
        <div className="mt-10 rounded-md border border-border bg-surface p-8 sm:p-10">
          <p className="text-muted-strong sm:text-base">
            No service categories have been set up yet. Check back soon.
          </p>
        </div>
      ) : (
        <ul className="mt-10 space-y-6 border-l-2 border-ink pl-8">
          {categories.map((category) => (
            <li
              key={category.slug}
              className="relative border-b border-border pb-6 last:border-b-0 last:pb-0"
            >
              <Link
                href={`/services/${category.slug}`}
                className="flex items-start gap-4"
              >
                <IconSquare
                  icon={category.icon}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <span className="border-b border-dotted border-border block font-mono text-lg font-bold text-ink leading-none sm:text-xl">
                    {category.name}
                  </span>
                  <span className="mt-1 block font-mono text-xs text-muted-strong sm:text-sm">
                    {category.tagline}
                  </span>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-strong" />
              </Link>
              <span
                className="absolute -right-px bottom-[calc(100%+4px)] inline-flex items-center gap-1 px-2 py-0.5 border border-success bg-surface text-success font-mono text-[10px] font-bold uppercase"
                title="Admin approved"
              >
                ✓ APPROVED
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
