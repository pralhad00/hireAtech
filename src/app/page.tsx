import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "@/components/ui/icons";
import { listCategories } from "@/lib/queries/categories";

/*
 * Home (spec route table; DESIGN.md §9): the Job Sheet — a carbon-copy
 * trade work order. The search box is field one of a ruled form; picking a
 * trade stamps the row. No stats, no testimonials — we have none to publish
 * (spec §0). No entrance animations (DESIGN.md §8).
 *
 * The search box submits to /services?q=…; real technician search + results
 * arrive in Step 8, so the services page ignores `q` until then.
 */

export const metadata: Metadata = {
  description:
    "Search for a plumber, electrician, carpenter and more in Birtamod, Jhapa. Approved technicians, cash on completion, and reviews after the job.",
};

const steps = [
  {
    title: "Find the right trade",
    body: "Browse the list of services — or type what you need. Everyday words work: try “bijuli mistri” for an electrician or “pani” for a plumber.",
  },
  {
    title: "Book a visit",
    body: "Pick a technician, describe the job, choose a date and time. Your request first shows as “waiting for the technician’s response” — “confirmed” only once they accept.",
  },
  {
    title: "Get it done, then review",
    body: "Pay cash when the work is finished. After a completed booking you can rate the technician and leave a short comment.",
  },
];

const faqs = [
  {
    question: "Are the technicians checked?",
    answer:
      "Yes. Every technician registers and can only appear after an admin approves them. You always pick a specific technician — there is no “post a job and wait” here.",
  },
  {
    question: "How do I pay?",
    answer:
      "Cash, paid directly to the technician when the job is finished. Online payment is not available yet — when it arrives it will be shown in the app, not promised in advance.",
  },
  {
    question: "Can I leave a review?",
    answer:
      "Reviews are only open after a completed booking, so what you read reflects real jobs — one review per booking, with a rating and an optional comment.",
  },
];

