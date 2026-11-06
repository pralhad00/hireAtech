import Link from "next/link";

/*
 * Marketplace Platform footer — clean, sharp corners, honest content.
 * Charcoal ground, white text, ruled sections, serial strip.
 * Server component — no JavaScript.
 */

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/services", label: "Services" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "About HireATech" },
      { href: "/help", label: "Help & FAQ" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-ink text-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Top strip: brand + serial */}
        <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4 mb-6 font-mono text-xs font-bold tracking-widest text-white/70 sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-white/30 bg-surface font-sans text-[10px] font-bold text-ink">
              H
            </span>
            <span className="font-display text-lg font-bold tracking-tighter sm:text-xl">
              HireATech
            </span>
          </div>
          <span>HM-BTM-000481</span>
        </div>

        {/* Link columns */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <p className="mt-2 max-w-xs text-sm text-white/80 sm:text-base">
              Find trusted local technicians in Birtamod, Jhapa. Browse by
              trade, book a visit, follow your booking, and leave a review when
              the job is done.
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <p className="font-mono text-xs font-bold tracking-widest text-white/70 sm:text-sm">
                {column.title}
              </p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom strip: service area, cash note */}
        <div className="mt-10 border-t border-white/15 pt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/70 sm:text-sm">
            Serving Birtamod, Jhapa, Nepal only · Payments are cash on
            completion
          </p>
          <p className="text-xs text-white/70 sm:text-sm">
            No online payment · No postcode/ZIP · Local technicians only
          </p>
        </div>
      </div>
    </footer>
  );
}