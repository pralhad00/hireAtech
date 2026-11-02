# DESIGN.md — HireATech visual system

> **Authority order:** `spec.md §11` > this file > any generic design advice
> (including the impeccable tool). Written *before* the Step 3 build from a
> live design interview with the owner (Nov 2026), inside spec §11's binding
> constraints — a decision contract, not a description of built code. Any
> drift discovered while building gets folded back into this file.

## 1. Personality — "Calm workshop"

Sturdy, honest, unhurried — a well-organized toolbox, not a startup landing page.

- 1px borders on inputs, cards, dividers; **no box-shadows** (spec §11)
- Small radii (2–8px), flat surfaces, generous whitespace
- No gradients, no purple/indigo, no glass/blur, no card piles (spec §11)
- Distinctiveness comes from **stronger graphics**: bold display type, large
  terracotta regions on public pages, and the signature element (§5) — not
  from decoration or generic filler.

## 2. Color tokens (spec §11 — binding)

| Token | Value | Use |
|---|---|---|
| primary | `#E45A32` | Terracotta — main buttons, active states |
| bg | `#F4F0E7` | Warm cream page background |
| ink | `#182820` | Charcoal green — text, dark sections |
| surface | `#FFFFFF` | Forms, cards |
| muted | `#667568` | Secondary text (keep AA contrast) |
| border | `#D8D2C7` | Dividers, field borders |
| error | `#B42318` | Errors |
| success | `#28734A` | Success |

### Where terracotta lives (owner decision: bold public, quiet app)

- **Public pages** (home, services, about, help): terracotta owns whole
  regions — hero band, category chips, section bands.
- **App pages** (forms, dashboards, booking flow — Steps 5–12): cream/white
  surfaces; terracotta only on buttons, links, active markers.

## 3. Typography

- Display (H1–H2): **Bitter** — warm slab serif. Body: **Work Sans**.
- Weights 400/600/700 only. Self-hosted via `next/font` — **no font CDN**
  (works offline, no layout shift, no third-party request).
- Body 16px on mobile; 14px minimum for secondary text (spec §11).
- "Stronger graphics" energy: on public pages H2s may sit at poster scale
  with terracotta behind them. The app stays quiet.
- **Never Inter** (spec §11).

## 4. Color strategy class

**Committed** on public pages (terracotta grounds real regions of the
surface); **Restrained** in the app (neutrals plus one accent). One system,
two volume levels — not two designs.

## 5. Signature element — Icon squares

The one memorable repeated gesture of the system:

- Chunky **solid** icons, hand-drawn-style inline SVG, in **bordered squares**
  (1px border token, cream or white fill), sitting wherever a category or
  trade name appears: homepage shortcuts, services list, technician rows.
- No emoji as icons, no icon packages (spec §3, §11).
- Category→icon mapping comes from the seeded `icon_key` values — never
  invented.

## 6. Layout & composition

- Mobile-first: mobile `< 640px` baseline; tablet 640–1023px; desktop
  `≥ 1024px`. No horizontal overflow at any size (spec §11).
- Spacing on a 4px base; more space above a heading than below it.
- **Occupied rows over card piles** (owner choice): lists are bordered rows —
  initials avatar (people) or icon square (categories) left, primary name and
  one line on top, details below; generous row padding, thumb-sized taps.
- Avatars = initials tiles; technician photos out of scope (spec §11).
- Status = text + colour, always (spec §11 + accessibility).
- Honest copy rules (spec §0): pending is never called "confirmed"; no
  invented stats, testimonials, or 24/7 promises.

## 7. Motion

- No entrance animations anywhere except **one orchestrated homepage
  reveal**: search box, then category shortcuts, under ~400ms total.
- Hover/focus/press transitions 150–200ms.
- Everything honors `prefers-reduced-motion`.
- No scroll-reveal animations (decided: "one reveal only").

## 8. Homepage — first viewport (owner choice: search-first band)

1. Large terracotta band with a centered **search box — the most prominent
   element on the home page** (spec §11).
2. One helper line about forgiving search; its wording must quote **real
   seeded aliases** (e.g. "bijuli mistri", "pani") — never invented examples
   (spec §0: no fake proof).
3. Six real category shortcuts below the band (icon square + name), pulled
   live from `service_categories`.

## 9. Component rules (spec §11 — binding)

- Buttons: primary (terracotta), secondary (outlined), ghost; visible hover,
  focus, disabled, loading states; every action button disables while working
  (no double submits).
- Inputs: visible label above, 1px border, error text below (never
  colour-only); validate on blur/submit; errors via `role="alert"` /
  `aria-live`; focus moves to the first error.
- Every list and form shows loading, empty, error, and success states.
- Keyboard friendly, visible focus rings, sensible page titles.

## 10. Nevers (owner-locked; apply to every future page and agent)

- **No popups, chat bubbles, or floating widgets** over the page.
- **No urgency tricks** — no countdowns, no "only 2 left!" (also blocked by
  the spec's honesty rules).
- **No clipart or decorative illustrations** — every graphic is functional
  (icon squares, avatars, status).
- No shadows, no gradients, no glass (spec §11).

## 11. Honest-risk note

Cream + terracotta + serif display is a common AI-generated look; the spec
pins it, so it stays. Our answer is not to drift from the spec but to commit
hard: poster-scale public headings, real terracotta regions, the icon-square
motif, and Birtamod-grounded copy make the commitment read as *chosen*, not
defaulted.
