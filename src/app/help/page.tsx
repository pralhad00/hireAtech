import Link from "next/link";
import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/*
 * /help — honest FAQ (spec route table). Every answer states what the spec
 * guarantees; where contact support doesn't exist yet, that is said plainly.
 * No invented phone numbers, no 24/7 promises.
 */

export const metadata: Metadata = {
  title: "Help & FAQ",
  description:
    "Practical answers about booking, statuses, payments and reviews on HireATech — and how to reach help while the platform is new.",
};

const faqs = [
  {
    question: "The search found nothing. What now?",
    answer:
      "Try the everyday word instead: “pani” instead of plumber, “bijuli mistri” instead of electrician, “mistri” for general repairs. If nothing matches at all, browse /services and pick the closest trade.",
  },
  {
    question: "My booking says “pending”. Is it confirmed?",
    answer:
      "No — and it will never quietly become confirmed. The technician must accept or reject the request, and both outcomes are shown to you. After acceptance it moves through “in progress” and “completed” as the job goes.",
  },
  {
    question: "Can I cancel a booking?",
    answer:
      "You can cancel while it is still pending or accepted (before work starts). Once a booking is in progress the technician controls the outcome. Your bookings page shows exactly which actions are open.",
  },
  {
    question: "How and when do I pay?",
    answer:
      "Cash, directly to the technician, when the job is completed. The price you saw on the service is what the visit costs; unusual work agreed with the technician is priced openly with you first. Online payment will be announced in the product if it ever arrives — not promised here.",
  },
  {
    question: "When can I leave a review?",
    answer:
      "After your booking is completed and only then. Each booking can receive one review from you: a 1–5 star rating plus an optional comment of up to 500 characters.",
  },
  {
    question: "I am a technician. When do I appear publicly?",
    answer:
      "Only after an admin approves your registration. Until then your account works for setting up your services and availability, but nothing shows publicly — no half-visible profiles.",
  },
  {
    question: "What if something goes wrong?",
    answer:
      "In-app notifications follow every booking status change, so you always know where the job stands. Direct support contact is being set up as the platform grows; for now, booking issues can be raised through your bookings page, where every status change is tracked and recorded.",
  },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        Help &amp; FAQ
      </h1>
      <p className="mt-3 max-w-prose text-muted-strong">
        Straight answers about how HireATech behaves. Nothing here is a
        promise of a feature — it describes what works today.
      </p>

      <div className="mt-8 divide-y divide-border rounded-lg border border-border bg-surface">
        <Accordion multiple className="gap-0">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`help-${index}`}
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

      <p className="mt-6 max-w-prose text-sm text-muted-strong sm:text-base">
        New to the flow?{" "}
        <Link
          href="/how-it-works"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          How it works
        </Link>{" "}
        walks through the whole booking journey, step by step.
      </p>
    </div>
  );
}