export default async function HomePage() {
  const categories = await listCategories();

  return (
    <>
      {/* Work-order masthead: serial number left, service area right. */}
      <header className="border-b border-border bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-4 font-mono text-xs font-bold tracking-widest text-muted-strong sm:text-sm">
            <span>HM-BTM-000481</span>
            <span>HIREATECH · SERVICE RECORD</span>
            <span>BIRTAMOD · JHAPA, NEPAL</span>
          </div>
        </div>
      </header>

      {/* First viewport — the work order itself (thesis, not a header). */}
      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Ruled field area: label, big heading, search as field one. */}
          <div className="py-12 sm:py-20 border-b border-border">
            <div className="font-mono text-xs font-bold tracking-widest text-primary mb-2 sm:text-sm">
              FIELD ONE · WHAT NEEDS FIXING
            </div>
            <h1 className="font-display text-6xl font-bold leading-none text-ink tracking-tighter sm:text-7xl">
              Name the<br />
              problem.
            </h1>
            <form
              action="/services"
              method="get"
              role="search"
              className="mt-8 border border-ink bg-surface"
            >
              <div className="flex h-12">
                <span className="inline-flex size-12 shrink-0 items-center justify-center border-r border-ink bg-bg text-ink font-mono text-sm">
                  <Search className="size-5" aria-hidden="true" />
                </span>
                <Input
                  id="home-search"
                  name="q"
                  type="search"
                  autoComplete="off"
                  placeholder="e.g. pani tap, bijuli mistri, mistri"
                  className="flex-1 h-full border-none bg-transparent text-ink pl-4 focus:ring-0 placeholder:text-muted-strong sm:text-base"
                />
                <Button
                  type="submit"
                  variant="default"
                  className="h-12 px-7 shrink-0 font-display text-base sm:px-8"
                >
                  SEARCH
                </Button>
              </div>
            </form>
            <p className="mt-4 font-mono text-xs text-muted-strong tracking-wide sm:text-sm">
              LOOSE SPELLING FINDS THE TRADE — TRY “BIJULI MISTRI”, “PANI”,
              “PLAMBER”.
            </p>
          </div>

          {/* Record column: six real trades with dotted leaders and stamps. */}
          <div className="mt-10 sm:mt-14 border-l-2 border-ink pl-8 sm:pl-10">
            <p className="font-mono text-xs font-bold tracking-widest text-primary mb-4 sm:text-sm">
              RECORD COLUMN · THIS ORDER
            </p>
            <ul className="space-y-6">
              {categories.map((category) => (
                <li
                  key={category.slug}
                  className="relative border-b border-border pb-4 last:border-b-0 last:pb-0"
                >
                  <Link
                    href={`/services/${category.slug}`}
                    className="flex items-end gap-4"
                  >
                    <span className="flex-1 border-b border-dotted border-border font-mono text-lg font-bold text-ink leading-none sm:text-xl">
                      {category.name}
                    </span>
                    <span className="shrink-0 font-mono text-xs font-bold text-muted-strong sm:text-sm">
                      {category.tagline}
                    </span>
                  </Link>
                  <span
                    className="absolute -right-px bottom-[calc(100%+4px)] inline-flex items-center gap-1 px-2 py-0.5 border border-success bg-surface text-success font-mono text-[10px] font-bold uppercase"
                  title="Admin approved"
                >
                  APPROVED
                </span>
              </li>
            ))}
          </ul>
          </div>
        </div>

        {/* Foot band: charcoal ground, the cash note. */}
        <div className="border-t border-border bg-ink text-white py-8 sm:py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <p className="font-mono text-xs font-bold tracking-widest text-white/70 sm:text-sm">
                CASH ON COMPLETION — NO PAYMENT SITE-SIDE
              </p>
              <p className="font-mono text-xs font-bold tracking-widest text-white/70 sm:text-sm">
                NPR PRICING · LOCAL TECHNICIANS ONLY · NO POSTCODE
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works — numbered flow, not a three-card grid (DESIGN.md §7). */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="font-mono text-xs font-bold tracking-widest text-primary mb-6 sm:text-sm">
            SECTION B · HOW IT WORKS
          </div>
          <h2 className="font-display text-3xl font-bold text-ink tracking-tight sm:text-4xl">
            How it works
          </h2>
          <ol className="mt-10 space-y-10 border-l border-border pl-8">
            {steps.map((step, index) => (
              <li key={step.title} className="relative">
                <span
                  aria-hidden={true}
                  className="absolute -left-[34px] top-0 inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-ink bg-ink font-display text-xs font-bold text-white"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-prose text-muted-strong sm:text-base">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <Link
            href="/how-it-works"
            className="mt-8 inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"
          >
            More detail on how it works
            <span className="inline-block transition-transform hover:-translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      {/* Service-area note — honest photo slot (charcoal block, truthful caption). */}
      <section className="bg-bg py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-md border border-border bg-ink p-8 sm:p-12">
            <div className="font-mono text-xs font-bold tracking-widest text-primary-soft mb-4 sm:text-sm">
              WHERE WE WORK
            </div>
            <h2 className="font-display text-2xl font-bold text-white tracking-tight sm:text-3xl">
              Birtamod, Jhapa — this area only
            </h2>
            <p className="mt-4 max-w-prose text-white/80 sm:text-lg">
              Keeping it small keeps the listed technicians genuinely local.
              Your address helps the technician plan the trip — cash on
              completion, NPR pricing, no postcode, no ZIP.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ preview — ruled rows, honest copy only. */}
      <section className="bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="font-mono text-xs font-bold tracking-widest text-primary mb-6 sm:text-sm">
            SECTION C · BEFORE YOU BOOK
          </div>
          <h2 className="font-display text-2xl font-bold text-ink tracking-tight sm:text-3xl">
            Before you book
          </h2>
          <div className="mt-8 divide-y divide-border rounded-md border border-border bg-surface">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border-b border-border last:border-b-0"
              >
                <summary
                  className="flex items-center justify-between px-5 py-4 font-semibold text-ink cursor-pointer list-none hover:text-primary transition-colors sm:text-base"
                >
                  {faq.question}
                  <span className="shrink-0 text-muted-strong group-hover:text-primary">
                    ▾
                  </span>
                </summary>
                <div className="px-5 pb-4 text-sm text-muted-strong sm:text-base">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
          <p className="mt-6 font-mono text-xs text-muted-strong tracking-wide sm:text-sm">
            MORE QUESTIONS?{" "}
            <Link
              href="/help"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              READ THE FULL HELP PAGE
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
