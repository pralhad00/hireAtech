"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/*
 * Job Sheet header — work-order masthead (spec §11: no pill shapes, 1px
 * borders over shadows, charcoal on off-white). The serial number is the
 * platform's register mark; it stays on every page so the site reads as a
 * record, not a landing template.
 *
 * Mobile menu: disclosure panel below the header row, opened by a real
 * button with aria-expanded, closed with Escape or by tapping a link.
 * Expansion animates with framer-motion (DESIGN.md §8: purposeful
 * micro-interactions, 150–300ms, honors reduced motion).
 *
 * No Login/Register links yet — those pages arrive in Step 4; linking to
 * them now would be honest-looking dead ends.
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
      {/* Work-order masthead: brand left, service area right, serial rule. */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 border-b border-border">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-ink bg-surface font-sans text-base font-bold text-ink">
            H
          </span>
          <span className="font-display text-2xl font-bold tracking-tighter sm:text-3xl">
            HireATech
          </span>
        </Link>

        {/* Desktop nav: ruled inline row. */}
        <nav className="hidden items-center gap-8 sm:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                isActive(pathname, link.href)
                  ? "text-primary border-b-2 border-primary pb-[1px]"
                  : "text-ink border-b-2 border-transparent pb-[1px]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Serial number: monospace stencil numerals, right-aligned. */}
        <div className="flex items-center gap-2 font-mono text-xs font-bold tracking-widest text-muted-strong sm:text-sm">
          <span className="border-l border-border pl-2 hidden sm:block"></span>
          <span>HM-BTM-000481</span>
        </div>
      </div>

      {/* Service area strip: charcoal ground, charcoal text — the work-order
          heading band, one region of olive nowhere yet. */}
      <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
        <div className="flex items-center justify-between gap-4 font-mono text-xs font-bold tracking-widest text-muted-strong sm:text-sm">
          <span>BIRTAMOD · JHAPA, NEPAL</span>
          <span>SERVICE AREA</span>
        </div>
      </div>

      {/* Mobile: one real button, one drawn icon swap (no emoji) */}
      <button
        ref={menuButtonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-ink transition-colors hover:border-primary sm:hidden"
      >
        <span className="sr-only">
          {open ? "Close menu" : "Open menu"}
        </span>
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

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
