import type { Metadata } from "next";
import { ShieldCheck, Star, MapPin, CreditCard, Users, Building2 } from "@/components/ui/icons";

/*
 * /about — honest information page. Marketplace Platform: bold sections,
 * trust signals, sharp cards, no fake photos/stats.
 */

export const metadata: Metadata = {
  title: "About",
  description:
    "HireATech is a local-technician booking platform for Birtamod, Jhapa — approved technicians, clear NPR prices, cash on completion.",
};

const principles = [
  { icon: ShieldCheck, title: "Admin approval first", desc: "Every technician is reviewed and approved by an admin before they can appear in search. No half-visible profiles, no unverified listings." },
  { icon: Star, title: "Reviews only after the job", desc: "Reviews exist only for completed bookings — one review per booking, with a 1–5 star rating and optional comment. No fake testimonials." },
  { icon: CreditCard, title: "Cash on completion", desc: "Payment is cash, paid directly to the technician when the job is finished. There is no online payment yet — when it arrives it will appear in the product, not be promised in advance." },
  { icon: MapPin, title: "Genuinely local", desc: "Birtamod, Jhapa, Nepal — this area only. Keeping it small keeps the listed technicians genuinely local to you." },
  { icon: Users, title: "Real statuses, honest copy", desc: "A request waiting for the technician is “pending”, never “confirmed”. We show exact statuses: pending → accepted → in progress → completed." },
  { icon: Building2, title: "No invented numbers", desc: "If a number appears here, it comes from the real product. No invented statistics, customer counts, or testimonials." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-12">
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          About HireATech
        </h2>
      </div>

      {/* Hero statement */}
      <section className="mb-16 rounded-lg border border-border bg-surface p-8 sm:p-10">
        <p className="max-w-prose text-lg text-muted-strong sm:text-xl">
          HireATech is a small, local platform with one job: connect people in{" "}
          <strong className="font-semibold text-ink">Birtamod, Jhapa (Nepal)</strong>{" "}
          with technicians they can trust — plumbers, electricians, carpenters,
          appliance repairers, painters and general maintenance hands.
        </p>
      </section>

      {/* Why it exists */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-ink mb-6">
          Why it exists
        </h2>
        <p className="max-w-prose text-muted-strong sm:text-base">
          Finding a good mistri nearby usually means asking around. HireATech
          makes that process visible: technicians register, an admin approves
          each one before they can appear, and you book a specific person at a
          specific time — with their experience and NPR prices in front of you.
        </p>
      </section>

      {/* Principles as cards */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-ink mb-8">
          How we stay honest
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {principles.map((principle) => (
            <article
              key={principle.title}
              className="rounded-lg border border-border bg-surface p-6 transition-all hover:border-primary"
            >
              <div className="inline-flex size-10 items-center justify-center rounded border border-primary/30 bg-primary/5 text-primary mb-4">
                <principle.icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink mb-2">
                {principle.title}
              </h3>
              <p className="text-sm text-muted-strong">
                {principle.desc}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* What we charge */}
      <section className="mb-16">
        <h2 className="font-display text-2xl font-bold text-ink mb-4">
          What we charge
        </h2>
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="max-w-prose text-muted-strong sm:text-base">
            Payment is cash, paid directly to the technician when the job is
            finished. The price you saw on the service is what the visit costs;
            unusual work agreed with the technician is priced openly with you
            first. There is no online payment yet — when that is real, it will
            appear in the product itself.
          </p>
        </div>
      </section>

      {/* Where we operate */}
      <section>
        <h2 className="font-display text-2xl font-bold text-ink mb-4">
          Where we operate
        </h2>
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="max-w-prose text-muted-strong sm:text-base">
            Birtamod, Jhapa, Nepal — this area only. Keeping it small keeps the
            listed technicians genuinely local. No postcode, no ZIP, no
            outsiders.
          </p>
        </div>
      </section>
    </div>
  );
}