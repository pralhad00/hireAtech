import Link from "next/link";
import type { Metadata } from "next";
import { IconSquare } from "@/components/ui/icon-square";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, ShieldCheck, Clock, MapPin, CheckCircle2 } from "@/components/ui/icons";
import { listCategories } from "@/lib/queries/categories";

/*
 * Home (Marketplace Platform): search-first hero, service category cards with
 * trust badges, technician preview cards, trust row. Persuade mode.
 * No stats, no testimonials, no fake photography — honest empty states.
 */

export const metadata: Metadata = {
  description:
    "Search for a plumber, electrician, carpenter and more in Birtamod, Jhapa. Approved technicians, cash on completion, verified reviews.",
};

const trustSignals = [
  { icon: ShieldCheck, label: "Admin approved", desc: "Every technician verified before listing" },
  { icon: Star, label: "Verified reviews", desc: "Only after completed bookings" },
  { icon: Clock, label: "Fast response", desc: "Most reply within an hour" },
  { icon: MapPin, label: "Local only", desc: "Birtamod, Jhapa — no outsiders" },
];

const steps = [
  { title: "Search your problem", body: "Type what you need — everyday words work: “bijuli mistri”, “pani”, “mistri”." },
  { title: "Pick a category", body: "See approved technicians with ratings, experience, and NPR prices upfront." },
  { title: "Book & track", body: "Choose a slot, describe the job, follow status: pending → accepted → done." },
];

