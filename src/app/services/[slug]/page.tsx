import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IconSquare } from "@/components/ui/icon-square";
import { ShieldCheck, Star, MapPin, Clock, ArrowRight, Search, Filter } from "@/components/ui/icons";
import { getCategoryBySlug } from "@/lib/queries/categories";

/*
 * /services/[slug] — one category with technician cards.
 * Marketplace Platform: bold header, trust badges, technician cards with ratings.
 * Real category data; technician list placeholder until Steps 8-9.
 */

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Service not found" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-strong">
        <Link
          href="/services"
          className="font-medium text-muted-strong underline-offset-4 hover:text-primary hover:underline"
        >
          Services
        </Link>
        <span aria-hidden={true} className="mx-2">/</span>
        <span aria-current="page" className="font-medium text-ink">
          {category.name}
        </span>
      </nav>

      {/* Category header */}
      <div className="mb-10 flex items-start gap-4">
        <IconSquare icon={category.icon} />
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-1 font-mono text-sm text-muted-strong sm:text-base">
            {category.tagline}
          </p>
        </div>
      </div>

      <p className="mb-8 max-w-2xl text-muted-strong sm:text-base">
        {category.description}
      </p>

      {/* Trust badges row */}
      <div className="mb-8 flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-success bg-success/10 text-success font-mono text-xs font-bold">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Admin approved
        </span>
        {category.approvedTechnicianCount > 0 && (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-warning/30 bg-warning/5 text-warning font-mono text-xs">
            <Star className="size-3.5 fill-current" aria-hidden="true" />
            {category.approvedTechnicianCount} technicians available
          </span>
        )}
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-border bg-bg text-muted-strong font-mono text-xs">
          <MapPin className="size-3.5" aria-hidden="true" />
          Birtamod, Jhapa only
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-border bg-bg text-muted-strong font-mono text-xs">
          <Clock className="size-3.5" aria-hidden="true" />
          Cash on completion
        </span>
      </div>

      {/* Search + filter within category */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <form action={`/services/${category.slug}`} method="get" role="search" className="flex-1 max-w-xl">
          <label htmlFor="category-search" className="sr-only">
            Search within {category.name}
          </label>
          <div className="flex">
            <span className="inline-flex size-12 shrink-0 items-center justify-center border-r border-border bg-bg text-muted-strong">
              <Search className="size-5" aria-hidden="true" />
            </span>
            <input
              id="category-search"
              name="q"
              type="search"
              placeholder={`Search ${category.name.toLowerCase()}s...`}
              className="flex-1 h-12 border-r-0 border-border bg-surface text-ink pl-4 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-strong"
            />
            <button
              type="submit"
              className="h-12 px-6 shrink-0 font-display text-base font-semibold text-white bg-primary border-none hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
            >
              Search
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

      {/* Technician cards */}
      <section aria-labelledby="technicians-heading">
        <h2
          id="technicians-heading"
          className="font-display text-xl font-bold text-ink mb-6 sm:text-2xl"
        >
          Approved technicians
        </h2>

        {category.approvedTechnicianCount === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-10 text-center">
            <p className="text-muted-strong mb-4">
              No approved technicians in this category yet.
            </p>
            <p className="text-sm text-muted-strong mb-6">
              New technicians appear here{" "}
              <strong className="font-semibold text-ink">only after admin approval</strong>
              , so what you see is always current.
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"
            >
              Try another service category
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {/* Placeholder technician cards (real data arrives Step 8-9) */}
              {[1, 2, 3].map((i) => (
                <article
                  key={i}
                  className="rounded-lg border border-border bg-surface p-5 transition-all hover:border-primary hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="inline-flex size-12 shrink-0 items-center justify-center rounded border border-border bg-bg text-ink font-display text-lg font-bold">
                      R
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base font-bold text-ink truncate">
                        Ram Bahadur Sharma
                      </h3>
                      <p className="font-mono text-xs text-muted-strong">
                        Electrician · 8 yrs exp
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1 text-warning font-semibold">
                      <Star className="size-4 fill-current" aria-hidden="true" />
                      4.8
                    </span>
                    <span className="text-muted-strong">(12 reviews)</span>
                    <span className="mx-1 text-border">·</span>
                    <span className="text-muted-strong font-mono">NPR 800/visit</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-strong">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    <span>Birtamod-3, 0.8 km</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-strong">
                    <ShieldCheck className="size-3.5 text-success" aria-hidden="true" />
                    <span>Admin approved</span>
                  </div>

                  <Link
                    href={`/technician/${i}`}
                    className="mt-4 w-full inline-flex items-center justify-center h-10 px-5 rounded-md border border-ink bg-transparent text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary hover:bg-primary/5 focus:ring-2 focus:ring-primary focus:ring-offset-2 font-display"
                  >
                    View profile
                  </Link>
                </article>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-strong">
                Showing 3 of {category.approvedTechnicianCount} technicians
              </p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}