# Precision Dark UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the full UI (home `/` + services wizard `/services`) into the "Precision Dark / AI-Lab" visual language per `docs/superpowers/specs/2026-09-05-precision-dark-ui-redesign-design.md`.

**Architecture:** Foundations first (fonts, tokens, Button component), then page-by-page rebuilds (home, services), then deletion of retired components and a final verification pass. Each task leaves the app building and visually coherent.

**Tech Stack:** Vite + React 18 + TypeScript, Tailwind CSS 3, motion/react, class-variance-authority, Fontsource variable fonts.

**Spec:** `docs/superpowers/specs/2026-09-05-precision-dark-ui-redesign-design.md`

## Global Constraints

- Dark-only. `main.tsx` keeps `document.documentElement.classList.add('dark')`.
- Keep the existing HSL token names and values in `src/index.css` (`--background: 220 20% 7%`, `--primary: 197 82% 63%`, etc.). No token renames.
- Single accent (sky/cyan). No second brand hue. Green/red only for status/destructive.
- No canvas/WebGL backgrounds. Ambient background = CSS radial glow + CSS dot grid only.
- Motion rules: entrances = fade + 12px rise, 0.4–0.5s ease-out, stagger ≤3 elements; hovers = border shift + ≤2px translate; NO scale springs; all `motion` entrances honor `useReducedMotion()`.
- No new dependencies except `@fontsource-variable/inter` and `@fontsource-variable/jetbrains-mono`.
- Mono (`font-mono`) is for eyebrow labels, metrics, step labels, and badges only — never body text.
- Cards: `rounded-2xl` with `border-border` 1px borders; no stacked `backdrop-blur`; buttons/inputs `rounded-lg`.
- No test runner exists in this repo. Per-task verification = `npm run build` (tsc + vite) + `npm run lint` + the listed dev-server visual checks.
- Execute in the current working tree, NOT a fresh worktree from HEAD: the spec was written against uncommitted changes in `src/App.tsx` / `src/pages/Services.tsx`. Task 1 Step 1 commits those as a baseline.
- Copy strings are exact — use them verbatim (they are quoted in the tasks).

---

### Task 1: Design system foundations (fonts, Button, tokens, config)

**Files:**
- Create: `src/components/ui/button.tsx`
- Modify: `src/main.tsx`
- Modify: `tailwind.config.js`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `cn` from `src/lib/utils.ts` (signature: `cn(...inputs: ClassValue[]): string`).
- Produces: `Button` and `buttonVariants` exports from `@/components/ui/button`. `Button` props = `React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>` with variants `default | outline | ghost` and sizes `sm | default | lg`; defaults `variant="default"`, `size="default"`, `type="button"`. Later tasks import `{ Button } from '@/components/ui/button'`.
- Produces: Tailwind `font-sans` = Inter Variable, `font-mono` = JetBrains Mono Variable (later tasks rely on these utility names).

- [ ] **Step 1: Commit the current working-tree changes as a baseline**

The working tree has uncommitted modifications to `src/App.tsx` and `src/pages/Services.tsx` that the spec was written against. Commit them so redesign diffs are clean. Do NOT `git add -A` (untracked `.codex/`, `graphify-out/`, `remakes/` must stay out).

```bash
git add src/App.tsx src/pages/Services.tsx
git commit -m "chore: baseline working-tree changes before UI redesign"
```

- [ ] **Step 2: Install the font packages**

```bash
npm install @fontsource-variable/inter @fontsource-variable/jetbrains-mono
```

Expected: adds 2 packages to `package.json` dependencies.

- [ ] **Step 3: Import fonts in `src/main.tsx`**

Add these two lines as the first imports of `src/main.tsx` (above `import { StrictMode } ...`):

```tsx
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
```

- [ ] **Step 4: Create `src/components/ui/button.tsx`**

Follows the cva + forwardRef pattern already used in `src/components/ui/toast.tsx`:

```tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-45',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline:
          'border border-border bg-transparent text-foreground hover:border-primary/40 hover:bg-primary/5',
        ghost: 'text-foreground hover:bg-primary/10',
      },
      size: {
        default: 'h-10 px-5',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

- [ ] **Step 5: Update `tailwind.config.js`**

5a. Replace the `fontFamily` block:

```js
fontFamily: {
  sans: ['"Inter Variable"', 'system-ui', 'sans-serif'],
  mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
  serif: ['Newsreader', 'serif'],
},
```

5b. Delete the `ripple` and `pulse` entries from BOTH `keyframes` and `animation`. The custom `pulse` keyframe (boxShadow-based) overrides Tailwind's default opacity `animate-pulse` app-wide and renders invisibly (its `--pulse-color` var is never set); deleting it restores the working default. The `ripple` keyframe is only used by the Ripple component deleted in Task 4.

- [ ] **Step 6: Clean global element styles in `src/index.css`**

6a. Delete these Vite-default blocks (they fight the accent color — e.g. `button:hover { border-color: #646cff }` draws indigo borders on every button, and `a { color: #646cff }` breaks link styling):

```css
a { font-weight: 500; color: #646cff; text-decoration: inherit; }
a:hover { color: #535bf2; }
h1 { font-size: clamp(1.8em, 4vw, 2.8em); line-height: 1.1; margin: clamp(0.4rem, 1.5vh, 1rem) 0; }
button { border-radius: 8px; border: 1px solid transparent; padding: clamp(0.35em, 1.2vw, 0.55em) clamp(0.75em, 2vw, 1em); font-size: clamp(0.8125em, 1.8vw, 0.95em); font-weight: 500; font-family: inherit; background-color: transparent; cursor: pointer; transition: border-color 0.25s; max-width: 90vw; }
button:hover { border-color: #646cff; }
button:focus, button:focus-visible { outline: 4px auto -webkit-focus-ring-color; }
```

6b. Fold the `App.css` rules into `index.css` (its import is removed in Task 2). Add after the `body` block:

```css
#root {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
```

6c. Leave the `space-mono-*` classes in place for now — the current home page still uses them until Task 2 rewrites it. (They are removed in Task 2.)

6d. Add a base focus-visible rule so elements without their own focus styling (e.g. the wizard's option buttons) keep a visible keyboard indicator — the `Button` component suppresses it with `focus-visible:outline-none` and shows its ring instead. Add inside the existing `@layer base { * { @apply border-border; } ... }` block area as its own layer block:

```css
@layer base {
  :focus-visible {
    outline: 2px solid hsl(var(--primary) / 0.6);
    outline-offset: 2px;
  }
}
```

Leave the `:root` token block unchanged (all values stay as-is per Global Constraints).

- [ ] **Step 7: Verify build and lint**

```bash
npm run build && npm run lint
```

Expected: tsc + vite build succeed, eslint exits 0.

- [ ] **Step 8: Visual sanity check**

```bash
npm run dev
```

Check `http://localhost:5173/`: home renders with Inter body text (was SF Pro/system), no indigo hover borders on buttons, wizard still functional. Check `http://localhost:5173/services`: `animate-pulse` on "Generating..." (reach step 4 to confirm later, or just confirm page renders).

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/button.tsx src/main.tsx tailwind.config.js src/index.css package.json package-lock.json
git commit -m "feat(ui): precision-dark foundations — Inter/JetBrains Mono, cva Button, token-safe cleanup"
```

---

### Task 2: Home page rebuild (`src/App.tsx`)

**Files:**
- Modify: `src/App.tsx` (full rewrite)
- Delete: `src/components/Folder.jsx`, `src/components/Folder.css`, `src/App.css`
- Modify: `src/index.css` (remove `space-mono-*` classes)

**Interfaces:**
- Consumes: `Button` from `@/components/ui/button` (Task 1), `font-sans`/`font-mono` utilities (Task 1).
- Produces: the deep-link contract `/services?type=mobile|web|system` consumed by Task 3's preselection. Also removes all `space-mono-*` class usages, unblocking their deletion from `index.css`.

- [ ] **Step 1: Rewrite `src/App.tsx` with the full file below**

```tsx
import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Globe, Laptop, Smartphone } from 'lucide-react';
import whiteLogo from './assets/white.png';
import Services from './pages/Services';
import { Button } from '@/components/ui/button';

const capabilities = [
  {
    id: 'mobile',
    title: 'Mobile',
    icon: Smartphone,
    line: "Field tools, customer touchpoints, and internal apps in your users' pockets — native or cross-platform.",
  },
  {
    id: 'web',
    title: 'Web Applications',
    icon: Globe,
    line: 'Dashboards, client portals, and products that make the browser the most useful tab your users open.',
  },
  {
    id: 'system',
    title: 'Desktop Systems',
    icon: Laptop,
    line: 'Focused operational software for teams whose work happens outside the browser.',
  },
] as const;

const trustMetrics = [
  { value: '100%', label: 'Client Customized' },
  { value: 'Agentic', label: 'Autonomy Core' },
  { value: 'Multi-OS', label: 'Mobile · Web · PC' },
];

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut', delay }}
    >
      {children}
    </motion.div>
  );
}