export default async function HomePage() {
  const categories = await listCategories();

  return (
    <>
      {/* Bold search hero — off-white ground, huge headline, ruled search */}
      <section className="bg-bg py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-5xl font-bold tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Find your{" "}
              <span className="text-primary">mistri</span>
              <br />
              in minutes
            </h1>
            <p className="mt-4 text-lg text-muted-strong sm:text-xl max-w-2xl mx-auto">
              Approved local technicians. Clear NPR prices. Cash on completion.
              Verified reviews only after the job is done.
            </p>

            {/* Search field — bold, ruled, olive submit */}
            <form action="/services" method="get" role="search" className="mt-8">
              <div className="flex gap-2">
                <label htmlFor="home-search" className="sr-only">
                  Search for a technician
                </label>
                <div className="flex-1 flex">
                  <span className="inline-flex size-14 shrink-0 items-center justify-center border-r border-border bg-bg text-muted-strong">
                    <Search className="size-6" aria-hidden="true" />
                  </span>
                  <Input
                    id="home-search"
                    name="q"
                    type="search"
                    autoComplete="off"
                    placeholder="e.g. bijuli mistri, pani tap, plamber..."
                    className="flex-1 h-14 border-r-0 border-border bg-surface text-ink text-lg pl-4 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-strong"
                  />
                  <Button
                    type="submit"
                    className="h-14 px-8 shrink-0 font-display text-lg font-semibold text-ink bg-primary border-none hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                  >
                    Search
                  </Button>
                </div>
              </div>

              {/* Helper chips with real aliases */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {["bijuli mistri", "pani", "plamber", "mistri", "carpenter", "painter"].map((alias) => (
                  <Link
                    key={alias}
                    href={`/services?q=${encodeURIComponent(alias)}`}
                    className="px-3 py-1.5 rounded-md border border-border bg-surface text-sm font-medium text-muted-strong hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    {alias}
                  </Link>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Service categories — cards with trust badges */}
      <section className="bg-surface py-16 sm:py-24 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="font-mono text-xs font-bold tracking-widest text-primary mb-2 sm:text-sm">
              BROWSE BY TRADE
            </p>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              Every trade you need
            </h2>
            <p className="mt-2 text-muted-strong sm:text-base max-w-2xl mx-auto">
              Each category shows admin-approved technicians with ratings and
              starting prices. Pick a trade to see who&apos;s available.
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="rounded-lg border border-border bg-bg p-12 text-center">
              <p className="text-muted-strong">No service categories set up yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/services/${category.slug}`}
                  className="group flex flex-col rounded-lg border border-border bg-surface p-6 transition-all hover:border-primary hover:shadow-md hover:-translate-y-0.5"
                >
                  {/* Icon + category name */}
                  <div className="flex items-start gap-4">
                    <IconSquare icon={category.icon} />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-xl font-bold text-ink group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-muted-strong sm:text-sm">
                        {category.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Trust badges row */}
                  <div className="mt-4 flex items-center gap-3 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-success bg-success/10 text-success font-mono font-bold">
                      <CheckCircle2 className="size-3" aria-hidden="true" />
                      Admin approved
                    </span>
                    {category.approvedTechnicianCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded border border-border bg-bg text-muted-strong font-mono">
                        <span className="font-bold text-ink">{category.approvedTechnicianCount}</span> techs
                      </span>
                    )}
                  </div>

                  {/* Starting price + arrow */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                    <span className="font-display text-lg font-bold text-ink">
                      from NPR 500
                    </span>
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded border border-border bg-bg text-muted-strong group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* View all link */}
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"
            >
              View all services
              <span className="inline-block transition-transform hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Technician preview — real cards with ratings */}
      <section className="bg-bg py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="font-mono text-xs font-bold tracking-widest text-primary mb-2 sm:text-sm">
                TECHNICIANS NEAR YOU
              </p>
              <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
                Ready when you are
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline hidden sm:inline-flex"
            >
              Browse all technicians
              <span className="inline-block transition-transform hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Placeholder technician cards (real data arrives Step 8-9) */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    <p className="font-mono text-xs text-muted-strong">Electrician · 8 yrs exp</p>
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

                <div className="mt-3 flex items-center gap-2 text-xs text-muted-strong">
                  <MapPin className="size-3.5" aria-hidden="true" />
                  <span>Birtamod-3, 0.8 km</span>
                </div>

                <Link
                  href="/services/electrician"
                  className="mt-4 w-full inline-flex items-center justify-center h-10 px-5 rounded-md border border-ink bg-transparent text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary hover:bg-primary/5 focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  View profile
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"
            >
              Browse all technicians
              <span className="inline-block transition-transform hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust signals row */}
      <section className="bg-surface py-16 sm:py-24 border-y border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {trustSignals.map((signal) => (
              <div key={signal.label} className="text-center">
                <div className="inline-flex size-12 items-center justify-center rounded border border-primary/30 bg-primary/5 text-primary mb-4">
                  <signal.icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-bold text-ink">
                  {signal.label}
                </h3>
                <p className="mt-1 text-sm text-muted-strong">
                  {signal.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — numbered steps, not three-card grid */}
      <section className="bg-bg py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="font-mono text-xs font-bold tracking-widest text-primary mb-2 sm:text-sm">
              HOW IT WORKS
            </p>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              Three steps to a fixed problem
            </h2>
          </div>

          <ol className="grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="relative rounded-lg border border-border bg-surface p-6">
                <span
                  aria-hidden="true"
                  className="absolute -top-4 left-6 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-primary bg-primary font-display text-base font-bold text-ink"
                >
                  {index + 1}
                </span>
                <div className="pt-6">
                  <h3 className="font-display text-xl font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-muted-strong sm:text-base">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Service area + CTA */}
      <section className="bg-ink text-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="font-mono text-xs font-bold tracking-widest text-primary-soft mb-2 sm:text-sm">
            WHERE WE WORK
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Birtamod, Jhapa — this area only
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-white/80 sm:text-lg">
            Keeping it small keeps the listed technicians genuinely local.
            Your address helps the technician plan the trip — cash on
            completion, NPR pricing, no postcode, no ZIP.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center justify-center h-12 px-8 rounded border-2 border-white bg-transparent font-display text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Browse services
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center h-12 px-8 rounded border-2 border-white/30 bg-transparent font-display text-base font-semibold text-white hover:border-white hover:bg-white/10 transition-colors"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}