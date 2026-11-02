import type { Metadata } from "next";

/*
 * /about — honest information page (spec route table). Says exactly what the
 * product is and nothing it isn't: no team photos, no funding story, no
 * invented phone numbers or "we've served N customers". Rendered as a
 * work-order record with ruled rows.
 */

export const metadata: Metadata = {
  title: "About",
  description:
    "HireATech is a local-technician booking platform for Birtamod, Jhapa — approved technicians, clear NPR prices, cash on completion.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="font-mono text-xs font-bold tracking-widest text-primary mb-4 sm:text-sm">
        RECORD · ABOUT HIREATECH
      </div>
      <h1 className="font-display text-3xl font-bold text-ink tracking-tight sm:text-4xl">
        About HireATech
      </h1>

      <div className="mt-10 rounded-md border border-border bg-surface p-8 sm:p-10">
        <p className="max-w-prose text-muted-strong sm:text-base">
          HireATech is a small, local platform with one job: connect people in{" "}
          <strong className="font-semibold text-ink">
            Birtamod, Jhapa (Nepal)
          </strong>{" "}
          with technicians they can trust — plumbers, electricians,
          carpenters, appliance repairers, painters and general maintenance
          hands.
        </p>
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold text-ink">
        Why it exists
      </h2>
      <p className="mt-2 max-w-prose text-muted-strong sm:text-base">
        Finding a good mistri nearby usually means asking around. HireATech
        makes that process visible: technicians register, an admin approves
        each one before they can appear, and you book a specific person at a
        specific time — with their experience and NPR prices in front of you.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink">
        How we stay honest
      </h2>
      <ul className="mt-3 max-w-prose list-disc space-y-2 pl-5 text-muted-strong sm:text-base">
        <li>
          Every technician you see has been approved by an admin — nobody is
          “verified” by a badge; they are verified by that approval.
        </li>
        <li>
          Reviews exist only for completed bookings, one review per booking.
        </li>
        <li>
          We show exact statuses. A request waiting for the technician is
          “pending”, never “confirmed”.
        </li>
        <li>
          There are no invented statistics, testimonials or customer counts on
          this site — if a number appears here, it comes from the real
          product.
        </li>
      </ul>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink">
        What we charge
      </h2>
      <p className="mt-2 max-w-prose text-muted-strong sm:text-base">
        Payment is cash, paid directly to the technician when the job is
        finished. There is no online payment yet — when that is real, it will
        appear in the product itself.
      </p>

      <h2 className="mt-10 font-display text-2xl font-bold text-ink">
        Where we operate
      </h2>
      <p className="mt-2 max-w-prose text-muted-strong sm:text-base">
        Birtamod, Jhapa, Nepal — this area only. Keeping it small keeps the
        listed technicians genuinely local.
      </p>
    </div>
  );
}
