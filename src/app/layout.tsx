import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import "./globals.css";

/*
 * Fonts (DESIGN.md §3; spec §11 amended): Space Grotesk — geometric grotesk
 * — for headings/display/nav/buttons; Plus Jakarta Sans for body text.
 * next/font self-hosts both (no font CDN, no layout shift). "Never
 * Inter" (spec §11). Do not add another next/font with variable
 * "--font-sans" — that variable is composed in globals.css and a collision
 * silently overrides Jakarta.
 */

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HireATech — Local technicians in Birtamod, Jhapa",
    template: "%s · HireATech",
  },
  description:
    "Find and book approved local technicians in Birtamod, Jhapa — plumbers, electricians, carpenters and more. Browse services, book a visit, and track your booking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Skip link: first focusable element, jumps past the header (§11) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