function Home() {
  return (
    <div className="relative min-h-[100svh] overflow-hidden bg-background text-foreground">
      {/* Single ambient background: one radial glow + one dot grid, CSS only */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,hsl(var(--primary)/0.10),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(hsl(var(--foreground)/0.07)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-6">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2.5">
            <img
              src={whiteLogo}
              alt="Foundation Stone Algorithms logo"
              className="h-8 w-8 object-contain"
            />
            <span className="text-sm font-semibold tracking-tight">Foundation Stone Algorithms</span>
          </div>
          <Link to="/services">
            <Button size="sm">Start a project</Button>
          </Link>
        </header>

        <section className="flex flex-col items-center gap-6 py-20 text-center sm:py-28">
          <Reveal>
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              Intelligent Systems Studio
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              We build intelligent systems that solve hard problems.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              We engineer custom software systems across mobile, web, and desktop — powered by
              intelligent agents, optimized execution pipelines, and bespoke client customizations.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/services">
                <Button size="lg">
                  Start a project request
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#capabilities">
                <Button variant="outline" size="lg">
                  See capabilities
                </Button>
              </a>
            </div>
          </Reveal>
        </section>

        <Reveal>
          <div className="grid grid-cols-3 divide-x divide-border border-y border-border py-6 text-center">
            {trustMetrics.map((metric) => (
              <div key={metric.label} className="px-2">
                <p className="font-mono text-xl font-semibold text-foreground sm:text-2xl">
                  {metric.value}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <section id="capabilities" className="scroll-mt-16 py-20">
          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              Capabilities
            </span>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">What we build</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;

              return (
                <Reveal key={capability.id} delay={index * 0.08}>
                  <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold tracking-tight">{capability.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {capability.line}
                    </p>
                    <Link
                      to={`/services?type=${capability.id}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      Request quote
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <Reveal>
          <p className="border-t border-border py-16 text-center font-mono text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Intelligent systems, engineered for your problem.
          </p>
        </Reveal>

        <footer className="py-8 text-center text-xs text-muted-foreground">
          {new Date().getFullYear()} Foundation Stone Algorithms. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </Router>
  );
}

export default App;
```

- [ ] **Step 2: Delete retired home-page assets**

```bash
git rm src/components/Folder.jsx src/components/Folder.css src/App.css
```

(`App.css` is safe to delete: its only import was `./App.css` in the old `App.tsx`; its `#root` rules were folded into `index.css` in Task 1.)

- [ ] **Step 3: Remove the `space-mono-*` classes from `src/index.css`**

Delete the entire `@layer components { .space-mono-regular {...} .space-mono-bold {...} .space-mono-regular-italic {...} .space-mono-bold-italic {...} }` block at the top of the file. The Step 1 rewrite removed the last usages. Verify no stragglers:

```bash
grep -rn "space-mono" src/ || echo "clean"
```

Expected: `clean`.

- [ ] **Step 4: Verify build and lint**

```bash
npm run build && npm run lint
```

Expected: both pass. If tsc reports unused imports, remove them from `App.tsx` — the file above compiles clean as written.

- [ ] **Step 5: Visual verification**

```bash
npm run dev
```

Check `http://localhost:5173/`:
- Nav shows logo + wordmark + "Start a project" button (accent-filled).
- Hero: mono badge, headline "We build intelligent systems that solve hard problems.", two CTAs (filled + outline), glow + dot grid behind, NO glitch canvas, NO ripple.
- Trust strip: 3 metrics separated by hairlines.
- Capabilities: 3 cards with icons and "Request quote →" links.
- Statement line + footer. No fake workspaces/folders anywhere.
- No scale-spring animations; entrances are fade+rise only.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/index.css
git commit -m "feat(home): rebuild as single-column precision-dark layout with capability cards"
```

---

### Task 3: Services wizard restyle (`src/pages/Services.tsx`)

**Files:**
- Modify: `src/pages/Services.tsx`

**Interfaces:**
- Consumes: `Button` from `@/components/ui/button` (Task 1); the `/services?type=` query param contract produced by Task 2.
- Produces: no exports; page-level behavior only. Wizard logic (steps, validation, geolocation, `generateQuote`) unchanged except error surfacing via new state `quoteError: string | null`.

- [ ] **Step 1: Update imports**

Replace:

```tsx
import { ShinyButton } from '@/components/magicui/shiny-button';
```

with:

```tsx
import { Button } from '@/components/ui/button';
```

And change the router import from:

```tsx
import { Link } from 'react-router-dom';
```

to:

```tsx
import { Link, useSearchParams } from 'react-router-dom';
```

- [ ] **Step 2: Add quote-error state and preselection effect**

Inside the component, next to the other `useState` calls:

```tsx
const [quoteError, setQuoteError] = useState<string | null>(null);
```

Add this effect directly after the existing geolocation `useEffect`:

```tsx
// Deep-link preselection from home capability cards: /services?type=mobile|web|system
const [searchParams] = useSearchParams();

useEffect(() => {
  const type = searchParams.get('type');
  if (type === 'mobile' || type === 'web' || type === 'system') {
    setSelectedProduct(type);
  }
}, [searchParams]);
```

- [ ] **Step 3: Replace all three `alert()` calls in `getQuote` with inline errors**

Replace:

```tsx
if (!selectedCountry) {
  alert('Location not detected. Please refresh the page.');
  return;
}
```

with:

```tsx
if (!selectedCountry) {
  setQuoteError('Location not detected — refresh the page to retry.');
  return;
}
```

Replace:

```tsx
if (!apiKey) {
  alert('API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.');
  setIsLoadingQuote(false);
  return;
}
```

with:

```tsx
if (!apiKey) {
  setQuoteError('Quote service is not configured. Add VITE_OPENROUTER_API_KEY to your .env file.');
  setIsLoadingQuote(false);
  return;
}
```

Replace:

```tsx
alert(`Failed to generate quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
```

with:

```tsx
setQuoteError(`Failed to generate quote: ${error instanceof Error ? error.message : 'Unknown error'}`);
```

And add `setQuoteError(null);` on the line directly after `setQuoteResult(null);` at the top of `getQuote` so retries clear stale errors.

- [ ] **Step 4: Restyle the page shell and header**

Replace the two background-gradient divs:

```tsx
<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_24%)]" />
<div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08),transparent_60%)]" />
```

with one:

```tsx
<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,hsl(var(--primary)/0.08),transparent_50%)]" />
```

In the header row, replace the "Services Wizard" chip:

```tsx
<div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-primary">
  Services Wizard
</div>
```

with the mono-badge style used on home:

```tsx
<div className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
  Services Wizard
</div>
```

- [ ] **Step 5: Replace the wizard card chrome and the Progress panel with a connected stepper rail**

Delete the four "cyber corner marker" divs at the top of the `<section>`:

```tsx
<div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/45"></div>
<div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/45"></div>
<div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/45"></div>
<div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/45"></div>
```

On the `<section>` itself, change `rounded-[24px] ... bg-card/60 ... backdrop-blur-xl` to `rounded-2xl ... bg-card` (drop `backdrop-blur-xl` and the `shadow-[0_24px_80px_rgba(0,0,0,0.32)]`; keep `border border-border/80` → use `border border-border`).

Replace the entire Progress panel (the `rounded-xl border border-border/80 bg-background/50 p-3` block containing the `h-1.5` bar and the 4-box `grid`) with:

```tsx
<div className="rounded-xl border border-border bg-background/50 p-4">
  <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
    <span>Progress</span>
    <span>Step {currentStep} of {steps.length}</span>
  </div>
  <div className="relative flex items-start justify-between">
    <div className="absolute left-0 right-0 top-[13px] h-px bg-border" />
    <div
      className="absolute left-0 top-[13px] h-px bg-primary transition-all duration-300"
      style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
    />
    {steps.map((step) => {
      const isActive = step.id === currentStep;
      const isComplete = step.id < currentStep;

      return (
        <div key={step.id} className="relative z-10 flex w-16 flex-col items-center gap-1.5 text-center">
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold',
              isComplete || isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground'
            )}
          >
            {isComplete ? <Check className="h-3.5 w-3.5" /> : step.id}
          </div>
          <span
            className={cn(
              'font-mono text-[9px] uppercase tracking-wider',
              isActive ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {step.label}
          </span>
        </div>
      );
    })}
  </div>
</div>
```

Also in the same parent block, change the heading label `text-[10px] font-medium uppercase tracking-[0.28em] text-primary/80` to `font-mono text-[10px] uppercase tracking-[0.28em] text-primary/80`.

- [ ] **Step 6: Update selection-card states (all four option groups)**

In every option card (`productCards` map, `mobileOptions` map, `webOptions` map, `systemOptions` map):

6a. Remove the motion gestures — change `whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}` (and `whileHover={{ x: 4 }}` on web options) to nothing (plain `<motion.button>` without gesture props, or plain `<button type="button">`), and add hover lift via CSS: include `hover:-translate-y-0.5` in the className.

6b. Replace the selected/unselected className pair in all four groups with this exact pattern:

```tsx
isSelected
  ? 'border-primary/70 bg-primary/10 ring-1 ring-primary/40'
  : 'border-border bg-card/30 hover:border-primary/35 hover:-translate-y-0.5'
```

(Keep each group's existing base classes — `min-h-*`, `flex`, `rounded-xl`, `p-4`, `transition-all duration-300` — unchanged.)

6c. In the `productCards` map only, remove the blur-glow div:

```tsx
<div 
  className={cn(
    "absolute inset-0 -z-10 rounded-xl opacity-0 transition-opacity duration-300 blur-lg",
    isSelected && "opacity-5 bg-primary"
  )}
/>
```

6d. In the `productCards` map, replace the mono footer line `SYS_DEV // 0{idx + 1}` block with:

```tsx
<div className="mt-auto pt-3 flex items-center justify-between text-[8px] font-mono uppercase tracking-wider text-muted-foreground/60 w-full">
  <span>Option 0{idx + 1}</span>
  <span className={isSelected ? 'text-primary' : ''}>Select</span>
</div>
```

- [ ] **Step 7: Swap ShinyButton for Button in the footer actions**

Replace the Continue button:

```tsx
<ShinyButton
  onClick={goNext}
  disabled={!canMoveForward}
  className={cn(
    'px-4 py-2 text-xs justify-center',
    !canMoveForward && 'cursor-not-allowed opacity-45 hover:shadow-none'
  )}
>
  Continue
  <ArrowRight className="h-3 w-3" />
</ShinyButton>
```

with:

```tsx
<Button onClick={goNext} disabled={!canMoveForward}>
  Continue
  <ArrowRight className="h-3.5 w-3.5" />
</Button>
```

Replace the Get Quote button:

```tsx
<ShinyButton
  onClick={getQuote}
  disabled={isLoadingQuote || !selectedCountry}
  className={cn(
    'justify-center px-4 py-2 text-xs',
    (!selectedCountry || isLoadingQuote) && 'cursor-not-allowed opacity-45 hover:shadow-none'
  )}
>
```

with:

```tsx
<Button onClick={getQuote} disabled={!selectedCountry || isLoadingQuote}>
```

and keep its children, changing the loading label to:

```tsx
{isLoadingQuote ? (
  <span className="animate-pulse">Analyzing scope…</span>
) : (
  <>
    Get Quote
    <ArrowRight className="h-3.5 w-3.5" />
  </>
)}
```

The "Back" button keeps its inline classes but restyle to match the outline variant — replace its className with:

```tsx
'inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-45'
```

- [ ] **Step 8: Restyle the sidebar — "Intelligence output" card and inline error**

8a. Delete the four corner-marker divs on the `<aside>` and change `rounded-[20px] ... bg-card/60 ... backdrop-blur-xl` to `rounded-2xl ... bg-card` (drop `backdrop-blur-xl`, keep sticky positioning and border).

8b. Change the sidebar eyebrow `Current Step` label and the two `What you have so far` / `Step guidance` panel titles to `font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground`.

8c. Replace the quote-result block:

```tsx
{quoteResult && (
  <div className="rounded-xl border border-primary/40 bg-primary/10 p-3">
    <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-primary/80">
      Your Quote
    </p>
    <div className="whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">
      {quoteResult}
    </div>
  </div>
)}
```

with:

```tsx
{isLoadingQuote && (
  <div className="rounded-xl border border-border bg-background/50 p-3">
    <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
      Intelligence output
    </p>
    <span className="animate-pulse text-xs text-primary">Analyzing scope…</span>
  </div>
)}

{quoteError && (
  <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs leading-relaxed text-destructive">
    {quoteError}
  </div>
)}

{quoteResult && (
  <div className="rounded-xl border border-primary/40 bg-primary/10 p-3">
    <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-primary/80">
      Intelligence output
    </p>
    <div className="whitespace-pre-wrap text-xs leading-relaxed text-foreground/90">
      {quoteResult}
    </div>
  </div>
)}
```

8d. On the Review step (step 4), the "Get a Quote" heading (`text-[10px] font-medium uppercase tracking-[0.28em] text-primary/80`) gets the same `font-mono` treatment as Step 5's heading.

- [ ] **Step 9: Verify build and lint**

```bash
npm run build && npm run lint
```

Expected: both pass, no `ShinyButton` references remain:

```bash
grep -rn "ShinyButton" src/ || echo "clean"
```

Expected: `clean`.

- [ ] **Step 10: Visual verification**

```bash
npm run dev
```

Check `http://localhost:5173/services`:
- Steps 1→4 navigable forward and back; stepper rail fills to 100% at step 4.
- Selected cards show accent border + ring, no scale bounce; hover lifts 2px.
- `http://localhost:5173/services?type=web` opens with "Web Application" preselected on step 1.
- Clicking "Get Quote" at step 4 (with valid `.env` key) shows "Analyzing scope…" pulse, then the Intelligence output card with the quote. Temporarily rename `VITE_OPENROUTER_API_KEY` in `.env` to confirm the inline destructive error renders (no `alert()`), then restore it.
- No corner markers, no blur-stacked surfaces, no indigo defaults.

- [ ] **Step 11: Commit**

```bash
git add src/pages/Services.tsx
git commit -m "feat(services): restyle wizard — stepper rail, preselection deep-link, inline quote errors"
```

---

### Task 4: Retired-component deletion and final verification

**Files:**
- Delete: `src/components/ui/letter-glitch.tsx`, `src/components/magicui/ripple.tsx`, `src/components/magicui/shiny-button.tsx`, `src/components/magicui/pulsating-button.tsx`, `src/components/magicui/typing-animation.tsx`

**Interfaces:**
- Consumes: nothing (pure cleanup).
- Produces: a `src/` tree with no references to deleted modules.

- [ ] **Step 1: Confirm zero references before deleting**

```bash
grep -rn "letter-glitch\|LetterGlitch\|magicui/ripple\|Ripple\|shiny-button\|ShinyButton\|pulsating-button\|PulsatingButton\|typing-animation\|TypingAnimation" src/ || echo "clean"
```

Expected: `clean`. If any hit appears, fix the referencing file first (they should all be gone after Tasks 2–3).

- [ ] **Step 2: Delete the retired components**

```bash
git rm src/components/ui/letter-glitch.tsx src/components/magicui/ripple.tsx src/components/magicui/shiny-button.tsx src/components/magicui/pulsating-button.tsx src/components/magicui/typing-animation.tsx
```

- [ ] **Step 3: Full build + lint**

```bash
npm run build && npm run lint
```

Expected: both pass with zero errors.

- [ ] **Step 4: Final visual pass (both routes, desktop + mobile viewport)**

```bash
npm run dev
```

- `/`: hero glow + dot grid, no canvas animation; all CTAs work; capability links carry `?type=`.
- `/services`: all 4 steps, preselection via `?type=mobile|web|system`, quote generation end-to-end, inline error path.
- Devtools: emulate `prefers-reduced-motion: reduce` → no entrance movement on either page.
- Responsive: 390px viewport — nav, hero, trust strip, cards, and wizard stack cleanly with no horizontal overflow.

- [ ] **Step 5: Commit**

```bash
git add -u
git commit -m "chore(ui): remove retired glitch/ripple/shiny components"
```

---

## Spec coverage check (self-review)

- §4.1 Typography → Task 1 (fonts, config), Task 2 Step 3 (space-mono removal)
- §4.2 Color & surface → Task 1 Step 6 (tokens kept, global styles cleaned), Task 2 Step 1 (hero glow/dot grid), Task 3 Steps 4–5 (surfaces)
- §4.3 Buttons → Task 1 Step 4 (Button), Tasks 2–3 (adoption, ShinyButton retired)
- §5 Home page → Task 2 (nav, hero, trust strip, capabilities + `id="capabilities"`, statement, footer; all deletions listed)
- §6 Services page → Task 3 (preselection §6.1, stepper §6.2, card states §6.3, buttons §6.4, quote card §6.5, inline errors §6.6, chrome removal)
- §7 Motion & accessibility → Global Constraints + Task 2 `Reveal` (useReducedMotion), Task 3 Step 6 (no springs), focus rings in Button (Task 1)
- §8 Code changes → Tasks 1–4 file lists match (delete list includes all six spec files; `App.css` handled in Task 2)
- §9 Verification → per-task build/lint + Task 4 Step 4 (reduced-motion, responsive, quote end-to-end, error path)
