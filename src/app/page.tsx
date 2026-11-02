import Link from "next/link";
import type { Metadata } from "next";
import { IconSquare } from "@/components/ui/icon-square";
import { ArrowRight } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search } from "@/components/ui/icons";
import { listCategories } from "@/lib/queries/categories";

/*
 * Home (spec route table; DESIGN.md §9): olive search-first band, six real
 * category tiles pulled live from service_categories, numbered how-it-works
 * flow, service-area note, honest FAQ preview. No stats, no testimonials —
 * we have none to publish (spec §0). No entrance animations (DESIGN.md §8).
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
      {/* Hero: the search box is the most prominent element (spec §11) */}
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Find a trusted local technician
            </h1>
            <p className="mt-3 text-base text-white/90 sm:text-lg">
              Plumbers, electricians, carpenters and more — in Birtamod, Jhapa.
            </p>

            <form
              action="/services"
              method="get"
              role="search"
              className="flex justify-center mt-8"
            >
              <div className="flex w-full max-w-xl gap-1.5">
                <label htmlFor="home-search" className="sr-only">
                  What do you need done?
                </label>
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-ink" />
                  <Input
                    id="home-search"
                    name="q"
                    type="search"
                    autoComplete="off"
                    placeholder="What do you need done? Try “bijuli mistri”"
                    className="h-12 border-ink bg-surface pl-11 text-ink shadow-none placeholder:text-muted-strong"
                  />
                </div>
                {/* Inverse button on the olive hero: same-color-on-same-color
                    would vanish; light surface keeps it high-contrast. */}
                <Button
                  type="submit"
                  size="lg"
                  variant="outline"
                  className="shrink-0 border-surface bg-surface text-ink hover:border-surface hover:text-ink"
                >
                  Search
                </Button>
              </div>
            </form>

            <p className="mt-4 text-sm text-white/90">
              Everyday words are fine — “pani”, “bijuli mistri”, “mistri”.
            </p>
          </div>
        </div>
      </section>

      {/* Category tiles: real rows from the database, not invented data */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          What needs fixing?
        </h2>
        <p className="mt-2 max-w-prose text-muted-strong">
          Every trade that joins HireATech appears here — updated as
          technicians are approved.
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/services/${category.slug}`}
                className="flex h-full flex-col items-center gap-3 rounded-lg border border-border bg-surface p-4 text-center transition-colors hover:border-ink"
              >
                <IconSquare icon={category.icon} />
                <span className="w-full">
                  <span className="block text-sm font-semibold leading-tight">
                    {category.name}
                  </span>
                  <span className="mt-1 block text-xs leading-snug text-muted-strong">
                    {category.tagline}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works — numbered flow, not a three-card grid (DESIGN.md §7) */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            How it works
          </h2>
          <ol className="mt-8 max-w-3xl space-y-8">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span
                  aria-hidden={true}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary font-display text-base font-bold text-white"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">
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
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Service-area note */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold sm:text-2xl">
            Where we work
          </h2>
          <p className="mt-2 max-w-prose text-muted-strong">
            HireATech serves{" "}
            <strong className="font-semibold text-ink">
              Birtamod, Jhapa
            </strong>{" "}
            and the neighbourhoods around it. When you book a visit, your
            address helps the technician plan the trip — cash on completion,
            NPR pricing, local technicians.
          </p>
        </div>
      </section>

      {/* FAQ preview: only what the spec guarantees — nothing invented */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Before you book
        </h2>
        <div className="mt-8 divide-y divide-border rounded-lg border border-border bg-surface">
          <Accordion multiple className="gap-0">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${index}`}
                className="border-b-0"
              >
                <AccordionTrigger className="px-5 py-4 font-semibold hover:no-underline sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4 text-sm text-muted-strong sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <p className="mt-4 text-sm text-muted-strong">
          More questions?{" "}
          <Link
            href="/help"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Read the full help page
          </Link>
          .
        </p>
      </section>
    </>
  );
}
