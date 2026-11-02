import Link from "next/link";
import type { Metadata } from "next";

/*
 * /how-it-works — honest information page (spec route table): describes the
 * real product flow and the real status lifecycle. No invented numbers,
 * badges or promises.
 */

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How HireATech works: pick a trade, book a visit with a specific approved technician, follow your booking status, pay cash, then review.",
};

const customerSteps = [
  {
    title: "Pick a trade",
    body: "Browse /services or search with the words you actually use — “bijuli mistri”, “pani”, “mistri”. The search matches everyday and local terms, not just English spellings.",
  },
  {
    title: "Choose a specific technician",
    body: "You always book a named, admin-approved technician — you see their profession, experience, services with NPR prices and availability before you commit. There is no “post a job and wait for offers”.",
  },
  {
    title: "Book a visit",
    body: "Describe the job, set a date and time window. Your request starts as a “pending” booking — the technician accepts or rejects it, and you are told either way.",
  },
  {
    title: "Follow the status",
    body: "Each booking has a status you can follow: pending → accepted → in progress → completed. You are never shown “confirmed” while it is merely waiting for the technician’s response.",
  },
  {
    title: "Pay and review",
    body: "Pay cash directly to the technician when the work is done. Completed bookings can then receive one review from you — a 1–5 star rating plus an optional comment.",
  },
];

const technicianSteps = [
  {
    title: "Register",
    body: "Create a technician account with your trade, experience and service area.",
  },
  {
    title: "Get approved",
    body: "An admin reviews the registration. Approved technicians appear in search immediately; nothing is shown publicly before approval.",
  },
  {
    title: "List your services",
    body: "Add services with clear NPR prices (or “quote per job”), set your weekly availability, and control what you offer.",
  },
  {
    title: "Accept or reject bookings",
    body: "New booking requests stay “pending” until you accept or reject, then move through in progress and completed as the job goes.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        How it works
      </h1>
      <p className="mt-3 max-w-prose text-muted-strong">
        HireATech connects people in Birtamod, Jhapa with local technicians —
        but only through real mechanisms: admin approval before anyone appears
        publicly, server-enforced booking statuses, and reviews that only open
        after a completed job. Here is the whole flow, from both sides.
      </p>

      <h2 className="mt-12 font-display text-2xl font-bold">
        If you need a job done
      </h2>
      <ol className="mt-6 space-y-6 border-l border-border pl-6">
        {customerSteps.map((step, index) => (
          <li key={step.title} className="relative">
            <span
              aria-hidden={true}
              className="absolute -left-[31px] top-0.5 inline-flex size-6 items-center justify-center rounded-md bg-primary font-display text-xs font-bold text-white"
            >
              {index + 1}
            </span>
            <h3 className="font-semibold">{step.title}</h3>
            <p className="mt-1 max-w-prose text-sm text-muted-strong sm:text-base">
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <h2 className="mt-12 font-display text-2xl font-bold">
        If you are a technician
      </h2>
      <ol className="mt-6 space-y-6 border-l border-border pl-6">
        {technicianSteps.map((step, index) => (
          <li key={step.title} className="relative">
            <span
              aria-hidden={true}
              className="absolute -left-[31px] top-0.5 inline-flex size-6 items-center justify-center rounded-md bg-ink font-display text-xs font-bold text-white"
            >
              {index + 1}
            </span>
            <h3 className="font-semibold">{step.title}</h3>
            <p className="mt-1 max-w-prose text-sm text-muted-strong sm:text-base">
              {step.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-12 rounded-lg border border-border bg-surface p-6">
        <h2 className="font-display text-xl font-bold">What booking means</h2>
        <p className="mt-2 max-w-prose text-sm text-muted-strong sm:text-base">
          A “pending” booking is exactly that: waiting for the technician’s
          response. It is not confirmed, and it is never labelled as
          confirmed. Payment is cash on completion — no advance, no card, and
          no online payment until that feature actually exists.
        </p>
        <p className="mt-4 text-sm sm:text-base">
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
  );
}
