# DESIGN.md — HireATech visual system (Job Sheet world)

> **Authority order:** `spec.md §11` > this file > any generic design advice
> (including the impeccable tool). §11 was **amended Nov 2026
> (owner-approved)** from the terracotta "warm workshop" system to the
> **Industrial Modernism / Job Sheet** system below. This file is the full
> design contract, not a description of built code; drift discovered while
> building gets folded back here rather than being tolerated in code.

## 1. Personality — Job Sheet Industrial Modernism

A rugged, modern, professional service brand — like an established trades
company's carbon-copy work order, not a generic SaaS application and not a
startup landing page. The interface communicates reliability, professionalism,
simplicity, and a strong visual identity; visually bold without becoming
complicated.

- Strong typography does the branding work; decoration does not exist.
- Sharp borders (1px, 0–4px corners), solid surfaces, structured grids.
- **Strictly avoid:** drop shadows, gradients, glass/glassmorphism, glow,
  floating decorative elements, excessive blur, pill shapes, excessive
  rounding, tricks from the previous terracotta system (see §13).
- Depth comes from contrast, alignment, type and composition — never shadows.
- The site **is** a work order: serial numbers, ruled fields, margin rules,
  rubber-stamp approval marks, station-by-station flow.

## 2. Color tokens (spec §11 — binding)

**Primary palette**

| Token | Value | Use |
|---|---|---|
| primary | `#414A2F` | Olive green — brand color, buttons, important elements |
| bg | `#F2F0E8` | Warm off-white — dominant page background (ruled paper) |
| ink | `#25271F` | Dark charcoal — headings, body text, dark surfaces |
| surface | `#FFFFFF` | Cards, inputs, contrasting surfaces |

**Supporting palette**

| Token | Value | Use |
|---|---|---|
| primary-soft | `#68734C` | Light olive — secondary brand elements |
| border | `#DCD9CC` | Warm borders and separators (ruled lines) |
| muted | `#77786F` | Large labels (≥18px bold / ≥24px) and non-essential marks only; **fails small-text AA** (≈3.9:1 on bg) |
| muted-strong | `#5E5F57` | Small secondary text — passes AA on bg and surface |
| bg-subtle | `#E9E7DE` | Neutral surface — subtle background variation |

**Functional palette** (meaningful states only, never decoration)

| Token | Value | Use |
|---|---|---|
| success | `#287A50` | Successful actions and confirmations (admin-approved stamp) |
| warning | `#B77A35` | Warnings, pending attention (e.g. a pending booking) |
| error | `#B7443D` | Errors and destructive actions |

### Usage rules

- Off-white is the dominant background; white separates surfaces; charcoal
  carries text; olive is the only accent — it never has to compete.
- Small text is always `ink` or `muted-strong` on light surfaces.
- Status badges are **text-first**: colour appears as a small dot or 3px left
  rule next to ink text; status is never colour-only (accessibility).
- No purple/indigo, no gradients, no invented accent colors, anywhere.

### Where olive lives (owner decision: bold public, quiet app)

- **Public pages** (home, services, about, help): olive owns whole regions —
  the search field band, primary buttons, key moments; charcoal owns the
  footer/service-area strip.
- **App pages** (forms, dashboards, booking flow — Steps 5–12): off-white and
  white surfaces; olive only on buttons, links and active markers.

## 3. Typography

- Display/headings/navigation/buttons: **Rajdhani** (condensed industrial
  grotesk; weights 400/500/600/700) — narrow, tall letterforms, industrial
  feel. Self-hosted via `next/font`.
- Body/descriptions/forms/long text: **Plus Jakarta Sans** (weights
  400/500/600). Self-hosted via `next/font`.
- **Never Inter** (spec §11).
- Large, bold, confident headings; hierarchy through size and weight; no
  decorative fonts.
- Scale (desktop; responsive down on smaller screens):

| Element | Size |
|---|---|
| Display headings | 48–56px |
| Page headings | 32–40px |
| Section headings | 24–28px |
| Component headings | 18–20px |
| Body text | 15–16px |
| Labels | 13–14px |
| Supporting text | 12px minimum |

