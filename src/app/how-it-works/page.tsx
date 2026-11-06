import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Clock, MapPin, Star, ShieldCheck, CreditCard } from "@/components/ui/icons";

/*
 * /how-it-works — numbered station flow, honest copy.
 * Marketplace Platform: bold steps, clear CTAs, trust signals.
 */

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How HireATech works: pick a trade, book a visit with a specific approved technician, follow your booking status, pay cash, then review.",
};

const customerSteps = [
  {
    number: 1,
    title: "Search your problem",
    body: "Type what you need — everyday words work: “bijuli mistri”, “pani”, “mistri”. The search matches local and everyday terms, not just English spellings.",
    icon: MapPin,
  },
  {
    number: 2,
    title: "Pick a category",
    body: "See all approved technicians for that trade — with ratings, experience, NPR prices, and availability. No “post a job and wait.”",
    icon: ShieldCheck,
  },
  {
    number: 3,
    title: "Book a visit",
    body: "Describe the job, choose a date and time. Your request shows as “pending” — the technician accepts or rejects, you’re told either way.",
    icon: Clock,
  },
  {
    number: 4,
    title: "Track the job",
    body: "Status moves through: pending → accepted → in progress → completed. Never labelled “confirmed” while waiting for the technician.",
    icon: CheckCircle2,
  },
  {
    number: 5,
    title: "Pay & review",
    body: "Pay cash directly to the technician when done. Completed bookings unlock one review: 1–5 stars + optional comment.",
    icon: Star,
  },
];

const technicianSteps = [
  {
    number: 1,
    title: "Register",
    body: "Create a technician account with your trade, experience, and service area.",
    icon: ShieldCheck,
  },
  {
    number: 2,
    title: "Get approved",
    body: "An admin reviews your registration. Approved technicians appear in search immediately; nothing shows publicly before approval.",
    icon: CheckCircle2,
  },
  {
    number: 3,
    title: "List your services",
    body: "Add services with clear NPR prices (or “quote per job”), set weekly availability, control what you offer.",
    icon: CreditCard,
  },
  {
    number: 4,
    title: "Accept bookings",
    body: "New requests stay “pending” until you accept or reject. Then move through in progress and completed as the job goes.",
    icon: Clock,
  },
];

const trustRow = [
  { icon: ShieldCheck, label: "Admin approved", desc: "Every technician verified before appearing in search" },
  { icon: Star, label: "Real reviews", desc: "Only after completed bookings — one per job" },
  { icon: CreditCard, label: "Cash on completion", desc: "No advance payment, no card required, no surprises" },
  { icon: MapPin, label: "Local only", desc: "Birtamod, Jhapa — technicians live where they work" },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-12">
        <p className="font-mono text-xs font-bold tracking-widest text-primary mb-2 sm:text-sm">
          HOW IT WORKS
        </p>
        <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          How it works
        </h1>
        <p className="mt-2 max-w-2xl text-muted-strong sm:text-base">
          HireATech connects people in Birtamod, Jhapa with local technicians —
          through real mechanisms: admin approval before anyone appears publicly,
          server-enforced booking statuses, and reviews that only open after a
          completed job. Here is the whole flow, step by step.
        </p>
      </div>

      {/* Customer journey */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-ink mb-8">
          If you need a job done
        </h2>
        <ol className="space-y-6">
          {customerSteps.map((step) => (
            <li key={step.number} className="relative flex gap-6 rounded-lg border border-border bg-surface p-6">
              <span
                aria-hidden="true"
                className="shrink-0 inline-flex size-10 items-center justify-center rounded border border-primary bg-primary font-display text-lg font-bold text-white"
              >
                {step.number}
              </span>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-3">
                  <step.icon className="size-5 text-primary" aria-hidden="true" />
                  <h3 className="font-display text-xl font-bold text-ink">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-2 max-w-prose text-muted-strong sm:text-base">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Technician journey */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-ink mb-8">
          If you are a technician
        </h2>
        <ol className="space-y-6">
          {technicianSteps.map((step) => (
            <li key={step.number} className="relative flex gap-6 rounded-lg border border-border bg-surface p-6">
              <span
                aria-hidden="true"
                className="shrink-0 inline-flex size-10 items-center justify-center rounded border border-border bg-bg font-display text-lg font-bold text-ink"
              >
                {step.number}
              </span>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-3">
                  <step.icon className="size-5 text-primary" aria-hidden="true" />
                  <h3 className="font-display text-xl font-bold text-ink">
                    {step.title}
                  </h3>
                </div>
                <p className="mt-2 max-w-prose text-muted-strong sm:text-base">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Trust signals */}
      <section className="mb-12 rounded-lg border border-border bg-surface p-8 sm:p-10">
        <h2 className="font-display text-xl font-bold text-ink mb-6">
          What makes HireATech different
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustRow.map((signal) => (
            <div key={signal.label} className="text-center">
              <div className="inline-flex size-10 items-center justify-center rounded border border-primary/30 bg-primary/5 text-primary mb-3">
                <signal.icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-base font-semibold text-ink">
                {signal.label}
              </h3>
              <p className="mt-1 text-sm text-muted-strong">
                {signal.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Key clarification */}
      <section className="rounded-lg border border-warning/30 bg-warning/5 p-6">
        <div className="flex items-start gap-4">
          <Clock className="size-5 shrink-0 mt-0.5 text-warning" aria-hidden="true" />
          <div>
            <h2 className="font-display text-lg font-bold text-ink">
              “Pending” is not “confirmed”
            </h2>
            <p className="mt-1 max-w-prose text-muted-strong sm:text-base">
              A “pending” booking is exactly that: waiting for the technician’s
              response. It is not confirmed, and it is never labelled as
              confirmed. Payment is cash on completion — no advance, no card,
              and no online payment until that feature actually exists.
            </p>
            <p className="mt-4 sm:text-base">
              <Link
                href="/services"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Browse services
              </Link>{" "}
              to see which trades are live today.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}