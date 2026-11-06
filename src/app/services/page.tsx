import Link from "next/link";
import type { Metadata } from "next";
import { IconSquare } from "@/components/ui/icon-square";
import { ArrowRight, Search, Filter, ShieldCheck, Star } from "@/components/ui/icons";
import { listCategories } from "@/lib/queries/categories";

/*
 * /services — all active categories as cards with trust badges.
 * Search results placeholder (Step 8 will implement real search).
 * Marketplace Platform: cards, sharp corners, bordered, trust signals.
 */

export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse every trade on HireATech: electricians, plumbers, carpenters, appliance repair, painting and general maintenance in Birtamod, Jhapa.",
};

export default async function ServicesPage() {
  const categories = await listCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Page header */}
      <div className="mb-10">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-strong mb-4">
          <Link
            href="/"
            className="font-medium text-muted-strong underline-offset-4 hover:text-primary hover:underline"
          >
            Home
          </Link>
          <span aria-hidden={true} className="mx-2">/</span>
          <span aria-current="page" className="font-medium text-ink">
            Services
          </span>
        </nav>
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          All services
        </h1>
        <p className="mt-2 max-w-2xl text-muted-strong sm:text-base">
          {categories.length} trades with admin-approved technicians. Clear NPR
          prices, verified reviews, cash on completion.
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form action="/services" method="get" role="search" className="flex-1 max-w-xl">
          <label htmlFor="services-search" className="sr-only">
            Filter services
          </label>
          <div className="flex">
            <span className="inline-flex size-12 shrink-0 items-center justify-center border-r border-border bg-bg text-muted-strong">
              <Search className="size-5" aria-hidden="true" />
            </span>
            <input
              id="services-search"
              name="q"
              type="search"
              placeholder="Filter: electrician, plumber, carpenter..."
              className="flex-1 h-12 border-r-0 border-border bg-surface text-ink pl-4 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-strong"
            />
            <button
              type="submit"
              className="h-12 px-6 shrink-0 font-display text-base font-semibold text-white bg-primary border-none hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            >
              Filter
            </button>
          </div>
        </form>

        <Link
          href="#"
          className="shrink-0 inline-flex items-center gap-2 h-10 px-5 rounded-md border border-ink bg-transparent text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary hover:bg-primary/5 focus:ring-2 focus:ring-primary focus:ring-offset-2 font-display"
        >
          <Filter className="size-4" aria-hidden="true" />
          Filters
        </Link>
      </div>

      {/* Category grid */}
      {categories.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-12 text-center">
          <p className="text-muted-strong">No service categories have been set up yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/services/${category.slug}`}
              className="group flex flex-col rounded-lg border border-border bg-surface p-6 transition-all hover:border-primary hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <IconSquare icon={category.icon} size="lg" className="shrink-0 group-hover:border-primary transition-colors" />
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-xl font-bold text-ink group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-muted-strong sm:text-sm">
                    {category.tagline}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-success bg-success/10 text-success font-mono font-bold">
                  <ShieldCheck className="size-3" aria-hidden="true" />
                  Admin approved
                </span>
                {category.approvedTechnicianCount > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border bg-bg text-muted-strong font-mono">
                    <Star className="size-3 fill-current text-warning" aria-hidden="true" />
                    <span className="font-bold text-ink">{category.approvedTechnicianCount}</span> techs
                  </span>
                )}
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                <span className="font-display text-lg font-bold text-ink">
                  from NPR 500
                </span>
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded border border-border bg-bg text-muted-strong group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}