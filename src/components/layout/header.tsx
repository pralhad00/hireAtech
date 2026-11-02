"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/*
 * Public header, mobile-first (spec §11). The mobile menu is a disclosure
 * below the header row, opened by a real button with aria-expanded, closed
 * with Escape or by tapping a link. Expansion animates with framer-motion
 * (DESIGN.md §8 allowed scope: purposeful micro-interactions, 150–300ms,
 * honors reduced motion).
 *
 * No Login/Register links yet — those pages arrive in Step 4; linking to them
 * now would be honest-looking dead ends.
 */

const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
  { href: "/help", label: "Help" },
];

function isActive(pathname: string, href: string) {
  if (href === "/services") {
    return pathname === "/services" || pathname.startsWith("/services/");
  }
  return pathname === href;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Escape closes and returns focus to the button (keyboard friendly, §11).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="border-b border-border bg-bg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary font-sans text-base font-bold text-white">
            H
          </span>
          <span>HireATech</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-surface hover:text-primary ${
                isActive(pathname, link.href)
                  ? "text-primary"
                  : "text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile: one real button, one drawn icon swap (no emoji) */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="inline-flex size-10 items-center justify-center rounded-md border border-border bg-surface text-ink transition-colors hover:border-primary sm:hidden"
        >
          <span className="sr-only">
            {open ? "Close menu" : "Open menu"}
          </span>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile nav panel (disclosure, not a popup — DESIGN.md §10);
          animated with framer-motion, still a plain conditional-screen panel. */}
      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Main (mobile)"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0.3, 0.9, 0.5, 1] }}
            style={{ overflow: "hidden" }}
            className="border-t border-border bg-surface sm:hidden"
          >
            <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block border-b border-border px-1 py-3 text-base font-semibold last:border-b-0 ${
                      isActive(pathname, link.href) ? "text-primary" : "text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