Body is 16px on mobile; secondary text never below 14px (spec §11). Measure
targets 65–75ch for long text.

Monospace stencil numerals (`font-mono`, `tracking-widest`, `font-bold`) for
serial numbers, trade codes, and field labels — the work-order chrome.

## 4. Borders, shapes and surfaces

- Prefer square corners: radius range is **0–4px** (default 2px on buttons,
  inputs, tiles). Pill buttons/containers are banned.
- 1px solid borders in `border` `#DCD9CC` (inputs, cards, dividers); visible
  separators between sections; borders instead of shadows, everywhere.
- **Ruled lines everywhere**: dotted leaders for trade names (`border-dotted
  border-border`), solid rules for section breaks, margin rules on work-order
  chrome.
- Solid surfaces only: white, off-white, olive, charcoal. No nested-card
  stacking; don't wrap every element in a card — structure via rules and
  alignment.
- **Occupied rows over card piles**: lists render as bordered rows —
  initials avatar / icon left, primary name and one line on top, details
  below; generous row padding; thumb-sized taps.
- The "repetitive three-card layout" is banned (SaaS-template smell): the
  homepage how-it-works is a numbered vertical flow, not three identical
  cards; services are rows; categories are a plain grid of labelled tiles
  without repeated icon+heading+text card anatomy.

## 5. Photography and visual assets

**Photography-led brand** — real commercial photography of Nepalese
technicians in realistic residential and commercial environments: professional
uniforms, appropriate equipment, natural lighting, people at work. Photography
leads; illustrations don't fill; decorative graphics don't exist.

- No generic Western stock photography; no artificial AI-generated imagery
  (also required by spec §0 honesty rules).
- **Honest photo slots:** until real assets exist, photography appears as
  bordered blocks — charcoal `#25271F` or `bg-subtle` `#E9E7DE` fill, a small
  truthful caption naming what the photo will show ("Technician repairing a
  sink in a Birtamod home"), fixed aspect ratios (16:9 band, 4:3 inline, 1:1
  avatar-adjacent). Never editorial decoration, never invented imagery.
- Technician profiles use **initials avatars** (square, bordered, charcoal
  text on `bg-subtle`) — photos per technician remain out of scope.

## 6. Iconography

- Icon system: **Lucide** (`lucide-react`), the one approved library
  (spec §3, amended). No Material Symbols, no emoji, no mixing sets.
- Used sparingly and purposefully: search, navigation affordances, status
  indicators, explicit category meaning. Prefer text labels for actions that
  are ambiguous.
- Consistent sizing: 16px (inline/UI), 20px (row/section), 24px (feature
  tiles); 2px stroke weight, `ink` or olive (`primary`).
- No icon beside every heading; no icons to fill empty space. Typography and
  imagery communicate.

## 7. Layout and spacing

- Mobile-first: mobile `< 640px`, tablet 640–1023px, desktop `≥ 1024px`. No
  horizontal overflow at any size (spec §11).
- Spacing scale (4px base): XS 4, SM 8, MD 16, LG 24, XL 32, 2XL 48, 3XL 64.
  More space above a heading than below it.
- Container side padding: 32px desktop, 24px tablet, 16px mobile; max content
  width 1200px.
- Structured grids over arbitrary positioning; consistent horizontal
  alignment and section rhythm across pages.
- **Work-order chrome**: serial number strip, service-area band, ruled field
  labels, margin rules, punch-hole dots — these persist across every page so
  the site reads as a single record.
- **Dotted-leader rows**: category/trade names with `border-b border-dotted
  border-border` leading to the admin-approved stamp.

## 8. Motion

- framer-motion (owner-approved Nov 2026) powers **subtle, purposeful
  micro-interactions only**: accordion/disclosure expansion, small state
  feedback (loading → done), gentle focus/tap affordances. Transitions stay
  150–300ms, exponential ease-out.
- **Still banned:** scroll parallax, page-entrance animation spam, floating
  decorations, anything that delays interaction. Motion supports actions; it
  shouldn't be the show.
