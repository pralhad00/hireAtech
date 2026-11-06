"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/*
 * Header — clean bar: logo at flex-start, then a search icon, "Join as a
 * Pro", and Log in / Sign up. No inline nav: the search icon opens a panel
 * with the search box (plus page links, so they stay reachable outside the
 * footer). Placeholder routes (/join-as-pro, /login) until the auth step.
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
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!searchOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        searchButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  return (
    <header className="border-b border-border bg-bg sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Logo — flex start */}
          <Link
            href="/"
            className="flex items-center shrink-0 mr-auto"
            aria-label="HireATech home"
          >
            <Image
              src="/logo.png"
              alt="HireATech"
              width={1154}
              height={212}
              priority
              className="h-6 w-auto sm:h-8 mix-blend-multiply"
            />
          </Link>

          {/* Search — icon that opens the search panel */}
          <button
            ref={searchButtonRef}
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            aria-expanded={searchOpen}
            aria-controls={searchOpen ? "header-panel" : undefined}
            aria-label="Search technicians"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-ink transition-colors hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>

          {/* Join as a Pro */}
          <Link
            href="/join-as-pro"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "hidden sm:inline-flex",
            )}
          >
            Join as a Pro
          </Link>

          {/* Log in / Sign up */}
          <Link href="/login" className={cn(buttonVariants())}>
            Log in / Sign up
          </Link>
        </div>
      </div>

      {/* Panel — search form + page links (opens at every breakpoint) */}
      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            id="header-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.3, 0.9, 0.5, 1] }}
            style={{ overflow: "hidden" }}
            className="border-t border-border bg-surface"
          >
            <div className="mx-auto max-w-6xl px-4 py-4 space-y-4 sm:px-6">
              {/* Search */}
              <form action="/services" method="get" role="search" className="space-y-3">
                <label htmlFor="header-panel-search" className="sr-only">
                  Search for a technician
                </label>
                <div className="flex">
                  <span className="inline-flex size-12 shrink-0 items-center justify-center border-r border-border bg-bg text-muted-strong">
                    <Search className="size-5" aria-hidden="true" />
                  </span>
                  <input
                    id="header-panel-search"
                    name="q"
                    type="search"
                    autoComplete="off"
                    placeholder="bijuli mistri, pani, plamber..."
                    className="flex-1 h-12 border-r-0 border-border bg-surface text-ink pl-4 focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-muted-strong"
                    ref={(el) => {
                      if (el && searchOpen) el.focus();
                    }}
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

              {/* Page links (hidden on sm+ — desktop keeps the panel search-first) */}
              <nav aria-label="Main" className="sm:hidden">
                <ul className="space-y-1 border-t border-border pt-4">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setSearchOpen(false)}
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

              {/* Join as a Pro — along the page links on small screens */}
              <Link
                href="/join-as-pro"
                onClick={() => setSearchOpen(false)}
                className={cn(buttonVariants({ variant: "outline" }), "w-full sm:hidden")}
              >
                Join as a Pro
              </Link>

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
