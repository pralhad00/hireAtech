DESIGN.md — HireATech Design System
Authority: spec.md §11 takes precedence over this file. This document is the implementation contract for HireATech’s visual design. Follow it over generic design advice or framework defaults. If implementation reveals a genuine design decision that is not covered here, update this document rather than introducing undocumented visual patterns.

Current direction: Industrial Modernism / Job Sheet. The approved November 2026 revision uses signal orange on ink, white-led surfaces, and completely square geometry. Earlier terracotta and olive systems are retired.

1. Brand and visual direction
HireATech should feel like the digital work order of an established, professional trades company — not a generic SaaS dashboard or a startup landing-page template.

The interface must communicate reliability, clarity, competence, and local service. Its visual identity comes from strong typography, disciplined grids, ruled fields, serial numbers, trade codes, and approval marks.

Core principles
- Typography and composition do the branding; decoration does not.
- Use sharp 1px borders, square corners, solid surfaces, and clear alignment.
- Treat the interface as a work order: serial-number strips, field labels, margin rules, dotted leaders, approval stamps, and numbered process steps.
- Create depth through contrast, spacing, borders, and hierarchy — never shadows.
- Keep public pages visually bold; keep booking and dashboard interfaces quieter and task-focused.
Never use: drop shadows, gradients, glassmorphism, glow, decorative floating elements, excessive blur, pill shapes, rounded corners, or generic SaaS card layouts.
2. Color system
Use these tokens consistently. Do not invent additional brand colors.
Brand and primary colors
Token	Value	Intended use
primary	#FF5A1F	Signal orange brand accent, primary buttons, key icons, and highlighted bands
on-primary	#111418	Text and icons placed on orange fills
primary-hover	#E04A12	Hover state for orange controls
primary-pressed	#C23E0C	Pressed state; white text is permitted here
primary-text	#B93509	Accessible orange text on light surfaces, including links and tertiary actions
primary-soft	#FFE9E0	Badges, active chips, and selected-row tint
primary-subtle	#FFF4EF	Very light selected or highlighted sections


Neutral colors
Token	Value	Intended use
bg	#FFFFFF	Main page background
surface	#FFFFFF	Cards, inputs, and foreground surfaces
ink	#111418	Headings, body text, dark sections, and strong borders
border	#DEDCD6	Standard 1px borders, dividers, and ruled lines
bg-subtle	#F5F5F2	Alternate sections, icon tiles, and photo placeholders
bg-strong	#EBEAE5	Hover backgrounds for subtle surfaces and rows
muted-strong	#4A4F57	Secondary text and metadata; use on light surfaces
muted	#6B7078	Placeholders and least-important text; use on white only


Dark-section colors
Token	Value	Intended use
dark-raised	#1C2026	Panels placed inside dark sections
dark-border	#33383F	Dividers and chip borders on dark surfaces
on-dark	#FFFFFF	Headings and primary text on dark surfaces
on-dark-soft	#C9CCD1	Supporting text on dark surfaces


