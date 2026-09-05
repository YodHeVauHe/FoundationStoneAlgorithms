# Precision Dark UI Redesign — Design Spec

Date: 2026-09-05
Status: Approved (pending spec review)
Motto: "Create intelligent systems that solve problems."

## 1. Goal

Redesign the full UI of the Foundation Stone Algorithms site (home `/` and services wizard `/services`) into a "Precision Dark / AI-Lab" visual language: near-black canvas, one restrained sky/cyan accent, Inter for text, mono only as flavor. The redesign replaces the current cyber/hacker aesthetic (Space Mono body text, letter-glitch canvas, ripple, fake secure-workspace folders) with a serious, quiet, engineered feel.

## 2. Non-goals

- No new pages (Work/About/Pricing) — existing two routes only.
- No light theme. The app stays dark-forced (`main.tsx` keeps forcing dark).
- No changes to the wizard's logic: 4 steps, validation, geolocation/currency detection, and OpenRouter quote generation behave exactly as today (only error surfacing changes, see §6).
- No backend, routing-structure, or dependency-framework changes beyond what §6 lists.

## 3. Decisions (from brainstorm)

1. Scope: full redesign of both existing pages; core flows preserved.
2. Direction: Precision dark / AI-lab (Linear/Vercel-style), not editorial-light, not refined-terminal.
3. Home content: fake workspaces replaced by three capability cards (Mobile, Web, Desktop Systems).
4. Accent: keep current sky/cyan (`--primary: 197 82% 63%`); single accent only.

## 4. Design system foundations

### 4.1 Typography

- **Inter Variable** (`@fontsource-variable/inter`, self-hosted) becomes `font-sans` for all body and display text. Headlines use tighter tracking (`tracking-tight`).
- **JetBrains Mono Variable** (`@fontsource-variable/jetbrains-mono`) becomes `font-mono`, used ONLY for: eyebrow labels/badges, data and metrics, step counters, status chips. No body text in mono.
- The `space-mono-*` classes in `index.css` are removed and all usages replaced with `font-sans`/`font-mono` utilities.
- `tailwind.config` extends `fontFamily.sans` and `fontFamily.mono` accordingly.

### 4.2 Color & surface

- Keep the existing HSL token system and names (components like toast depend on them). Palette stays near-black: `--background: 220 20% 7%`, `--foreground: 210 20% 96%`, primary unchanged.
- Cards: defined by 1px borders (`border-white/8` ≈ `border-border/70`) with flat `bg-card` (no stacked backdrop-blur). Hover = border brightens to accent-tinted.
- Radius: cards `rounded-2xl` (16px); buttons/inputs `rounded-lg`. The current `rounded-[24px]` pill look is retired.
- One accent only; semantic green/red kept for status (verified/destructive).
- Hero texture: a single CSS radial glow (accent at ~6-10% opacity) plus a subtle dot-grid via CSS `background-image` — no canvas.

### 4.3 Buttons

- New `src/components/ui/button.tsx` built with `class-variance-authority`:
  - Variants: `default` (filled accent, `text-primary-foreground`), `outline` (1px border, transparent bg), `ghost`.
  - Sizes: `sm`, `default`, `lg`.
  - Visible `focus-visible` ring in accent (`ring-primary/60`).
- `ShinyButton` usage is replaced by this Button everywhere; `shiny-button.tsx` is deleted.

## 5. Home page (`src/App.tsx`)

Single centered column, `max-w-5xl`, replacing the two-column split. Sections top to bottom:

1. **Nav** — logo image (existing `white.png`, ~28-32px) + wordmark text on the left; one `Button` "Start a project" linking to `/services` on the right.
2. **Hero** — mono eyebrow badge `INTELLIGENT SYSTEMS STUDIO`; H1: "We build intelligent systems that solve hard problems."; subline: the existing value-prop paragraph verbatim ("We engineer custom software systems across mobile, web, and desktop—powered by intelligent agents, optimized execution pipelines, and bespoke client customizations."); primary CTA "Start a project request" → `/services`; secondary `outline` "See capabilities" → anchors to §5.4 (capabilities section gets `id="capabilities"`). Background: radial glow + dot grid (CSS only).
3. **Trust strip** — the three metrics (100% Client Customized / Agentic Autonomy Core / Multi-OS Mobile·Web·PC) as a quiet horizontal row: mono value + small uppercase label, separated by hairline dividers.
4. **Capabilities** — heading ("What we build") + three cards: Mobile, Web Application, Desktop Systems. Each card: icon (lucide), title, one problem→solution sentence, footer link "Request quote →" linking to `/services?type=mobile|web|system`.
5. **Statement** — one static line: "Intelligent systems, engineered for your problem." Replaces the rotating-quote card (RotatingQuote component is removed).
6. **Footer** — centered copyright line (existing text), generous top padding.