- Everything honors `prefers-reduced-motion`.

## 9. Homepage — first viewport (Job Sheet: search as field one)

1. **Work-order masthead** (header): serial number left, brand center, service
   area right.
2. **Ruled field area**: "FIELD ONE · WHAT NEEDS FIXING" label, huge
   Rajdhani heading "Name the problem.", the search as field one (ruled input
   with icon prefix, olive primary submit button).
3. **Record column**: six real trades with dotted leaders and `✓ APPROVED`
   stamp (green success token).
4. **Foot band**: charcoal ground — "CASH ON COMPLETION — NO PAYMENT SITE-SIDE"
   and "NPR PRICING · LOCAL TECHNICIANS ONLY · NO POSTCODE".

## 10. Component rules (spec §11 — binding)

- Buttons: primary (olive fill, white text), secondary (white/transparent,
  charcoal 1px border and text), ghost (ink text, underline on hover);
  square corners, bold readable labels; visible hover, focus, disabled and
  loading states. Every action button disables while working (no double
  submits).
- Inputs: solid white/off-white background, 1px `border`, sharp corners,
  visible label above (or `sr-only` for search), error text below in `error`
  (never colour-only); validate on blur/submit; errors via `role="alert"` /
  `aria-live`; focus moves to the first error; focus ring is a 2px olive
  outline, visible everywhere ("browser surfaces themed: selection olive/white,
  focus, caret").
- Every list and form shows loading, empty, error and success states.
- Keyboard friendly; sensible page titles; every page keeps its own
  `metadata`.
- **Admin-approved stamp**: inline flex, `success` border and text, `surface`
  bg, monospace `text-[10px]`, uppercase — the single decisive color mark.

## 11. UX principles

1. **Fast discovery** — find the right technician in as few steps as possible.
2. **Trust and transparency** — approval status, experience, reviews, service
   info are plainly shown, never implied.
3. **Pricing clarity** — visit charge vs estimate vs final charge defined
   once and used consistently (NPR).
4. **Simple interactions** — navigation and forms stay short and obvious.
5. **Consistent feedback** — every action (book, status change, error,
   confirmation) answers visibly.
6. **Accessibility** — readable type, sufficient contrast (small text is
   `ink`/`muted-strong`), keyboard access, understandable controls.
7. **Responsive design** — works on desktop, tablet and phone.

## 12. Nevers (apply to every future page and agent)

- **No popups, chat bubbles, or floating widgets** over the page.
- **No urgency tricks** — no countdowns, no "only 2 left!".
- No invented stats, testimonials, phone numbers, or 24/7 promises (spec §0);
  pending is never labelled "confirmed".
- No shadows, gradients, glass, glow, floating decorations.
- No pill shapes or playful rounding; no card piles; no nested cards.
- No decorative icons, no emoji as icons, no icon-set mixing.
- No fake photography — empty states and photo slots are honest.
- No centered pill-search hero, no uniform three-card stacks, no rounded
  friendly buttons, no stock-color tagline — the tells you already named.

## 13. Migration — retired from the previous system (owner-approved)

| Retired | Replacement |
|---|---|
| Terracotta `#E45A32` / cream `#F4F0E7` / ink `#182820` / border `#D8D2C7` / muted `#667568` / error `#B42318` / success `#28734A` | Section 2 palette |
| Bitter (slab serif display) + Work Sans | Rajdhani (condensed grotesk) + Plus Jakarta Sans |
| Radii 2–8px | 0–4px, square-leaning |
| Icon squares (hand-drawn SVG set in bordered squares) | Bordered 4px-radius tiles with Lucide 24px icons, uppercase-style trade label |
| One orchestrated homepage reveal | No entrance animations at all |
| `background: primary` buttons with terracotta hover | Olive buttons, hover darkened via `ink` overlay (no invented color) |
| "Calm workshop" personality copy patterns | Industrial Modernism tone: direct, professional, plain |
| Centered hero tagline + search pill | Work-order masthead + ruled field one + record column |
| Uniform three-card feature grid | Numbered station flow, dotted-leader rows |