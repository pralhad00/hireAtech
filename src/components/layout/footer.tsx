import Link from "next/link";

/*
 * Public footer (server component — no JavaScript). Honest content only:
 * the real service area, real links, no phone numbers, no 24/7 claims
 * (spec §0; we have none to publish).
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
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:grid-cols-2 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">HireATech</p>
          <p className="mt-2 max-w-xs text-sm text-white/80">
            Find trusted local technicians in Birtamod, Jhapa. Browse by trade,
            book a visit, follow your booking, and leave a review when the job
            is done.
          </p>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-white/90">
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

      <div className="border-t border-white/15">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/70 sm:px-6">
          Serving Birtamod, Jhapa, Nepal only · Payments are cash on completion
        </p>
      </div>
    </footer>
  );
}