Removed from home: `LetterGlitch`, `Ripple`, `Folder.jsx`/`Folder.css`, secure-file styles in `App.css`, `projectFolders`, `restrictedFiles`, `createRestrictedItems`, `rotatingQuotes`, `HeroLogo` glow-stack (simplified), cyber corner markers.

## 6. Services page (`src/pages/Services.tsx`)

Layout and flow unchanged (header row, main wizard card + sticky summary sidebar). Visual changes:

- **Preselection**: on mount, read `type` query param; if it is one of `mobile|web|system`, set `selectedProduct` to it (wizard stays on step 1 with that card already selected; the user completes the flow normally). Invalid or missing param = current behavior.
- **Stepper**: compact connected progress rail — numbered nodes joined by a line; completed nodes show a check; mono labels. Replaces the four-box grid inside the "Progress" panel.
- **Selection cards**: selected state = accent border + subtle accent ring/glow; unselected = plain border. No whileHover scale springs; hover = border shift + 2px lift.
- **Buttons**: new Button component — "Continue"/"Get Quote" use `default`; "Back" uses `outline`. Disabled state = reduced opacity + no pointer.
- **Quote output**: restyled as "Intelligence output" card in the sidebar with animated loading state ("Analyzing scope…" pulse).
- **Errors inline**: replace all three `alert()` calls with inline states — missing API key and quote-generation failure render an error note in the quote card (`--destructive` styling); missing-country case keeps existing location error UI.
- Remove: cyber corner markers, background radial-gradient blobs, `selection:bg` is fine to keep.

## 7. Motion & accessibility

> **Addendum (2026-09-05, user-directed):** The home page was upgraded from simple entrance reveals to scroll-driven layered depth, per user feedback that the static version read as generic. Implemented with motion v12's documented scroll API (`useScroll`/`useTransform`/`useSpring` — motion.dev) rather than CSS scroll-driven `animation-timeline`, because Firefox support for the CSS property still lags (MDN/CanIUse) and motion is already a dependency. Layers: ambient glow/grid counter-drift with grid fade; hero exit parallax with depth-of-field blur; capability cards with per-card depth drift (0.6/1/1.4) and spring smoothing; kinetic statement line; top scroll-progress rail; sticky nav that gains a blur backdrop on scroll. The wizard page keeps the restrained motion from the original spec. All scroll transforms remain gated behind `useReducedMotion`.

- Entrances: fade + 12px rise, 0.4–0.5s ease-out, stagger ≤3 elements, using `motion/react`.
- Hovers: border-color shift + `translateY(-2px)`; no scale springs, no pulsing CTAs (the current `animate-pulse` on the hero CTA is removed).
- Exactly one ambient element app-wide: the hero glow (static; no animation loop).
- All `motion` entrances wrapped with `useReducedMotion` (fall back to no movement); CSS animations gated behind `prefers-reduced-motion`.
- Keyboard: all interactive elements reachable with visible focus rings; card links remain real `Link`/`a` elements.

## 8. Code changes summary

**Add**
- `src/components/ui/button.tsx` (cva-based Button)
- Fontsource imports (`@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`) in `src/main.tsx`
- Tailwind `fontFamily` extension in `tailwind.config`

**Modify**
- `src/index.css` — remove `space-mono-*` classes, refresh token comments, keep token names/values
- `src/App.tsx` — full home rebuild per §5
- `src/pages/Services.tsx` — restyle per §6 + inline errors + query-param preselection
- `src/App.css` — emptied/removed (secure-file styles deleted)

**Delete**
- `src/components/ui/letter-glitch.tsx`, `src/components/magicui/ripple.tsx`, `src/components/magicui/pulsating-button.tsx`, `src/components/magicui/typing-animation.tsx` (grep first; delete only if unreferenced), `src/components/magicui/shiny-button.tsx`, `src/components/Folder.jsx`, `src/components/Folder.css`

## 9. Verification

1. `npm run build` (tsc + vite) passes with no type errors.
2. `npm run lint` passes.
3. Dev-server visual pass: `/` renders hero, trust strip, capabilities, footer; `/services` renders wizard; all 4 steps navigable back and forward; `/services?type=web` preselects Web Application; quote generation succeeds with the existing `.env` key; quote failure path shows inline error (simulate by breaking key temporarily).
4. Reduced-motion check (emulate `prefers-reduced-motion`) shows no entrance movement.
