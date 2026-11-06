"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/*
 * Marketplace Platform header — search-first, bold, sharp corners.
 * Logo left, search center (desktop), nav right, serial strip bottom.
 * Mobile: hamburger opens full-screen search + nav panel.
 * Framer-motion for panel slide (150-300ms, honors reduced motion).
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const pathname = usePathname();
  const mobileSearchButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!mobileSearchOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileSearchOpen(false);
        mobileSearchButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileSearchOpen]);

  return (
    <header className="border-b border-border bg-bg sticky top-0 z-40">
      {/* Top bar: logo, desktop search, nav, serial */}
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl"
            aria-label="HireATech home"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-ink bg-surface font-sans text-base font-bold text-ink">
              H
            </span>
            <span className="hidden sm:block">HireATech</span>
          </Link>

          {/* Desktop search — bold, ruled, olive submit */}
          <form
            action="/services"
            method="get"
            role="search"
            className="flex-1 max-w-xl hidden sm:flex"
          >
            <label htmlFor="header-search" className="sr-only">
              Search for a technician
            </label>
            <div className="flex w-full">
              <span className="inline-flex size-12 shrink-0 items-center justify-center border-r border-border bg-bg text-muted-strong">
                <Search className="size-5" aria-hidden="true" />
              </span>
              <input
                id="header-search"
                name="q"
                type="search"
                autoComplete="off"
                placeholder="bijuli mistri, pani, plamber..."
                className="flex-1 h-12 border-r-0 border-border bg-surface text-ink pl-4 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-strong"
              />
              <button
                type="submit"
                className="h-12 px-6 shrink-0 font-display text-base font-semibold text-white bg-primary border-none hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isActive(pathname, link.href)
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "text-ink hover:bg-bg hover:border-border border-transparent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Serial strip — monospace, ruled */}
      </div>

      {/* Mobile search button (not a hamburger — direct search entry) */}
      <button
        ref={mobileSearchButtonRef}
        type="button"
        onClick={() => setMobileSearchOpen((v) => !v)}
        aria-expanded={mobileSearchOpen}
        aria-controls="mobile-search"
        className="mx-auto max-w-6xl px-4 pb-3 w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface text-ink transition-colors hover:border-primary sm:hidden"
      >
        <Search className="size-5" aria-hidden="true" />
        <span className="font-semibold">Search technicians</span>
      </button>

      {/* Mobile panel — full screen search + nav */}
      <AnimatePresence>
        {mobileSearchOpen ? (
          <motion.div
            id="mobile-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.3, 0.9, 0.5, 1] }}
            style={{ overflow: "hidden" }}
            className="border-t border-border bg-surface sm:hidden"
          >
            <div className="mx-auto max-w-6xl px-4 py-4 space-y-4">
              {/* Mobile search */}
              <form
                id="mobile-search"
                action="/services"
                method="get"
                role="search"
                className="space-y-3"
              >
                <label htmlFor="mobile-search-input" className="sr-only">
                  Search for a technician
                </label>
                <div className="flex">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center border-r border-border bg-bg text-muted-strong">
                    <Search className="size-5" aria-hidden="true" />
                  </span>
                  <input
                    id="mobile-search-input"
                    name="q"
                    type="search"
                    autoComplete="off"
                    placeholder="bijuli mistri, pani, plamber..."
                    className="flex-1 h-12 border-r-0 border-border bg-surface text-ink pl-4 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-strong"
                  />
                  <button
                    type="submit"
                    className="h-12 px-6 shrink-0 font-display text-base font-semibold text-white bg-primary border-none hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                  >
                    Search
                  </button>
                </div>
                <p className="font-mono text-xs text-muted-strong tracking-wide">
                  TRY: BIJULI MISTRI · PANI · PLAMBER · MISTRI
                </p>
              </form>

              {/* Mobile nav */}
              <nav aria-label="Main (mobile)">
                <ul className="space-y-1 border-t border-border pt-4">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => {
                          setMobileSearchOpen(false);
                        }}
                        className={`block px-2 py-3 rounded-md text-base font-semibold border border-transparent transition-colors ${
                          isActive(pathname, link.href)
                            ? "bg-primary/10 text-primary border-primary/30"
                            : "text-ink hover:bg-bg hover:border-border"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Service area note */}
              <p className="border-t border-border pt-4 font-mono text-xs font-bold tracking-widest text-muted-strong">
                BIRTAMOD · JHAPA, NEPAL ONLY
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}