Use ink (#111418) as the background for dark sections.
Functional colors
Use functional colors only to communicate a real state. They are not brand decoration.
State	Foreground	Tint	Intended use
Success	#12805C	#E6F4EE	Confirmations and admin-approved status
Warning	#8A5A00	#FFF4D6	Pending attention, including pending bookings
Error	#D92D20	#FDECEA	Validation errors and destructive actions
Info	#2457C5	#E9EFFB	Neutral notices and tips only


Blue is permitted only for informational states. It is not a secondary brand color.
Color application rules
- White is the dominant page background. Use bg-subtle to distinguish alternate sections.
- ink carries primary text and dark sections. Orange is the only brand accent.
- Orange fills use on-primary text. Do not use white text on bright orange.
- Small orange text on light backgrounds must use primary-text, never primary.
- Use muted only on white. On bg-subtle, use muted-strong for secondary text.
- Status must never rely on color alone. Pair status text with a small colored dot or a 3px left rule.
- Use the warning token for pending states; do not let warning indicators resemble the orange brand accent.
- No purple, indigo, gradients, or additional invented accent colors.
Where orange belongs
Public pages — home, services, about, and help:
- Orange can own prominent regions such as the search band, technician CTA band, and primary actions.
- Ink owns the hero strip, footer, and service-area band.
App pages — forms, booking flow, and dashboards:
- Use white and bg-subtle as the main surfaces.
- Restrict orange to primary actions, meaningful icons, active markers, and primary-text links.
3. Typography
Font families
- Headings, display text, navigation, and buttons: Space Grotesk, weights 400, 500, 600, and 700.
- Body text, descriptions, forms, and long-form content: Plus Jakarta Sans, weights 400, 500, and 600.
- Self-host both through next/font.
- Do not use Inter or decorative display fonts.
Use large, confident headings. Establish hierarchy through size and weight, not decorative styling.
Type scale
Element	Desktop size
Display heading	48–56px
Page heading	32–40px
Section heading	24–28px
Component heading	18–20px
Body text	15–16px
Labels	13–14px
Supporting text	12px minimum


- Body text on mobile should be 16px.
- Secondary text on mobile must not fall below 14px.
- Keep long-form text around 65–75 characters per line (65–75ch).
- Use monospace numerals (font-mono, bold, wide tracking) for serial numbers, trade codes, and work-order field labels.
4. Geometry, borders, and surfaces
Square geometry
- Every corner has a 0px radius. This applies to buttons, inputs, cards, tiles, chips, badges, avatars, images, modals, and dropdowns.
- Do not use rounded, pill-shaped, or circular UI elements.
- Do not introduce exceptions for small components.
Borders and surface treatment
- Standard borders are 1px solid border.
- Use visible separators between sections.
- Use a 2px ink or primary border for emphasis; never use a shadow.
- Use solid surfaces only: white, bg-subtle, orange, and ink.
- Do not stack nested cards or wrap every element in a card. Prefer spacing, alignment, and ruled separators.
- Use dotted bottom borders for trade/category leader rows and solid rules for section breaks and work-order boundaries.
Lists and rows
Prefer occupied, bordered rows over piles of cards:
- Initials avatar or meaningful icon on the left.
- Primary name and one concise supporting line.
- Relevant details beneath or alongside the primary information.
- Generous vertical padding and touch-friendly interactive areas.
- On hover, change the border to ink.
- Selected rows use primary-subtle with a primary border.
Avoid repetitive three-card layouts. In particular:
- How-it-works sections use a numbered vertical sequence.
- Services are presented as rows.
- Categories use a simple grid of labelled tiles, not repeated icon/title/description cards.
5. Photography and image assets
HireATech is a photography-led brand. Use authentic commercial photography showing Nepalese technicians working in realistic residential or commercial environments.

Photography direction
- Professional technicians and appropriate work equipment.
- Realistic Nepalese homes, businesses, and service environments.
- Natural lighting and clear, recognizable subjects.
- Show people performing the service, not merely posing with tools.
Asset integrity
- Do not use generic Western stock photography.
- Do not present AI-generated or invented images as real HireATech technicians, customers, jobs, or locations.
- Until genuine photography is available, use an honest placeholder: a bordered block filled with ink or bg-subtle, plus a short factual caption describing the intended image.
- Example caption: “Technician repairing a sink in a Birtamod home.”
- Standard image proportions: 16:9 for wide bands, 4:3 for inline images, and 1:1 for avatar-adjacent placements.
- Text placed over photography must sit on an ink overlay at 70% opacity (#111418B3).
- Technician profiles use square, bordered initials avatars with ink text on bg-subtle. Individual technician profile photos are out of scope unless the project requirements change.

7. Layout, responsiveness, and spacing
Breakpoints
- Mobile: < 640px
- Tablet: 640–1023px
- Desktop: ≥ 1024px
Build mobile-first. Pages must not create horizontal overflow at any supported viewport size.
Spacing scale
Use a 4px base unit:
Token	Value
XS	4px
SM	8px
MD	16px
LG	24px
XL	32px
2XL	48px
3XL	64px


Give headings more space above than below.
Containers and alignment
- Desktop side padding: 32px.
- Tablet side padding: 24px.
- Mobile side padding: 16px.
- Maximum content width: 1200px.
- Use structured grids and consistent alignment rather than arbitrary positioning.
- Maintain a consistent horizontal alignment and section rhythm across pages.
Persistent work-order language
Carry a restrained set of work-order elements across the site so every page feels part of the same system:
- Serial-number strip.
- Service-area band.
- Ruled field labels and margin rules.
- Punch-hole details where they support the composition.
- Dotted-leader rows for trade/category names, with the admin-approved stamp where applicable.
These elements should establish the visual language, not become decorative clutter.
8. Motion and interaction
Use Framer Motion only for small, purposeful interface feedback:
- Accordion and disclosure expansion.
- Loading-to-complete state changes.
- Subtle focus, hover, and tap feedback.
Motion rules:
- Typical transitions: 150–300ms.
- Use an exponential ease-out curve.
- Respect prefers-reduced-motion.
- Do not use scroll parallax, decorative floating motion, page-entrance animation sequences, or animations that delay an action.
- Motion supports usability; it must not become the visual focus.

10. Component and state rules
Buttons
Use four button variants:
Variant	Appearance	Use
Primary	Orange fill, ink text	Main action
Secondary	White fill, 1px ink border and ink text	Alternative action
Dark	Ink fill, white text	Actions on orange bands
Ghost	Ink text, underline on hover	Low-emphasis actions


- Primary hover: primary-hover.
- Primary pressed: primary-pressed with white text.
- Keep labels bold and readable.
- Provide visible hover, focus, disabled, and loading states.
- Disable action buttons while their action is processing to avoid duplicate submissions.
Inputs and forms
- Use white input backgrounds, square corners, and 1px border.
- Place a visible label above each input; search may use an accessible screen-reader-only label.
- Use muted for placeholders on white surfaces.
- Show validation messages below the relevant field.
- Error messages use the error foreground and tint, with a 3px left rule. Never communicate an error through color alone.
- Validate on blur or submit.
- Expose errors with role="alert" or an appropriate aria-live region.
- On submission failure, move focus to the first invalid field.
- Use a visible 2px ink focus outline on light surfaces and a 2px primary focus outline on dark sections.
- Theme browser selection and caret colors using the orange/ink palette.
Chips and badges
- Chips use a 1px border and square geometry.
- Active chips use primary-soft with primary-text.
- General badges such as “Verified” or “Top rated” use primary-soft with primary-text.
- Verification may use the success tint and success foreground.
- Status remains text-first; never rely on color alone.
Admin-approved stamp
Use a consistent inline stamp:
- Inline-flex layout.
- Success-colored border and text.
- White (surface) background.
- Monospace, uppercase text at approximately 10px.
- Use only when approval is real and supported by application data.
Required UI states
Every list and form must have appropriate:
- Loading state.
- Empty state.
- Error state.
- Success or completion state.
Every interactive control must be keyboard accessible and have a visible focus state. Every page must have a meaningful title and its own metadata.
11. UX principles
1. Fast discovery: help users find the right technician in as few steps as practical.
2. Trust and transparency: show approval status, experience, reviews, and service information explicitly. Never imply information that is not available.
3. Pricing clarity: distinguish visit charge, estimate, and final charge. Use NPR consistently.
4. Simple interactions: keep navigation and forms short and understandable.
5. Consistent feedback: every action — booking, status change, error, or confirmation — must produce clear visible feedback.
6. Accessibility: maintain readable type, sufficient contrast, keyboard access, and understandable controls.
7. Responsive behavior: provide a usable experience on phones, tablets, and desktops.
12. Non-negotiable restrictions
Apply these rules to every page and every implementation agent:
- No popups, chat bubbles, or floating widgets over the page.
- No urgency tricks, countdowns, or fabricated scarcity.
- No invented statistics, testimonials, phone numbers, or 24/7 claims.
- Never label a pending booking as confirmed.
- No shadows, gradients, glass effects, glow, or floating decorations.
- No rounded corners, pill shapes, circular UI, nested cards, or repetitive card piles.
- No white text on bright orange; no bright orange text for small text on white.
- No decorative icons, emoji icons, or mixed icon libraries.
- No fake photography or invented customer/technician imagery presented as real.
- No secondary brand color. Blue is reserved for informational UI states only.
- No centered pill-search hero, generic three-card feature stacks, or generic startup/SaaS visual patterns.
- Do not invent content or visual proof to make a page appear more complete. Use honest empty states and placeholders.


